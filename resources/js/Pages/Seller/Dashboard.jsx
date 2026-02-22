import React from "react";
import { Head, Link } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    TrendingUp,
    Package,
    ShoppingBag,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    ChevronRight,
    AlertCircle,
    Plus,
} from "lucide-react";

export default function Dashboard({ auth }) {
    // Dummy Data untuk visualisasi
    const stats = [
        {
            title: "Pendapatan Kotor",
            value: "Rp 2.450.000",
            trend: "+15% vs bulan lalu",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
        },
        {
            title: "Pesanan Baru",
            value: "8",
            trend: "3 Perlu Dikirim",
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
        },
        {
            title: "Produk Aktif",
            value: "14",
            trend: "2 Stok Habis",
            icon: Package,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
        },
    ];

    const recentOrders = [
        {
            id: "#ORD-092",
            buyer: "Nadia H.",
            product: "Meja Belajar Kayu",
            price: "Rp 350.000",
            status: "Perlu Dikirim",
            date: "Hari ini, 14:30",
        },
        {
            id: "#ORD-091",
            buyer: "Budi S.",
            product: "Buku Kalkulus Edisi 9",
            price: "Rp 120.000",
            status: "Dikirim",
            date: "Kemarin, 09:15",
        },
        {
            id: "#ORD-089",
            buyer: "Siti A.",
            product: "Lampu Tidur",
            price: "Rp 85.000",
            status: "Selesai",
            date: "20 Feb 2026",
        },
    ];

    return (
        <SellerLayout user={auth.user}>
            <Head title="Ringkasan Toko - ReCircle" />

            <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* --- HEADER DESKTOP --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                            Halo, {auth.user?.name}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">
                            Berikut adalah ringkasan performa tokomu hari ini.
                        </p>
                    </div>
                    <Link
                        href={route("products.index")}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-md shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" /> Tambah Produk
                    </Link>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                                >
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                    <ArrowUpRight className="w-3 h-3" />{" "}
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-bold text-gray-400">
                                {stat.title}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* --- TABEL PESANAN TERBARU (KOLOM KIRI - LEBAR) --- */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h2 className="text-base font-bold text-gray-900">
                                Pesanan Terbaru
                            </h2>
                            <Link
                                href={route("orders.index")}
                                className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                            >
                                Kelola <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Pesanan</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map((order, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">
                                                    {order.id}
                                                </p>
                                                <p className="text-gray-500 text-xs mt-0.5">
                                                    {order.product}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 font-black text-gray-900">
                                                {order.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.status ===
                                                    "Perlu Dikirim" && (
                                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">
                                                        <Clock className="w-3.5 h-3.5" />{" "}
                                                        {order.status}
                                                    </span>
                                                )}
                                                {order.status === "Dikirim" && (
                                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100">
                                                        <ArrowUpRight className="w-3.5 h-3.5" />{" "}
                                                        {order.status}
                                                    </span>
                                                )}
                                                {order.status === "Selesai" && (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- TO-DO LIST (KOLOM KANAN - SEMPIT) --- */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                Prioritas Toko{" "}
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/50 cursor-pointer hover:bg-amber-50 transition-colors">
                                <div>
                                    <p className="font-bold text-amber-900 text-sm">
                                        Pesanan Baru
                                    </p>
                                    <p className="text-xs text-amber-700/70 mt-0.5">
                                        Harus segera diproses
                                    </p>
                                </div>
                                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-black flex items-center justify-center text-sm">
                                    3
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/50 cursor-pointer hover:bg-red-50 transition-colors">
                                <div>
                                    <p className="font-bold text-red-900 text-sm">
                                        Stok Habis
                                    </p>
                                    <p className="text-xs text-red-700/70 mt-0.5">
                                        Produk tidak tayang
                                    </p>
                                </div>
                                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-black flex items-center justify-center text-sm">
                                    2
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">
                                        Pesan Belum Dibaca
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Dari pembeli
                                    </p>
                                </div>
                                <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center text-sm">
                                    0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
