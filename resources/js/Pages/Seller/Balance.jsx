import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Wallet, ArrowLeft, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function SellerBalance({ balances, total_dilepas }) {
    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    const statusIcons = {
        ditahan: <Clock className="w-4 h-4 text-amber-500" />,
        dilepas: <CheckCircle className="w-4 h-4 text-green-500" />,
        ditarik: <TrendingUp className="w-4 h-4 text-blue-500" />,
    };

    const statusLabels = {
        ditahan: 'Ditahan (Escrow)',
        dilepas: 'Dilepas',
        ditarik: 'Dicairkan',
    };

    return (
        <MainLayout>
            <Head title="Saldo Penjualan" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <a href="/seller/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Kembali ke Dashboard</span>
                    </a>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Saldo Penjualan</h1>
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Dana Dilepas</p>
                            <p className="text-2xl font-bold text-primary">{formatPrice(total_dilepas)}</p>
                        </div>
                    </div>

                    {balances.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada riwayat saldo</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {balances.map((b) => (
                                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {statusIcons[b.status]}
                                        <div>
                                            <p className="font-medium text-gray-900">{b.product_name}</p>
                                            <p className="text-xs text-gray-400">{b.kode_pesanan} · {b.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatPrice(b.jumlah)}</p>
                                        <p className="text-xs text-gray-400">{statusLabels[b.status]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
