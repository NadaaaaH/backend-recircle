<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $buyer = User::where('email', 'buyer@example.com')->first();
        $rizky = User::where('email', 'rizky.fauzan@recircle.id')->first();

        $productMagicCom   = Product::where('nama_barang', 'like', '%Magic Com%')->first();
        $productKalkulator = Product::where('nama_barang', 'like', '%Kalkulator Scientific%')->first();
        $productKipas      = Product::where('nama_barang', 'like', '%Kipas Angin%')->first();
        $productKalkulus   = Product::where('nama_barang', 'like', '%Buku Kalkulus%')->first();
        $productSepeda     = Product::where('nama_barang', 'like', '%Sepeda Lipat%')->first();

        // 1. Offer Accepted (Deal) - Magic Com
        if ($buyer && $productMagicCom) {
            Offer::updateOrCreate(
                [
                    'user_id' => $buyer->id,
                    'product_id' => $productMagicCom->id,
                ],
                [
                    'harga_tawar' => 60000,
                    'harga_deal' => 50000,
                    'status' => 'accepted',
                    'pesan' => 'Halo kak, apakah boleh ditawar 50rb? Saya ambil langsung ke kosan kakak.',
                    'deal_expired_at' => now()->addDays(2),
                    'expires_at' => now()->addDays(2),
                ]
            );
        }

        // 2. Offer Accepted (Deal) - Kalkulator
        if ($buyer && $productKalkulator) {
            Offer::updateOrCreate(
                [
                    'user_id' => $buyer->id,
                    'product_id' => $productKalkulator->id,
                ],
                [
                    'harga_tawar' => 170000,
                    'harga_deal' => 175000,
                    'status' => 'accepted',
                    'pesan' => 'Kak, 175rb boleh dilepas gak buat tugas lab fisika?',
                    'deal_expired_at' => now()->addDays(1),
                    'expires_at' => now()->addDays(1),
                ]
            );
        }

        // 3. Offer Pending - Kipas Angin
        if ($rizky && $productKipas) {
            Offer::updateOrCreate(
                [
                    'user_id' => $rizky->id,
                    'product_id' => $productKipas->id,
                ],
                [
                    'harga_tawar' => 50000,
                    'harga_deal' => null,
                    'status' => 'pending',
                    'pesan' => 'Permisi kak, kalau 50rb saya jemput sore ini di gerbang Bara IPB.',
                    'deal_expired_at' => null,
                    'expires_at' => now()->addHours(24),
                ]
            );
        }

        // 4. Offer Rejected - Sepeda Lipat
        if ($rizky && $productSepeda) {
            Offer::updateOrCreate(
                [
                    'user_id' => $rizky->id,
                    'product_id' => $productSepeda->id,
                ],
                [
                    'harga_tawar' => 300000,
                    'harga_deal' => null,
                    'status' => 'rejected',
                    'pesan' => 'Boleh 300rb kak?',
                    'deal_expired_at' => null,
                    'expires_at' => now()->subDay(),
                ]
            );
        }

        // 5. Offer Pending - Buku Kalkulus
        if ($buyer && $productKalkulus) {
            Offer::updateOrCreate(
                [
                    'user_id' => $buyer->id,
                    'product_id' => $productKalkulus->id,
                ],
                [
                    'harga_tawar' => 50000,
                    'harga_deal' => null,
                    'status' => 'pending',
                    'pesan' => 'Halo kak Nada, boleh nego jadi 50 ribu? COD perpus IPB.',
                    'deal_expired_at' => null,
                    'expires_at' => now()->addHours(48),
                ]
            );
        }
    }
}
