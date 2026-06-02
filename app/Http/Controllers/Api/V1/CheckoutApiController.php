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
                    'seller_id' => $product->user_id,
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
     * Get checkout verification details for multiple cart items (multi-seller supported).
     */
    public function showCartCheckout(Request $request): JsonResponse
    {
        try {
            $cartItemIds = $request->input('cart_item_ids');
            if (empty($cartItemIds)) {
                $cartItemIds = [];
            }
            if (is_string($cartItemIds)) {
                $cartItemIds = json_decode($cartItemIds, true) ?? explode(',', $cartItemIds);
            }
            if (!is_array($cartItemIds)) {
                $cartItemIds = (array) $cartItemIds;
            }
            $cartItemIds = array_filter($cartItemIds);

            $products = \App\Models\Product::with(['user', 'images'])
                ->whereIn('id', (array) ($cartItemIds ?? []))
                ->get();

            $acceptedOffers = \App\Models\Offer::where('user_id', auth()->id())
                ->whereIn('product_id', (array) ($cartItemIds ?? []))
                ->where('status', 'accepted')
                ->get();

            $cartItems = $products->map(function ($product) use ($acceptedOffers) {
                $offer = $acceptedOffers->firstWhere('product_id', $product->id);
                return (object) [
                    'id'      => $product->id,
                    'product' => $product,
                    'offer'   => $offer,
                ];
            });

            if ($cartItems->isEmpty()) {
                return $this->errorResponse('No cart items found', 404);
            }

            $itemsData = [];
            $sellersData = [];
            $uniqueSellers = [];
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
                    'seller_id'    => $product->user_id,
                    'name'         => $product->nama_barang,
                    'price'        => $product->harga,
                    'final_price'  => $finalPrice,
                    'img'          => $product->foto_barang_url,
                    'offer_id'     => $offer?->id,
                ];

                $seller = $product->user;
                if ($seller && !in_array($seller->id, $uniqueSellers)) {
                    $uniqueSellers[] = $seller->id;
                    $sellersData[] = [
                        'id'             => $seller->id,
                        'name'           => $seller->name,
                        'loc'            => $product->lokasi_kampus,
                        'seller_area_id' => $seller->komerce_destination_id ?? '34260',
                    ];
                }
            }

            $fallbackSeller = !empty($sellersData) ? $sellersData[0] : null;

            return $this->successResponse([
                'items' => $itemsData,
                'seller' => $fallbackSeller, // Fallback for legacy single-seller client support
                'sellers' => $sellersData,   // Native multi-seller array
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
        $validated = $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.seller_id'  => 'required|exists:users,id',
            'items.*.price'      => 'required|numeric|min:0',
            'items.*.quantity'   => 'nullable|integer',
            'items.*.name'       => 'nullable|string',
            'items.*.offer_id'   => 'nullable|exists:offers,id',
            'couriers'           => 'required|array',
            'total_amount'       => 'required|numeric|min:0',
            'metode_pengiriman'  => 'required|in:cod,kirim_paket',
            'alamat_pengiriman'  => 'required_if:metode_pengiriman,kirim_paket|nullable|string',
            'shipping_address'   => 'nullable|string',
            'catatan'            => 'nullable|string|max:500',
        ]);

        $items = $validated['items'];
        $couriers = $validated['couriers'];
        $totalAmount = (int) $validated['total_amount'];
        $metodePengiriman = $validated['metode_pengiriman'];
        $alamatPengiriman = $validated['alamat_pengiriman'] ?? $validated['shipping_address'] ?? null;
        $catatan = $validated['catatan'] ?? null;

            // 1. GENERATE PAYMENT REFERENCE:
            $paymentRef = 'PAY-' . strtoupper(uniqid());

            DB::beginTransaction();

            $orders = [];
            $appliedCourierSellers = [];

            // 2. MULTI-ORDER CREATION (Inside DB::transaction):
            foreach ($items as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);
                if (!$product->isActive()) {
                    throw new \Exception("Product '{$product->nama_barang}' is no longer available");
                }

                $sellerId = $itemData['seller_id'];
                
                // Get the courier price for this seller (applied only once per seller)
                $courierPrice = 0;
                $courierName = null;
                if (isset($couriers[$sellerId]) && !in_array($sellerId, $appliedCourierSellers)) {
                    $courierPrice = (int) $couriers[$sellerId]['price'];
                    $courierName = $couriers[$sellerId]['name'] ?? 'Tukang Paket';
                    $appliedCourierSellers[] = $sellerId;
                }

                $orderKode = $paymentRef . '-' . $product->id;

                $order = Order::create([
                    'kode_pesanan'       => $orderKode,
                    'user_id'            => $request->user()->id,
                    'product_id'         => $product->id,
                    'offer_id'           => $itemData['offer_id'] ?? null,
                    'total_harga'        => (int) $itemData['price'] + $courierPrice,
                    'shipping_cost'      => $courierPrice,
                    'courier_service'    => $courierName,
                    'metode_pengiriman'  => $metodePengiriman,
                    'status'             => 'pending',
                    'alamat_pengiriman'  => $alamatPengiriman,
                    'catatan'            => $catatan,
                    'dana_ditahan'       => $metodePengiriman === 'kirim_paket',
                ]);

                $product->markAsSold();
                $this->offerService->cancelAllOffersForProduct($product);

                // Remove from cart/wishlist if it exists
                DB::table('wishlists')
                    ->where('user_id', $request->user()->id)
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
    }
}
