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
     * Store and finalize transaction for single or multi-seller cart checkout.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Check if it is a unified multi-seller payload or traditional single product payload
            if ($request->has('items')) {
                $validated = $request->validate([
                    'items'              => 'required|array',
                    'items.*.product_id' => 'required|exists:products,id',
                    'items.*.price'      => 'required|numeric|min:0',
                    'items.*.quantity'   => 'required|integer|min:1',
                    'items.*.name'       => 'required|string',
                    'items.*.seller_id'  => 'required|exists:users,id',
                    'items.*.offer_id'   => 'nullable|exists:offers,id',
                    'couriers'           => 'required|array',
                    'total_amount'       => 'required|numeric|min:0',
                    'metode_pengiriman'  => 'required|in:cod,kirim_paket',
                    'alamat_pengiriman'  => 'required_if:metode_pengiriman,kirim_paket|nullable|string',
                    'catatan'            => 'nullable|string|max:500',
                ]);

                $items = $validated['items'];
                $couriers = $validated['couriers'];
                $totalAmount = (int) $validated['total_amount'];
                $metodePengiriman = $validated['metode_pengiriman'];
                $alamatPengiriman = $validated['alamat_pengiriman'] ?? null;
                $catatan = $validated['catatan'] ?? null;
            } else {
                $validated = $request->validate([
                    'product_id'         => 'required|exists:products,id',
                    'offer_id'           => 'nullable|exists:offers,id',
                    'metode_pengiriman'  => 'required|in:cod,kirim_paket',
                    'alamat_pengiriman'  => 'required_if:metode_pengiriman,kirim_paket|nullable|string',
                    'catatan'            => 'nullable|string|max:500',
                    'shipping_cost'      => 'nullable|numeric|min:0',
                    'courier_info'       => 'nullable|string'
                ]);

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

                $finalPrice = $offer ? $offer->harga_deal : $product->harga;
                $shippingCost = ($validated['metode_pengiriman'] === 'kirim_paket') ? (int) ($validated['shipping_cost'] ?? 0) : 0;

                // Wrap single product into unified cart structure
                $items = [[
                    'product_id' => $product->id,
                    'price'      => $finalPrice,
                    'quantity'   => 1,
                    'name'       => $product->nama_barang,
                    'seller_id'  => $product->user_id,
                    'offer_id'   => $offer?->id,
                ]];

                $couriers = [
                    $product->user_id => [
                        'price' => $shippingCost,
                        'name'  => $validated['courier_info'] ?? 'Kirim Paket',
                    ]
                ];

                $totalAmount = $finalPrice + $shippingCost;
                $metodePengiriman = $validated['metode_pengiriman'];
                $alamatPengiriman = $validated['alamat_pengiriman'] ?? null;
                $catatan = $validated['catatan'] ?? null;

                if ($alamatPengiriman && isset($validated['courier_info'])) {
                    $alamatPengiriman .= " (Kurir: " . $validated['courier_info'] . ")";
                }
            }

            // 1. GENERATE PAYMENT REFERENCE:
            $paymentRef = 'PAY-' . strtoupper(uniqid());

            DB::beginTransaction();

            $orders = [];

            // 2. MULTI-ORDER CREATION (Inside DB::transaction):
            foreach ($items as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);
                if (!$product->isActive()) {
                    throw new \Exception("Product '{$product->nama_barang}' is no longer available");
                }

                $sellerId = $itemData['seller_id'];
                
                // Get the courier price for this seller
                $courierPrice = 0;
                if (isset($couriers[$sellerId])) {
                    $courierPrice = (int) $couriers[$sellerId]['price'];
                }

                $orderKode = $paymentRef . '-' . $product->id;

                $order = Order::create([
                    'kode_pesanan'       => $orderKode,
                    'user_id'            => $request->user()->id,
                    'product_id'         => $product->id,
                    'offer_id'           => $itemData['offer_id'] ?? null,
                    'total_harga'        => (int) $itemData['price'] + $courierPrice,
                    'shipping_cost'      => $courierPrice,
                    'metode_pengiriman'  => $metodePengiriman,
                    'status'             => 'pending',
                    'alamat_pengiriman'  => $alamatPengiriman,
                    'catatan'            => $catatan,
                    'dana_ditahan'       => $metodePengiriman === 'kirim_paket',
                ]);

                $product->markAsSold();
                $this->offerService->cancelAllOffersForProduct($product);

                // Remove from cart if it exists
                \App\Models\Cart::where('user_id', $request->user()->id)
                    ->where('product_id', $product->id)
                    ->delete();

                $orders[] = $order;
            }

            $snapToken = null;

            if ($metodePengiriman === 'kirim_paket') {
                Config::$serverKey = config('services.midtrans.server_key');
                Config::$isProduction = config('services.midtrans.is_production');
                Config::$isSanitized = true;
                Config::$is3ds = true;

                // 3. STRICT MIDTRANS ITEM MAPPING:
                $midtransItems = [];

                foreach ($items as $itemData) {
                    $midtransItems[] = [
                        'id'       => $itemData['product_id'],
                        'price'    => (int) $itemData['price'],
                        'quantity' => (int) $itemData['quantity'],
                        'name'     => substr($itemData['name'], 0, 50),
                    ];
                }

                foreach ($couriers as $sellerId => $courier) {
                    if ((int) $courier['price'] > 0) {
                        $midtransItems[] = [
                            'id'       => 'ONGKIR-' . $sellerId,
                            'price'    => (int) $courier['price'],
                            'quantity' => 1,
                            'name'     => 'Ongkir ' . ($courier['name'] ?? 'Kirim Paket'),
                        ];
                    }
                }

                $params = [
                    'transaction_details' => [
                        'order_id'     => $paymentRef,
                        'gross_amount' => (int) $totalAmount,
                    ],
                    'customer_details' => [
                        'first_name' => $request->user()->name,
                        'email'      => $request->user()->email,
                        'phone'      => $request->user()->nomor_wa ?? '',
                    ],
                    'item_details' => $midtransItems,
                    'expiry' => [
                        'start_time' => now()->format('Y-m-d H:i:s O'),
                        'unit'       => 'hour',
                        'duration'   => 2
                    ],
                ];

                // 4. SNAP TOKEN:
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
                'order_id'   => $orders[0]->id,
                'snap_token' => $snapToken,
            ], 'Checkout processed successfully', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Checkout failed: ' . $e->getMessage(), 500);
        }
    }
}
