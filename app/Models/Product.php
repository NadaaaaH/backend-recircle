<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',          // Foreign Key tetap standar Laravel
        'nama_barang',      // Indo
        'harga',            // Indo
        'kategori',         // Indo (disimpan string sesuai request controller kamu)
        'kondisi',          // Indo
        'deskripsi',        // Indo
        'lokasi_kampus',    // Indo
        'image',            // English (Pengecualian)
        'status',           // 'active', 'sold'
    ];

    // Relasi ke User (Penjual)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Tawaran
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}