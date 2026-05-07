<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Resources\Api\V1\SellerDashboardResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SellerDashboardApiController extends Controller
{
    use ApiResponse;

    /**
     * Get seller dashboard statistics.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $productIds = $user->products()->pluck('id');

            $totalProducts = $user->products()->count();
            
            $activeProducts = $user->products()->where('status', 'active')->count();
            
            $soldProducts = $user->products()->where('status', 'sold')->count();
            
            $activeOrders = Order::whereIn('product_id', $productIds)
                ->whereIn('status', ['pending', 'dibayar', 'dikirim'])
                ->count();

            $data = [
                'total_products'  => $totalProducts,
                'active_products' => $activeProducts,
                'sold_products'   => $soldProducts,
                'active_orders'   => $activeOrders,
            ];

            return $this->successResponse(
                new SellerDashboardResource($data),
                'Seller dashboard statistics retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve dashboard statistics: ' . $e->getMessage(), 500);
        }
    }
}
