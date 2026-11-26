<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobOrder extends Model
{
    protected $fillable = [
        'logsheet_id',
        'order_id',
        'ordinal',
        'status',
    ];

    public function logsheet(): BelongsTo
    {
        return $this->belongsTo(Logsheet::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
