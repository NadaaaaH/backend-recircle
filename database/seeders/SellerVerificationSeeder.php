<?php

namespace Database\Seeders;

use App\Models\SellerVerification;
use App\Models\User;
use Illuminate\Database\Seeder;

class SellerVerificationSeeder extends Seeder
{
    public function run(): void
    {
        $sausan = User::where('email', 'sausan@recircle.id')->first();
        $budi = User::where('email', 'seller@example.com')->first();
        $nada = User::where('email', 'nadahf@recircle.id')->first();
        $dimas = User::where('email', 'dimas.pratama@recircle.id')->first();
        $farhan = User::where('email', 'calon.seller@recircle.id')->first();
        $rizky = User::where('email', 'rizky.fauzan@recircle.id')->first();

        // 1. Approved KYC for active sellers
        if ($sausan) {
            SellerVerification::updateOrCreate(
                ['user_id' => $sausan->id],
                [
                    'foto_ktm' => 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
                    'foto_selfie' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
                    'nama_kampus' => 'IPB University',
                    'nim' => 'G6401201088',
                    'status' => 'approved',
                    'catatan_admin' => 'Data identitas mahasiswa valid dan terverifikasi di PDDikti.',
                ]
            );
        }

        if ($budi) {
            SellerVerification::updateOrCreate(
                ['user_id' => $budi->id],
                [
                    'foto_ktm' => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                    'foto_selfie' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                    'nama_kampus' => 'IPB University',
                    'nim' => 'A1401191024',
                    'status' => 'approved',
                    'catatan_admin' => 'KTM dan selfie mahasiswa terverifikasi aktif.',
                ]
            );
        }

        if ($nada) {
            SellerVerification::updateOrCreate(
                ['user_id' => $nada->id],
                [
                    'foto_ktm' => 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
                    'foto_selfie' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
                    'nama_kampus' => 'IPB University',
                    'nim' => 'G6401211043',
                    'status' => 'approved',
                    'catatan_admin' => 'Terverifikasi.',
                ]
            );
        }

        if ($dimas) {
            SellerVerification::updateOrCreate(
                ['user_id' => $dimas->id],
                [
                    'foto_ktm' => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                    'foto_selfie' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
                    'nama_kampus' => 'Universitas Indonesia',
                    'nim' => '2006578912',
                    'status' => 'approved',
                    'catatan_admin' => 'KTM UI valid.',
                ]
            );
        }

        // 2. Pending KYC for demoing Admin approval flow
        if ($farhan) {
            SellerVerification::updateOrCreate(
                ['user_id' => $farhan->id],
                [
                    'foto_ktm' => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                    'foto_selfie' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
                    'nama_kampus' => 'Institut Teknologi Bandung',
                    'nim' => '13520045',
                    'status' => 'pending',
                    'catatan_admin' => null,
                ]
            );
        }

        // 3. Rejected KYC example for demoing rejection display
        if ($rizky) {
            SellerVerification::updateOrCreate(
                ['user_id' => $rizky->id],
                [
                    'foto_ktm' => 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
                    'foto_selfie' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
                    'nama_kampus' => 'IPB University',
                    'nim' => 'B0401211099',
                    'status' => 'rejected',
                    'catatan_admin' => 'Foto KTM terlalu buram sehingga nomor induk mahasiswa tidak terbaca jelas. Silakan upload ulang dengan pencahayaan yang cukup.',
                ]
            );
        }
    }
}
