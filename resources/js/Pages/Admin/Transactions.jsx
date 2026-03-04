import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
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
    Box
} from 'lucide-react';

export default function Transactions({ transactions, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Transaksi', href: '/admin/transactions' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/transactions', { search }, { preserveState: true });
    };

    const statusColors = {
        completed: 'bg-green-50 text-green-600 border-green-100',
        shipping: 'bg-blue-50 text-blue-600 border-blue-100',
        pending: 'bg-orange-50 text-orange-600 border-orange-100',
        cancelled: 'bg-red-50 text-red-600 border-red-100',
    };

    const paymentColors = {
        paid: 'bg-green-500',
        unpaid: 'bg-orange-400',
        failed: 'bg-red-500',
    };

    return (
        <DashboardLayout title="Data Transaksi" breadcrumbs={breadcrumbs}>
            <Head title="Admin — Kelola Transaksi" />

            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Data Transaksi</h2>
                        <p className="text-gray-500 mt-1">Riwayat semua pesanan dan pembayaran di platform.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari Order ID, produk, atau user..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all shadow-sm"
                        />
                    </form>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f7f9f7]/50 border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID & Produk</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nominal</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pihak Terkait</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.data.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 tracking-tighter">#{order.id}</span>
                                                    <p className="font-bold text-gray-800 text-sm truncate max-w-[180px]">{order.product}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    {order.created_at}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-[11px] font-bold text-[#43552c] border border-gray-100">
                                                Rp {number_format(order.total_price, 0, ',', '.')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-600">
                                                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                                                    {order.buyer} <span className="text-[9px] text-gray-400">(Buyer)</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-600">
                                                    <span className="w-1 h-1 rounded-full bg-[#43552c]" />
                                                    {order.seller} <span className="text-[9px] text-gray-400">(Seller)</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status] || statusColors.pending}`}>
                                                {order.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                                    order.status === 'shipping' ? <Truck className="w-3 h-3" /> :
                                                        <Clock className="w-3 h-3" />}
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tighter">{order.payment_status}</span>
                                                    <div className={`w-12 h-1 rounded-full mt-1 ${paymentColors[order.payment_status] || 'bg-gray-200'}`} />
                                                </div>
                                                <button className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-100 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-5 bg-[#f7f9f7]/30 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="text-gray-900 font-bold">{transactions.from}</span> sampai <span className="text-gray-900 font-bold">{transactions.to}</span> dari <span className="text-gray-900 font-bold">{transactions.total}</span> transaksi
                        </p>
                        <div className="flex gap-2">
                            {transactions.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                                        ${link.active ? 'bg-[#43552c] text-white shadow-sm' :
                                            link.url ? 'bg-white border border-gray-100 text-gray-500 hover:border-[#43552c] hover:text-[#43552c]' :
                                                'text-gray-300 pointer-events-none'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Simple helper
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? ',' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
