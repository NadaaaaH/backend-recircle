import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    ShoppingBag,
    User,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    Image as ImageIcon,
    Tag,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminProductsPage() {
    const [products, setProducts] = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        document.title = "Admin — Manajemen Produk";
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter]);

    const fetchProducts = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/products', {
                params: { search, status: statusFilter, page }
            });
            setProducts(res.data.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(1);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (confirm(`Ubah status produk ini menjadi ${newStatus}?`)) {
            try {
                await api.post(`/admin/products/${id}/status`, { status: newStatus });
                fetchProducts(products.current_page);
            } catch (err) {
                alert('Gagal mengubah status produk.');
            }
        }
    };

    const statusColors = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
        rejected: 'bg-red-50 text-red-600 border-red-100',
        inactive: 'bg-gray-50 text-gray-500 border-gray-100',
    };

    const renderPagination = () => {
        if (products.last_page <= 1) return null;
        
        const pages = [];
        for (let i = 1; i <= products.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchProducts(i)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                        ${products.current_page === i 
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
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Produk</h2>
                        <p className="text-gray-500 mt-1">Total {products.total || 0} produk terdaftar di marketplace.</p>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama produk atau seller..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] appearance-none transition-all shadow-sm font-medium text-gray-600"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </form>
                </div>

                {/* Products Grid/Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Info Produk</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori & Harga</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Memuat data produk...</p>
                                        </td>
                                    </tr>
                                ) : products?.data?.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center relative group/img">
                                                        {product.image ? (
                                                            <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">{product.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#2c4055] font-medium">
                                                            <User className="w-3.5 h-3.5" />
                                                            {product.seller || 'Unknown Seller'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
                                                        <Tag className="w-3.5 h-3.5 text-[#d4a373]" />
                                                        {product.category}
                                                    </div>
                                                    <p className="text-sm font-semibold text-[#2c4055]">
                                                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${statusColors[product.status] || statusColors.inactive}`}>
                                                    {product.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                        product.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> :
                                                            <XCircle className="w-3.5 h-3.5" />}
                                                    {product.status || 'inactive'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {product.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(product.id, 'active')}
                                                                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100"
                                                                title="Setujui Produk"
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(product.id, 'rejected')}
                                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm border border-red-100"
                                                                title="Tolak Produk"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {product.status === 'active' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(product.id, 'inactive')}
                                                            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
                                                            title="Sembunyikan"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        className="p-2 rounded-lg bg-white text-[#2c4055] border border-gray-200 hover:border-[#2c4055]/30 hover:bg-gray-50 transition-all shadow-sm"
                                                        title="Buka Halaman Produk"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                                            Tidak ada data produk ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && products?.total > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500 font-medium">
                                Menampilkan <span className="text-gray-900 font-semibold">{((products.current_page - 1) * 15) + 1}</span> - <span className="text-gray-900 font-semibold">{Math.min(products.current_page * 15, products.total)}</span> dari <span className="text-gray-900 font-semibold">{products.total}</span> produk
                            </p>
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
