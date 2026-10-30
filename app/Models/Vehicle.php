<?php

namespace App\Models;

use Database\Factories\VehicleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    /** @use HasFactory<VehicleFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'plate_number',
        'brand',
        'model',
        'capacity_metric_ton',
        'capacity_cubic_meter',
        'cost_per_km',
        'cost_per_hour',
        'status',
    ];
}
