<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['phone' => '+8801700000000'],
            [
                'name' => 'Store Admin',
                'email' => 'admin@novamart.local',
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
                'role' => UserRole::Admin,
                'address' => 'House 12, Road 5, Dhanmondi',
                'city' => 'Dhaka',
                'password' => Hash::make('Admin@1234'),
            ],
        );

        User::query()->updateOrCreate(
            ['phone' => '+8801800000000'],
            [
                'name' => 'Demo Customer',
                'email' => 'customer@novamart.local',
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
                'role' => UserRole::Customer,
                'address' => 'Banani Block C, Road 11',
                'city' => 'Dhaka',
                'password' => Hash::make('Customer@1234'),
            ],
        );

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
