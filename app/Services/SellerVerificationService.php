<?php

namespace App\Services;

use App\Models\SellerVerification;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class SellerVerificationService
{
    /**
     * Submit verifikasi KTM baru.
     */
    public function submitVerification(User $user, UploadedFile $fotoKtm, UploadedFile $fotoSelfie, string $namaKampus, string $nim): SellerVerification
    {
        // Cek apakah sudah ada verifikasi pending
        $existing = SellerVerification::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            throw new \InvalidArgumentException('Kamu sudah memiliki pengajuan verifikasi yang sedang diproses.');
        }

        // Cek apakah sudah verified
        if ($user->isSeller()) {
            throw new \InvalidArgumentException('Akun kamu sudah terverifikasi sebagai penjual.');
        }

        // Upload foto KTM & Selfie menggunakan default disk (Cloudinary/Storage)
        $pathKtm = $fotoKtm->store('verifications');
        $pathSelfie = $fotoSelfie->store('verifications');

        return SellerVerification::create([
            'user_id'      => $user->id,
            'foto_ktm'     => $pathKtm,
            'foto_selfie'  => $pathSelfie,
            'nama_kampus'  => $namaKampus,
            'nim'          => $nim,
            'status'       => 'pending',
        ]);
    }

    /**
     * Admin menyetujui verifikasi.
     */
    public function approveVerification(SellerVerification $verification): SellerVerification
    {
        $verification->update(['status' => 'approved']);

        // Set user sebagai verified seller
        $verification->user->update([
            'is_seller' => true,
            'role' => 'seller'
        ]);

        return $verification->fresh();
    }

    /**
     * Admin menolak verifikasi.
     */
    public function rejectVerification(SellerVerification $verification, string $reason): SellerVerification
    {
        $verification->update([
            'status'        => 'rejected',
            'catatan_admin' => $reason,
        ]);

        return $verification->fresh();
    }

    /**
     * Ambil semua verifikasi pending untuk admin review.
     */
    public function getPendingVerifications()
    {
        return SellerVerification::pending()
            ->with('user')
            ->latest()
            ->get();
    }
}
