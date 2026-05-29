<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Offer;
use App\Models\SellerBalance;
use App\Models\User;
use App\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        protected OfferService $offerService,
        protected PaymentGatewayInterface $paymentGateway,
    ) {}

    /**
     * Buat order baru.
     *
     * @return array{order: Order, snap_token: string|null}
     */
    public function createOrder(
        User    $user,
        Product $product,
        string  $metodePengiriman,
        ?Offer  $offer = null,
        ?string $alamat = null,
        ?string $catatan = null,
    ): array {
        return DB::transaction(function () use ($user, $product, $metodePengiriman, $offer, $alamat, $catatan) {
            // Tentukan harga final
            $totalHarga = $offer?->harga_deal ?? $product->harga;

            // Buat order
            $order = Order::create([
                'user_id'            => $user->id,
                'product_id'         => $product->id,
                'offer_id'           => $offer?->id,
                'total_harga'        => $totalHarga,
                'metode_pengiriman'  => $metodePengiriman,
                'status'             => 'pending',
                'alamat_pengiriman'  => $alamat,
                'catatan'            => $catatan,
                'dana_ditahan'       => $metodePengiriman === 'kirim_paket',
            ]);

            if ($metodePengiriman === 'cod') {
                // Tandai produk sebagai sold
                $product->markAsSold();

                // Auto-cancel semua penawaran pending/accepted pada produk ini
                $this->offerService->cancelAllOffersForProduct($product);
            }

            // Jika kirim paket, buat Snap token Midtrans
            $snapToken = null;
            if ($metodePengiriman === 'kirim_paket') {
                $result = $this->paymentGateway->createTransaction($order);
                $snapToken = $result['token'];

                $order->update([
                    'midtrans_snap_token' => $snapToken,
                ]);

                // Buat record seller balance (ditahan)
                SellerBalance::create([
                    'user_id'  => $product->user_id,
                    'order_id' => $order->id,
                    'jumlah'   => $totalHarga,
                    'status'   => 'ditahan',
                ]);
            }

            // Kirim notifikasi ke Seller
            \App\Services\MongoLogService::notify(
                $product->user_id,
                'order',
                'Ada pesanan baru masuk untuk "' . $product->nama_barang . '" sebesar Rp ' . number_format($totalHarga, 0, ',', '.') . '!',
                ['order_id' => $order->id, 'product_id' => $product->id],
                'seller'
            );

            // COD: status tetap pending (konfirmasi saat meetup)

            return [
                'order'      => $order->fresh(),
                'snap_token' => $snapToken,
            ];
        });
    }

    /**
     * Buyer konfirmasi terima barang.
     * Lepas dana escrow ke seller.
     */
    public function confirmReceipt(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            $order->update([
                'status'         => 'selesai',
                'dana_ditahan'   => false,
                'dana_dilepas_at' => now(),
            ]);

            // Update seller balance -> dilepas
            $balance = $order->sellerBalance;
            if ($balance && $balance->isDitahan()) {
                $balance->update([
                    'status'     => 'dilepas',
                    'dilepas_at' => now(),
                ]);
            }

            // Kirim notifikasi ke Seller
            \App\Services\MongoLogService::notify(
                $order->product->user_id,
                'order_update',
                'Pesanan selesai! Barang "' . $order->product->nama_barang . '" telah diterima pembeli. Dana Rp ' . number_format($order->total_harga, 0, ',', '.') . ' telah dilepas ke saldo Anda.',
                ['order_id' => $order->id, 'product_id' => $order->product_id],
                'seller'
            );

            return $order->fresh();
        });
    }

    /**
     * Update status order dari Midtrans webhook.
     */
    public function handlePaymentSettlement(Order $order, string $transactionId, string $paymentType): Order
    {
        return DB::transaction(function () use ($order, $transactionId, $paymentType) {
            $order->update([
                'status'                  => 'dibayar',
                'midtrans_transaction_id' => $transactionId,
                'metode_pembayaran'       => $paymentType,
            ]);

            // Mark the product as sold
            $order->product->markAsSold();

            // Auto-cancel all other pending/accepted offers for this product
            $this->offerService->cancelAllOffersForProduct($order->product);

            // Also auto-cancel/expire other pending orders for the same product
            Order::where('product_id', $order->product_id)
                ->where('id', '!=', $order->id)
                ->where('status', 'pending')
                ->update(['status' => 'dibatalkan']);

            // Kirim notifikasi ke Seller bahwa order sudah lunas dan siap kirim
            \App\Services\MongoLogService::notify(
                $order->product->user_id,
                'order_update',
                'Pembayaran diterima! Pesanan "' . $order->product->nama_barang . '" telah dibayar. Harap segera mengirimkan paket.',
                ['order_id' => $order->id, 'product_id' => $order->product_id],
                'seller'
            );

            return $order->fresh();
        });
    }

    /**
     * Handle payment expiry/cancel dari Midtrans.
     */
    public function handlePaymentFailure(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            $order->update(['status' => 'dibatalkan']);

            // Kembalikan status produk ke active
            $order->product->update(['status' => 'active']);

            // Hapus seller balance yang ditahan
            $balance = $order->sellerBalance;
            if ($balance && $balance->isDitahan()) {
                $balance->delete();
            }

            // Kirim notifikasi ke Seller
            \App\Services\MongoLogService::notify(
                $order->product->user_id,
                'order_update',
                'Pesanan untuk "' . $order->product->nama_barang . '" telah dibatalkan karena kegagalan pembayaran.',
                ['order_id' => $order->id, 'product_id' => $order->product_id],
                'seller'
            );

            return $order->fresh();
        });
    }

    /**
     * Seller menandai barang sudah dikirim.
     */
    public function markAsShipped(Order $order): Order
    {
        $order->update(['status' => 'dikirim']);

        // Kirim notifikasi ke Buyer
        \App\Services\MongoLogService::notify(
            $order->user_id,
            'order_update',
            'Pesanan Anda untuk "' . $order->product->nama_barang . '" telah dikirim oleh penjual!',
            ['order_id' => $order->id, 'product_id' => $order->product_id],
            'buyer'
        );

        return $order->fresh();
    }
}
