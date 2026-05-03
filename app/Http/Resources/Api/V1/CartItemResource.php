<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'product_id'       => $this->product_id,
            'product_name'     => $this->product->nama_barang,
            'product_image'    => $this->product->foto_barang_url,
            'normal_price'     => (int) $this->product->harga,
            'negotiated_price' => $this->offer ? (int) $this->offer->harga_deal : null,
            'expires_at'       => $this->offer ? $this->offer->deal_expired_at : null,
            'added_at'         => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
