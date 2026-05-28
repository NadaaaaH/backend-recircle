<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class NotificationLog extends Model
{
    /**
     * The database connection that should be used by the model.
     * Assuming it is configured as 'mongodb' in config/database.php.
     *
     * @var string
     */
    protected $connection = 'mongodb';

    /**
     * The collection associated with the model.
     *
     * @var string
     */
    protected $collection = 'notification_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'notifiable_id',
        'type',
        'data',
        'created_at',
    ];

    /**
     * Indicates if the model should be timestamped.
     * We'll disable default timestamps to manually handle created_at like a log if desired,
     * or keep it true to let it populate updated_at as well.
     * Setting to false since typically logs only need created_at.
     *
     * @var bool
     */
    public $timestamps = false;
}
