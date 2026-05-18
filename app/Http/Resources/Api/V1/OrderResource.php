<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderCode' => $this->kode_pesanan,
            'totalPrice' => $this->total_harga,
            'shippingMethod' => $this->metode_pengiriman,
            'status' => $this->status,
            'paymentMethod' => $this->metode_pembayaran,
            'shippingAddress' => $this->alamat_pengiriman,
            'notes' => $this->catatan,
            'courierInfo' => $this->courier_info,
            'isPending' => $this->status === 'pending',
            'snapToken' => $this->when($this->status === 'pending', $this->midtrans_snap_token),
            'midtransClientKey' => config('services.midtrans.client_key') ?? config('midtrans.client_key'),
            'createdAt' => $this->created_at?->toIso8601String(),
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}