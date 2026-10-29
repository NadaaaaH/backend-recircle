<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nama_kategori' => 'Elektronik',          'ikon' => 'Laptop'],
            ['nama_kategori' => 'Furniture & Kost',    'ikon' => 'Armchair'],
            ['nama_kategori' => 'Fashion & Pakaian',   'ikon' => 'Shirt'],
            ['nama_kategori' => 'Buku & Modul Kuliah', 'ikon' => 'BookOpen'],
            ['nama_kategori' => 'Gadget & Aksesoris',  'ikon' => 'Smartphone'],
            ['nama_kategori' => 'Hobi & Olahraga',     'ikon' => 'Gamepad2'],
            ['nama_kategori' => 'Perlengkapan Kost',   'ikon' => 'Home'],
            ['nama_kategori' => 'Otomotif & Sepeda',   'ikon' => 'Bike'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['nama_kategori'])],
                [
                    'nama_kategori' => $cat['nama_kategori'],
                    'ikon'          => $cat['ikon'],
                ]
            );
        }
    }
}
