<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use App\Models\NotificationLog;

class MongoChannel
{
    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        // Require the notification to have a toMongo method
        if (! method_exists($notification, 'toMongo')) {
            throw new \RuntimeException('Notification is missing the toMongo method.');
        }

        // Get the data payload from the notification instance
        $data = $notification->toMongo($notifiable);

        // Insert the payload into MongoDB using our log model
        NotificationLog::create([
            'notifiable_id' => $notifiable->getKey(),
            'type'          => get_class($notification),
            'data'          => $data,
            'created_at'    => now()->toDateTimeString(),
        ]);
    }
}
