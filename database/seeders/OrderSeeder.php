<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $points = [
            ['Daikin Service Centre Shah Alam', 'Seksyen 15, 40200 Shah Alam, Selangor'],
            ['Dealer Klang Aircond',            'Jalan Kapar, 41400 Klang, Selangor'],
            ['Dealer Subang Cool',              'Jalan SS 15/4, 47500 Subang Jaya, Selangor'],
            ['Dealer Petaling Jaya Aircond',    'Jalan Universiti, 46200 Petaling Jaya, Selangor'],
            ['Dealer Cheras Cooling',           'Jalan Cheras, 56100 Kuala Lumpur'],
            ['Dealer Johor Bahru Aircond',      'Jalan Tebrau, 80250 Johor Bahru, Johor'],
            ['Dealer Penang Cooling',           'Jalan Perai, 13600 Perai, Pulau Pinang'],
            ['Dealer Ipoh Aircond',             'Jalan Sultan Idris Shah, 30000 Ipoh, Perak'],
        ];

        $priorities = ['normal', 'normal', 'high', 'urgent'];
        $boards = ['pool', 'pool', 'scheduled'];

        foreach ($points as $i => [$name, $address]) {
            $do = 'DO26'.str_pad((string) ($i + 1), 6, '0', STR_PAD_LEFT);

            // Skip if this DO already exists
            if (DB::table('orders')->where('daikin_DO', $do)->exists()) {
                $this->command?->warn("Order {$do} already exists, skipped.");

                continue;
            }

            DB::table('orders')->insert([
                'daikin_DO' => $do,
                'address' => $address,
                'delivery_point_name' => $name,
                'priority' => $priorities[$i % count($priorities)],
                'plan_board' => $boards[$i % count($boards)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
