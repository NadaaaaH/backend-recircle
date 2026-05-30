<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SellerVerificationResource;
use App\Models\SellerVerification;
use App\Services\SellerVerificationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminVerificationApiController extends Controller
{
    use ApiResponse;

    public function __construct(protected SellerVerificationService $verificationService) {}

    public function index(): JsonResponse
    {
        try {
            $verifications = SellerVerification::with('user')->latest()->get();
            $data = [
                'list' => SellerVerificationResource::collection($verifications),
                'stats' => [
                    'total' => \App\Models\SellerVerification::count(),
                    'pending' => \App\Models\SellerVerification::where('status', 'pending')->count(),
                    'approved' => \App\Models\SellerVerification::where('status', 'approved')->count(),
                    'rejected' => \App\Models\SellerVerification::where('status', 'rejected')->count(),
                ]
            ];
            return $this->successResponse(
                $data,
                'All verifications retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve verifications', 500);
        }
    }

    public function approve(int $id): JsonResponse
    {
        try {
            $verification = \Illuminate\Support\Facades\DB::transaction(function () use ($id) {
                $verification = SellerVerification::findOrFail($id);
                
                // 1. Update status to approved
                $verification->update(['status' => 'approved']);
                
                // 2. Find and update the associated User's is_seller flag to true
                $verification->user->update([
                    'is_seller' => true
                ]);

                return $verification;
            });
            
            // Get fresh user object
            $freshUser = $verification->user->fresh();
            
            return $this->successResponse([
                'verification' => new SellerVerificationResource($freshUser->latestVerification ?: $verification),
                'user' => $freshUser
            ], 'Seller approved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to approve verification: ' . $e->getMessage(), 500);
        }
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        try {
            $verification = SellerVerification::findOrFail($id);
            $validated = $request->validate(['catatan_admin' => 'required|string|max:500']);
            $this->verificationService->rejectVerification($verification, $validated['catatan_admin']);
            return $this->successResponse(null, 'Seller rejected');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to reject verification', 500);
        }
    }
}
