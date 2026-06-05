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

                $referenceNo = 'WD-' . date('YmdHis') . '-' . Str::random(4);

                // 3. Create the Withdrawal record with status 'success' (processed locally)
                $withdrawal = Withdrawal::create([
                    'user_id' => $user->id,
                    'reference_no' => $referenceNo,
                    'amount' => $amount,
                    'bank_name' => $validated['bankCode'],
                    'account_number' => $validated['accountNumber'],
                    'status' => 'success',
                    'error_message' => null,
                ]);

                return [
                    'withdrawal' => $withdrawal,
                ];
            });

            return $this->successResponse($result, 'Penarikan dana berhasil diproses secara lokal.', 201);

        } catch (\Exception $e) {
            if ($e->getMessage() === 'Saldo tidak mencukupi untuk penarikan ini.') {
                return $this->errorResponse($e->getMessage(), 400);
            }
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
