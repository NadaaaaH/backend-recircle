import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Wallet, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function SellerBalance({ balances, total_dilepas }) {
    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    const statusIcons = {
        ditahan: <Clock className="w-4 h-4 text-amber-500" />,
        dilepas: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        ditarik: <TrendingUp className="w-4 h-4 text-blue-500" />,
    };

    const statusLabels = {
        ditahan: 'Ditahan (Escrow)',
        dilepas: 'Dilepas',
        ditarik: 'Dicairkan',
    };

    return (
        <div className="pb-12 max-w-[1000px] mx-auto">
            <Head>
                <title>Saldo Penjualan | ReCircle</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Saldo Penjualan</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Pantau riwayat pencairan dan saldo yang tertahan</p>
            </div>

            <div className="bg-white rounded-[1.25rem] p-6 md:p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/70 mb-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-[#4A5D23]/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-7 h-7 text-[#4A5D23]" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Dana Dilepas</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{formatPrice(total_dilepas)}</p>
                </div>
            </div>

            {balances.length === 0 ? (
                <div className="bg-white rounded-[1.25rem] p-12 text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/70 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Wallet className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada riwayat saldo</h3>
                    <p className="text-slate-500 text-sm font-medium">Riwayat transaksi penjualan Anda akan muncul di sini.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[1.25rem] shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/70 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {balances.map((b) => (
                            <div key={b.id} className="p-5 md:p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                                        b.status === 'ditahan' ? 'bg-amber-50 border-amber-100' :
                                        b.status === 'dilepas' ? 'bg-emerald-50 border-emerald-100' :
                                        'bg-blue-50 border-blue-100'
                                    }`}>
                                        {statusIcons[b.status]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-base">{b.product_name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{b.kode_pesanan} &bull; {b.created_at}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <p className="font-black text-slate-900 text-lg tracking-tight">{formatPrice(b.jumlah)}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border mt-1 ${
                                        b.status === 'ditahan' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        b.status === 'dilepas' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {statusLabels[b.status]}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

SellerBalance.layout = page => <SellerLayout>{page}</SellerLayout>;
