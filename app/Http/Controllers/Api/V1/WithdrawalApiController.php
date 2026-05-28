<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SellerBalance;
use App\Models\Withdrawal;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WithdrawalApiController extends Controller
{
    use ApiResponse;

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10000',
            'bankCode' => 'required|string',
            'accountNumber' => 'required|string'
        ]);

        $amount = (float) $validated['amount'];
        $user = $request->user();

        try {
            $result = DB::transaction(function () use ($user, $amount, $validated) {
                // 1. Calculate Available Balance (dilepas + ditarik -> ditarik is negative, so it deducts)
                $availableBalance = SellerBalance::where('user_id', $user->id)
                    ->whereIn('status', ['dilepas', 'ditarik'])
                    ->sum('jumlah');

                if ($availableBalance < $amount) {
                    throw new \Exception('Saldo tidak mencukupi untuk penarikan ini.');
                }

                // 2. Deduct balance immediately in the database transaction (creates negative record)
                $deduction = SellerBalance::create([
                    'user_id' => $user->id,
                    'order_id' => null, // order_id is nullable now
                    'jumlah' => -$amount, // Negative amount to deduct
                    'status' => 'ditarik',
                    'catatan' => "Penarikan Dana (Withdrawal) ke {$validated['bankCode']} ({$validated['accountNumber']})",
                    'ditarik_at' => now(),
                ]);

                // 3. Call Midtrans Payout API
                $serverKey = env('MIDTRANS_SERVER_KEY');
                $isProduction = env('MIDTRANS_IS_PRODUCTION', false);
                $baseUrl = $isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';
                $endpoint = $baseUrl . '/v2/payouts';

                $payload = [
                    'amount' => $amount,
                    'bank_account' => [
                        'account_number' => (string) $validated['accountNumber'],
                        'bank_name' => strtolower($validated['bankCode']),
                    ],
                    'customer_name' => $user->name,
                ];

                // Perform the HTTP request with standard timeout
                $response = Http::timeout(15)
                    ->withBasicAuth($serverKey, '')
                    ->withHeaders([
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ])
                    ->post($endpoint, $payload);

                // 4. Handle Midtrans Response
                if ($response->failed()) {
                    throw new \Exception('Gagal memproses penarikan ke gateway pembayaran: HTTP ' . $response->status() . ' - ' . $response->body());
                }

                $resData = $response->json();
                $midtransStatus = strtolower($resData['status'] ?? $resData['transaction_status'] ?? 'pending');

                // If Midtrans explicitly failed/rejected, rollback transaction by throwing exception
                if (in_array($midtransStatus, ['failed', 'failure', 'rejected', 'deny', 'cancelled', 'canceled'])) {
                    throw new \Exception('Penarikan ditolak oleh gateway pembayaran: ' . ($resData['status_message'] ?? 'Unknown error'));
                }

                // Map Midtrans status to local Withdrawal status
                $localStatus = 'pending';
                if (in_array($midtransStatus, ['success', 'settlement', 'completed', 'approved'])) {
                    $localStatus = 'success';
                }

                $referenceNo = 'WD-' . date('YmdHis') . '-' . Str::random(4);

                // Create the Withdrawal record
                $withdrawal = Withdrawal::create([
                    'user_id' => $user->id,
                    'reference_no' => $referenceNo,
                    'amount' => $amount,
                    'bank_name' => $validated['bankCode'],
                    'account_number' => $validated['accountNumber'],
                    'status' => $localStatus,
                    'midtrans_payout_id' => $resData['payout_id'] ?? $resData['id'] ?? null,
                    'error_message' => null,
                ]);

                return [
                    'withdrawal' => $withdrawal,
                    'midtrans_response' => $resData,
                ];
            });

            return $this->successResponse($result, 'Penarikan dana sedang diproses.', 201);

        } catch (\Exception $e) {
            if ($e->getMessage() === 'Saldo tidak mencukupi untuk penarikan ini.') {
                return $this->errorResponse($e->getMessage(), 400);
            }
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
