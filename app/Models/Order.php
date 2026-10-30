<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'daikin_do',
        'address',
        'delivery_point_name',
        'priority',
        'plan_board',
    ];
}
