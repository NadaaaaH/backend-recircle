<?php

namespace Database\Seeders;

use App\Models\Cart;
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
        $buyer = User::where('email', 'buyer@example.com')->first();
        $rizky = User::where('email', 'rizky.fauzan@recircle.id')->first();

        $productMagicCom   = Product::where('nama_barang', 'like', '%Magic Com%')->first();
        $productKulkas     = Product::where('nama_barang', 'like', '%Kulkas Mini%')->first();
        $productKalkulator = Product::where('nama_barang', 'like', '%Kalkulator Scientific%')->first();
        $productKalkulus   = Product::where('nama_barang', 'like', '%Buku Kalkulus%')->first();
        $productSepeda     = Product::where('nama_barang', 'like', '%Sepeda Lipat%')->first();
        $productToteBag    = Product::where('nama_barang', 'like', '%Tote Bag%')->first();

        // Cari offer deal yang accepted untuk buyer
        $offerMagicCom = Offer::where('user_id', $buyer?->id)
            ->where('product_id', $productMagicCom?->id)
            ->where('status', 'accepted')
            ->first();

        $offerKalkulator = Offer::where('user_id', $buyer?->id)
            ->where('product_id', $productKalkulator?->id)
            ->where('status', 'accepted')
            ->first();

        // 1. Cart Items untuk Buyer:
        if ($buyer) {
            // Item 1: Magic Com (dengan Offer Deal accepted: 50.000)
            if ($productMagicCom) {
                Cart::updateOrCreate(
                    [
                        'user_id' => $buyer->id,
                        'product_id' => $productMagicCom->id,
                    ],
                    [
                        'offer_id' => $offerMagicCom?->id,
                    ]
                );
            }

            // Item 2: Kulkas Mini (tanpa offer / harga normal: 850.000)
            if ($productKulkas) {
                Cart::updateOrCreate(
                    [
                        'user_id' => $buyer->id,
                        'product_id' => $productKulkas->id,
                    ],
                    [
                        'offer_id' => null,
                    ]
                );
            }

            // Item 3: Tote Bag Kampus (harga normal: 25.000)
            if ($productToteBag) {
                Cart::updateOrCreate(
                    [
                        'user_id' => $buyer->id,
                        'product_id' => $productToteBag->id,
                    ],
                    [
                        'offer_id' => null,
                    ]
                );
            }
        }

        // 2. Cart Items untuk Rizky:
        if ($rizky && $productKalkulus) {
            Cart::updateOrCreate(
                [
                    'user_id' => $rizky->id,
                    'product_id' => $productKalkulus->id,
                ],
                [
                    'offer_id' => null,
                ]
            );
        }

        // 3. Wishlists untuk Buyer dan Rizky
        if ($buyer) {
            $wishlistProducts = array_filter([$productKalkulator?->id, $productSepeda?->id, $productKalkulus?->id]);
            foreach ($wishlistProducts as $prodId) {
                DB::table('wishlists')->insertOrIgnore([
                    'user_id' => $buyer->id,
                    'product_id' => $prodId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        if ($rizky && $productSepeda) {
            DB::table('wishlists')->insertOrIgnore([
                'user_id' => $rizky->id,
                'product_id' => $productSepeda->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
