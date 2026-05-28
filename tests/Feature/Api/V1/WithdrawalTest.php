<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use App\Models\SellerBalance;
use App\Models\Withdrawal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WithdrawalTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test withdrawal when seller has insufficient balance.
     */
    public function test_insufficient_balance_returns_400(): void
    {
        $seller = User::factory()->create([
            'is_seller' => true,
        ]);

        // Seller has 0 balance (no balance rows)

        $response = $this->actingAs($seller)
            ->postJson('/api/v1/seller/withdrawals', [
                'amount' => 50000,
                'bankCode' => 'bca',
                'accountNumber' => '1234567890',
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Saldo tidak mencukupi untuk penarikan ini.',
            ]);

        // Ensure no seller balance or withdrawal record was created
        $this->assertEquals(0, SellerBalance::count());
        $this->assertEquals(0, Withdrawal::count());
    }

    /**
     * Test successful withdrawal.
     */
    public function test_successful_withdrawal_deducts_balance_and_creates_withdrawal_record(): void
    {
        $seller = User::factory()->create([
            'is_seller' => true,
        ]);

        // Add 100,000 balance to seller (order_id is null)
        SellerBalance::create([
            'user_id' => $seller->id,
            'order_id' => null,
            'jumlah' => 100000,
            'status' => 'dilepas',
            'catatan' => 'Pemasukan Awal',
            'dilepas_at' => now(),
        ]);

        // Mock Midtrans Payout API returning success status
        Http::fake([
            'https://api.sandbox.midtrans.com/v2/payouts' => Http::response([
                'status' => 'success',
                'payout_id' => 'payout-123456',
                'status_message' => 'Payout completed successfully'
            ], 200)
        ]);

        $response = $this->actingAs($seller)
            ->postJson('/api/v1/seller/withdrawals', [
                'amount' => 60000,
                'bankCode' => 'bca',
                'accountNumber' => '1234567890',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'withdrawal' => [
                        'id',
                        'user_id',
                        'reference_no',
                        'amount',
                        'bank_name',
                        'account_number',
                        'status',
                        'midtrans_payout_id',
                    ],
                    'midtrans_response'
                ]
            ]);

        // Assert balance deduction row exists
        $this->assertDatabaseHas('seller_balances', [
            'user_id' => $seller->id,
            'jumlah' => -60000,
            'status' => 'ditarik',
        ]);

        // Assert local Withdrawal record exists with status 'success'
        $this->assertDatabaseHas('withdrawals', [
            'user_id' => $seller->id,
            'amount' => 60000,
            'bank_name' => 'bca',
            'account_number' => '1234567890',
            'status' => 'success',
            'midtrans_payout_id' => 'payout-123456',
        ]);

        // Total balance should be 40,000 (100,000 - 60,000)
        $newBalance = SellerBalance::where('user_id', $seller->id)
            ->whereIn('status', ['dilepas', 'ditarik'])
            ->sum('jumlah');
        $this->assertEquals(40000, $newBalance);
    }

    /**
     * Test that Midtrans API failure rolls back the balance deduction.
     */
    public function test_failed_midtrans_api_rolls_back_balance_deduction(): void
    {
        $seller = User::factory()->create([
            'is_seller' => true,
        ]);

        // Add 100,000 balance to seller
        SellerBalance::create([
            'user_id' => $seller->id,
            'order_id' => null,
            'jumlah' => 100000,
            'status' => 'dilepas',
            'catatan' => 'Pemasukan Awal',
            'dilepas_at' => now(),
        ]);

        // Mock Midtrans Payout API returning HTTP 500 error
        Http::fake([
            'https://api.sandbox.midtrans.com/v2/payouts' => Http::response('Midtrans server error', 500)
        ]);

        $response = $this->actingAs($seller)
            ->postJson('/api/v1/seller/withdrawals', [
                'amount' => 60000,
                'bankCode' => 'bca',
                'accountNumber' => '1234567890',
            ]);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
            ]);

        // Assert that the deduction row was NOT persisted (rolled back)
        $this->assertDatabaseMissing('seller_balances', [
            'jumlah' => -60000,
        ]);

        // Assert no Withdrawal record was created
        $this->assertEquals(0, Withdrawal::count());

        // Seller balance should remain 100,000
        $newBalance = SellerBalance::where('user_id', $seller->id)
            ->whereIn('status', ['dilepas', 'ditarik'])
            ->sum('jumlah');
        $this->assertEquals(100000, $newBalance);
    }
}
