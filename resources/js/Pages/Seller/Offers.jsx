import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Check, X, Clock, ArrowLeft } from 'lucide-react';

export default function SellerOffers({ offers }) {
    const { flash } = usePage().props;
    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    const statusColors = {
        pending: 'bg-amber-100 text-amber-700',
        accepted: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        cancelled: 'bg-gray-100 text-gray-500',
    };

    const statusLabels = {
        pending: 'Menunggu',
        accepted: 'Diterima',
        rejected: 'Ditolak',
        cancelled: 'Dibatalkan',
    };

    const handleAccept = (offerId) => {
        if (confirm('Terima tawaran ini? Tawaran lainnya akan otomatis ditolak.')) {
            router.post(`/offers/${offerId}/accept`);
        }
    };

    const handleReject = (offerId) => {
        if (confirm('Tolak tawaran ini?')) {
            router.post(`/offers/${offerId}/reject`);
        }
    };

    return (
        <MainLayout>
            <Head title="Penawaran Masuk" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <a href="/seller/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Kembali ke Dashboard</span>
                    </a>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Penawaran Masuk</h1>

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{flash.success}</div>
                    )}

                    {offers.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada penawaran masuk</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {offers.map((offer) => (
                                <div key={offer.id} className="bg-white rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <img src={offer.product.img} alt={offer.product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{offer.product?.name || 'Produk'}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">dari {offer.buyer?.name || 'Pembeli'}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[offer.status]}`}>
                                                    {statusLabels[offer.status]}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3">
                                                <div>
                                                    <p className="text-xs text-gray-400">Harga asli</p>
                                                    <p className="text-sm font-medium text-gray-600">{formatPrice(offer.product?.price || 0)}</p>
                                                </div>
                                                <div className="text-gray-300">→</div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Tawaran</p>
                                                    <p className="text-sm font-bold text-primary">{formatPrice(offer.harga_tawar)}</p>
                                                </div>
                                                <div className="text-xs text-gray-400 ml-auto">{offer.created_at}</div>
                                            </div>
                                            {offer.pesan && (
                                                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mt-3">"{offer.pesan}"</p>
                                            )}
                                            {offer.status === 'pending' && (
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={() => handleAccept(offer.id)}
                                                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" /> Terima
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(offer.id)}
                                                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" /> Tolak
                                                    </button>
                                                </div>
                                            )}
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
