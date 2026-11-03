<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Syafiq Syahrom', 'email' => 'syafiqsyahrom2@gmail.com',    'role' => 'manager',   'status' => 'active'],
            ['name' => 'Admin',         'email' => 'admin@example.com',    'role' => 'manager',   'status' => 'active'],
            ['name' => 'Planner One',   'email' => 'planner1@example.com', 'role' => 'planner', 'status' => 'active'],
            ['name' => 'Planner Two',   'email' => 'planner2@example.com', 'role' => 'planner', 'status' => 'active'],
            ['name' => 'Inactive User', 'email' => 'inactive@example.com', 'role' => 'planner', 'status' => 'inactive'],
        ];

        foreach ($users as $user) {
            // Skip if a user with this email already exists
            if (DB::table('users')->where('email', $user['email'])->exists()) {
                $this->command?->warn("User {$user['email']} already exists, skipped.");

                continue;
            }

            DB::table('users')->insert($user + [
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
