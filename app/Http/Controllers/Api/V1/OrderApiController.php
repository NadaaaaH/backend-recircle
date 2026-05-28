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

            if ($order->user_id !== $request->user()->id) {
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

            if ($order->status !== 'dikirim') {
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

                if ($order->status !== 'dikirim') {
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
}
