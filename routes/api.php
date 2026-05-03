<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MidtransWebhookController;
use App\Http\Controllers\Api\V1\AuthApiController;
use App\Http\Controllers\Api\V1\ProductApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| CSRF excluded globally for API routes.
*/

Route::post('/midtrans/webhook', [MidtransWebhookController::class, '__invoke'])
    ->name('midtrans.webhook');

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    // --- Public Routes ---
    Route::post('/login', [AuthApiController::class, 'login']);
    
    // Product Endpoints (Public)
    Route::get('/products', [ProductApiController::class, 'index']);
    Route::get('/products/{id}', [ProductApiController::class, 'show']);

    // --- Protected Routes ---
    Route::middleware('auth:sanctum')->group(function () {
        // Auth Endpoints
        Route::post('/logout', [AuthApiController::class, 'logout']);
        
        // Example User endpoint
        Route::get('/user', function (\Illuminate\Http\Request $request) {
            return response()->json([
                'status' => 'success',
                'message' => 'User profile retrieved successfully',
                'data' => new \App\Http\Resources\Api\V1\UserResource($request->user())
            ]);
        });

        // Wishlist Endpoints
        Route::get('/wishlists', [\App\Http\Controllers\Api\V1\WishlistApiController::class, 'index']);
        Route::post('/wishlists/{productId}/toggle', [\App\Http\Controllers\Api\V1\WishlistApiController::class, 'toggle']);

        // Cart Endpoints
        Route::get('/carts', [\App\Http\Controllers\Api\V1\CartApiController::class, 'index']);
        Route::post('/carts', [\App\Http\Controllers\Api\V1\CartApiController::class, 'store']);
        Route::delete('/carts/{id}', [\App\Http\Controllers\Api\V1\CartApiController::class, 'destroy']);
    });
});
