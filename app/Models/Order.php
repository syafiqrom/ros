<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'daikin_do',
        'address',
        'delivery_point_name',
        'is_in_pool',
    ];
}
