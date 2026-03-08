<?php

use App\Http\Controllers\Api\MidtransWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| CSRF excluded globally for API routes.
*/

Route::post('/midtrans/webhook', [MidtransWebhookController::class, '__invoke'])
    ->name('midtrans.webhook');
