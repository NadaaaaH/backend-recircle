import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { MessageSquare, Clock, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';

export default function BuyerOffers({ offers }) {
    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    const statusConfig = {
        pending: { icon: <Clock className="w-4 h-4" />, bg: 'bg-amber-100 text-amber-700', label: 'Menunggu' },
        accepted: { icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-green-100 text-green-700', label: 'Diterima' },
        rejected: { icon: <XCircle className="w-4 h-4" />, bg: 'bg-red-100 text-red-700', label: 'Ditolak' },
        cancelled: { icon: <XCircle className="w-4 h-4" />, bg: 'bg-gray-100 text-gray-500', label: 'Dibatalkan' },
    };

    return (
        <MainLayout>
            <Head title="Penawaran Saya" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Penawaran Saya</h1>

                    {offers.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada penawaran</p>
                            <a href="/explore" className="inline-block mt-4 text-primary font-medium hover:underline">Jelajahi Produk</a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {offers.map((offer) => {
                                const config = statusConfig[offer.status];
                                return (
                                    <div key={offer.id} className="bg-white rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <Link href={`/product/${offer.product.id}`}>
                                                <img src={offer.product.img} alt={offer.product.name} className="w-16 h-16 rounded-xl object-cover" />
                                            </Link>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <Link href={`/product/${offer.product.id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors">
                                                            {offer.product.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500">{offer.product.seller_name}</p>
                                                    </div>
                                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg}`}>
                                                        {config.icon} {config.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400">Harga asli</p>
                                                        <p className="text-sm text-gray-600">{formatPrice(offer.product.price)}</p>
                                                    </div>
                                                    <div className="text-gray-300">→</div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Tawaranmu</p>
                                                        <p className="text-sm font-bold text-primary">{formatPrice(offer.harga_tawar)}</p>
                                                    </div>
                                                    {offer.harga_deal && (
                                                        <>
                                                            <div className="text-gray-300">→</div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Deal</p>
                                                                <p className="text-sm font-bold text-green-600">{formatPrice(offer.harga_deal)}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                    <span className="text-xs text-gray-400 ml-auto">{offer.created_at}</span>
                                                </div>
                                                {/* CTA for accepted non-expired offers */}
                                                {offer.status === 'accepted' && !offer.is_expired && (
                                                    <Link
                                                        href={`/checkout/${offer.product.id}?offer_id=${offer.id}`}
                                                        className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" /> Checkout Sekarang
                                                    </Link>
                                                )}
                                                {offer.status === 'accepted' && offer.is_expired && (
                                                    <p className="text-xs text-red-500 mt-3">⏰ Deal sudah kedaluwarsa</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
