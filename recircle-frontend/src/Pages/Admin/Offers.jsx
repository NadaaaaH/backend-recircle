import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
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
    TrendingDown,
    Loader2
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminOffersPage() {
    const [offers, setOffers] = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        document.title = "Admin — Monitoring Penawaran";
        const delayDebounceFn = setTimeout(() => {
            fetchOffers(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchOffers = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/offers', {
                params: { search, page }
            });
            setOffers(res.data.data);
        } catch (error) {
            console.error("Failed to fetch offers", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOffers(1);
    };

    const statusColors = {
        accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rejected: 'bg-red-50 text-red-600 border-red-100',
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
        cancelled: 'bg-gray-50 text-gray-500 border-gray-100',
    };

    const renderPagination = () => {
        if (offers.last_page <= 1) return null;
        
        const pages = [];
        for (let i = 1; i <= offers.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchOffers(i)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                        ${offers.current_page === i 
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
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Aktivitas Penawaran</h2>
                        <p className="text-gray-500 mt-1">Pantau negosiasi harga antara pembeli dan penjual.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari produk atau pengguna..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] transition-all shadow-sm"
                        />
                    </form>
                </div>

                {/* Offers Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk & Waktu</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Negosiasi</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pihak Terlibat</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Memuat data penawaran...</p>
                                        </td>
                                    </tr>
                                ) : offers?.data?.length > 0 ? (
                                    offers.data.map((offer) => (
                                        <tr key={offer.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">{offer.product}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(offer.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm">
                                                        <p className="text-gray-400 line-through">Rp {new Intl.NumberFormat('id-ID').format(offer.original_price)}</p>
                                                        <p className="font-semibold text-[#2c4055]">Rp {new Intl.NumberFormat('id-ID').format(offer.offered_price)}</p>
                                                    </div>
                                                    <div className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-1 border border-emerald-100">
                                                        <TrendingDown className="w-3.5 h-3.5" />
                                                        -{Math.round((1 - offer.offered_price / offer.original_price) * 100)}%
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                        <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-100">B</div>
                                                        {offer.buyer}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                        <div className="w-5 h-5 rounded-md bg-[#2c4055]/10 text-[#2c4055] flex items-center justify-center text-[10px] font-bold border border-[#2c4055]/20">P</div>
                                                        {offer.seller}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${statusColors[offer.status] || statusColors.pending}`}>
                                                    {offer.status === 'accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                        offer.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                                                            <Clock className="w-3.5 h-3.5" />}
                                                    {offer.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                                            Tidak ada data penawaran ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && offers?.total > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500 font-medium">
                                Menampilkan <span className="text-gray-900 font-semibold">{((offers.current_page - 1) * 15) + 1}</span> - <span className="text-gray-900 font-semibold">{Math.min(offers.current_page * 15, offers.total)}</span> dari <span className="text-gray-900 font-semibold">{offers.total}</span> penawaran
                            </p>
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
