import React from "react";
import { Head } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    TrendingUp
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
        <div className="pb-12 max-w-[1200px] mx-auto">
            <Head>
                <title>Keuangan Toko | ReCircle</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Keuangan Toko
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    Pantau saldo pendapatan dan tarik dana ke rekeningmu.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Kolom Kiri: Saldo Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-[#4A5D23]/30 transition-all">
                        {/* Decorative Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A5D23]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="w-12 h-12 bg-[#4A5D23]/10 text-[#4A5D23] rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <span className="bg-[#4A5D23]/10 text-[#4A5D23] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                Saldo Siap Tarik
                            </span>
                        </div>
                        
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">Saldo Aktif</p>
                            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
                                Rp 1.450.000
                            </h2>
                            <button className="w-full bg-[#4A5D23] text-white font-bold py-3.5 rounded-xl hover:bg-[#3B4A1C] shadow-sm transition-all flex items-center justify-center gap-2">
                                <ArrowUpRight className="w-5 h-5" /> Tarik Dana Sekarang
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                                Dana Tertunda
                            </p>
                            <p className="text-xl font-black text-slate-900 leading-tight">
                                Rp 120.000
                            </p>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Grafik Pendapatan */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Statistik Pendapatan
                            </h3>
                            <p className="text-sm font-medium text-slate-500">
                                7 Hari Terakhir
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-bold text-sm">+24%</span>
                        </div>
                    </div>

                    {/* CSS Simple Bar Chart */}
                    <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 mt-auto pt-10 h-64 border-b border-slate-100 pb-2 relative">
                        {/* Background lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-2 pointer-events-none">
                            <div className="w-full border-t border-slate-100 border-dashed"></div>
                            <div className="w-full border-t border-slate-100 border-dashed"></div>
                            <div className="w-full border-t border-slate-100 border-dashed"></div>
                            <div className="w-full"></div>
                        </div>

                        {chartData.map((data, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center w-full group relative z-10"
                            >
                                <div className="relative w-full flex justify-center h-48 items-end">
                                    <div
                                        className={`w-full max-w-[2.5rem] rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                                            data.value === 100
                                                ? "bg-[#4A5D23]"
                                                : "bg-slate-200"
                                        }`}
                                        style={{ height: `${data.value}%` }}
                                    >
                                        {/* Tooltip Hover */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                            {data.value}%
                                            {/* Arrow indicator */}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={`mt-3 text-[11px] font-bold uppercase tracking-wider ${data.value === 100 ? "text-[#4A5D23]" : "text-slate-400"}`}
                                >
                                    {data.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabel Riwayat */}
            <div className="mt-8 bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                        Riwayat Transaksi
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 md:px-8 py-4 border-b border-slate-100">ID Transaksi</th>
                                <th className="px-6 md:px-8 py-4 border-b border-slate-100">Keterangan</th>
                                <th className="px-6 md:px-8 py-4 border-b border-slate-100">Nominal</th>
                                <th className="px-6 md:px-8 py-4 border-b border-slate-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((item, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-6 md:px-8 py-4 md:py-5">
                                        <p className="font-bold text-slate-900">
                                            {item.id}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {item.date}
                                        </p>
                                    </td>
                                    <td className="px-6 md:px-8 py-4 md:py-5">
                                        <p className="font-bold text-slate-700">
                                            {item.type}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {item.method}
                                        </p>
                                    </td>
                                    <td
                                        className={`px-6 md:px-8 py-4 md:py-5 font-black text-base md:text-lg tracking-tight ${item.amount.includes("+") ? "text-emerald-600" : "text-slate-900"}`}
                                    >
                                        {item.amount}
                                    </td>
                                    <td className="px-6 md:px-8 py-4 md:py-5">
                                        {item.status === "Berhasil" || item.status === "Masuk" ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-bold">
                                                <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                                {item.status}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-bold">
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
    );
}

Finance.layout = page => <SellerLayout>{page}</SellerLayout>;
