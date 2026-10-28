<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kpi extends Model
{
    protected $table = 'kpi_reports';

    protected $fillable = [
        'truck_load_no',
        'job_no',
        'job_date',
        'daikin_do',
        'delivery_point_name',
        'truck_no',
        'iod_date',
        'est_delivery_date',
        'est_delivery_time',
        'kpi_pass', // PASS, NO IOD, ON DELIVERY
    ];

    protected $casts = [
        'job_date' => 'date',
        'iod_date' => 'datetime',
        'est_delivery_date' => 'date',
    ];
}
