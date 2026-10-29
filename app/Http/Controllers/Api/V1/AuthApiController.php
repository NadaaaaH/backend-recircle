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
     * Handle user registration.
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user'  => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ], 'Registration successful', 201);

        } catch (ValidationException $e) {
            return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Internal Server Error: ' . $e->getMessage(), 500);
        }
    }

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
            
            // Prevent login if account is deactivated
            if (!($user->is_active ?? true)) {
                return $this->errorResponse('Akun Anda telah diblokir. Hubungi administrator.', 403);
            }

            // Generate Token
            $token = $user->createToken('auth_token')->plainTextToken;

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
     * Get the authenticated user details cleanly.
     */
    public function user(Request $request): JsonResponse
    {
        try {
            $user = auth('sanctum')->user();
            if (!$user) {
                return $this->successResponse(null, 'User is not logged in');
            }
            // If account is deactivated, treat as not authenticated
            if (!($user->is_active ?? true)) {
                return $this->errorResponse('Akun dinonaktifkan', 403);
            }
            return $this->successResponse(new \App\Http\Resources\Api\V1\UserResource($user), 'Authenticated user retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle user logout and token revocation.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->successResponse(null, 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to logout', 500);
        }
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password'         => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            return $this->successResponse(null, 'Password updated successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update password: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $request->validate(['email' => 'required|email']);
            $status = \Illuminate\Support\Facades\Password::sendResetLink(
                $request->only('email')
            );
            if ($status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT) {
                return $this->successResponse(null, __($status));
            }
            return $this->errorResponse(__($status), 400);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send reset link: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Reset user password using token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'token'    => 'required',
                'email'    => 'required|email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $status = \Illuminate\Support\Facades\Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user) use ($request) {
                    $user->forceFill([
                        'password' => Hash::make($request->password),
                        'remember_token' => \Illuminate\Support\Str::random(60),
                    ])->save();
                    event(new \Illuminate\Auth\Events\PasswordReset($user));
                }
            );

            if ($status === \Illuminate\Support\Facades\Password::PASSWORD_RESET) {
                return $this->successResponse(null, __($status));
            }
            return $this->errorResponse(__($status), 400);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to reset password: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Confirm password for sensitive actions.
     */
    public function confirmPassword(Request $request): JsonResponse
    {
        try {
            $request->validate(['password' => 'required|string']);
            if (!Hash::check($request->password, $request->user()->password)) {
                return $this->errorResponse('Password tidak cocok', 422, [
                    'password' => ['Password tidak cocok.'],
                ]);
            }
            return $this->successResponse(null, 'Password confirmed');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation Error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error confirming password', 500);
        }
    }

    /**
     * Send email verification notification.
     */
    public function sendVerificationNotification(Request $request): JsonResponse
    {
        try {
            if ($request->user()->hasVerifiedEmail()) {
                return $this->successResponse(null, 'Email already verified.');
            }
            $request->user()->sendEmailVerificationNotification();
            return $this->successResponse(null, 'Verification link sent.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send verification email: ' . $e->getMessage(), 500);
        }
    }
}
