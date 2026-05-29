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

        $pendingOrders = Order::where('status', 'pending')
            ->where('created_at', '<', $expiredTime)
            ->with('product')
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

                // Notify buyer and seller
                \App\Services\MongoLogService::notify(
                    $order->user_id,
                    'order_update',
                    'Pesanan Anda untuk "' . $order->product->nama_barang . '" telah dibatalkan otomatis karena tidak dibayar dalam 2 jam.',
                    ['order_id' => $order->id, 'product_id' => $order->product_id],
                    'buyer'
                );

                \App\Services\MongoLogService::notify(
                    $order->product->user_id,
                    'order_update',
                    'Pesanan untuk produk "' . $order->product->nama_barang . '" telah dibatalkan otomatis karena tidak dibayar pembeli dalam 2 jam.',
                    ['order_id' => $order->id, 'product_id' => $order->product_id],
                    'seller'
                );

                $cancelledCount++;
            });
        }

        $this->info("Successfully cancelled {$cancelledCount} unpaid orders and restored product availability.");
        return 0;
    }
}
