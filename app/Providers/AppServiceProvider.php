<?php

namespace App\Providers;

use App\Contracts\PaymentGatewayInterface;
use App\Services\MidtransPaymentService;
use App\Services\RajaOngkirService;
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
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' || request()->secure() || app()->environment('production') || str_contains(request()->header('host', ''), 'ngrok')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
