import React from "react";
import { Head, Link } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    Plus,
    TrendingUp,
    Package,
    ShoppingBag,
    ArrowUpRight,
    Clock,
} from "lucide-react";

export default function Dashboard({ auth }) {
    // Data dummy untuk tampilan
    const stats = [
        {
            title: "Pendapatan Bulan Ini",
            value: "Rp 1.450.000",
            trend: "+15%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            title: "Pesanan Aktif",
            value: "3",
            trend: "2 Baru",
            icon: ShoppingBag,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            title: "Total Produk",
            value: "12",
            trend: "Stabil",
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
    ];

    const recentOrders = [
        {
            id: "#ORD-001",
            buyer: "Nadia H.",
            product: "Buku Kalkulus Edisi 9",
            price: "Rp 120.000",
            status: "Menunggu Konfirmasi",
        },
        {
            id: "#ORD-002",
            buyer: "Budi S.",
            product: "Meja Belajar Minimalis",
            price: "Rp 350.000",
            status: "Dikirim",
        },
    ];

    return (
        <SellerLayout user={auth.user}>
            <Head title="Dashboard Toko - ReCircle" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Ringkasan Toko
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Pantau performa dan pesanan terbaru tokomu hari ini.
                        </p>
                    </div>
                    <Link
                        href={route("products.index")}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
                    >
                        <Plus className="w-5 h-5" /> Tambah Barang
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                                >
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                                    <ArrowUpRight className="w-3 h-3" />{" "}
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-semibold text-gray-400">
                                {stat.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            Pesanan Terbaru
                        </h2>
                        <Link
                            href={route("orders.index")}
                            className="text-sm font-bold text-primary hover:text-primary-hover"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-8 py-4">ID Pesanan</th>
                                    <th className="px-8 py-4">Pembeli</th>
                                    <th className="px-8 py-4">Produk</th>
                                    <th className="px-8 py-4">Total</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-8 py-5 font-bold text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-8 py-5 font-medium text-gray-600">
                                            {order.buyer}
                                        </td>
                                        <td className="px-8 py-5 text-gray-500">
                                            {order.product}
                                        </td>
                                        <td className="px-8 py-5 font-bold text-gray-900">
                                            {order.price}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                                                <Clock className="w-3.5 h-3.5" />{" "}
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
