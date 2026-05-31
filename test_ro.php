<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = config('services.rajaongkir.key');
$baseUrl = 'https://rajaongkir.komerce.id/api/v1';

$response = \Illuminate\Support\Facades\Http::withHeaders(['key' => $apiKey])
    ->get("{$baseUrl}/destination/domestic-destination", [
        'search' => 'Depok',
        'limit' => 20,
        'offset' => 0
    ]);

echo "Status Code: " . $response->status() . "\n";
echo "Headers:\n";
print_r($response->headers());
echo "Body:\n";
echo $response->body() . "\n";
