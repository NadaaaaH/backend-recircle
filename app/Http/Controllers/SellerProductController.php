<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerProductController extends Controller
{
    /**
     * Seller: Kelola Produk (List Produk Sendiri).
     */
    public function index(Request $request)
    {
        $products = $request->user()->products()
            ->withTrashed()
            ->with(['category', 'orders' => function($q) {
                $q->whereIn('status', ['pending', 'dibayar', 'dikirim']);
            }])
            ->latest()
            ->get()
            ->map(fn ($p) => [
                'id'            => $p->id,
                'name'          => $p->nama_barang,
                'price'         => $p->harga,
                'category'      => $p->category->nama_kategori ?? '-',
                'status'        => $p->status,
                'is_archived'   => (bool) $p->is_archived,
                'deleted_at'    => $p->deleted_at ? $p->deleted_at->toISOString() : null,
                'img'           => $p->foto_barang_url,
                'created_at'    => $p->created_at->diffForHumans(),
                'active_orders' => $p->orders->count(),
            ]);

        return Inertia::render('Seller/Products', [
            'products' => $products,
        ]);
    }

    /**
     * Mengubah status is_archived (Aktif <-> Arsip).
     */
    public function toggleArchive(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            abort(403);
        }

        $product->update([
            'is_archived' => !$product->is_archived,
        ]);

        $statusStr = $product->is_archived ? 'diarsipkan' : 'dikembalikan ke etalase';
        return back()->with('success', "Produk berhasil {$statusStr}.");
    }

    /**
     * Melakukan Soft Delete (barang masuk ke "Tong Sampah").
     */
    public function destroy(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            abort(403);
        }

        $product->delete();

        return back()->with('success', 'Produk berhasil dipindahkan ke Tong Sampah.');
    }

    /**
     * Mengembalikan barang dari "Tong Sampah" ke etalase utama.
     */
    public function restore(Request $request, $id)
    {
        $product = Product::onlyTrashed()->where('user_id', $request->user()->id)->findOrFail($id);

        $product->restore();

        return back()->with('success', 'Produk berhasil dipulihkan.');
    }

    /**
     * Penjual menghapus permanen manual dari "Tong Sampah".
     */
    public function forceDestroy(Request $request, $id)
    {
        $product = Product::onlyTrashed()->where('user_id', $request->user()->id)->findOrFail($id);

        // Cek apakah produk punya relasi ke tabel orders
        if ($product->orders()->exists()) {
            return back()->withErrors(['error' => 'Tidak dapat dihapus permanen karena memiliki riwayat transaksi']);
        }

        $product->forceDelete();

        return back()->with('success', 'Produk berhasil dihapus permanen.');
    }
}
