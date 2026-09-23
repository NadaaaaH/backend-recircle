<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SellerVerificationResource;
use App\Models\SellerVerification;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerVerificationApiController extends Controller
{
    use ApiResponse;

    public function show(Request $request): JsonResponse
    {
        try {
            $verification = SellerVerification::where('user_id', $request->user()->id)->first();
            if (!$verification) return $this->successResponse(null, 'No verification found');

            return $this->successResponse(new SellerVerificationResource($verification), 'Verification details retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve verification details', 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_kampus' => 'required|string|max:255',
                'nim'         => 'required|string|max:50',
                'foto_ktm'    => 'required|image|mimes:jpeg,png,jpg|max:5120',
                'foto_selfie' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            ]);

            $user = $request->user();

            if ($user->role === 'seller' || $user->is_seller) {
                return $this->errorResponse('Akun kamu sudah terverifikasi sebagai penjual.', 400);
            }

            // Check if a pending verification request already exists
            $existingPending = SellerVerification::where('user_id', $user->id)
                ->where('status', 'pending')
                ->first();

            if ($existingPending) {
                return $this->errorResponse('Kamu sudah memiliki pengajuan verifikasi yang sedang diproses.', 400);
            }

            // Check for previous rejected requests to update and reuse rather than duplicate
            $existingRejected = SellerVerification::where('user_id', $user->id)
                ->where('status', 'rejected')
                ->first();

            $pathKtm = $request->file('foto_ktm')->store('verifications');
            $pathSelfie = $request->file('foto_selfie')->store('verifications');

            if ($existingRejected) {
                $existingRejected->update([
                    'nama_kampus' => $validated['nama_kampus'],
                    'nim'         => $validated['nim'],
                    'foto_ktm'    => $pathKtm,
                    'foto_selfie' => $pathSelfie,
                    'status'      => 'pending',
                    'catatan_admin' => null,
                ]);
                $verification = $existingRejected;
            } else {
                $verification = SellerVerification::create([
                    'user_id'     => $user->id,
                    'nama_kampus' => $validated['nama_kampus'],
                    'nim'         => $validated['nim'],
                    'foto_ktm'    => $pathKtm,
                    'foto_selfie' => $pathSelfie,
                    'status'      => 'pending',
                ]);
            }

            return $this->successResponse(new SellerVerificationResource($verification), 'Verification request submitted successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to submit verification: ' . $e->getMessage(), 500);
        }
    }
}
