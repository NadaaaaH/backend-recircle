<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Offer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Pastikan kategori tersedia
        $category = Category::firstOrCreate(
            ['slug' => 'elektronik'],
            ['nama_kategori' => 'Elektronik', 'ikon' => 'Laptop']
        );

        // 2. Pastikan kita memiliki user Pembeli (Buyer) dan Penjual (Seller)
        $buyer = User::firstOrCreate(
            ['email' => 'buyer@example.com'],
            [
                'name' => 'Buyer Name',
                'password' => bcrypt('password'),
                'kampus' => 'IPB University',
                'is_seller' => false,
            ]
        );

        $seller = User::firstOrCreate(
            ['email' => 'seller@example.com'],
            [
                'name' => 'Seller Name',
                'password' => bcrypt('password'),
                'kampus' => 'Institut Pertanian Bogor',
                'is_seller' => true,
            ]
        );

        // 3. Buat 2 produk untuk seller dengan atribut lengkap
        $product1 = Product::firstOrCreate(
            ['nama_barang' => 'Magic Com Miyako Ungu Series 1726'],
            [
                'user_id' => $seller->id,
                'category_id' => $category->id,
                'harga' => 75000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Kondisi bagus, masih berfungsi normal pemakaian anak kost.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $product2 = Product::firstOrCreate(
            ['nama_barang' => 'Kulkas Mini Hisense Silver Series 189x'],
            [
                'user_id' => $seller->id,
                'category_id' => $category->id,
                'harga' => 850000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Dingin mantap, hemat listrik cocok untuk kamar kost.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        // 4. Item 1: Normal item (tanpa offer / nego)
        Cart::firstOrCreate([
            'user_id' => $buyer->id,
            'product_id' => $product2->id,
        ], [
            'offer_id' => null,
        ]);

        // 5. Item 2: Item dengan penawaran/nego yang disetujui (offer_deal, expires_at 24 jam)
        $offer = Offer::firstOrCreate(
            [
                'user_id' => $buyer->id,
                'product_id' => $product1->id,
            ],
            [
                'harga_tawar' => 60000,
                'harga_deal' => 50000,
                'status' => 'accepted',
                'pesan' => 'Bisa kurang ngga kak?',
                'deal_expired_at' => now()->addHours(24),
                'expires_at' => now()->addHours(24),
            ]
        );

        Cart::firstOrCreate([
            'user_id' => $buyer->id,
            'product_id' => $product1->id,
        ], [
            'offer_id' => $offer->id,
        ]);

        // 6. Sinkronisasi tabel wishlists untuk kompatibilitas CartApiController (API Cart)
        DB::table('wishlists')->insertOrIgnore([
            [
                'user_id' => $buyer->id,
                'product_id' => $product1->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $buyer->id,
                'product_id' => $product2->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
