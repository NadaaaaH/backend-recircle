import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/Layouts/MainLayout';
import { ShoppingBag, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

export default function BuyerOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [flash, setFlash] = useState({});
    
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

    useEffect(() => {
        document.title = "Pesanan Saya | ReCircle";
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            let resultData = response.data?.data;
            
            // Handle Laravel pagination inside ApiResponse wrapper
            if (resultData && Array.isArray(resultData.data)) {
                setOrders(resultData.data);
            } 
            // Handle flat array just in case
            else if (Array.isArray(resultData)) {
                setOrders(resultData);
            } 
            else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Gagal memuat pesanan:", error);
            setFlash({ error: "Gagal mengambil daftar pesanan. Silakan refresh halaman." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (orderId) => {
        if (confirm('Konfirmasi barang sudah diterima? Dana akan dilepas ke penjual.')) {
            try {
                await api.post(`/orders/${orderId}/confirm`);
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'selesai' } : o));
                setFlash({ success: "Pesanan berhasil diselesaikan. Dana diteruskan ke penjual." });
                setTimeout(() => setFlash({}), 3000);
            } catch (error) {
                alert(error.response?.data?.message || "Gagal mengonfirmasi penerimaan barang.");
            }
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Saya</h1>

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">{flash.error}</div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                            <p className="text-gray-500 font-medium">Memuat pesanan...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Belum ada pesanan</p>
                            <Link to="/explore" className="inline-block mt-4 text-primary font-bold hover:underline">Mulai Belanja</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                            <img 
                                                src={order.product?.images?.[0] || 'https://placehold.co/400x400/eeeeee/999999?text=No+Image'} 
                                                alt={order.product?.name} 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/eeeeee/999999?text=No+Image'; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <Link to={`/orders/${order.id}`} className="hover:text-primary transition-colors block flex-1">
                                                    <p className="font-bold text-gray-900 text-lg line-clamp-1">{order.product?.name || 'Produk'}</p>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">{order.product?.seller?.name || 'Penjual'}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{order.orderCode} &bull; {new Date(order.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})}</p>
                                                </Link>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${statusColors[order.status] || statusColors.pending}`}>
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-primary">{formatPrice(order.totalPrice)}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                                                        {order.shippingMethod === 'cod' ? 'COD' : 'Kirim Paket'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link 
                                                        to={`/orders/${order.id}`}
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
