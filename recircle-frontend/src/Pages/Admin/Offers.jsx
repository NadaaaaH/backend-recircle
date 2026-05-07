import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Search,
    MessageSquare,
    User,
    Calendar,
    ArrowRight,
    Tag,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingDown
} from 'lucide-react';

export default function Offers({ offers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Penawaran', href: '/admin/offers' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/offers', { search }, { preserveState: true });
    };

    const statusColors = {
        accepted: 'bg-green-50 text-green-600 border-green-100',
        rejected: 'bg-red-50 text-red-600 border-red-100',
        pending: 'bg-orange-50 text-orange-600 border-orange-100',
        cancelled: 'bg-gray-50 text-gray-500 border-gray-100',
    };

    return (
        <DashboardLayout title="Aktivitas Penawaran" breadcrumbs={breadcrumbs}>
            <Head title="Admin — Monitoring Penawaran" />

            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Aktivitas Penawaran</h2>
                        <p className="text-gray-500 mt-1">Pantau negosiasi harga antara pembeli dan penjual.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari produk atau pengguna..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all shadow-sm"
                        />
                    </form>
                </div>

                {/* Offers Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f7f9f7]/50 border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk & Waktu</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Negosiasi</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pihak Terlibat</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {offers.data.map((offer) => (
                                    <tr key={offer.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{offer.product}</p>
                                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    {offer.created_at}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xs">
                                                    <p className="text-gray-400 line-through">Rp {number_format(offer.original_price, 0, ',', '.')}</p>
                                                    <p className="font-bold text-[#43552c]">Rp {number_format(offer.offered_price, 0, ',', '.')}</p>
                                                </div>
                                                <div className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-[10px] font-bold flex items-center gap-1">
                                                    <TrendingDown className="w-3 h-3" />
                                                    -{Math.round((1 - offer.offered_price / offer.original_price) * 100)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                                                    <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center text-[9px] font-bold">B</div>
                                                    {offer.buyer}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                                                    <div className="w-5 h-5 rounded-md bg-[#43552c]/10 text-[#43552c] flex items-center justify-center text-[9px] font-bold">P</div>
                                                    {offer.seller}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[offer.status] || statusColors.pending}`}>
                                                {offer.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> :
                                                    offer.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                                                        <Clock className="w-3 h-3" />}
                                                {offer.status}
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
                            Menampilkan <span className="text-gray-900 font-bold">{offers.from}</span> sampai <span className="text-gray-900 font-bold">{offers.to}</span> dari <span className="text-gray-900 font-bold">{offers.total}</span> penawaran
                        </p>
                        <div className="flex gap-2">
                            {offers.links.map((link, idx) => (
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                                            ${link.active ? 'bg-[#43552c] text-white shadow-sm' :
                                                link.url ? 'bg-white border border-gray-100 text-gray-500 hover:border-[#43552c] hover:text-[#43552c]' :
                                                    'text-gray-300 pointer-events-none'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
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
