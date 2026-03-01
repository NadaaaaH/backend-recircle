<?php

namespace App\Providers;

use App\Contracts\PaymentGatewayInterface;
use App\Services\MidtransPaymentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind PaymentGateway interface ke implementasi Midtrans
        $this->app->bind(PaymentGatewayInterface::class, MidtransPaymentService::class);
    }

    public function boot(): void
    {
        //
    }
}
