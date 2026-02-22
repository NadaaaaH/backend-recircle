import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    Search,
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    MoreHorizontal,
    Filter,
} from "lucide-react";

export default function Orders({ auth }) {
    const [activeTab, setActiveTab] = useState("Semua");
    const [search, setSearch] = useState("");

    const tabs = ["Semua", "Menunggu Konfirmasi", "Sedang Dikirim", "Selesai"];

    // Dummy Data Pesanan
    const orders = [
        {
            id: "#ORD-092",
            buyer: "Nadia H.",
            product: "Meja Belajar Kayu",
            price: "Rp 350.000",
            date: "24 Feb 2026",
            status: "Menunggu Konfirmasi",
        },
        {
            id: "#ORD-091",
            buyer: "Budi S.",
            product: "Buku Kalkulus",
            price: "Rp 120.000",
            date: "23 Feb 2026",
            status: "Sedang Dikirim",
        },
        {
            id: "#ORD-089",
            buyer: "Siti A.",
            product: "Lampu Tidur",
            price: "Rp 85.000",
            date: "20 Feb 2026",
            status: "Selesai",
        },
    ];

    // Logika Filter
    const filteredOrders = orders.filter((order) => {
        const matchTab = activeTab === "Semua" || order.status === activeTab;
        const matchSearch =
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.product.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    // Helper Fungsi untuk Status Badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "Menunggu Konfirmasi":
                return (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" /> Menunggu
                    </span>
                );
            case "Sedang Dikirim":
                return (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <Truck className="w-3.5 h-3.5" /> Dikirim
                    </span>
                );
            case "Selesai":
                return (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <SellerLayout user={auth.user}>
            <Head title="Daftar Pesanan - ReCircle" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Daftar Pesanan
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">
                            Kelola semua pesanan masuk dari pembeli.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari No. Resi atau Produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-11 pr-4 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 w-full md:w-72 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-slate-400 hover:text-primary transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Sistem Tab Modern */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex overflow-x-auto border-b border-gray-50 scrollbar-hide px-4 pt-4 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
                                    activeTab === tab
                                        ? "text-primary border-primary"
                                        : "text-slate-400 border-transparent hover:text-slate-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tabel Pesanan yang Responsif */}
                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="text-xs uppercase font-black tracking-wider text-slate-300">
                                <tr>
                                    <th className="px-6 py-4">Pesanan</th>
                                    <th className="px-6 py-4">Pembeli</th>
                                    <th className="px-6 py-4">Total Tagihan</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900">
                                                {order.id}
                                            </p>
                                            <p className="text-slate-500 font-medium mt-1 truncate max-w-[200px]">
                                                {order.product}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-slate-600">
                                            {order.buyer}
                                        </td>
                                        <td className="px-6 py-5 font-black text-slate-900">
                                            {order.price}
                                        </td>
                                        <td className="px-6 py-5 text-slate-500 font-medium">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="p-2 text-slate-300 hover:text-primary transition-colors bg-white rounded-xl shadow-sm border border-gray-50">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Tampilan jika data kosong */}
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-20 px-6">
                                <PackageCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="font-black text-slate-900 text-lg">
                                    Tidak ada pesanan ditemukan
                                </h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Belum ada transaksi di kategori "{activeTab}
                                    ".
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
