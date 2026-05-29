<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationApiController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the user's notifications filtered by role.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $role = $request->query('role', 'buyer');

            // Query strictly by user_id and target_role in MongoDB
            $notifications = Notification::where('user_id', $user->id)
                ->where('target_role', $role)
                ->latest()
                ->get();

            return $this->successResponse($notifications, 'Notifications retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve notifications', 500);
        }
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        try {
            $user = $request->user();
            $notification = Notification::where('user_id', $user->id)
                ->findOrFail($id);

            $notification->update(['is_read' => true]);

            return $this->successResponse($notification, 'Notification marked as read');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to mark notification as read', 500);
        }
    }

    /**
     * Mark all notifications of a specific role as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $role = $request->query('role', 'buyer');

            Notification::where('user_id', $user->id)
                ->where('target_role', $role)
                ->update(['is_read' => true]);

            return $this->successResponse(null, 'All notifications marked as read');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to mark all notifications as read', 500);
        }
    }

    /**
     * Fetch the 5 latest notifications filtered by role.
     */
    public function latest(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $role = $request->query('role', 'seller');

            // 1. Fetch from MongoDB Notifications custom model (preferred)
            $notifications = Notification::where('user_id', $user->id)
                ->where('target_role', $role)
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($notif) {
                    return [
                        'id' => $notif->id ?? $notif->_id,
                        'title' => $notif->title ?? 'Notifikasi Baru',
                        'message' => $notif->message ?? 'Ada aktivitas baru.',
                        'read_at' => ($notif->is_read ?? false) ? now()->toISOString() : null,
                        'created_at' => $notif->created_at ? $notif->created_at->toISOString() : now()->toISOString(),
                        'type' => $notif->type ?? 'bell',
                    ];
                });

            // 2. Fallback to SQL-based Laravel notifications if MongoDB is empty
            if ($notifications->isEmpty()) {
                $notifications = $user->notifications()
                    ->where('data->target_role', $role)
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(function ($notif) {
                        return [
                            'id' => $notif->id,
                            'title' => $notif->data['title'] ?? 'Notifikasi Baru',
                            'message' => $notif->data['message'] ?? ($notif->data['text'] ?? 'Ada aktivitas baru.'),
                            'read_at' => $notif->read_at,
                            'created_at' => $notif->created_at->toISOString(),
                            'type' => $notif->data['type'] ?? 'bell',
                        ];
                    });
            }

            // 3. Absolute fallback: return standard notifications if both role-specific queries are empty
            if ($notifications->isEmpty()) {
                $notifications = $user->notifications()
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(function ($notif) {
                        return [
                            'id' => $notif->id,
                            'title' => $notif->data['title'] ?? 'Notifikasi Baru',
                            'message' => $notif->data['message'] ?? ($notif->data['text'] ?? 'Ada aktivitas baru.'),
                            'read_at' => $notif->read_at,
                            'created_at' => $notif->created_at->toISOString(),
                            'type' => $notif->data['type'] ?? 'bell',
                        ];
                    });
            }

            return $this->successResponse($notifications, 'Latest notifications retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve latest notifications: ' . $e->getMessage(), 500);
        }
    }
}
