<?php

namespace Database\Seeders;

use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds for MongoDB chat messages.
     */
    public function run(): void
    {
        $buyer  = User::where('email', 'buyer@example.com')->first();
        $rizky  = User::where('email', 'rizky.fauzan@recircle.id')->first();
        $budi   = User::where('email', 'seller@example.com')->first();
        $nada   = User::where('email', 'nadahf@recircle.id')->first();
        $sausan = User::where('email', 'sausan@recircle.id')->first();
        $dimas  = User::where('email', 'dimas.pratama@recircle.id')->first();

        $productMagicCom   = Product::where('nama_barang', 'like', '%Magic Com%')->first();
        $productKulkas     = Product::where('nama_barang', 'like', '%Kulkas Mini%')->first();
        $productKalkulus   = Product::where('nama_barang', 'like', '%Buku Kalkulus%')->first();
        $productKipas      = Product::where('nama_barang', 'like', '%Kipas Angin%')->first();
        $productMonitor    = Product::where('nama_barang', 'like', '%Monitor LED%')->first();

        $conversations = [];

        // ── Room 1: Buyer <-> Budi (Tentang Magic Com & Kulkas Mini) ───────────
        if ($buyer && $budi) {
            $roomId = ChatMessage::generateRoomId((int) $buyer->id, (int) $budi->id);
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $budi->id,
                'product_id'  => $productMagicCom ? (int) $productMagicCom->id : null,
                'message'     => 'Halo kak Budi, Magic Com Miyako-nya masih ada?',
                'is_read'     => true,
                'created_at'  => now()->subDays(2)->subHours(5),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $budi->id,
                'receiver_id' => (int) $buyer->id,
                'product_id'  => $productMagicCom ? (int) $productMagicCom->id : null,
                'message'     => 'Halo! Masih ada kak, kondisinya normal dan pancinya masih mulus anti lengket.',
                'is_read'     => true,
                'created_at'  => now()->subDays(2)->subHours(4),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $budi->id,
                'product_id'  => $productMagicCom ? (int) $productMagicCom->id : null,
                'message'     => 'Bisa nego 50 ribu gak kak? Nanti sore saya ambil langsung ke kosan.',
                'is_read'     => true,
                'created_at'  => now()->subDays(2)->subHours(3),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $budi->id,
                'receiver_id' => (int) $buyer->id,
                'product_id'  => $productMagicCom ? (int) $productMagicCom->id : null,
                'message'     => 'Boleh kak, tawaran nego sudah saya terima ya. Silakan di-checkout via ReCircle biar aman.',
                'is_read'     => true,
                'created_at'  => now()->subDays(2)->subHours(2),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $budi->id,
                'product_id'  => $productMagicCom ? (int) $productMagicCom->id : null,
                'message'     => 'Siap kak, sudah saya masukkan ke keranjang belanja. Makasih banyak ya!',
                'is_read'     => false,
                'created_at'  => now()->subDays(1)->subHours(1),
            ];
        }

        // ── Room 2: Buyer <-> Nada Haifa (Tentang Buku Kalkulus) ────────────────
        if ($buyer && $nada) {
            $roomId = ChatMessage::generateRoomId((int) $buyer->id, (int) $nada->id);
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $nada->id,
                'product_id'  => $productKalkulus ? (int) $productKalkulus->id : null,
                'message'     => 'Permisi kak Nada, mau tanya buku kalkulus purcell masih ada?',
                'is_read'     => true,
                'created_at'  => now()->subHours(12),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $nada->id,
                'receiver_id' => (int) $buyer->id,
                'product_id'  => $productKalkulus ? (int) $productKalkulus->id : null,
                'message'     => 'Iya masih ada kak. Halamannya lengkap semua, cuma ada sedikit coretan pensil di bab turunan.',
                'is_read'     => true,
                'created_at'  => now()->subHours(10),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $nada->id,
                'product_id'  => $productKalkulus ? (int) $productKalkulus->id : null,
                'message'     => 'Kalau COD di Perpustakaan IPB bisa jam berapa ya kak besok?',
                'is_read'     => false,
                'created_at'  => now()->subHours(2),
            ];
        }

        // ── Room 3: Rizky <-> Sausan Asma (Tentang Kipas Angin) ─────────────────
        if ($rizky && $sausan) {
            $roomId = ChatMessage::generateRoomId((int) $rizky->id, (int) $sausan->id);
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $rizky->id,
                'receiver_id' => (int) $sausan->id,
                'product_id'  => $productKipas ? (int) $productKipas->id : null,
                'message'     => 'Halo kak Sausan, kipas angin meja Miyako masih kencang putarannya?',
                'is_read'     => true,
                'created_at'  => now()->subHours(8),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $sausan->id,
                'receiver_id' => (int) $rizky->id,
                'product_id'  => $productKipas ? (int) $productKipas->id : null,
                'message'     => 'Halo! Masih kencang banget kak, swing kiri kanan lancar dan gak berisik sama sekali.',
                'is_read'     => false,
                'created_at'  => now()->subHours(6),
            ];
        }

        // ── Room 4: Buyer <-> Dimas Pratama (Tentang Monitor LED) ───────────────
        if ($buyer && $dimas) {
            $roomId = ChatMessage::generateRoomId((int) $buyer->id, (int) $dimas->id);
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $dimas->id,
                'product_id'  => $productMonitor ? (int) $productMonitor->id : null,
                'message'     => 'Malam kak Dimas, monitor LED LG 22 inch ada garansi personal gak ya?',
                'is_read'     => true,
                'created_at'  => now()->subDays(1),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $dimas->id,
                'receiver_id' => (int) $buyer->id,
                'product_id'  => $productMonitor ? (int) $productMonitor->id : null,
                'message'     => 'Malam kak! Ada garansi personal 3 hari buat tes ya kak. Kalau mau kirim ekspedisi dipacking bubble tebal + dus.',
                'is_read'     => true,
                'created_at'  => now()->subHours(20),
            ];
            $conversations[] = [
                'room_id'     => $roomId,
                'sender_id'   => (int) $buyer->id,
                'receiver_id' => (int) $dimas->id,
                'product_id'  => $productMonitor ? (int) $productMonitor->id : null,
                'message'     => 'Oke kak mantap, sudah saya pesan ya via kirim paket JNE.',
                'is_read'     => false,
                'created_at'  => now()->subHours(18),
            ];
        }

        // Simpan setiap pesan ke MongoDB
        foreach ($conversations as $item) {
            ChatMessage::create($item);
        }
    }
}
