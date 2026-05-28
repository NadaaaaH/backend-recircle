<?php
namespace App\Http\Controllers\Api\V1;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ChatContactResource;
use App\Http\Resources\Api\V1\ChatMessageResource;
use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatApiController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        try {
            // Cek apakah MongoDB sudah dikonfigurasi. Jika belum, jangan eksekusi query agar tidak hang.
            if (str_contains(config('database.connections.mongodb.dsn'), '<cluster-url>')) {
                return $this->successResponse([], 'Chat disabled: MongoDB not configured.');
            }

            $user = $request->user();

            $userId = (int) $user->id;
            $userIdStr = (string) $user->id;

            // Fetch using standard Eloquent to ensure perfect hydration and type safety
            // We use standard 'orWhere' grouping to fetch all conversations where the user is either sender or receiver
            $messages = ChatMessage::where(function ($query) use ($userId, $userIdStr) {
                $query->where('sender_id', $userId)
                      ->orWhere('receiver_id', $userId)
                      ->orWhere('sender_id', $userIdStr)
                      ->orWhere('receiver_id', $userIdStr);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->unique('room_id') // Filters to only keep the latest message per unique chat room
            ->values();

            $contacts = [];
            foreach ($messages as $msg) {
                $senderId = (int) $msg->sender_id;
                $receiverId = (int) $msg->receiver_id;
                $currentUserId = (int) $user->id;

                $otherUserId = $senderId === $currentUserId ? $receiverId : $senderId;
                $otherUser = User::find($otherUserId);

                if ($otherUser) {
                    $contacts[] = [
                        'id' => (int) $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($otherUser->name) . '&background=f3f4f6&color=43552c',
                        'last_message' => $msg->message,
                        'created_at' => $msg->created_at->diffForHumans(),
                        'is_read' => (bool) $msg->is_read,
                        'unread_count' => ChatMessage::where('sender_id', $otherUserId)
                            ->where('receiver_id', $currentUserId)
                            ->where('is_read', false)
                            ->count(),
                    ];
                }
            }

            return $this->successResponse($contacts, 'Chat contacts retrieved successfully');
        } catch (\Exception $e) {
            Log::error('Chat index error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return $this->errorResponse('Failed to retrieve chat contacts: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $otherUserId, Request $request): JsonResponse
    {
        try {
            if (str_contains(config('database.connections.mongodb.dsn'), '<cluster-url>')) {
                return $this->successResponse([], 'Chat disabled: MongoDB not configured.');
            }

            $userId = (int) $request->user()->id;
            $otherUserId = (int) $otherUserId;

            // Mark incoming messages as read — match both int and string types for safety
            ChatMessage::where('receiver_id', $userId)
                ->where('is_read', false)
                ->where(function ($q) use ($otherUserId) {
                    $q->where('sender_id', $otherUserId)
                      ->orWhere('sender_id', (string) $otherUserId);
                })
                ->update(['is_read' => true]);

            // Generate room_id deterministically — both directions produce the same key
            $roomId = ChatMessage::generateRoomId($userId, $otherUserId);

            $messages = ChatMessage::where('room_id', $roomId)
                ->with(['product', 'sender'])
                ->orderBy('created_at', 'asc')
                ->get();

            return $this->successResponse(
                ChatMessageResource::collection($messages),
                'Chat messages retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Chat show error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return $this->errorResponse('Failed to retrieve chat messages: ' . $e->getMessage(), 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            if (str_contains(config('database.connections.mongodb.dsn'), '<cluster-url>')) {
                return $this->errorResponse('Failed to send message: MongoDB not configured.', 500);
            }

            $validated = $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'product_id' => 'nullable|exists:products,id',
                'message' => 'required|string|max:1000',
            ]);

            $senderId = (int) $request->user()->id;
            $receiverId = (int) $validated['receiver_id'];
            $productId = isset($validated['product_id']) ? (int) $validated['product_id'] : null;

            $roomId = ChatMessage::generateRoomId($senderId, $receiverId);

            // Strictly cast all foreign keys to integer for MongoDB type consistency
            $message = ChatMessage::create([
                'room_id' => $roomId,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'product_id' => $productId,
                'message' => $validated['message'],
                'is_read' => false,
            ]);

            $message->load(['product', 'sender']);

            try {
                broadcast(new MessageSent($message))->toOthers();
            } catch (\Exception $e) {
                Log::error('Reverb Broadcast Error: ' . $e->getMessage());
            }

            return $this->successResponse(
                new ChatMessageResource($message),
                'Message sent successfully',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send message', 500);
        }
    }
}
