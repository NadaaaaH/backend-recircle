<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with complete demo data.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            SellerVerificationSeeder::class,
            ProductSeeder::class,
            OfferSeeder::class,
            OrderSeeder::class,
            SellerFinanceSeeder::class,
            CartSeeder::class,
            ChatSeeder::class,
        ]);
    }
}
