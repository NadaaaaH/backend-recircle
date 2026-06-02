<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderApiController extends Controller
{
    use ApiResponse;

    public function __construct(protected OrderService $orderService) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $orders = Order::where('user_id', $request->user()->id)
                ->with(['product.images', 'product.user', 'offer'])
                ->latest()
                ->paginate(10);

            return $this->successResponse(
                OrderResource::collection($orders)->response()->getData(true),
                'Orders retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve orders: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id, Request $request): JsonResponse
    {
        try {
            $order = Order::with(['product.user', 'offer'])->findOrFail($id);

            $isBuyer = $order->user_id === $request->user()->id;
            $isSeller = ($order->product && $order->product->user_id === $request->user()->id);

            if (!$isBuyer && !$isSeller) {
                return $this->errorResponse('Unauthorized', 403);
            }

            return $this->successResponse(
                new OrderResource($order),
                'Order details retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Order not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve order', 500);
        }
    }

    public function confirmReceipt(int $id, Request $request): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);

            if ($order->user_id !== $request->user()->id) {
                return $this->errorResponse('Unauthorized', 403);
            }

            $isCodProcessing = ($order->metode_pengiriman === 'cod' && $order->status === 'processing');
            if ($order->status !== 'dikirim' && !$isCodProcessing) {
                return $this->errorResponse('Order is not in shipped status', 400);
            }

            $this->orderService->confirmReceipt($order);
            return $this->successResponse(null, 'Receipt confirmed. Funds released to seller.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to confirm receipt: ' . $e->getMessage(), 500);
        }
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:shipped,completed',
        ]);

        $statusInput = $validated['status'];

        try {
            $order = Order::with('product')->findOrFail($id);

            if ($statusInput === 'shipped') {
                // 1. Seller shipping confirmation
                // Verify that authenticated user is the seller of the product
                if ($order->product->user_id !== $request->user()->id) {
                    return $this->errorResponse('Unauthorized', 403);
                }

                if ($order->status !== 'dibayar') {
                    return $this->errorResponse('Order must be in paid status to ship', 400);
                }

                $this->orderService->markAsShipped($order);

                return $this->successResponse(
                    new OrderResource($order->fresh()),
                    'Order marked as shipped successfully.'
                );
            }

            if ($statusInput === 'completed') {
                // 2. Buyer order completion
                // Verify that authenticated user is the buyer of the order
                if ($order->user_id !== $request->user()->id) {
                    return $this->errorResponse('Unauthorized', 403);
                }

                $isCodProcessing = ($order->metode_pengiriman === 'cod' && $order->status === 'processing');
                if ($order->status !== 'dikirim' && !$isCodProcessing) {
                    return $this->errorResponse('Order must be in shipped status to complete', 400);
                }

                $updatedOrder = $this->orderService->confirmReceipt($order);

                return $this->successResponse(
                    new OrderResource($updatedOrder),
                    'Order completed and funds released to seller.'
                );
            }

            return $this->errorResponse('Invalid status transition', 400);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Order not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update order: ' . $e->getMessage(), 500);
        }
    }

    public function cancelOrder(int $id, Request $request): JsonResponse
    {
        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $order = Order::with(['product'])->findOrFail($id);

            $isBuyer = $order->user_id === $request->user()->id;
            $isSeller = ($order->product && $order->product->user_id === $request->user()->id);

            if (!$isBuyer && !$isSeller) {
                return $this->errorResponse('Unauthorized', 403);
            }

            if ($order->status !== 'pending') {
                return $this->errorResponse('Pesanan yang sudah dibayar tidak dapat dibatalkan', 422);
            }

            // Update order status to 'dibatalkan' (mapped to cancel in database enum)
            $order->status = 'dibatalkan';
            $order->save();

            // RESTOCK LOGIC: Loop through $order->items and restore the availability in products table.
            // Since we have a single product order, we handle both items relation (if added later) and direct product relation.
            $productsToRestock = [];
            if (isset($order->items) && $order->items) {
                foreach ($order->items as $item) {
                    if ($item->product) {
                        $productsToRestock[] = $item->product;
                    }
                }
            } elseif ($order->product) {
                $productsToRestock[] = $order->product;
            }

            foreach ($productsToRestock as $product) {
                $product->status = 'active';
                $product->save();
            }

            \Illuminate\Support\Facades\DB::commit();

            return $this->successResponse(
                new OrderResource($order->fresh()),
                'Pesanan berhasil dibatalkan.'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return $this->errorResponse('Order not found', 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return $this->errorResponse('Failed to cancel order: ' . $e->getMessage(), 500);
        }
    }
}
