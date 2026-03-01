<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    /**
     * Buyer: Riwayat pesanan saya.
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['product.images', 'product.user', 'offer'])
            ->latest()
            ->get()
            ->map(fn ($order) => [
                'id'                => $order->id,
                'kode_pesanan'      => $order->kode_pesanan,
                'total_harga'       => $order->total_harga,
                'metode_pengiriman' => $order->metode_pengiriman,
                'status'            => $order->status,
                'metode_pembayaran' => $order->metode_pembayaran,
                'created_at'        => $order->created_at->diffForHumans(),
                'product' => [
                    'id'    => $order->product->id,
                    'name'  => $order->product->nama_barang,
                    'img'   => $order->product->image,
                    'seller_name' => $order->product->user->name,
                ],
            ]);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Buyer: Konfirmasi terima barang.
     */
    public function confirmReceipt(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        if ($order->status !== 'dikirim') {
            return back()->withErrors(['order' => 'Order belum dikirim.']);
        }

        $this->orderService->confirmReceipt($order);
        return back()->with('success', 'Barang dikonfirmasi diterima. Dana dilepas ke penjual.');
    }
}
