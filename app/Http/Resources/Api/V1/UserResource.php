<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            // Sembunyikan email dan whatsapp untuk privasi di public endpoint,
            // tetapi bisa ditampilkan jika user sedang mengakses profilnya sendiri,
            // namun karena ini lebih sering dipakai oleh public product list, kita sembunyikan.
            'profile_picture'=> $this->profile_picture ? asset('storage/' . $this->profile_picture) : null,
            'joined_at'      => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
