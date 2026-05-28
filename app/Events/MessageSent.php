<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ChatMessage $message;

    /**
     * Create a new event instance.
     */
    public function __construct(ChatMessage $message)
    {
        $this->message = $message;
    }

    /**
     * Broadcast ONLY to the receiver's private channel.
     * The sender already appends their own message optimistically — broadcasting
     * to the sender's channel would cause duplicate messages in the UI.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . (int) $this->message->receiver_id),
        ];
    }

    /**
     * The event name that will be broadcast.
     */
    public function broadcastAs(): string
    {
        return 'MessageSent';
    }

    /**
     * Flatten the data payload so the frontend receives it directly on the event object.
     * Frontend reads: event.id, event.sender_id, event.message, etc.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => (string) $this->message->id,
            'sender_id' => (int) $this->message->sender_id,
            'receiver_id' => (int) $this->message->receiver_id,
            'product_id' => $this->message->product_id ? (int) $this->message->product_id : null,
            'message' => $this->message->message,
            'is_read' => (bool) $this->message->is_read,
            'created_at' => $this->message->created_at ? $this->message->created_at->toISOString() : now()->toISOString(),
            'product' => $this->message->product ? [
                'id' => $this->message->product->id,
                'name' => $this->message->product->nama_barang,
                'price' => $this->message->product->harga,
                'image' => $this->message->product->foto_barang_url,
            ] : null,
            'sender' => $this->message->relationLoaded('sender') && $this->message->sender ? [
                'id' => (int) $this->message->sender->id,
                'name' => $this->message->sender->name,
            ] : [
                'id' => (int) $this->message->sender_id,
                'name' => 'Unknown User',
            ],
        ];
    }
}
