<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_verified',
        'is_seller',
        'avatar',
        'nomor_wa',
        'kampus',
        'bio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_verified' => 'boolean',
        'is_seller' => 'boolean',
    ];

    // ── Relasi ─────────────────────────────────────

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function sellerVerifications()
    {
        return $this->hasMany(SellerVerification::class);
    }

    public function sellerBalances()
    {
        return $this->hasMany(SellerBalance::class);
    }

    public function categoryViews()
    {
        return $this->hasMany(UserCategoryView::class);
    }

    // ── Helper Methods ─────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSeller(): bool
    {
        return $this->is_seller;
    }

    public function latestVerification()
    {
        return $this->hasOne(SellerVerification::class)->latestOfMany();
    }
}