<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Offer;
use App\Models\SellerVerification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'pending_verifications' => SellerVerification::where('status', 'pending')->count(),
            'total_transactions' => Order::count(),
            'total_revenue' => Order::where('status', 'completed')->sum('total_harga'),
            'active_offers' => Offer::where('status', 'pending')->count(),
        ];

        // Monthly stats for chart (last 6 months)
        $monthlyStats = Order::select(
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(total_harga) as revenue'),
            DB::raw("DATE_FORMAT(created_at, '%m') as month")
        )
            ->where('status', 'completed')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        $recentActivities = $this->getRecentActivities();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'monthlyStats' => $monthlyStats,
            'recentActivities' => $recentActivities,
        ]);
    }

    public function products(Request $request)
    {
        $query = Product::with(['user', 'category']);

        if ($request->search) {
            $query->where('nama_barang', 'like', "%{$request->search}%")
                ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $products = $query->latest()->paginate(10)->through(fn($p) => [
            'id' => $p->id,
            'name' => $p->nama_barang,
            'seller' => $p->user->name,
            'category' => $p->category->nama_kategori ?? 'Umum',
            'price' => $p->harga,
            'status' => $p->status ?? 'pending',
            'image' => $p->foto_barang_url,
            'created_at' => $p->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function updateProductStatus(Request $request, Product $product)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,rejected,inactive,pending',
        ]);

        $product->update(['status' => $validated['status']]);

        return back()->with('success', "Status produk {$product->nama_barang} diperbarui menjadi {$validated['status']}.");
    }

    public function offers(Request $request)
    {
        $query = Offer::with(['user', 'product.user']);

        if ($request->search) {
            $query->whereHas('product', fn($q) => $q->where('nama_barang', 'like', "%{$request->search}%"))
                ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        $offers = $query->latest()->paginate(10)->through(fn($o) => [
            'id' => $o->id,
            'product' => $o->product->nama_barang,
            'buyer' => $o->user->name,
            'seller' => $o->product->user->name,
            'original_price' => $o->product->harga,
            'offered_price' => $o->harga_tawaran,
            'status' => $o->status,
            'created_at' => $o->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Offers', [
            'offers' => $offers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function transactions(Request $request)
    {
        $query = Order::with(['buyer', 'seller', 'product']);

        if ($request->search) {
            $query->where('id', 'like', "%{$request->search}%")
                ->orWhereHas('buyer', fn($q) => $q->where('name', 'like', "%{$request->search}%"))
                ->orWhereHas('product', fn($q) => $q->where('nama_barang', 'like', "%{$request->search}%"));
        }

        $orders = $query->latest()->paginate(10)->through(fn($o) => [
            'id' => $o->id,
            'product' => $o->product->nama_barang ?? 'Produk Dihapus',
            'buyer' => $o->buyer->name,
            'seller' => $o->seller->name,
            'total_harga' => $o->total_harga,
            'status' => $o->status,
            'payment_status' => $o->payment_status,
            'created_at' => $o->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Transactions', [
            'transactions' => $orders,
            'filters' => $request->only(['search']),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        $users = $query->latest()->paginate(10)->through(fn($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role ?? 'user',
            'is_active' => $u->is_active ?? true,
            'created_at' => $u->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function toggleUserStatus(User $user)
    {
        $user->is_active = !($user->is_active ?? true);
        $user->save();

        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "User {$user->name} berhasil {$status}.");
    }

    private function getRecentActivities()
    {
        // Combine recent users, products, and orders into a single activity feed
        $users = User::latest()->limit(3)->get()->map(fn($u) => [
            'type' => 'user',
            'title' => 'User Baru terdaftar',
            'description' => "{$u->name} bergabung sebagai " . ($u->role ?? 'user'),
            'time' => $u->created_at->diffForHumans(),
        ]);

        $products = Product::latest()->limit(3)->get()->map(fn($p) => [
            'type' => 'product',
            'title' => 'Produk Baru diunggah',
            'description' => "{$p->nama_barang} diunggah oleh {$p->user->name}",
            'time' => $p->created_at->diffForHumans(),
        ]);

        $orders = Order::latest()->limit(3)->get()->map(fn($o) => [
            'type' => 'order',
            'title' => 'Pesanan Baru',
            'description' => "Pesanan #{$o->id} senilai Rp " . number_format($o->total_price, 0, ',', '.'),
            'time' => $o->created_at->diffForHumans(),
        ]);

        return $users->concat($products)->concat($orders)->sortByDesc('time')->values()->take(5);
    }
}
