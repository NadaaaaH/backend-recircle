import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    X,
    Package,
    Image as ImageIcon,
    CheckCircle,
} from "lucide-react";

export default function Products({ auth }) {
    const [activeTab, setActiveTab] = useState("Semua");
    const [search, setSearch] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [toast, setToast] = useState(null); // Custom Toast State

    const tabs = ["Semua", "Aktif", "Draf", "Terjual", "Arsip"];

    // Fungsi pemicu Toast Notifikasi
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const products = [
        {
            id: 1,
            name: "Sony WH-1000XM4",
            price: "Rp 2.100.000",
            stock: 1,
            status: "Aktif",
            img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400",
        },
        {
            id: 2,
            name: "Monitor 24 inch",
            price: "Rp 950.000",
            stock: 0,
            status: "Draf",
            img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400",
        },
        {
            id: 3,
            name: "Buku Kalkulus Edisi 9",
            price: "Rp 120.000",
            stock: 2,
            status: "Aktif",
            img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=400",
        },
    ];

    const filteredProducts = products.filter((p) => {
        const matchTab = activeTab === "Semua" || p.status === activeTab;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const handleSave = (e) => {
        e.preventDefault();
        setEditingProduct(null);
        showToast("Produk berhasil diperbarui!");
    };

    const handleDelete = () => {
        setEditingProduct(null);
        showToast("Produk telah dihapus secara permanen.", "error");
    };

    return (
        <SellerLayout user={auth.user}>
            <Head title="Manajemen Produk - ReCircle" />

            {/* --- MICRO-INTERACTION: TOAST NOTIFICATION --- */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-slideDown">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border border-slate-700">
                        <CheckCircle
                            className={`w-5 h-5 ${toast.type === "error" ? "text-red-500" : "text-primary"}`}
                        />
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Katalog Produk
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Atur barang, draf, dan stok jualanmu.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama barang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-11 pr-4 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 w-full sm:w-72 transition-all"
                            />
                        </div>
                        <button
                            onClick={() =>
                                setEditingProduct({
                                    name: "",
                                    price: "",
                                    stock: "",
                                    status: "Draf",
                                })
                            }
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
                        >
                            <Plus className="w-5 h-5" /> Tambah Baru
                        </button>
                    </div>
                </div>

                {/* Tab Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
                                activeTab === tab
                                    ? "text-slate-900 border-slate-900"
                                    : "text-slate-400 border-transparent hover:text-slate-600"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid Katalog */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setEditingProduct(product)}
                            className="bg-white rounded-[2rem] p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
                        >
                            <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 relative mb-4">
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-black shadow-sm backdrop-blur-md uppercase tracking-widest ${
                                            product.status === "Aktif"
                                                ? "bg-emerald-500 text-white"
                                                : product.status === "Draf"
                                                  ? "bg-amber-400 text-slate-900"
                                                  : "bg-slate-900 text-white"
                                        }`}
                                    >
                                        {product.status}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur text-slate-900 p-3 rounded-full shadow-xl">
                                        <Edit3 className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between px-2 pb-2">
                                <h3 className="font-bold text-slate-900 truncate mb-2 text-sm sm:text-base">
                                    {product.name}
                                </h3>
                                <div className="flex justify-between items-end">
                                    <p className="font-black text-primary text-sm sm:text-lg">
                                        {product.price}
                                    </p>
                                    <p className="text-xs font-bold text-slate-400">
                                        Stok: {product.stock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm border-dashed">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="font-black text-slate-900 text-lg">
                            Tidak ada produk
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Belum ada barang di tab ini.
                        </p>
                    </div>
                )}
            </div>

            {/* --- ADVANCED UX: MODAL (DESKTOP) / BOTTOM SHEET (MOBILE) --- */}
            {editingProduct && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full sm:max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-fadeIn">
                        {/* Drag Handle untuk Mobile */}
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

                        <button
                            onClick={() => setEditingProduct(null)}
                            className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900">
                                {editingProduct.id
                                    ? "Edit Produk"
                                    : "Tambah Produk Baru"}
                            </h2>
                            {editingProduct.id && (
                                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-lg">
                                    ID: {editingProduct.id}
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Drag & Drop Image Area */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Foto Barang (Maks 5)
                                </label>
                                <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-8 text-center hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer group">
                                    <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3 group-hover:text-primary transition-colors" />
                                    <p className="text-sm font-bold text-slate-600">
                                        Klik atau seret foto ke sini
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Format PNG, JPG max 2MB
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                    Nama Barang
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editingProduct.name}
                                    className="w-full bg-slate-50 border border-transparent rounded-2xl p-4 font-bold text-slate-900 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Harga (Rp)
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={editingProduct.price}
                                        className="w-full bg-slate-50 border border-transparent rounded-2xl p-4 font-bold text-slate-900 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Stok Tersedia
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={editingProduct.stock}
                                        className="w-full bg-slate-50 border border-transparent rounded-2xl p-4 font-bold text-slate-900 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Rich Text Placeholder */}
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                    Deskripsi Lengkap
                                </label>
                                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                                    <div className="bg-slate-50 px-4 py-2 border-b border-gray-200 flex gap-3 text-slate-400">
                                        <span className="font-serif font-bold cursor-pointer hover:text-slate-900">
                                            B
                                        </span>
                                        <span className="font-serif italic cursor-pointer hover:text-slate-900">
                                            I
                                        </span>
                                        <span className="underline cursor-pointer hover:text-slate-900">
                                            U
                                        </span>
                                    </div>
                                    <textarea
                                        rows="4"
                                        className="w-full border-none p-4 font-medium text-slate-700 focus:ring-0 resize-none"
                                        placeholder="Jelaskan kondisi barang, minus, dll..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                {editingProduct.id && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="w-full sm:w-auto flex justify-center items-center gap-2 text-red-500 hover:bg-red-50 px-6 py-4 rounded-2xl font-bold text-sm transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> Hapus
                                        Produk
                                    </button>
                                )}
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(null)}
                                        className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] sm:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-black transition-colors shadow-lg shadow-slate-200"
                                    >
                                        {editingProduct.id
                                            ? "Simpan Perubahan"
                                            : "Terbitkan Produk"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SellerLayout>
    );
}
