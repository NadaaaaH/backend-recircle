<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class AutoCancelUnpaidOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:auto-cancel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically cancel orders that remain unpaid for 2 hours and restore product availability.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredTime = now()->subHours(2);

        // Eager load product with trashed to prevent issues with soft-deleted products
        $pendingOrders = Order::where('status', 'pending')
            ->where('created_at', '<', $expiredTime)
            ->with(['product' => function ($query) {
                $query->withTrashed();
            }])
            ->get();

        if ($pendingOrders->isEmpty()) {
            $this->info('No unpaid pending orders to cancel.');
            return 0;
        }

        $cancelledCount = 0;

        foreach ($pendingOrders as $order) {
            DB::transaction(function () use ($order, &$cancelledCount) {
                // Cancel the order
                $order->update(['status' => 'dibatalkan']);

                // Restore product availability (stock)
                if ($order->product) {
                    $order->product->update(['status' => 'active']);
                }

                // Delete any pending seller balance escrow
                if ($order->sellerBalance) {
                    $order->sellerBalance->delete();
                }

                // Safely resolve product name and IDs
                $productName = $order->product?->nama_barang ?? 'Produk';
                $productId = $order->product_id ?? null;

                // Notify buyer
                \App\Services\MongoLogService::notify(
                    $order->user_id,
                    'order_update',
                    "Pesanan Anda dengan ID #{$order->id} (untuk \"{$productName}\") telah dibatalkan otomatis karena tidak dibayar dalam 2 jam.",
                    ['order_id' => $order->id, 'product_id' => $productId],
                    'buyer'
                );

                // Notify seller (only if product and seller ID exists)
                if ($order->product && $order->product->user_id) {
                    \App\Services\MongoLogService::notify(
                        $order->product->user_id,
                        'order_update',
                        "Pesanan dengan ID #{$order->id} (untuk produk \"{$productName}\") telah dibatalkan otomatis karena tidak dibayar pembeli dalam 2 jam.",
                        ['order_id' => $order->id, 'product_id' => $productId],
                        'seller'
                    );
                }

                $cancelledCount++;
            });
        }

        $this->info("Successfully cancelled {$cancelledCount} unpaid orders and restored product availability.");
        return 0;
    }
}
