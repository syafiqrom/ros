<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Logsheet extends Model
{
    public const STATUS_NEW = 'new';

    protected $fillable = [
        'date',
        'status',
        'vehicle_id',
        'start_load_date',
        'start_load_time',
        'dispatch_date',
        'dispatch_time',
        'remarks',
    ];

    protected $attributes = [
        'status' => self::STATUS_NEW,
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class)->withTrashed();
    }

    public function jobOrders(): HasMany
    {
        return $this->hasMany(JobOrder::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'start_load_date' => 'date:Y-m-d',
            'dispatch_date' => 'date:Y-m-d',
        ];
    }
}
