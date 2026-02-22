<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function create()
    {
        return Inertia::render('Product/Create');
    }

    public function store(Request $request)
    {
        // Validasi array image (maksimal 5 foto misalnya)
        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'harga' => 'required|numeric|min:1000',
            'kategori' => 'required|string',
            'kondisi' => 'required|string',
            'deskripsi' => 'required|string',
            'lokasi_kampus' => 'required|string',

            // Validasi Multiple File
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // 1. Buat Produk Dulu (Tanpa Image Cover dulu)
        $product = $request->user()->products()->create([
            'nama_barang' => $validated['nama_barang'],
            'harga' => $validated['harga'],
            'kategori' => $validated['kategori'],
            'kondisi' => $validated['kondisi'],
            'deskripsi' => $validated['deskripsi'],
            'lokasi_kampus' => $validated['lokasi_kampus'],
            'image' => '', // Nanti diupdate pakai foto pertama
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $fullPath = '/storage/' . $path;
                $product->images()->create([
                    'path' => $fullPath
                ]);
                if ($index === 0) {
                    $product->update(['image' => $fullPath]);
                }
            }
        }

        return redirect()->route('product.index')->with('message', 'Barang berhasil tayang!');
    }

    // PROSES TAMPIL DETAIL (SHOW)
    public function show($id)
    {
        // Ambil data produk beserta data penjualnya
        $product = Product::with('user')->findOrFail($id);

        return Inertia::render('Product/Show', [
            'product' => [
                'id' => $product->id,
                // MAPPING PENTING:
                // Frontend butuh 'name', Database punya 'nama_barang'
                'name' => $product->nama_barang,
                'price' => $product->harga,
                'category' => $product->kategori,
                'condition' => $product->kondisi,
                'desc' => $product->deskripsi,
                'loc' => $product->lokasi_kampus,
                'img' => $product->image, // Image tetap
                'posted_at' => $product->created_at->diffForHumans(),
                'seller' => [
                    'name' => $product->user->name,
                    // Pastikan kolom HP di tabel users sesuai (misal: whatsapp_number)
                    'phone' => $product->user->whatsapp_number ?? '628123456789',
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($product->user->name),
                ]
            ]
        ]);
    }

    // HALAMAN EXPLORE (INDEX)
    public function index(Request $request)
    {
        // 1. Mulai query dasar (hanya ambil produk aktif)
        $query = Product::with(['images', 'category'])->where('status', 'active');

        // 2. LOGIKA SEARCH: Jika ada parameter 'search' dari Navbar
        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;

            // Filter berdasarkan nama barang ATAU deskripsi
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nama_barang', 'like', '%' . $searchTerm . '%')
                    ->orWhere('deskripsi', 'like', '%' . $searchTerm . '%');
            });
        }

        // 3. Ambil data dengan Pagination (misal 12 per halaman)
        $products = $query->latest()->paginate(12)->withQueryString();

        // 4. Kirim ke halaman React
        return Inertia::render('Product/Index', [
            'products' => $products,
            // Kirim balik parameter pencarian biar bisa ditaruh di input search halamannya
            'filters' => $request->only(['search'])
        ]);
    }
}