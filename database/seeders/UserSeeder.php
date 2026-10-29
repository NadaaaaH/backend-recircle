<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // 1. Admin
        User::updateOrCreate(
            ['email' => 'admin@recircle.id'],
            [
                'name' => 'Admin ReCircle',
                'password' => $password,
                'role' => 'admin',
                'is_seller' => false,
                'is_verified' => true,
                'is_active' => true,
                'kampus' => 'IPB University',
                'nomor_wa' => '628111222333',
                'bio' => 'Administrator resmi platform ReCircle Kampus.',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            ]
        );

        // 2. Verified Sellers
        User::updateOrCreate(
            ['email' => 'sausan@recircle.id'],
            [
                'name' => 'Sausan Asma',
                'password' => $password,
                'role' => 'user',
                'is_seller' => true,
                'is_verified' => true,
                'is_active' => true,
                'kampus' => 'IPB University',
                'nomor_wa' => '628123456789',
                'bio' => 'Mahasiswi Ilmu Komputer IPB angkatan 59. Menjual barang preloved kosan yang masih mulus dan layak pakai.',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            ]
        );

        User::updateOrCreate(
            ['email' => 'seller@example.com'],
            [
                'name' => 'Budi Santoso',
                'password' => $password,
                'role' => 'user',
                'is_seller' => true,
                'is_verified' => true,
                'is_active' => true,
                'kampus' => 'IPB University',
                'nomor_wa' => '6285712345678',
                'bio' => 'Alumni Agronomi IPB, beres-beres kosan menjelang wisuda. Fast response COD Dramaga.',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            ]
        );

        User::updateOrCreate(
            ['email' => 'nadahf@recircle.id'],
            [
                'name' => 'Nada Haifa',
                'password' => $password,
                'role' => 'user',
                'is_seller' => true,
                'is_verified' => true,
                'is_active' => true,
                'kampus' => 'IPB University',
                'nomor_wa' => '6287812349999',
                'bio' => 'Jual buku kuliah, modul praktikum, dan perlengkapan kamar kost. COD lingkar kampus oke banget.',
                'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            ]
        );

        User::updateOrCreate(
            ['email' => 'dimas.pratama@recircle.id'],
            [
                'name' => 'Dimas Pratama',
                'password' => $password,
                'role' => 'user',
                'is_seller' => true,
                'is_verified' => true,
                'is_active' => true,
                'kampus' => 'Universitas Indonesia',
                'nomor_wa' => '6281399887766',
                'bio' => 'Anak Teknik Elektro UI. Suka rakit alat dan jual gadget bekas terawat bergaransi personal.',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            ]
        );

        // 3. Calon Seller (Pending KYC)
        User::updateOrCreate(
            ['email' => 'calon.seller@recircle.id'],
            [
                'name' => 'Farhan Pratama',
                'password' => $password,
                'role' => 'user',
                'is_seller' => false,
                'is_verified' => false,
                'is_active' => true,
                'kampus' => 'Institut Teknologi Bandung',
                'nomor_wa' => '6282112345678',
                'bio' => 'Calon seller ReCircle ITB.',
                'avatar' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
            ]
        );

        // 4. Buyers
        User::updateOrCreate(
            ['email' => 'buyer@example.com'],
            [
                'name' => 'Buyer Name',
                'password' => $password,
                'role' => 'user',
                'is_seller' => false,
                'is_verified' => false,
                'is_active' => true,
                'kampus' => 'IPB University',
                'nomor_wa' => '628991234567',
                'bio' => 'Mahasiswa tingkat 1 cari barang kebutuhan kos murah meriah.',
                'avatar' => 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
            ]
        );

        User::updateOrCreate(
            ['email' => 'rizky.fauzan@recircle.id'],
            [
                'name' => 'Rizky Fauzan',
                'password' => $password,
                'role' => 'user',
                'is_seller' => false,
                'is_verified' => false,
                'is_active' => true,
                'kampus' => 'IPB University',
                'nomor_wa' => '628812345678',
                'bio' => 'Pengguna aktif ReCircle Dramaga Bogor.',
                'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            ]
        );
    }
}
