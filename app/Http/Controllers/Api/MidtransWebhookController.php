<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    /**
     * Handle incoming Midtrans Webhook / HTTP Notification
     */
    public function __invoke(Request $request, OrderService $orderService)
    {
        // REMINDER: Exclude this webhook route ('api/midtrans/webhook') from CSRF verification
        // in Laravel's bootstrap/app.php (Laravel 11+) using ->validateCsrfTokens(except: ['api/midtrans/webhook'])
        // or in App\Http\Middleware\VerifyCsrfToken middleware (Laravel < 11) in the $except array.

        try {
            $payload = $request->all();
            
            Log::info('Midtrans Webhook Received:', $payload);

            // Robust check: Pastikan semua field kritikal yang dibutuhkan verifikasi ada di payload
            $requiredFields = ['order_id', 'status_code', 'gross_amount', 'signature_key', 'transaction_status'];
            foreach ($requiredFields as $field) {
                if (!isset($payload[$field])) {
                    Log::warning('Midtrans Webhook: Missing required field ' . $field, ['payload' => $payload]);
                    return response()->json(['message' => 'Required field missing: ' . $field], 400);
                }
            }

            $orderIdSent  = $payload['order_id'];
            $statusCode   = $payload['status_code'];
            $grossAmount  = $payload['gross_amount'];
            $signatureKey = $payload['signature_key'];

            // STRICT AUDIT 1 (Security): Ensure it correctly validates the signature key using server_key, order_id, status_code, and gross_amount to prevent spoofing.
            $serverKey = config('services.midtrans.server_key') ?? config('midtrans.server_key');
            
            if (!$serverKey) {
                Log::error('Midtrans Webhook Config Error: server_key not configured in config/services.php or config/midtrans.php');
                return response()->json(['message' => 'Server configuration error'], 500);
            }

            $expectedSignature = hash('sha512', $orderIdSent . $statusCode . $grossAmount . $serverKey);

            if (!hash_equals($expectedSignature, $signatureKey)) {
                Log::warning('Midtrans Webhook: Invalid Signature', ['expected' => $expectedSignature, 'actual' => $signatureKey]);
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            // 1. Handle Case: Dashboard Settings "Test" button hits
            // Midtrans sends dynamic test ids like "payment_notif_test_XXXX" which never exist in our DB.
            if (str_contains($orderIdSent, 'payment_notif_test')) {
                Log::info('Midtrans Webhook: Received verification test hit. Responding OK.');
                return response()->json(['message' => 'Connection valid, test accepted'], 200);
            }

            // 2. PRIMARY LOOKUP: Direct match
            $order = Order::where('kode_pesanan', $orderIdSent)->first();
            
            // 3. ROBUST FALLBACK: If there are any prefix/suffixes appended mistakenly by routing
            if (!$order) {
                Log::warning('Midtrans Webhook: Exact ID not found, attempting loose extraction search', ['order_id' => $orderIdSent]);
                // Attempt to match based on pattern if passed aggregated
                $order = Order::where('kode_pesanan', 'LIKE', '%' . $orderIdSent . '%')->first();
            }

            if (!$order) {
                Log::error('Midtrans Webhook: Order Lookup Failed completely', ['order_id' => $orderIdSent]);
                return response()->json(['message' => 'Order object could not be resolved in local dataset'], 404);
            }

            $transactionStatus = $payload['transaction_status'];
            $fraudStatus       = $payload['fraud_status'] ?? null;
            $transactionId     = $payload['transaction_id'] ?? '';
            $paymentType       = $payload['payment_type'] ?? 'midtrans';
 
            $ordersToProcess = [$order];
            if ($order->midtrans_snap_token) {
                $ordersToProcess = Order::where('midtrans_snap_token', $order->midtrans_snap_token)->get();
            }

            foreach ($ordersToProcess as $ord) {
                // STRICT AUDIT 2 (Status Logic): Ensure the database update logic correctly translates Midtrans transaction_status
                if ($transactionStatus === 'settlement' || $transactionStatus === 'capture') {
                    if ($transactionStatus === 'capture' && $fraudStatus === 'challenge') {
                        // Challenge status means payment is pending review
                        $ord->update(['status' => 'pending']);
                        Log::info("Midtrans Webhook: Order {$ord->kode_pesanan} capture is challenged. Status set to pending.");
                    } else {
                        // 'settlement' or 'capture' (approved/accept) -> Update order to 'paid' (mapped locally as 'dibayar')
                        $orderService->handlePaymentSettlement($ord, $transactionId, $paymentType);
                        Log::info("Midtrans Webhook: Order {$ord->kode_pesanan} paid successfully. Status updated to dibayar.");
                    }
                } else if ($transactionStatus === 'pending') {
                    // 'pending' -> Update order to 'pending'
                    $ord->update(['status' => 'pending']);
                    Log::info("Midtrans Webhook: Order {$ord->kode_pesanan} is pending payment.");
                } else if (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                    // 'deny', 'expire', 'cancel' -> Update order to 'failed' or 'cancelled' (mapped locally as 'dibatalkan')
                    $orderService->handlePaymentFailure($ord);
                    Log::warning("Midtrans Webhook: Order {$ord->kode_pesanan} payment failed/cancelled/denied. Status set to dibatalkan.");
                }
            }

            return response()->json(['message' => 'OK']);
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
