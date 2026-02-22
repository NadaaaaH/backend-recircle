import React from "react";
import { Head } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function Finance({ auth }) {
    // Dummy Data untuk Grafik
    const chartData = [
        { label: "Sen", value: 40 },
        { label: "Sel", value: 70 },
        { label: "Rab", value: 30 },
        { label: "Kam", value: 90 },
        { label: "Jum", value: 60 },
        { label: "Sab", value: 100 }, // Puncak grafik
        { label: "Min", value: 80 },
    ];

    const history = [
        {
            id: "WD-001",
            date: "22 Feb 2026",
            type: "Penarikan",
            amount: "- Rp 500.000",
            status: "Berhasil",
            method: "Bank BCA",
        },
        {
            id: "ORD-092",
            date: "21 Feb 2026",
            type: "Penjualan",
            amount: "+ Rp 350.000",
            status: "Masuk",
            method: "Meja Belajar",
        },
        {
            id: "ORD-091",
            date: "20 Feb 2026",
            type: "Penjualan",
            amount: "+ Rp 120.000",
            status: "Tertunda",
            method: "Buku Kalkulus",
        },
    ];

    return (
        <SellerLayout user={auth.user}>
            <Head title="Keuangan Toko - ReCircle" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Keuangan Toko
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Pantau saldo pendapatan dan tarik dana ke rekeningmu.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Saldo Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                            {/* Dekorasi Card */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

                            <div className="flex items-center gap-3 text-slate-300 mb-6">
                                <Wallet className="w-5 h-5" />
                                <span className="font-bold text-sm tracking-widest uppercase">
                                    Saldo Aktif
                                </span>
                            </div>
                            <h2 className="text-4xl font-black mb-8">
                                Rp 1.450.000
                            </h2>

                            <button className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
                                Tarik Dana Sekarang
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Dana Tertunda
                                </p>
                                <p className="text-xl font-black text-slate-900">
                                    Rp 120.000
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Grafik Pendapatan */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    Statistik Pendapatan
                                </h3>
                                <p className="text-sm font-medium text-slate-500">
                                    7 Hari Terakhir
                                </p>
                            </div>
                            <span className="font-black text-primary bg-primary/10 px-4 py-2 rounded-xl text-sm">
                                +24%
                            </span>
                        </div>

                        {/* CSS Simple Bar Chart */}
                        <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 mt-auto pt-10 h-64">
                            {chartData.map((data, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center w-full group"
                                >
                                    <div className="relative w-full flex justify-center h-48 items-end">
                                        <div
                                            className={`w-full max-w-[3rem] rounded-xl transition-all duration-500 group-hover:opacity-80 ${
                                                data.value === 100
                                                    ? "bg-primary"
                                                    : "bg-slate-100"
                                            }`}
                                            style={{ height: `${data.value}%` }}
                                        >
                                            {/* Tooltip Hover */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                {data.value}%
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`mt-4 text-sm font-bold ${data.value === 100 ? "text-primary" : "text-slate-400"}`}
                                    >
                                        {data.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabel Riwayat */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold text-slate-900">
                            Riwayat Transaksi
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-8 py-4">ID Transaksi</th>
                                    <th className="px-8 py-4">Keterangan</th>
                                    <th className="px-8 py-4">Nominal</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {history.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900">
                                                {item.id}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {item.date}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-700">
                                                {item.type}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {item.method}
                                            </p>
                                        </td>
                                        <td
                                            className={`px-8 py-5 font-black text-lg ${item.amount.includes("+") ? "text-primary" : "text-slate-900"}`}
                                        >
                                            {item.amount}
                                        </td>
                                        <td className="px-8 py-5">
                                            {item.status === "Berhasil" ||
                                            item.status === "Masuk" ? (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                                    {item.status}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                                                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                                                    {item.status}
                                                </span>
                                            )}
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
