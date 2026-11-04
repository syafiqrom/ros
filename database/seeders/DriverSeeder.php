<?php

namespace Database\Seeders;

use App\Models\Driver;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drivers = [
            ['name' => 'Ahmad Faizal bin Rahman',   'phone' => '012-345 6701', 'licence_no' => 'D10234567', 'status' => 'active'],
            ['name' => 'Muthu a/l Raman',           'phone' => '013-456 7802', 'licence_no' => 'D10234568', 'status' => 'active'],
            ['name' => 'Lim Wei Jie',               'phone' => '016-567 8903', 'licence_no' => 'D10234569', 'status' => 'active'],
            ['name' => 'Mohd Hafiz bin Ismail',     'phone' => '017-678 9004', 'licence_no' => 'D10234570', 'status' => 'active'],
            ['name' => 'Rajesh a/l Kumar',          'phone' => '018-789 0105', 'licence_no' => 'D10234571', 'status' => 'active'],
            ['name' => 'Tan Chee Keong',            'phone' => '019-890 1206', 'licence_no' => 'D10234572', 'status' => 'active'],
            ['name' => 'Azman bin Yusof',           'phone' => '011-901 2307', 'licence_no' => 'D10234573', 'status' => 'inactive'],
        ];

        foreach ($drivers as $driver) {
            Driver::firstOrCreate(
                ['licence_no' => $driver['licence_no']],
                $driver,
            );
        }
    }
}
