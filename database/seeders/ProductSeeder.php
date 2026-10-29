<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $sausan = User::where('email', 'sausan@recircle.id')->first();
        $budi   = User::where('email', 'seller@example.com')->first();
        $nada   = User::where('email', 'nadahf@recircle.id')->first();
        $dimas  = User::where('email', 'dimas.pratama@recircle.id')->first();

        // Fallback user if needed
        $defaultSeller = $budi ?: User::first();

        $catElektronik = Category::where('slug', 'elektronik')->first();
        $catFurniture  = Category::where('slug', 'furniture-kost')->orWhere('slug', 'furniture')->first();
        $catFashion    = Category::where('slug', 'fashion-pakaian')->orWhere('slug', 'fashion')->first();
        $catBuku       = Category::where('slug', 'buku-modul-kuliah')->orWhere('slug', 'buku-modul')->first();
        $catGadget     = Category::where('slug', 'gadget-aksesoris')->orWhere('slug', 'gadget')->first();
        $catHobi       = Category::where('slug', 'hobi-olahraga')->orWhere('slug', 'hobi')->first();
        $catKost       = Category::where('slug', 'perlengkapan-kost')->first();
        $catOtomotif   = Category::where('slug', 'otomotif-sepeda')->orWhere('slug', 'otomotif')->first();

        $products = [
            // ── Elektronik ──────────────────────────────────────────
            [
                'seller' => $budi ?: $defaultSeller,
                'category' => $catElektronik,
                'nama_barang' => 'Magic Com Miyako Ungu Series 1726',
                'harga' => 75000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Kondisi bagus terawat, anti lengket masih mulus, fungsi memasak dan menghangatkan normal. Cocok buat anak kos hemat makan.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $budi ?: $defaultSeller,
                'category' => $catElektronik,
                'nama_barang' => 'Kulkas Mini Hisense Silver Series 189x',
                'harga' => 850000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Kulkas mini 1 pintu kondisi sangat dingin, low watt hanya 80 watt. Jarang dipakai karena sering makan di luar.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $sausan ?: $defaultSeller,
                'category' => $catElektronik,
                'nama_barang' => 'Kipas Angin Meja Miyako KAD-927B 9 Inch',
                'harga' => 65000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Angin kencang dan tidak berisik, putaran lancar. Dijual karena mau pindah kost ke kamar ber-AC.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],

            // ── Gadget & Aksesoris ──────────────────────────────────
            [
                'seller' => $dimas ?: $defaultSeller,
                'category' => $catGadget,
                'nama_barang' => 'Kalkulator Scientific Casio fx-991EX Classwiz Asli',
                'harga' => 195000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Kalkulator wajib anak teknik dan sains. Kondisi 98% seperti baru, baterai awet, solar cell normal, dus dan buku panduan lengkap.',
                'lokasi_kampus' => 'Universitas Indonesia',
                'image' => 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $dimas ?: $defaultSeller,
                'category' => $catGadget,
                'nama_barang' => 'Monitor LED LG 22 Inch Full HD IPS 75Hz',
                'harga' => 720000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Layar jernih no dead pixel. Kelengkapan kabel power, kabel HDMI, dan stand ori. Sangat nyaman buat nugas skripsi dan coding.',
                'lokasi_kampus' => 'Universitas Indonesia',
                'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $sausan ?: $defaultSeller,
                'category' => $catGadget,
                'nama_barang' => 'Keyboard Mechanical Royal Kludge RK61 Wireless',
                'harga' => 310000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Switch Brown enak dan tactile, koneksi Bluetooth + Dongle 2.4G + Kabel Type C lancar. Keycaps bersih.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],

            // ── Buku & Modul Kuliah ─────────────────────────────────
            [
                'seller' => $nada ?: $defaultSeller,
                'category' => $catBuku,
                'nama_barang' => 'Buku Kalkulus Purcell Edisi 9 Jilid 1 & 2 Terjemahan',
                'harga' => 65000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Buku pegangan wajib TPB / PPKU semester 1 dan 2. Halaman lengkap tanpa ada yang robek, ada sedikit coretan pensil catatan rumus penting.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $nada ?: $defaultSeller,
                'category' => $catBuku,
                'nama_barang' => 'Buku Fisika Dasar Halliday Resnick Edisi 7 Lengkap',
                'harga' => 75000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Buku fisik mulus terawat disampul plastik bening. Membantu banget buat lulus mata kuliah fisika dasar.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $sausan ?: $defaultSeller,
                'category' => $catBuku,
                'nama_barang' => 'Buku Pengantar Algoritma dan Struktur Data C++',
                'harga' => 45000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Cocok buat mahasiswa baru jurusan informatika/ilkom yang mulai belajar coding dasar dan struktur data.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],

            // ── Perlengkapan Kost & Furniture ───────────────────────
            [
                'seller' => $budi ?: $defaultSeller,
                'category' => $catKost,
                'nama_barang' => 'Kasur Busa Inoac Single 90x200 Tebal 15cm',
                'harga' => 240000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Busa masih padat dan tidak kempes, bersih selalu dilapisi sprei. Bonus 1 sprei motif kotak minimalis.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $nada ?: $defaultSeller,
                'category' => $catKost,
                'nama_barang' => 'Dispenser Air Minum Miyako Galon Atas Panas & Normal',
                'harga' => 85000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Fungsi panas cepat mendidih, cocok buat seduh mie instan dan kopi malam. Kebersihan tabung terjaga.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $sausan ?: $defaultSeller,
                'category' => $catKost,
                'nama_barang' => 'Rak Sepatu Susun 4 Tingkat Minimalis Stainless',
                'harga' => 35000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Bahan pipa stainless anti karat dan plastik kokoh. Muat 12 pasang sepatu/sandal.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $dimas ?: $defaultSeller,
                'category' => $catFurniture,
                'nama_barang' => 'Meja Belajar Lipat Kayu Kokoh dengan Cup Holder',
                'harga' => 40000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Meja lesehan serbaguna dengan slot tab/HP dan tempat minum. Kaki meja stabil dilapisi karet anti slip.',
                'lokasi_kampus' => 'Universitas Indonesia',
                'image' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],

            // ── Fashion & Pakaian ───────────────────────────────────
            [
                'seller' => $nada ?: $defaultSeller,
                'category' => $catFashion,
                'nama_barang' => 'Jas Laboratorium Kimia IPB Putih Lengan Panjang Size L',
                'harga' => 45000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Dipakai hanya 1 semester saat praktikum kimia umum, sudah dicuci bersih dan wangi. Siap pakai untuk mahasiswa baru.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $budi ?: $defaultSeller,
                'category' => $catFashion,
                'nama_barang' => 'Kemeja Putih Polos Katun Halus Size M Ospek / Sidang',
                'harga' => 35000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Kemeja formal bahan katun dingin dan tidak terawang. Jahitan rapi, kancing lengkap.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $sausan ?: $defaultSeller,
                'category' => $catFashion,
                'nama_barang' => 'Tote Bag Kanvas Resleting Tebal Motif Aesthetic Kampus',
                'harga' => 25000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Kuat menampung laptop 14 inch dan buku tebal. Dilengkapi resleting utama dan kantong saku dalam.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],

            // ── Hobi & Otomotif ─────────────────────────────────────
            [
                'seller' => $budi ?: $defaultSeller,
                'category' => $catOtomotif,
                'nama_barang' => 'Sepeda Lipat Evergreen 16 Inch Siap Gowes Kampus',
                'harga' => 550000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Lipatan aman dan enteng, rem pakem, ban masih tebal. Praktis buat transportasi keliling lingkungan kampus IPB Dramaga.',
                'lokasi_kampus' => 'IPB Dramaga',
                'image' => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
            [
                'seller' => $dimas ?: $defaultSeller,
                'category' => $catHobi,
                'nama_barang' => 'Raket Badminton Yonex Carbonex 8000 Plus Senar Tarikan 24',
                'harga' => 165000,
                'kondisi' => 'Bekas',
                'deskripsi' => 'Frame kokoh no retak, grip baru diganti handuk. Cocok buat olahraga sore di lapangan gymnasium kampus.',
                'lokasi_kampus' => 'Universitas Indonesia',
                'image' => 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ],
        ];

        foreach ($products as $item) {
            Product::updateOrCreate(
                ['nama_barang' => $item['nama_barang']],
                [
                    'user_id'       => $item['seller']->id,
                    'category_id'   => $item['category'] ? $item['category']->id : 1,
                    'harga'         => $item['harga'],
                    'kondisi'       => $item['kondisi'],
                    'deskripsi'     => $item['deskripsi'],
                    'lokasi_kampus' => $item['lokasi_kampus'],
                    'image'         => $item['image'],
                    'status'        => $item['status'],
                ]
            );
        }
    }
}
