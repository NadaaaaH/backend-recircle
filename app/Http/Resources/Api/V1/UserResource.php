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
            'profilePicture' => $this->profile_picture ? asset('storage/' . $this->profile_picture) : null,
            'joinedAt'       => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
