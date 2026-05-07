<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerProductApiController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        try {
            $products = $request->user()->products()
                ->with(['category', 'orders'])
                ->latest()
                ->paginate(10);

            return $this->successResponse(
                ProductResource::collection($products)->response()->getData(true),
                'Seller products retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve seller products', 500);
        }
    }

    public function toggleArchive(int $id, Request $request): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);
            if ($product->user_id !== $request->user()->id) return $this->errorResponse('Unauthorized', 403);

            $newStatus = $product->status === 'archived' ? 'active' : 'archived';
            $product->update(['status' => $newStatus]);

            return $this->successResponse(new ProductResource($product), "Product status updated to {$newStatus}");
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to toggle archive status', 500);
        }
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);
            if ($product->user_id !== $request->user()->id) return $this->errorResponse('Unauthorized', 403);

            $product->delete(); // Soft delete if supported, or regular delete
            return $this->successResponse(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete product', 500);
        }
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        try {
            $product = Product::withTrashed()->findOrFail($id);
            if ($product->user_id !== $request->user()->id) return $this->errorResponse('Unauthorized', 403);

            $product->restore();
            return $this->successResponse(new ProductResource($product), 'Product restored successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to restore product', 500);
        }
    }

    public function forceDestroy(int $id, Request $request): JsonResponse
    {
        try {
            $product = Product::withTrashed()->findOrFail($id);
            if ($product->user_id !== $request->user()->id) return $this->errorResponse('Unauthorized', 403);

            $product->forceDelete();
            return $this->successResponse(null, 'Product permanently deleted');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to force delete product', 500);
        }
    }
}
