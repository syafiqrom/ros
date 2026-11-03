<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['plate_number' => 'BKL 1234', 'brand' => 'Isuzu',           'model' => 'NPR 75',     'capacity_metric_ton' => 3,  'capacity_cubic_meter' => 15, 'cost_per_km' => 1.20, 'cost_per_hour' => 25.00, 'status' => 'available'],
            ['plate_number' => 'WXY 5678', 'brand' => 'Isuzu',           'model' => 'NQR 75',     'capacity_metric_ton' => 5,  'capacity_cubic_meter' => 22, 'cost_per_km' => 1.50, 'cost_per_hour' => 30.00, 'status' => 'available'],
            ['plate_number' => 'VAB 9012', 'brand' => 'Hino',            'model' => '300 Series', 'capacity_metric_ton' => 5,  'capacity_cubic_meter' => 24, 'cost_per_km' => 1.60, 'cost_per_hour' => 32.00, 'status' => 'available'],
            ['plate_number' => 'JKL 3456', 'brand' => 'Hino',            'model' => '500 Series', 'capacity_metric_ton' => 10, 'capacity_cubic_meter' => 40, 'cost_per_km' => 2.20, 'cost_per_hour' => 45.00, 'status' => 'on_trip'],
            ['plate_number' => 'PQR 7890', 'brand' => 'Mitsubishi Fuso', 'model' => 'Canter',     'capacity_metric_ton' => 3,  'capacity_cubic_meter' => 16, 'cost_per_km' => 1.25, 'cost_per_hour' => 26.00, 'status' => 'available'],
            ['plate_number' => 'DEF 2468', 'brand' => 'Mitsubishi Fuso', 'model' => 'Fighter',    'capacity_metric_ton' => 8,  'capacity_cubic_meter' => 35, 'cost_per_km' => 2.00, 'cost_per_hour' => 40.00, 'status' => 'maintenance'],
            ['plate_number' => 'MNO 1357', 'brand' => 'UD Trucks',       'model' => 'Kuzer',      'capacity_metric_ton' => 5,  'capacity_cubic_meter' => 23, 'cost_per_km' => 1.55, 'cost_per_hour' => 31.00, 'status' => 'available'],
            ['plate_number' => 'TUV 8642', 'brand' => 'UD Trucks',       'model' => 'Quester',    'capacity_metric_ton' => 20, 'capacity_cubic_meter' => 60, 'cost_per_km' => 3.50, 'cost_per_hour' => 60.00, 'status' => 'available'],
        ];

        foreach ($vehicles as $vehicle) {
            // Skip if the plate already exists (includes soft-deleted rows)
            if (DB::table('vehicles')->where('plate_number', $vehicle['plate_number'])->exists()) {
                $this->command?->warn("Vehicle {$vehicle['plate_number']} already exists, skipped.");

                continue;
            }

            DB::table('vehicles')->insert($vehicle + [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
