<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    /**
     * Halaman checkout — bisa dari full price atau dari accepted offer.
     */
    public function show(Request $request, Product $product)
    {
        $offer = null;
        $finalPrice = $product->harga;

        // Cek apakah ada accepted offer milik buyer ini
        if ($request->has('offer_id')) {
            $offer = Offer::where('id', $request->offer_id)
                ->where('user_id', $request->user()->id)
                ->where('status', 'accepted')
                ->where('deal_expired_at', '>', now())
                ->first();

            if ($offer) {
                $finalPrice = $offer->harga_deal;
            }
        }

        return Inertia::render('Checkout', [
            'product' => [
                'id'    => $product->id,
                'name'  => $product->nama_barang,
                'price' => $product->harga,
                'img'   => $product->foto_barang_url,
                'loc'   => $product->lokasi_kampus,
                'seller_name' => $product->user->name,
            ],
            'offer' => $offer ? [
                'id'         => $offer->id,
                'harga_deal' => $offer->harga_deal,
                'expired_at' => $offer->deal_expired_at->toISOString(),
            ] : null,
            'final_price'       => $finalPrice,
            'midtrans_client_key' => config('services.midtrans.client_key'),
        ]);
    }

    /**
     * Proses checkout.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'         => 'required|exists:products,id',
            'offer_id'           => 'nullable|exists:offers,id',
            'metode_pengiriman'  => 'required|in:cod,kirim_paket',
            'alamat_pengiriman'  => 'required_if:metode_pengiriman,kirim_paket|nullable|string',
            'catatan'            => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Verifikasi produk masih active
        if (!$product->isActive()) {
            return back()->withErrors(['product' => 'Produk sudah tidak tersedia.']);
        }

        $offer = null;
        if (!empty($validated['offer_id'])) {
            $offer = Offer::where('id', $validated['offer_id'])
                ->where('user_id', $request->user()->id)
                ->where('status', 'accepted')
                ->where('deal_expired_at', '>', now())
                ->first();
        }

        try {
            $result = $this->orderService->createOrder(
                user: $request->user(),
                product: $product,
                metodePengiriman: $validated['metode_pengiriman'],
                offer: $offer,
                alamat: $validated['alamat_pengiriman'] ?? null,
                catatan: $validated['catatan'] ?? null,
            );

            // Untuk kirim_paket: kembalikan snap_token ke frontend
            if ($result['snap_token']) {
                return Inertia::render('Checkout', [
                    'order' => [
                        'id'            => $result['order']->id,
                        'kode_pesanan'  => $result['order']->kode_pesanan,
                        'total_harga'   => $result['order']->total_harga,
                    ],
                    'snap_token'          => $result['snap_token'],
                    'midtrans_client_key' => config('services.midtrans.client_key'),
                    'product' => [
                        'id'    => $product->id,
                        'name'  => $product->nama_barang,
                        'price' => $product->harga,
                        'img'   => $product->foto_barang_url,
                        'loc'   => $product->lokasi_kampus,
                        'seller_name' => $product->user->name,
                    ],
                    'final_price' => $result['order']->total_harga,
                ]);
            }

            // COD: redirect ke halaman sukses
            return redirect()->route('orders.index')->with('success', 'Order berhasil dibuat! Hubungi penjual untuk COD.');

        } catch (\Exception $e) {
            return back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }
}
