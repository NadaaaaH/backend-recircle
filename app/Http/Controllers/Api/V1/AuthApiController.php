<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthApiController extends Controller
{
    use ApiResponse;

    /**
     * Handle user login and token generation.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email'    => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->errorResponse('Invalid credentials', 401);
            }

            // Generate Token
            $token = $user->createToken('mobile-app-token')->plainTextToken;

            return $this->successResponse([
                'user'  => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ], 'Login successful');

        } catch (ValidationException $e) {
            return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Internal Server Error', 500);
        }
    }

    /**
     * Handle user logout and token revocation.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            return $this->successResponse(null, 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to logout', 500);
        }
    }
}
