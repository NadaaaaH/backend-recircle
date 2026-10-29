<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Database\Seeder;

class SellerFinanceSeeder extends Seeder
{
    public function run(): void
    {
        $budi = User::where('email', 'seller@example.com')->first();
        $sausan = User::where('email', 'sausan@recircle.id')->first();

        // 1. Withdrawal Success - Budi Santoso (Penarikan berhasil ke Bank BCA)
        if ($budi) {
            Withdrawal::updateOrCreate(
                ['reference_no' => 'WD-20261022-001'],
                [
                    'user_id' => $budi->id,
                    'amount' => 500000,
                    'bank_name' => 'BCA (Bank Central Asia)',
                    'account_number' => '8012398745',
                    'status' => 'success',
                    'midtrans_payout_id' => 'payout-bca-success-99128',
                    'error_message' => null,
                    'created_at' => now()->subDays(5),
                ]
            );

            // 2. Withdrawal Pending - Budi Santoso (Menunggu transfer admin/gateway)
            Withdrawal::updateOrCreate(
                ['reference_no' => 'WD-20261028-002'],
                [
                    'user_id' => $budi->id,
                    'amount' => 350000,
                    'bank_name' => 'BCA (Bank Central Asia)',
                    'account_number' => '8012398745',
                    'status' => 'pending',
                    'midtrans_payout_id' => null,
                    'error_message' => null,
                    'created_at' => now()->subDay(),
                ]
            );
        }

        // 3. Withdrawal Success - Sausan Asma (Penarikan ke Bank Mandiri)
        if ($sausan) {
            Withdrawal::updateOrCreate(
                ['reference_no' => 'WD-20261018-003'],
                [
                    'user_id' => $sausan->id,
                    'amount' => 200000,
                    'bank_name' => 'Bank Mandiri',
                    'account_number' => '1330019283745',
                    'status' => 'success',
                    'midtrans_payout_id' => 'payout-mandiri-success-77192',
                    'error_message' => null,
                    'created_at' => now()->subDays(9),
                ]
            );
        }
    }
}
