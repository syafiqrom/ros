<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'vbeln',
        'pdate',
        'name',
        'addr1',
        'addr2',
        'city',
        'region',
        'tzone',
        'volum',
        'priority',
        'plan_board',
        'row_hash',
    ];
}
