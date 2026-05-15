import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    ShoppingCart,
    User,
    Calendar,
    CheckCircle2,
    Clock,
    Truck,
    CreditCard,
    MoreVertical,
    DollarSign,
    Box,
    Loader2
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        document.title = "Admin — Data Transaksi";
        const delayDebounceFn = setTimeout(() => {
            fetchTransactions(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchTransactions = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/transactions', {
                params: { search, page }
            });
            setTransactions(res.data.data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTransactions(1);
    };

    const statusColors = {
        completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        shipping: 'bg-blue-50 text-blue-600 border-blue-100',
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
        cancelled: 'bg-red-50 text-red-600 border-red-100',
    };

    const paymentColors = {
        paid: 'bg-emerald-500',
        unpaid: 'bg-amber-400',
        failed: 'bg-red-500',
    };

    const renderPagination = () => {
        if (transactions.last_page <= 1) return null;
        
        const pages = [];
        for (let i = 1; i <= transactions.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchTransactions(i)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                        ${transactions.current_page === i 
                            ? 'bg-[#2c4055] text-white shadow-sm' 
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-[#2c4055] hover:text-[#2c4055]'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return <div className="flex gap-2">{pages}</div>;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Data Transaksi</h2>
                        <p className="text-gray-500 mt-1">Riwayat semua pesanan dan pembayaran di platform.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari Order ID, produk, atau user..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] transition-all shadow-sm"
                        />
                    </form>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID & Produk</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pihak Terkait</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Memuat data transaksi...</p>
                                        </td>
                                    </tr>
                                ) : transactions?.data?.length > 0 ? (
                                    transactions.data.map((order) => (
                                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-400 tracking-tighter">#{order.id}</span>
                                                        <p className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">{order.product}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 text-xs font-semibold text-[#2c4055] border border-gray-200">
                                                    Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        {order.buyer} <span className="text-[10px] text-gray-400">(Buyer)</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2c4055]" />
                                                        {order.seller} <span className="text-[10px] text-gray-400">(Seller)</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${statusColors[order.status] || statusColors.pending}`}>
                                                    {order.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                        order.status === 'shipping' ? <Truck className="w-3.5 h-3.5" /> :
                                                            <Clock className="w-3.5 h-3.5" />}
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">{order.payment_status}</span>
                                                        <div className={`w-12 h-1 rounded-full mt-1 ${paymentColors[order.payment_status] || 'bg-gray-200'}`} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                                            Tidak ada data transaksi ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && transactions?.total > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500 font-medium">
                                Menampilkan <span className="text-gray-900 font-semibold">{((transactions.current_page - 1) * 15) + 1}</span> - <span className="text-gray-900 font-semibold">{Math.min(transactions.current_page * 15, transactions.total)}</span> dari <span className="text-gray-900 font-semibold">{transactions.total}</span> transaksi
                            </p>
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
