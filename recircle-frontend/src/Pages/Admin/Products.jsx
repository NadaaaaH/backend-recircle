import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Search,
    MoreVertical,
    ShoppingBag,
    User,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    Image as ImageIcon,
    Tag,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

export default function Products({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Produk', href: '/admin/products' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusUpdate = (id, newStatus) => {
        if (confirm(`Ubah status produk ini menjadi ${newStatus}?`)) {
            router.post(`/admin/products/${id}/status`, { status: newStatus });
        }
    };

    const statusColors = {
        active: 'bg-green-50 text-green-600 border-green-100',
        pending: 'bg-orange-50 text-orange-600 border-orange-100',
        rejected: 'bg-red-50 text-red-600 border-red-100',
        inactive: 'bg-gray-50 text-gray-500 border-gray-100',
    };

    return (
        <DashboardLayout title="Manajemen Produk" breadcrumbs={breadcrumbs}>
            <Head title="Admin — Semua Produk" />

            <div className="space-y-6">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manajemen Produk</h2>
                        <p className="text-gray-500 mt-1">Total {products.total} produk terdaftar di marketplace.</p>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama produk atau seller..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    router.get('/admin/products', { search, status: e.target.value }, { preserveState: true });
                                }}
                                className="pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] appearance-none transition-all shadow-sm font-medium text-gray-600"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </form>
                </div>

                {/* Products Grid/Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f7f9f7]/50 border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Info Produk</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori & Harga</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center relative group/img">
                                                    {product.image ? (
                                                        <img src={`/storage/${product.image}`} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{product.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#43552c] font-medium">
                                                        <User className="w-3 h-3" />
                                                        {product.seller}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold uppercase tracking-wider">
                                                    <Tag className="w-3 h-3 text-[#d4a373]" />
                                                    {product.category}
                                                </div>
                                                <p className="text-sm font-bold text-[#43552c]">
                                                    Rp {number_format(product.price, 0, ',', '.')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[product.status] || statusColors.inactive}`}>
                                                {product.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> :
                                                    product.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                        <XCircle className="w-3 h-3" />}
                                                {product.status || 'inactive'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {product.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(product.id, 'active')}
                                                            className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors shadow-sm border border-green-100"
                                                            title="Setujui Produk"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(product.id, 'rejected')}
                                                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm border border-red-100"
                                                            title="Tolak Produk"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {product.status === 'active' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(product.id, 'inactive')}
                                                        className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors shadow-sm border border-gray-100"
                                                        title="Sembunyikan"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className="p-2 rounded-xl bg-white text-[#43552c] border border-gray-100 hover:border-[#43552c]/30 hover:bg-[#f7f9f7] transition-all shadow-sm"
                                                    title="Buka Halaman Produk"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
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
                            Menampilkan <span className="text-gray-900 font-bold">{products.from}</span> sampai <span className="text-gray-900 font-bold">{products.to}</span> dari <span className="text-gray-900 font-bold">{products.total}</span> produk
                        </p>
                        <div className="flex gap-2">
                            {products.links.map((link, idx) => (
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
