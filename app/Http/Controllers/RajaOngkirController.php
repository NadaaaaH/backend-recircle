<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use Illuminate\Http\Request;

class RajaOngkirController extends Controller
{
    private RajaOngkirService $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function searchDestination(Request $request)
    {
        $keyword = $request->query('keyword', '');
        if (strlen($keyword) < 3) {
            return response()->json([]);
        }
        return response()->json($this->rajaOngkir->searchDestination($keyword));
    }

    public function calculateCost(Request $request)
    {
        $request->validate([
            'product_id'  => 'sometimes|exists:products,id',
            'origin'      => 'required_without:product_id',
            'destination' => 'required',
            'weight'      => 'required|numeric',
            'courier'     => 'required|string',
        ]);

        try {
            $origin = $request->origin;
            if ($request->has('product_id')) {
                $product = \App\Models\Product::with('user')->find($request->product_id);
                if ($product && $product->user) {
                    $origin = $product->user->komerce_destination_id;
                }
            } else if (is_numeric($origin) && \App\Models\Product::find($origin)) {
                $product = \App\Models\Product::with('user')->find($origin);
                if ($product && $product->user) {
                    $origin = $product->user->komerce_destination_id;
                }
            }

            if (empty($origin)) {
                $origin = '34260'; // Safe Default Fallback (Depok)
            }

            $cost = $this->rajaOngkir->calculateCost(
                $origin,
                $request->destination,
                $request->weight,
                $request->courier
            );
            return response()->json($cost);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
