<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    /**
     * Handle incoming Midtrans Webhook / HTTP Notification
     */
    public function __invoke(Request $request)
    {
        try {
            $payload = $request->all();
            
            Log::info('Midtrans Webhook Received:', $payload);

            // Verifikasi signature key
            $serverKey    = config('midtrans.server_key');
            $orderIdSent  = $payload['order_id'];
            $statusCode   = $payload['status_code'];
            $grossAmount  = $payload['gross_amount'];
            $signatureKey = $payload['signature_key'];

            $expectedSignature = hash('sha512', $orderIdSent . $statusCode . $grossAmount . $serverKey);

            if ($expectedSignature !== $signatureKey) {
                Log::warning('Midtrans Webhook: Invalid Signature', ['expected' => $expectedSignature, 'actual' => $signatureKey]);
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            // Extract the original order_id since we appended a timestamp previously (e.g. ORD-XXX-161902)
            $orderIdParts = explode('-', $orderIdSent);
            // Reconstruct the original kode_pesanan before the timestamp
            array_pop($orderIdParts); 
            $originalOrderId = implode('-', $orderIdParts);

            // Failover just in case it wasn't split properly
            if (empty($originalOrderId)) {
                $originalOrderId = $orderIdSent;
            }

            $order = Order::where('kode_pesanan', $originalOrderId)->first();

            if (!$order) {
                Log::error('Midtrans Webhook: Order Not Found', ['order_id' => $originalOrderId]);
                return response()->json(['message' => 'Order not found'], 404);
            }

            $transactionStatus = $payload['transaction_status'];
            $fraudStatus       = $payload['fraud_status'] ?? null;

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    // TODO set payment status in merchant's database to 'Challenge by FDS'
                    // $order->update(['status' => 'challenge']);
                } else if ($fraudStatus == 'accept') {
                    $order->update(['status' => 'dibayar']);
                }
            } else if ($transactionStatus == 'settlement') {
                $order->update(['status' => 'dibayar']);
            } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $order->update(['status' => 'dibatalkan']);
            } else if ($transactionStatus == 'pending') {
                $order->update(['status' => 'pending']);
            }

            return response()->json(['message' => 'OK']);
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
