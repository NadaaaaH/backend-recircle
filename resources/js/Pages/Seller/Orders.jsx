import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Truck, ArrowLeft, Package } from 'lucide-react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function SellerOrders({ orders }) {
    const { flash } = usePage().props;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [orderToShip, setOrderToShip] = useState(null);
    const [isShipping, setIsShipping] = useState(false);

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

    const triggerShip = (orderId) => {
        setOrderToShip(orderId);
        setIsConfirmOpen(true);
    };

    const confirmShip = () => {
        if (!orderToShip) return;
        setIsShipping(true);
        router.post(`/seller/orders/${orderToShip}/ship`, {}, {
            onFinish: () => {
                setIsShipping(false);
                setIsConfirmOpen(false);
                setOrderToShip(null);
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Pesanan Masuk" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <a href="/seller/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Kembali ke Dashboard</span>
                    </a>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Masuk</h1>

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{flash.success}</div>
                    )}

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada pesanan masuk</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <img src={order.product.img} alt={order.product.name} className="w-16 h-16 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.product.name}</p>
                                                    <p className="text-sm text-gray-500">Pembeli: {order.buyer.name}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{order.kode_pesanan}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
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
                                                {order.status === 'dibayar' && (
                                                    <button
                                                        onClick={() => triggerShip(order.id)}
                                                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                                                    >
                                                        <Truck className="w-4 h-4" /> Kirim
                                                    </button>
                                                )}
                                            </div>
                                            {order.alamat_pengiriman && (
                                                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mt-3">📍 {order.alamat_pengiriman}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmShip}
                title="Konfirmasi Pengiriman"
                subtitle="Apakah Anda yakin telah mengirimkan barang ini dan ingin memperbarui statusnya menjadi 'Dikirim'?"
                confirmText="Tandai Dikirim"
                cancelText="Batal"
                type="info"
                isLoading={isShipping}
            />
        </MainLayout>
    );
}
