import React from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShoppingBag, ArrowLeft, Package, CheckCircle2 } from 'lucide-react';

export default function BuyerOrders({ orders }) {
    const { flash } = usePage().props;
    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    const statusColors = {
        pending: 'bg-amber-100 text-amber-700',
        dibayar: 'bg-blue-100 text-blue-700',
        dikirim: 'bg-purple-100 text-purple-700',
        selesai: 'bg-green-100 text-green-700',
        dibatalkan: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        pending: 'Menunggu Bayar',
        dibayar: 'Dibayar',
        dikirim: 'Dikirim',
        selesai: 'Selesai',
        dibatalkan: 'Dibatalkan',
    };

    const handleConfirm = (orderId) => {
        if (confirm('Konfirmasi barang sudah diterima? Dana akan dilepas ke penjual.')) {
            router.post(`/orders/${orderId}/confirm`);
        }
    };

    return (
        <MainLayout>
            <Head title="Pesanan Saya" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Saya</h1>

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{flash.success}</div>
                    )}

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada pesanan</p>
                            <a href="/explore" className="inline-block mt-4 text-primary font-medium hover:underline">Mulai Belanja</a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <img src={order.product.img} alt={order.product.name} className="w-16 h-16 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <Link href={`/orders/${order.id}`} className="hover:text-primary transition-colors block">
                                                    <p className="font-bold text-gray-900 text-lg">{order.product.name}</p>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">{order.product.seller_name}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{order.kode_pesanan} &bull; {order.created_at}</p>
                                                </Link>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                                                    {statusLabels[order.status]}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-primary">{formatPrice(order.total_harga)}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                                                        {order.metode_pengiriman === 'cod' ? 'COD' : 'Kirim Paket'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link 
                                                        href={`/orders/${order.id}`}
                                                        className="px-4 py-2 rounded-xl text-sm font-bold text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                    {order.status === 'dikirim' && (
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); handleConfirm(order.id); }}
                                                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" /> Terima Barang
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
