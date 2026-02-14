<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',       // Pembeli
        'product_id',    // Barang yang ditawar
        'harga_tawar',   // Indo (Dulu: offer_price)
        'pesan',         // Indo (Dulu: message)
        'status',        // 'pending', 'accepted', 'rejected'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}