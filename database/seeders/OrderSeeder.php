<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Order;
use App\Models\Product;
use App\Models\SellerBalance;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $buyer = User::where('email', 'buyer@example.com')->first();
        $rizky = User::where('email', 'rizky.fauzan@recircle.id')->first();

        $productKulkas   = Product::where('nama_barang', 'like', '%Kulkas Mini%')->first();
        $productMonitor  = Product::where('nama_barang', 'like', '%Monitor LED%')->first();
        $productJasLab   = Product::where('nama_barang', 'like', '%Jas Laboratorium%')->first();
        $productKasur    = Product::where('nama_barang', 'like', '%Kasur Busa%')->first();
        $productKeyboard = Product::where('nama_barang', 'like', '%Keyboard Mechanical%')->first();

        // 1. Order SELESAI (Completed) - Kulkas Mini (COD Dramaga)
        if ($buyer && $productKulkas) {
            $orderSelesai = Order::updateOrCreate(
                ['kode_pesanan' => 'RC-20261020-KULKAS'],
                [
                    'user_id' => $buyer->id,
                    'product_id' => $productKulkas->id,
                    'offer_id' => null,
                    'total_harga' => 850000,
                    'shipping_cost' => 0,
                    'metode_pengiriman' => 'cod',
                    'courier_service' => null,
                    'rajaongkir_tracking_id' => null,
                    'status' => 'selesai',
                    'alamat_pengiriman' => 'Asrama Putra Dramaga Gedung A3, IPB Dramaga, Bogor',
                    'catatan' => 'Ketemuan di lobi asrama putra jam 4 sore.',
                    'midtrans_transaction_id' => 'mid-settled-889123',
                    'midtrans_snap_token' => 'snap-demo-token-112233',
                    'metode_pembayaran' => 'bca_va',
                    'dana_ditahan' => false,
                    'dana_dilepas_at' => now()->subDays(2),
                    'created_at' => now()->subDays(4),
                ]
            );

            // Seller Balance: Sudah dilepas ke saldo penjual
            SellerBalance::updateOrCreate(
                ['order_id' => $orderSelesai->id],
                [
                    'user_id' => $productKulkas->user_id,
                    'jumlah' => 850000,
                    'status' => 'dilepas',
                    'catatan' => 'Penjualan Kulkas Mini Hisense (Pesanan RC-20261020-KULKAS)',
                    'dilepas_at' => now()->subDays(2),
                ]
            );
        }

        // 2. Order DIKIRIM (In Transit) - Monitor LED (Kirim Paket via JNE)
        if ($buyer && $productMonitor) {
            $orderDikirim = Order::updateOrCreate(
                ['kode_pesanan' => 'RC-20261026-MONITOR'],
                [
                    'user_id' => $buyer->id,
                    'product_id' => $productMonitor->id,
                    'offer_id' => null,
                    'total_harga' => 745000,
                    'shipping_cost' => 25000,
                    'metode_pengiriman' => 'kirim_paket',
                    'courier_service' => 'JNE - Reguler (REG)',
                    'rajaongkir_tracking_id' => 'JNE0192837465',
                    'status' => 'dikirim',
                    'alamat_pengiriman' => 'Jl. Babakan Raya No. 42, RT 02/RW 03, Dramaga, Bogor 16680',
                    'catatan' => 'Mohon bubble wrap tebal ya kak.',
                    'midtrans_transaction_id' => 'mid-settled-991204',
                    'midtrans_snap_token' => 'snap-demo-token-991204',
                    'metode_pembayaran' => 'gopay',
                    'dana_ditahan' => true,
                    'dana_dilepas_at' => null,
                    'created_at' => now()->subDay(),
                ]
            );

            // Seller Balance: Dana masih ditahan di escrow
            SellerBalance::updateOrCreate(
                ['order_id' => $orderDikirim->id],
                [
                    'user_id' => $productMonitor->user_id,
                    'jumlah' => 720000,
                    'status' => 'ditahan',
                    'catatan' => 'Escrow ditahan: Pesanan RC-20261026-MONITOR (Menunggu konfirmasi penerimaan pembeli)',
                    'dilepas_at' => null,
                ]
            );
        }

        // 3. Order DIBAYAR / PROCESSING - Jas Laboratorium (Seller siap packing)
        if ($rizky && $productJasLab) {
            $orderDibayar = Order::updateOrCreate(
                ['kode_pesanan' => 'RC-20261028-JASLAB'],
                [
                    'user_id' => $rizky->id,
                    'product_id' => $productJasLab->id,
                    'offer_id' => null,
                    'total_harga' => 45000,
                    'shipping_cost' => 0,
                    'metode_pengiriman' => 'cod',
                    'courier_service' => null,
                    'rajaongkir_tracking_id' => null,
                    'status' => 'dibayar',
                    'alamat_pengiriman' => 'Fakultas MIPA IPB Kampus Dramaga',
                    'catatan' => 'Bisa titip di lobi departemen kimia ya kak.',
                    'midtrans_transaction_id' => 'mid-settled-102938',
                    'midtrans_snap_token' => 'snap-demo-token-102938',
                    'metode_pembayaran' => 'qris',
                    'dana_ditahan' => true,
                    'dana_dilepas_at' => null,
                    'created_at' => now()->subHours(6),
                ]
            );

            SellerBalance::updateOrCreate(
                ['order_id' => $orderDibayar->id],
                [
                    'user_id' => $productJasLab->user_id,
                    'jumlah' => 45000,
                    'status' => 'ditahan',
                    'catatan' => 'Escrow ditahan: Jas Lab Kimia (RC-20261028-JASLAB)',
                    'dilepas_at' => null,
                ]
            );
        }

        // 4. Order PENDING (Waiting for payment) - Kasur Busa Inoac
        if ($buyer && $productKasur) {
            Order::updateOrCreate(
                ['kode_pesanan' => 'RC-20261029-KASUR'],
                [
                    'user_id' => $buyer->id,
                    'product_id' => $productKasur->id,
                    'offer_id' => null,
                    'total_harga' => 240000,
                    'shipping_cost' => 0,
                    'metode_pengiriman' => 'cod',
                    'courier_service' => null,
                    'rajaongkir_tracking_id' => null,
                    'status' => 'pending',
                    'alamat_pengiriman' => 'Kost Pondok Hijau Kamar 12, Balumbang Jaya, Bogor Barat',
                    'catatan' => 'Menunggu instruksi pembayaran via transfer.',
                    'midtrans_transaction_id' => null,
                    'midtrans_snap_token' => 'snap-demo-pending-776655',
                    'metode_pembayaran' => null,
                    'dana_ditahan' => false,
                    'dana_dilepas_at' => null,
                    'created_at' => now()->subMinutes(30),
                ]
            );
        }

        // 5. Order DIBATALKAN (Cancelled) - Keyboard Mechanical
        if ($rizky && $productKeyboard) {
            Order::updateOrCreate(
                ['kode_pesanan' => 'RC-20261015-KEYBOARD'],
                [
                    'user_id' => $rizky->id,
                    'product_id' => $productKeyboard->id,
                    'offer_id' => null,
                    'total_harga' => 310000,
                    'shipping_cost' => 0,
                    'metode_pengiriman' => 'cod',
                    'courier_service' => null,
                    'rajaongkir_tracking_id' => null,
                    'status' => 'dibatalkan',
                    'alamat_pengiriman' => 'Kantin Sapta IPB',
                    'catatan' => 'Pembeli membatalkan pesanan karena sudah dapat barang serupa.',
                    'midtrans_transaction_id' => null,
                    'midtrans_snap_token' => null,
                    'metode_pembayaran' => null,
                    'dana_ditahan' => false,
                    'dana_dilepas_at' => null,
                    'created_at' => now()->subDays(10),
                ]
            );
        }
    }
}
