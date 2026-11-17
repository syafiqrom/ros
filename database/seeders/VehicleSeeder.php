<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {

        $plates = [
            'BNM8380', 'NDE8380', 'NDG8380', 'VBY8380', 'RV8380', 'VX8380',
            'WB8380M', 'WA8370F', 'WYB7593', 'AGG2515', 'WUH1637', 'BNU8380',
            'BFQ1409', 'BEB4975', 'PDS1778', 'PJQ5893', 'WCC7054', 'WDS3732',
            'WHJ3454', 'JKY6118', 'WW8093', 'BKY4649', 'WFS8705', 'BGA6907',
            'FA8380', 'CDX8380', 'JDP5663', 'KEL8380', 'NBK9841', 'BJU4159',
            'JHD', 'W6280P', 'SD8622R', 'BINU',
        ];

        $vehicles = array_map(fn ($plate) => [
            'plate_number' => $plate,
            'brand' => 'Isuzu',
            'model' => 'NPR 75',
            'capacity_metric_ton' => 3,
            'capacity_cubic_meter' => 15,
            'cost_per_km' => 1.20,
            'cost_per_hour' => 25.00,
            'status' => 'available',
        ], $plates);

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
