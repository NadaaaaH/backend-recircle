<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\RajaOngkirService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogisticsApiController extends Controller
{
    use ApiResponse;

    public function __construct(protected RajaOngkirService $rajaOngkir) {}

    public function searchDestination(Request $request): JsonResponse
    {
        $keyword = $request->query('keyword', '');
        if (strlen($keyword) < 3) {
            return $this->successResponse([], 'Keyword too short');
        }
        
        try {
            $results = $this->rajaOngkir->searchDestination($keyword);
            return $this->successResponse($results, 'Destinations retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to search destination', 500);
        }
    }

    public function calculateCost(Request $request): JsonResponse
    {
        $request->validate([
            'product_id'  => 'sometimes|exists:products,id',
            'origin'      => 'required_without:product_id',
            'destination' => 'required',
            'weight'      => 'required|numeric',
            'courier'     => 'required|string',
        ]);

        try {
            $origin = $request->origin;
            if ($request->has('product_id')) {
                $product = \App\Models\Product::with('user')->find($request->product_id);
                if ($product && $product->user) {
                    $origin = $product->user->komerce_destination_id;
                }
            } else if (is_numeric($origin) && \App\Models\Product::find($origin)) {
                $product = \App\Models\Product::with('user')->find($origin);
                if ($product && $product->user) {
                    $origin = $product->user->komerce_destination_id;
                }
            }

            if (empty($origin)) {
                $origin = '34260'; // Safe Default Fallback (Depok)
            }

            $cost = $this->rajaOngkir->calculateCost(
                $origin,
                $request->destination,
                $request->weight,
                $request->courier
            );
            return $this->successResponse($cost, 'Shipping cost calculated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to calculate shipping cost: ' . $e->getMessage(), 500);
        }
    }
}
