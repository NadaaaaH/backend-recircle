import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShieldCheck, CreditCard, MapPin, Package, Truck, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Checkout({ product, offer, final_price, snap_token, midtrans_client_key, order }) {
    const { flash } = usePage().props;
    const [metodePengiriman, setMetodePengiriman] = useState('cod');
    const [alamat, setAlamat] = useState('');
    const [catatan, setCatatan] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Load Midtrans Snap.js
    useEffect(() => {
        if (midtrans_client_key) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', midtrans_client_key);
            script.async = true;
            document.head.appendChild(script);
            return () => document.head.removeChild(script);
        }
    }, [midtrans_client_key]);

    // Jika ada snap_token baru dari server, langsung buka popup
    useEffect(() => {
        if (snap_token && window.snap) {
            window.snap.pay(snap_token, {
                onSuccess: () => setPaymentSuccess(true),
                onPending: () => setPaymentSuccess(true),
                onError: () => alert('Pembayaran gagal. Silakan coba lagi.'),
                onClose: () => {},
            });
        }
    }, [snap_token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/checkout', {
            product_id: product.id,
            offer_id: offer?.id || null,
            metode_pengiriman: metodePengiriman,
            alamat_pengiriman: alamat,
            catatan: catatan,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    if (paymentSuccess) {
        return (
            <MainLayout>
                <Head title="Pembayaran Berhasil" />
                <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
                    <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-lg">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
                        <p className="text-gray-500 mb-6">Order kamu sedang diproses. Penjual akan segera mengirim barang.</p>
                        <a
                            href="/orders"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors font-medium"
                        >
                            Lihat Pesanan Saya
                        </a>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Checkout" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    {/* Header */}
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Kembali</span>
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Metode Pengiriman */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-primary" />
                                    Metode Pengiriman
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${metodePengiriman === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <input type="radio" name="metode" value="cod" checked={metodePengiriman === 'cod'} onChange={() => setMetodePengiriman('cod')} className="sr-only" />
                                        <MapPin className={`w-5 h-5 ${metodePengiriman === 'cod' ? 'text-primary' : 'text-gray-400'}`} />
                                        <div>
                                            <p className="font-medium text-gray-900">COD</p>
                                            <p className="text-sm text-gray-500">Ketemuan di kampus</p>
                                        </div>
                                    </label>
                                    <label
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${metodePengiriman === 'kirim_paket' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <input type="radio" name="metode" value="kirim_paket" checked={metodePengiriman === 'kirim_paket'} onChange={() => setMetodePengiriman('kirim_paket')} className="sr-only" />
                                        <Package className={`w-5 h-5 ${metodePengiriman === 'kirim_paket' ? 'text-primary' : 'text-gray-400'}`} />
                                        <div>
                                            <p className="font-medium text-gray-900">Kirim Paket</p>
                                            <p className="text-sm text-gray-500">Bayar via Midtrans</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Alamat (kirim paket) */}
                            {metodePengiriman === 'kirim_paket' && (
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Alamat Pengiriman
                                    </h3>
                                    <textarea
                                        value={alamat}
                                        onChange={(e) => setAlamat(e.target.value)}
                                        placeholder="Masukkan alamat lengkap untuk pengiriman..."
                                        rows={3}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm resize-none"
                                    />
                                </div>
                            )}

                            {/* Catatan */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                    Catatan (opsional)
                                </h3>
                                <textarea
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                    placeholder="Pesan untuk penjual..."
                                    rows={2}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm resize-none"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm sticky top-28">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h3>
                                <div className="flex gap-4 mb-6">
                                    <img src={product.img} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.seller_name}</p>
                                        <p className="text-sm text-gray-500">{product.loc}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Harga barang</span>
                                        <span className="text-gray-700">{formatPrice(product.price)}</span>
                                    </div>
                                    {offer && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary font-medium">Harga deal</span>
                                            <span className="text-primary font-medium">{formatPrice(offer.harga_deal)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Metode</span>
                                        <span className="text-gray-700">{metodePengiriman === 'cod' ? 'COD' : 'Kirim Paket'}</span>
                                    </div>
                                </div>

                                <div className="border-t mt-4 pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-xl text-primary">{formatPrice(final_price)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={processing || (metodePengiriman === 'kirim_paket' && !alamat.trim())}
                                    className="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {metodePengiriman === 'kirim_paket' ? (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            {processing ? 'Memproses...' : 'Bayar Sekarang'}
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            {processing ? 'Memproses...' : 'Buat Pesanan COD'}
                                        </>
                                    )}
                                </button>

                                {metodePengiriman === 'kirim_paket' && (
                                    <p className="text-xs text-gray-400 text-center mt-3">
                                        Pembayaran aman melalui Midtrans. Dana ditahan hingga kamu konfirmasi terima barang.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
