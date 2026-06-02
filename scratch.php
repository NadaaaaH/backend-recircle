<?php
require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orders = App\Models\Order::with('user')->get();
foreach ($orders as $order) {
    echo "ID: " . $order->id . " | Buyer: " . ($order->user?->name ?? 'N/A') . " | Alamat Pengiriman: " . var_export($order->alamat_pengiriman, true) . "\n";
}
