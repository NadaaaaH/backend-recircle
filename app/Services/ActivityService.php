<?php

namespace App\Services;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Offer;

class ActivityService
{
    public static function getRecentActivities($limit = 5)
    {
        $subLimit = max(1, (int) ($limit / 2));

        $users = User::latest()->limit($subLimit)->get()->map(fn($u) => [
            'type' => 'user',
            'title' => 'User Baru terdaftar',
            'description' => "{$u->name} bergabung sebagai " . ($u->role ?? 'user'),
            'time' => $u->created_at->diffForHumans(),
            'timestamp' => $u->created_at->toDateTimeString(),
        ]);

        $products = Product::latest()->limit($subLimit)->get()->map(fn($p) => [
            'type' => 'product',
            'title' => 'Produk Baru diunggah',
            'description' => "{$p->nama_barang} diunggah oleh {$p->user->name}",
            'time' => $p->created_at->diffForHumans(),
            'timestamp' => $p->created_at->toDateTimeString(),
        ]);

        $orders = Order::latest()->limit($subLimit)->get()->map(fn($o) => [
            'type' => 'order',
            'title' => 'Pesanan Baru',
            'description' => "Pesanan #{$o->id} senilai Rp " . number_format($o->total_harga, 0, ',', '.'),
            'time' => $o->created_at->diffForHumans(),
            'timestamp' => $o->created_at->toDateTimeString(),
        ]);

        return $users->concat($products)->concat($orders)
            ->sortByDesc('timestamp')
            ->values()
            ->take($limit);
    }

    public static function getSellerActivities($userId, $limit = 5)
    {
        $seller = User::find($userId);
        if (!$seller)
            return collect();

        $productIds = $seller->products()->pluck('id');
        $subLimit = max(1, (int) ($limit / 2));

        $offers = Offer::whereIn('product_id', $productIds)
            ->with('product')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn($o) => [
                'type' => 'offer',
                'title' => 'Penawaran Baru',
                'description' => "Penawaran Rp " . number_format($o->harga_tawar, 0, ',', '.') . " untuk {$o->product->nama_barang}",
                'time' => $o->created_at->diffForHumans(),
                'timestamp' => $o->created_at->toDateTimeString(),
            ]);

        $orders = Order::whereIn('product_id', $productIds)
            ->with('product')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn($o) => [
                'type' => 'order',
                'title' => 'Pesanan Baru',
                'description' => "Pesanan #{$o->id} untuk {$o->product->nama_barang}",
                'time' => $o->created_at->diffForHumans(),
                'timestamp' => $o->created_at->toDateTimeString(),
            ]);

        return $offers->concat($orders)
            ->sortByDesc('timestamp')
            ->values()
            ->take($limit);
    }
}
