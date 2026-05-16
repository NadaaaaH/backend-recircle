<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'orderCode'        => $this->kode_pesanan,
            'totalPrice'       => $this->total_harga,
            'shippingMethod'   => $this->metode_pengiriman,
            'status'           => $this->status,
            'paymentMethod'    => $this->metode_pembayaran,
            'isPending'        => (bool) $this->is_pending,
            'snapToken'        => $this->when($this->is_pending, $this->snap_token),
            'shippingAddress'  => $this->alamat_pengiriman,
            'notes'            => $this->catatan,
            'createdAt'        => $this->created_at?->toIso8601String(),
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}