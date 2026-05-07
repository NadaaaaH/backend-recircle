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
            $user = $request->user();
            
            // Get latest messages per room
            $latestMessages = ChatMessage::raw(function ($collection) use ($user) {
                $userId = (int) $user->id;
                return $collection->aggregate([
                    ['$match' => ['$or' => [['sender_id' => $userId], ['receiver_id' => $userId]]]],
                    ['$sort' => ['created_at' => -1]],
                    ['$group' => [
                        '_id' => '$room_id',
                        'original' => ['$first' => '$$ROOT']
                    ]],
                    ['$replaceRoot' => ['newRoot' => '$original']],
                    ['$sort' => ['created_at' => -1]]
                ]);
            });
            
            $messages = ChatMessage::hydrate(iterator_to_array($latestMessages));
            
            $contacts = [];
            foreach ($messages as $msg) {
                $otherUserId = $msg->sender_id === $user->id ? $msg->receiver_id : $msg->sender_id;
                $otherUser = User::find($otherUserId);
                
                if ($otherUser) {
                    $contacts[] = [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($otherUser->name) . '&background=f3f4f6&color=43552c',
                        'last_message' => $msg->message,
                        'created_at' => $msg->created_at->diffForHumans(),
                        'is_read' => $msg->is_read,
                        'unread_count' => ChatMessage::where('sender_id', $otherUserId)
                            ->where('receiver_id', $user->id)
                            ->where('is_read', false)
                            ->count(),
                    ];
                }
            }

            return $this->successResponse($contacts, 'Chat contacts retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve chat contacts', 500);
        }
    }

    public function show(int $otherUserId, Request $request): JsonResponse
    {
        try {
            $userId = $request->user()->id;

            // Mark as read
            ChatMessage::where('sender_id', $otherUserId)
                ->where('receiver_id', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            $roomId = ChatMessage::generateRoomId((int)$userId, (int)$otherUserId);
            $messages = ChatMessage::where('room_id', $roomId)
                ->with(['product', 'sender'])
                ->orderBy('created_at', 'asc')
                ->get();

            return $this->successResponse(
                ChatMessageResource::collection($messages),
                'Chat messages retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve chat messages', 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'product_id' => 'nullable|exists:products,id',
                'message' => 'required|string|max:1000',
            ]);

            $roomId = ChatMessage::generateRoomId((int)$request->user()->id, (int)$validated['receiver_id']);

            $message = ChatMessage::create([
                'room_id' => $roomId,
                'sender_id' => $request->user()->id,
                'receiver_id' => $validated['receiver_id'],
                'product_id' => $validated['product_id'] ?? null,
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
