<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'orderCode'      => $this->kode_pesanan,
            'totalPrice'     => $this->total_harga,
            'shippingMethod' => $this->metode_pengiriman,
            'status'         => $this->status,
            'shippingAddress'=> $this->alamat_pengiriman,
            'createdAt'      => $this->created_at?->toIso8601String(),
            'buyer' => [
                'id'    => $this->whenLoaded('buyer', fn() => $this->buyer->id),
                'name'  => $this->whenLoaded('buyer', fn() => $this->buyer->name),
                'phone' => $this->whenLoaded('buyer', fn() => $this->buyer->phone),
            ],
            'product' => [
                'id'       => $this->whenLoaded('product', fn() => $this->product->id),
                'name'     => $this->whenLoaded('product', fn() => $this->product->nama_barang),
                'imageUrl' => $this->whenLoaded('product', fn() => $this->product->foto_barang_url),
            ],
        ];
    }
}