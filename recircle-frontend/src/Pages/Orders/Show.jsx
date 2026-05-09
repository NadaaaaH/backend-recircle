import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '@/Layouts/MainLayout';
import {
    ArrowLeft,
    Package,
    CreditCard,
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Truck,
    ShieldCheck
} from 'lucide-react';

export default function Show() {
    const { id } = useParams();
    const order = { id: id, kode_pesanan: 'ORD-001', created_at: '10 Okt 2023', total_harga: 12000000, metode_pengiriman: 'kirim_paket', metode_pembayaran: 'bank_transfer', status: 'dikirim', alamat_pengiriman: 'Jl. Raya Dramaga', catatan: 'Tolong packing kayu', is_pending: false };
    const product = { name: 'MacBook Pro M1', seller_name: 'Apple Store', seller_kampus: 'IPB', img: null };
    const snap_token = null;
    const midtrans_client_key = null;
    const [isPaying, setIsPaying] = useState(false);

    // Initialize Midtrans Snap Script
    useEffect(() => {
        if (snap_token && midtrans_client_key) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Sandbox URL
            script.setAttribute('data-client-key', midtrans_client_key);
            script.async = true;
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [snap_token, midtrans_client_key]);

    const handlePayNow = () => {
        if (window.snap && snap_token) {
            setIsPaying(true);
            window.snap.pay(snap_token, {
                onSuccess: function (result) {
                    setIsPaying(false);
                    alert("Pembayaran Berhasil");
                },
                onPending: function (result) {
                    setIsPaying(false);
                    alert("Pembayaran Pending");
                },
                onError: function (result) {
                    setIsPaying(false);
                    alert("Pembayaran gagal atau dibatalkan.");
                },
                onClose: function () {
                    setIsPaying(false);
                }
            });
        } else {
            alert('Sistem pembayaran belum siap. Silakan refresh halaman.');
        }
    };

    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    // Mappings for status aesthetics
    const statusConfig = {
        pending: {
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: <Clock className="w-5 h-5" />,
            label: 'Menunggu Pembayaran'
        },
        dibayar: {
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: <CreditCard className="w-5 h-5" />,
            label: 'Sudah Dibayar'
        },
        dikirim: {
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            icon: <Truck className="w-5 h-5" />,
            label: 'Sedang Dikirim'
        },
        selesai: {
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: <CheckCircle2 className="w-5 h-5" />,
            label: 'Selesai'
        },
        dibatalkan: {
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: <XCircle className="w-5 h-5" />,
            label: 'Dibatalkan'
        }
    };

    const currentStatus = statusConfig[order.status] || statusConfig.pending;

    // Ordered steps logic
    const timelineSteps = [
        { key: 'pending', label: 'Pesanan Dibuat', done: true },
        { 
            key: 'dibayar', 
            label: 'Pembayaran Diterima', 
            done: ['dibayar', 'dikirim', 'selesai'].includes(order.status) 
        },
        { 
            key: 'dikirim', 
            label: 'Pesanan Dikirim', 
            done: ['dikirim', 'selesai'].includes(order.status) 
        },
        { 
            key: 'selesai', 
            label: 'Pesanan Selesai', 
            done: order.status === 'selesai' 
        }
    ];

    useEffect(() => {
        document.title = `Pesanan ${order.kode_pesanan} | ReCircle`;
    }, [order.kode_pesanan]);

    return (
        <MainLayout>
            
            <div className="min-h-screen bg-[#f7f9f7] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link 
                            to="/orders"
                            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-400 hover:text-primary border border-gray-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                Detail Pesanan
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}>
                                    {currentStatus.icon}
                                    {currentStatus.label}
                                </span>
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                                <span className="uppercase tracking-wider">#{order.kode_pesanan}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <Calendar className="w-4 h-4" />
                                {order.created_at}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* MAIN CONTENT: Items & Delivery Info */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* Product Card */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    Barang yang Dibeli
                                </h2>
                                
                                <div className="flex gap-6 items-start">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-inner">
                                        <img 
                                            src={product.img || 'https://placehold.co/400x400/eeeeee/999999?text=No+Image'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/eeeeee/999999?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                                        <p className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                                            Penjual: <span className="text-gray-900">{product.seller_name}</span> 
                                            <span className="text-gray-300 mx-1">•</span> 
                                            {product.seller_kampus}
                                        </p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-sm font-medium text-gray-500">1 x {formatPrice(order.total_harga)}</span>
                                            <span className="text-lg font-black text-gray-900">{formatPrice(order.total_harga)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery & Notes Card */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            Info Pengiriman
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-medium text-gray-400 mb-1">Metode</p>
                                                <p className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 inline-flex">
                                                    {order.metode_pengiriman === 'cod' ? 'Cash on Delivery (COD)' : 'Kirim Paket'}
                                                </p>
                                            </div>
                                            {order.metode_pengiriman === 'kirim_paket' && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-400 mb-1">Alamat Pengiriman</p>
                                                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                        {order.alamat_pengiriman || 'Tidak ada alamat tercatat.'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-primary pl-3">
                                            Metode Pembayaran
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 hover:text-primary transition-colors cursor-default">
                                                        {order.metode_pembayaran ? order.metode_pembayaran.replace('_', ' ').toUpperCase() : 'Midtrans Payment'}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-500">Otomatis & Aman</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Catatan */}
                                        {order.catatan && (
                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <p className="text-xs font-medium text-gray-400 mb-2">Catatan untuk Penjual</p>
                                                <p className="text-sm font-medium text-gray-700 italic border-l-2 border-gray-300 pl-3">"{order.catatan}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* SIDEBAR: Order Summary & Timeline */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Payment Action Box */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                {/* Decorative accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] z-0 pointer-events-none"></div>
                                
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Pesanan</h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                            <span>Subtotal (1 Barang)</span>
                                            <span className="text-gray-900">{formatPrice(order.total_harga)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                            <span>Ongkos Kirim</span>
                                            <span className="text-gray-900">{order.metode_pengiriman === 'cod' ? 'Rp 0' : 'Menyusul (Resi)'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                            <span>Biaya Layanan</span>
                                            <span className="text-gray-900">Rp 0</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-gray-900">Total Belanja</span>
                                            <span className="text-2xl font-black text-primary">{formatPrice(order.total_harga)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons based on status */}
                                    {order.is_pending && order.metode_pengiriman === 'kirim_paket' && (
                                        <button 
                                            onClick={handlePayNow}
                                            disabled={isPaying || !snap_token}
                                            className="w-full bg-[#43552c] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#43552c]/20 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isPaying ? 'Memproses...' : 'Selesaikan Pembayaran'}
                                        </button>
                                    )}

                                    {order.metode_pengiriman === 'cod' && order.is_pending && (
                                        <div className="w-full bg-primary/10 text-primary border border-primary/20 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm text-center px-4">
                                            Menunggu COD. Hubungi penjual.
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 font-medium">
                                        <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <p>Dana tertahan aman di sistem kami hingga kamu mengonfirmasi barang telah diterima.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            {order.status !== 'dibatalkan' && (
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Status Perjalanan</h3>
                                    <div className="relative pl-3">
                                        {/* Vertical Line Connector */}
                                        <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100"></div>
                                        
                                        <div className="space-y-6">
                                            {timelineSteps.map((step, index) => {
                                                const isDone = step.done;
                                                return (
                                                    <div key={step.key} className="relative flex items-start gap-4 z-10">
                                                        <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${isDone ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-200'}`}></div>
                                                        <div>
                                                            <p className={`text-sm font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                {step.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
