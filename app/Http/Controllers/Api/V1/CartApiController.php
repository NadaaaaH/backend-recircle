<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CartGroupResource;
use App\Models\Cart;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartApiController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the user's cart grouped by seller.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Get carts with eager loading to prevent N+1
            $carts = Cart::with(['product.user', 'offer'])
                ->where('user_id', $request->user()->id)
                ->get();

            // Group by seller_id efficiently using Collection's groupBy
            $groupedCarts = $carts->groupBy(function ($cartItem) {
                return $cartItem->product->user_id;
            })->map(function ($items) {
                $seller = $items->first()->product->user;
                return [
                    'seller' => [
                        'id'          => $seller->id,
                        'name'        => $seller->name,
                        'universitas' => $seller->kampus ?? $seller->universitas ?? null,
                    ],
                    'items' => $items,
                ];
            })->values();

            return $this->successResponse(
                CartGroupResource::collection($groupedCarts),
                'Cart retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve cart: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created cart item in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            $userId = $request->user()->id;
            $productId = $request->product_id;

            // Check if product is already in cart to prevent duplicates
            $exists = Cart::where('user_id', $userId)
                ->where('product_id', $productId)
                ->exists();

            if ($exists) {
                return $this->errorResponse('Barang sudah ada di keranjang', 400);
            }

            // Verify the product exists and is active (optional, but good practice)
            $product = Product::find($productId);
            if (!$product || !$product->isActive()) {
                return $this->errorResponse('Barang tidak tersedia', 400);
            }

            // Prevent buying own product
            if ($product->user_id === $userId) {
                return $this->errorResponse('Tidak bisa memasukkan barang sendiri ke keranjang', 400);
            }

            $cart = Cart::create([
                'user_id'    => $userId,
                'product_id' => $productId,
                // offer_id can be null initially unless specified
            ]);

            return $this->successResponse(
                null,
                'Berhasil dimasukkan ke keranjang',
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
             return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to add to cart', 500);
        }
    }

    /**
     * Remove the specified cart item from storage.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $cart = Cart::where('user_id', $request->user()->id)->findOrFail($id);
            $cart->delete();

            return $this->successResponse(null, 'Berhasil dihapus dari keranjang');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Cart item not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete cart item', 500);
        }
    }
}
