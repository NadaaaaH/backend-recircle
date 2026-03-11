<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirController extends Controller
{
    protected $apiKey;
    protected $baseUrl = 'https://api.rajaongkir.com/starter';

    public function __construct()
    {
        $this->apiKey = config('services.rajaongkir.key');
    }

    public function getProvinces()
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->get("{$this->baseUrl}/province");

            if ($response->successful()) {
                return response()->json($response->json()['rajaongkir']['results']);
            }

            Log::error('RajaOngkir Get Provinces Error: ' . $response->body());
            return response()->json(['error' => 'Gagal mengambil data provinsi'], 500);
        } catch (\Exception $e) {
            Log::error('RajaOngkir Get Provinces Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan sistem'], 500);
        }
    }

    public function getCities($province_id)
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->get("{$this->baseUrl}/city", [
                'province' => $province_id
            ]);

            if ($response->successful()) {
                return response()->json($response->json()['rajaongkir']['results']);
            }

            Log::error('RajaOngkir Get Cities Error: ' . $response->body());
            return response()->json(['error' => 'Gagal mengambil data kota'], 500);
        } catch (\Exception $e) {
            Log::error('RajaOngkir Get Cities Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan sistem'], 500);
        }
    }

    public function getCost(Request $request)
    {
        $request->validate([
            'origin'      => 'required|numeric',
            'destination' => 'required|numeric',
            'weight'      => 'required|numeric',
            'courier'     => 'required|in:jne,pos,tiki'
        ]);

        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->post("{$this->baseUrl}/cost", [
                'origin'      => $request->origin,
                'destination' => $request->destination,
                'weight'      => $request->weight,
                'courier'     => $request->courier,
            ]);

            if ($response->successful()) {
                return response()->json($response->json()['rajaongkir']['results'][0]['costs']);
            }

            Log::error('RajaOngkir Get Cost Error: ' . $response->body());
            return response()->json(['error' => 'Gagal menghitung ongkos kirim'], 500);
        } catch (\Exception $e) {
            Log::error('RajaOngkir Get Cost Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan saat menghitung ongkir'], 500);
        }
    }
}
