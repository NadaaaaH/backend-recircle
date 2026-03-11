import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Package, Plus, Edit, Trash2, Search, ArrowRight, LayoutGrid, List, CheckCircle } from 'lucide-react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function SellerProducts({ products }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Confirmation Modal State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const triggerDelete = (id) => {
        setProductToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        router.delete(`/seller/products/${productToDelete}`, {
            onFinish: () => {
                setIsDeleting(false);
                setIsConfirmOpen(false);
                setProductToDelete(null);
            }
        });
    };

    return (
        <DashboardLayout
            title="Kelola Produk"
            breadcrumbs={[
                { label: 'Seller', href: '/seller/dashboard' },
                { label: 'Produk' },
            ]}
        >
            <Head title="Kelola Produk - Penjual" />

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari produkmu..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary shadow-sm transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Link
                        href="/jual"
                        className="flex items-center gap-2 bg-[#43552c] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#43552c]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Tambah
                        <span className="hidden sm:inline">Produk Baru</span>
                    </Link>
                </div>
            </div>

            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {flash.success}
                </div>
            )}

            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100/50">
                    <div className="w-16 h-16 bg-[#43552c]/10 text-[#43552c] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada produk</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Mulai jual furnitur atau barang di kos/kampusmu yang tidak terpakai!
                    </p>
                    <Link
                        href="/jual"
                        className="inline-flex items-center gap-2 border-2 border-[#43552c] text-[#43552c] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#43552c] hover:text-white transition-all group"
                    >
                        Mulai Jualan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col">
                            <div className="aspect-[4/3] bg-gray-100 relative">
                                <img 
                                    src={p.img || '/images/placeholder-product.png'} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-product.png'; }}
                                />

                                <div className="absolute top-2 right-2">
                                    {p.status === 'active' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Active</span>}
                                    {p.status === 'sold' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Sold</span>}
                                    {p.status === 'archived' && <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Archived</span>}
                                </div>
                                {p.active_orders > 0 && (
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md">
                                        {p.active_orders} Pesanan Aktif
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="text-[11px] text-[#d4a373] font-bold uppercase tracking-wider mb-1">{p.category}</div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight flex-1">{p.name}</h3>
                                <div className="text-lg font-black text-[#43552c] mb-4">{formatPrice(p.price)}</div>

                                <div className="grid grid-cols-2 gap-2 mt-auto border-t border-gray-50 pt-3">
                                    <Link
                                        href={`/seller/products/${p.id}/edit`}
                                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold bg-[#f7f9f7] text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit className="w-3.5 h-3.5" /> Edit
                                    </Link>
                                    <button
                                        onClick={() => triggerDelete(p.id)}
                                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Takedown
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Produk</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p, idx) => (
                                    <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${idx !== filteredProducts.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={p.img || '/images/placeholder-product.png'} 
                                                    alt="" 
                                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100" 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-product.png'; }}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm max-w-[200px] truncate">{p.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{p.created_at}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-gray-900 text-sm whitespace-nowrap">{formatPrice(p.price)}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{p.category}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1 items-start">
                                                {p.status === 'active' && <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">Active</span>}
                                                {p.status === 'sold' && <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold">Sold</span>}
                                                {p.status === 'archived' && <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold">Archived</span>}
                                                {p.active_orders > 0 && <span className="text-[10px] text-blue-600 font-semibold">{p.active_orders} pesanan aktif</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/seller/products/${p.id}/edit`}
                                                    className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => triggerDelete(p.id)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    title="Takedown/Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Takedown Produk"
                subtitle="Apakah Anda yakin ingin men-takedown produk ini? Barang tidak akan muncul lagi di marketplace."
                confirmText="Takedown"
                cancelText="Batal"
                type="danger"
                isLoading={isDeleting}
            />
        </DashboardLayout>
    );
}
