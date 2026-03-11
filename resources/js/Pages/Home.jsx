import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { ArrowRight, Search } from "lucide-react";

export default function Home({ recommendations = [], categories = [] }) {
    const { auth } = usePage().props;

    return (
        <MainLayout>
            <Head title="ReCircle - Marketplace Mahasiswa Indonesia" />

            {/* --- HERO SECTION: Premium Edge-to-Edge --- */}
            <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1489987707023-af0825ae1eeb?q=80&w=2000&auto=format&fit=crop"
                    alt="Vintage Student Fashion"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-4xl mx-auto text-center mt-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white uppercase tracking-tight leading-none mb-4">
                        Preloved & Reborn
                    </h1>
                    <p className="text-lg text-gray-200 mt-2 mb-8 max-w-2xl mx-auto">
                        Platform jual beli eksklusif untuk mahasiswa. Transaksi
                        aman, harga terjangkau, dan mendukung gaya hidup
                        berkelanjutan.
                    </p>
                    <Link
                        href="/explore"
                        className="bg-white text-[#43552c] hover:bg-gray-100 rounded-full px-10 py-4 font-bold tracking-wide uppercase transition-all active:scale-95 shadow-xl"
                    >
                        Mulai Belanja
                    </Link>
                </div>
            </section>

            {/* --- INFINITE TICKER --- */}
            <div className="bg-primary text-white py-4 overflow-hidden border-y border-primary-light/20">
                <div className="flex gap-12 items-center animate-marquee whitespace-nowrap text-sm font-bold tracking-[0.2em] uppercase opacity-90">
                    <span>Transaksi Aman</span>
                    <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                    <span>Verifikasi Mahasiswa</span>
                    <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                    <span>COD Kampus & Kirim Paket</span>
                    <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                    <span>Hemat Budget</span>
                    <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                    <span>Sustainable Living</span>
                    <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                    <span>Transaksi Aman</span>
                    <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                    <span>Verifikasi Mahasiswa</span>
                </div>
            </div>

            {/* --- CATEGORIES (from server) --- */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Kategori{" "}
                        <span className="font-serif italic text-primary">
                            Pilihan
                        </span>
                    </h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/explore?category=${cat.slug}`}
                            className="snap-start flex-shrink-0 group"
                        >
                            <div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/20 transition-all min-w-[160px] h-[160px]">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {cat.count} items
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* --- REKOMENDASI MINGGU INI (from server) --- */}
            <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
                <div className="flex justify-between items-center gap-4 mb-12">
                    <div className="flex space-x-2">
                        <div className="h-10 w-1 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-bold tracking-tigh text-gray-900">
                            Rekomendasi <br className="md:hidden" />
                            <span className="font-serif italic text-gray-400 font-normal">
                                Minggu Ini
                            </span>
                        </h2>
                    </div>
                    <Link
                        href="/explore"
                        className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-hover transition-all shadow-lg"
                    >
                        Eksplorasi Barang
                    </Link>
                </div>

                {recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {recommendations.map((product) => (
                            <Link
                                href={`/product/${product.id}`}
                                key={product.id}
                                className="group cursor-pointer block"
                            >
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                                    <img
                                        src={
                                            product.img ||
                                            "/images/placeholder-product.png"
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/images/placeholder-product.png";
                                        }}
                                    />
                                    {product.tag && (
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm border border-gray-100">
                                            {product.tag}
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <ArrowRight className="w-5 h-5 text-gray-900" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-gray-500 text-sm">
                                            {product.loc}
                                        </span>
                                        <span className="font-bold text-primary">
                                            {Number(
                                                product.price,
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">
                            Belum ada produk tersedia. Jadilah penjual pertama!
                        </p>
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
