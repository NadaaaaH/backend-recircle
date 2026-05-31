<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Order;
use App\Models\Product;
use App\Models\SellerBalance;
use App\Services\OfferService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Midtrans\Config;
use Midtrans\Snap;

class CheckoutApiController extends Controller
{
    use ApiResponse;

    public function __construct(protected OfferService $offerService) {}

    /**
     * Get checkout verification details for a single product.
     */
    public function show(Product $product, Request $request): JsonResponse
    {
        try {
            $offer = null;
            $finalPrice = $product->harga;

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

            return $this->successResponse([
                'product' => [
                    'id'    => $product->id,
                    'name'  => $product->nama_barang,
                    'price' => $product->harga,
                    'img'   => $product->foto_barang_url,
                    'loc'   => $product->lokasi_kampus,
                    'seller_name' => $product->user->name,
                    'seller_area_id' => $product->user->komerce_destination_id ?? '34260',
                ],
                'offer' => $offer,
                'final_price' => $finalPrice,
                'midtrans_client_key' => config('services.midtrans.client_key'),
                'midtrans_snap_url'   => config('services.midtrans.is_production')
                    ? 'https://app.midtrans.com/snap/snap.js'
                    : 'https://app.sandbox.midtrans.com/snap/snap.js',
            ], 'Checkout data retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve checkout data', 500);
        }
    }

    /**
     * Get checkout verification details for multiple cart items (same seller).
     */
    public function showCartCheckout(Request $request): JsonResponse
    {
        try {
            $cartItemIds = $request->input('cart_item_ids', []);
            if (is_string($cartItemIds)) {
                $cartItemIds = explode(',', $cartItemIds);
            }

            $cartItems = \App\Models\Cart::whereIn('id', $cartItemIds)
                ->where('user_id', $request->user()->id)
                ->with(['product.user', 'offer'])
                ->get();

            if ($cartItems->isEmpty()) {
                return $this->errorResponse('No cart items found', 404);
            }

            $firstCartItem = $cartItems->first();
            $seller = $firstCartItem->product->user;
            
            $itemsData = [];
            $totalOriginalPrice = 0;
            $totalFinalPrice = 0;

            foreach ($cartItems as $item) {
                $product = $item->product;
                $offer = $item->offer;

                $finalPrice = $product->harga;
                if ($offer && $offer->status === 'accepted' && $offer->deal_expired_at > now()) {
                    $finalPrice = $offer->harga_deal;
                }

                $totalOriginalPrice += $product->harga;
                $totalFinalPrice += $finalPrice;

                $itemsData[] = [
                    'cart_item_id' => $item->id,
                    'product_id'   => $product->id,
                    'name'         => $product->nama_barang,
                    'price'        => $product->harga,
                    'final_price'  => $finalPrice,
                    'img'          => $product->foto_barang_url,
                    'offer_id'     => $offer?->id,
                ];
            }

            return $this->successResponse([
                'items' => $itemsData,
                'seller' => [
                    'id'          => $seller->id,
                    'name'        => $seller->name,
                    'loc'         => $firstCartItem->product->lokasi_kampus,
                    'seller_area_id' => $seller->komerce_destination_id ?? '34260',
                ],
                'total_original_price' => $totalOriginalPrice,
                'total_final_price'    => $totalFinalPrice,
                'midtrans_client_key' => config('services.midtrans.client_key'),
                'midtrans_snap_url'   => config('services.midtrans.is_production')
                    ? 'https://app.midtrans.com/snap/snap.js'
                    : 'https://app.sandbox.midtrans.com/snap/snap.js',
            ], 'Cart checkout data retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve cart checkout data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store and finalize transaction for single or multiple products.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'product_id'         => 'nullable|exists:products,id',
                'offer_id'           => 'nullable|exists:offers,id',
                'cart_item_ids'      => 'nullable|array',
                'cart_item_ids.*'    => 'exists:carts,id',
                'metode_pengiriman'  => 'required|in:cod,kirim_paket',
                'alamat_pengiriman'  => 'required_if:metode_pengiriman,kirim_paket|nullable|string',
                'catatan'            => 'nullable|string|max:500',
                'shipping_cost'      => 'nullable|numeric|min:0',
                'courier_info'       => 'nullable|string'
            ]);

            $isCartCheckout = !empty($validated['cart_item_ids']);

            if (!$isCartCheckout && empty($validated['product_id'])) {
                return $this->errorResponse('Either product_id or cart_item_ids is required', 400);
            }

            DB::beginTransaction();

            $orders = [];
            $totalSubTotal = 0;
            $ongkir = ($validated['metode_pengiriman'] === 'kirim_paket' && isset($validated['shipping_cost'])) 
                      ? (int) $validated['shipping_cost'] 
                      : 0;

            $alamatLengkap = $validated['alamat_pengiriman'] ?? null;
            if ($alamatLengkap && isset($validated['courier_info'])) {
                $alamatLengkap .= " (Kurir: " . $validated['courier_info'] . ")";
            }

            if ($isCartCheckout) {
                $cartItems = \App\Models\Cart::whereIn('id', $validated['cart_item_ids'])
                    ->where('user_id', $request->user()->id)
                    ->with(['product', 'offer'])
                    ->get();

                if ($cartItems->isEmpty()) {
                    return $this->errorResponse('No valid cart items found', 400);
                }

                foreach ($cartItems as $item) {
                    $product = $item->product;
                    if (!$product->isActive()) {
                        throw new \Exception("Product '{$product->nama_barang}' is no longer available");
                    }

                    $offer = $item->offer;
                    $subTotal = ($offer && $offer->status === 'accepted' && $offer->deal_expired_at > now()) 
                        ? $offer->harga_deal 
                        : $product->harga;

                    $totalSubTotal += $subTotal;

                    // Distribute full shipping cost to first order only
                    $itemOngkir = (count($orders) === 0) ? $ongkir : 0;
                    $itemTotalHarga = $subTotal + $itemOngkir;

                    $orderKode = 'RC-' . strtoupper(uniqid()) . '-' . time();

                    $order = Order::create([
                        'kode_pesanan'       => $orderKode,
                        'user_id'            => $request->user()->id,
                        'product_id'         => $product->id,
                        'offer_id'           => $offer?->id,
                        'total_harga'        => $itemTotalHarga,
                        'shipping_cost'      => $itemOngkir,
                        'metode_pengiriman'  => $validated['metode_pengiriman'],
                        'status'             => 'pending',
                        'alamat_pengiriman'  => $alamatLengkap,
                        'catatan'            => $validated['catatan'] ?? null,
                        'dana_ditahan'       => $validated['metode_pengiriman'] === 'kirim_paket',
                    ]);

                    $product->markAsSold();
                    $this->offerService->cancelAllOffersForProduct($product);

                    $orders[] = $order;
                    $item->delete();
                }
            } else {
                $product = Product::findOrFail($validated['product_id']);
                if (!$product->isActive()) {
                    return $this->errorResponse('Product is no longer available', 400);
                }

                $offer = null;
                if (!empty($validated['offer_id'])) {
                    $offer = Offer::where('id', $validated['offer_id'])
                        ->where('user_id', $request->user()->id)
                        ->where('status', 'accepted')
                        ->where('deal_expired_at', '>', now())
                        ->first();
                }

                $subTotal = $offer ? $offer->harga_deal : $product->harga;
                $totalSubTotal = $subTotal;
                $totalHarga = $subTotal + $ongkir;

                $orderKode = 'RC-' . strtoupper(uniqid()) . '-' . time();

                $order = Order::create([
                    'kode_pesanan'       => $orderKode,
                    'user_id'            => $request->user()->id,
                    'product_id'         => $product->id,
                    'offer_id'           => $offer?->id,
                    'total_harga'        => $totalHarga,
                    'shipping_cost'      => $ongkir,
                    'metode_pengiriman'  => $validated['metode_pengiriman'],
                    'status'             => 'pending',
                    'alamat_pengiriman'  => $alamatLengkap,
                    'catatan'            => $validated['catatan'] ?? null,
                    'dana_ditahan'       => $validated['metode_pengiriman'] === 'kirim_paket',
                ]);

                $product->markAsSold();
                $this->offerService->cancelAllOffersForProduct($product);

                $orders[] = $order;
            }

            $primaryOrder = $orders[0];
            $snapToken = null;

            if ($validated['metode_pengiriman'] === 'kirim_paket') {
                Config::$serverKey = config('services.midtrans.server_key');
                Config::$isProduction = config('services.midtrans.is_production');
                Config::$isSanitized = true;
                Config::$is3ds = true;

                $grossAmount = $totalSubTotal + $ongkir;

                $itemDetails = [];
                foreach ($orders as $ord) {
                    $itemDetails[] = [
                        'id'       => $ord->product->id,
                        'price'    => (int) ($ord->total_harga - $ord->shipping_cost),
                        'quantity' => 1,
                        'name'     => substr($ord->product->nama_barang, 0, 50),
                    ];
                }

                if ($ongkir > 0) {
                    $itemDetails[] = [
                        'id'       => 'shipping_cost',
                        'price'    => (int) $ongkir,
                        'quantity' => 1,
                        'name'     => 'Shipping Cost',
                    ];
                }

                $params = [
                    'transaction_details' => [
                        'order_id'     => $primaryOrder->kode_pesanan,
                        'gross_amount' => (int) $grossAmount,
                    ],
                    'customer_details' => [
                        'first_name' => $request->user()->name,
                        'email'      => $request->user()->email,
                        'phone'      => $request->user()->nomor_wa ?? '',
                    ],
                    'item_details' => $itemDetails,
                ];

                $snapToken = Snap::getSnapToken($params);

                foreach ($orders as $ord) {
                    $ord->update(['midtrans_snap_token' => $snapToken]);

                    SellerBalance::create([
                        'user_id'  => $ord->product->user_id,
                        'order_id' => $ord->id,
                        'jumlah'   => $ord->total_harga,
                        'status'   => 'ditahan',
                    ]);
                }
            }

            DB::commit();

            return $this->successResponse([
                'order_id' => $primaryOrder->id,
                'snap_token' => $snapToken,
            ], 'Checkout processed successfully', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Checkout failed: ' . $e->getMessage(), 500);
        }
    }
}
