<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerVerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'campusName'  => $this->nama_kampus,
            'nim'         => $this->nim,
            'ktmPhoto'    => $this->foto_ktm_url,
            'selfiePhoto' => $this->foto_selfie_url,
            'foto_ktm'    => $this->foto_ktm_url,
            'foto_selfie' => $this->foto_selfie_url,
            'status'      => $this->status,
            'catatanAdmin' => $this->catatan_admin, // Add catatanAdmin for React frontend display
            'catatan_admin' => $this->catatan_admin,
            'createdAt'   => $this->created_at->diffForHumans(),
            'user' => [
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ],
        ];
    }
}
