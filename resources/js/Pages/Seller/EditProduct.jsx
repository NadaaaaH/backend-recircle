import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Upload, X, Image as ImageIcon, ArrowLeft, Tag, FileText, Layers, CheckCircle } from 'lucide-react';

export default function EditProduct({ product, categories = [] }) {
    const { flash } = usePage().props;

    // ── 1. STATE INITIALIZATION ──
    // Ensuring `useForm` correctly pre-fills all existing product data.
    const { data, setData, post, processing, errors } = useForm({
        // IMPORTANT: Inertia File Upload Quirk
        // File uploads using PUT/PATCH in Laravel require a spoofed POST request
        _method: 'put',
        nama_barang: product?.nama_barang || '',
        harga: product?.harga || '',
        category_id: product?.category_id || '',
        kondisi: product?.kondisi || 'Bekas - Layak Pakai',
        deskripsi: product?.deskripsi || '',
        status: product?.status || 'active',
        image: null,
    });

    // ── 2. IMAGE PREVIEW LOGIC ──
    const [previewUrl, setPreviewUrl] = useState(product?.image || null);
    const [isDragging, setIsDragging] = useState(false);

    const conditions = [
        'Baru',
        'Bekas - Seperti Baru',
        'Bekas - Layak Pakai',
        'Bekas - Butuh Perbaikan',
    ];

    const statuses = [
        { value: 'active', label: 'Aktif / Tayang' },
        { value: 'archived', label: 'Archived / Takedown' },
        { value: 'sold', label: 'Terjual' },
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData('image', file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewUrl(product?.image || null); // Revert to initial product cover
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                setData('image', file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    // ── 3. FORM SUBMISSION ──
    const submit = (e) => {
        e.preventDefault();
        // Sending as a POST request with `forceFormData` to support file uploads and `_method: 'put'`
        post(route('seller.products.update', product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // ── 4. VALIDATION UI COMPONENT ──
    const InputError = ({ message }) => {
        if (!message) return null;
        return <p className="text-red-500 text-xs mt-1.5 font-bold tracking-wide">{message}</p>;
    };

    return (
        <DashboardLayout
            title="Edit Produk"
            breadcrumbs={[
                { label: 'Seller', href: '/seller/dashboard' },
                { label: 'Produk Saya', href: '/seller/products' },
                { label: 'Edit Produk' },
            ]}
        >
            <Head title={`Edit ${product?.nama_barang || 'Produk'}`} />

            <div className="max-w-4xl mx-auto pb-12">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-6 lg:mb-8">
                    <Link
                        href="/seller/products"
                        className="p-3 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Edit Produk</h1>
                        <p className="text-sm text-gray-500 mt-1">Perbarui informasi dan tampilan barang jualanmu</p>
                    </div>
                </div>

                {/* Flash Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3 text-sm font-bold shadow-[0_4px_10px_rgb(0,0,0,0.02)]">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6 md:space-y-8">

                    {/* ── PHOTO UPLOAD SECTION ── */}
                    {/* Mobile: stack vertically, Desktop: row layout */}
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-[#43552c]/10 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-[#43552c]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Foto Sampul Produk</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Gambar utama yang dilihat pembeli di etalase</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Image Preview Container */}
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`w-full sm:w-48 aspect-square rounded-2xl overflow-hidden border-2 border-dashed bg-[#f7f9f7] flex-shrink-0 relative group transition-all ${isDragging ? 'border-[#43552c] bg-[#43552c]/5' : 'border-gray-200'}`}
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        {/* Remove Button for newly uploaded image */}
                                        {data.image && (
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-xl text-gray-500 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon className={`w-8 h-8 mb-2 ${isDragging ? 'text-[#43552c]' : 'opacity-30'}`} />
                                        <span className={`text-xs font-bold ${isDragging ? 'text-[#43552c]' : 'text-gray-400'}`}>
                                            {isDragging ? 'Drop foto di sini' : 'Belum ada foto'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Upload Controls & Guidelines */}
                            <div className="flex-1 w-full">
                                <label className="inline-flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-6 py-3 bg-[#f7f9f7] border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all text-sm font-bold text-gray-700 shadow-sm">
                                    <Upload className="w-4 h-4 text-[#43552c]" />
                                    <span>Ganti Foto Cover</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        Format JPG, PNG, atau JPEG.
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        Ukuran maksimum 5MB.
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        Format ideal 1:1 (Persegi).
                                    </p>
                                </div>
                                <InputError message={errors.image} />
                            </div>
                        </div>
                    </div>

                    {/* ── PRODUCT DETAILS SECTION ── */}
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        {/* Status Toggle & Title */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#d4a373]/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#d4a373]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Informasi Barang</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Detail dan deskripsi produk</p>
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div className="flex flex-shrink-0 items-center justify-between sm:justify-start gap-3 bg-[#f7f9f7] px-4 py-2.5 rounded-xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 p-0 cursor-pointer"
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ── CSS Grid for Form Layout ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                            {/* Product Name (Full Width) */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                                <input
                                    type="text"
                                    value={data.nama_barang}
                                    onChange={(e) => setData('nama_barang', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all bg-[#f7f9f7] focus:bg-white text-gray-900 font-medium"
                                    placeholder="Contoh: Meja Belajar IKEA"
                                />
                                <InputError message={errors.nama_barang} />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-gray-400" /> Harga (Rp)</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.harga}
                                    onChange={(e) => setData('harga', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all bg-[#f7f9f7] focus:bg-white text-gray-900 font-bold"
                                    min="1000"
                                    placeholder="0"
                                />
                                <InputError message={errors.harga} />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-gray-400" /> Kategori</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all bg-[#f7f9f7] focus:bg-white text-gray-900 font-medium"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            {/* Condition */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kondisi Barang</label>
                                <select
                                    value={data.kondisi}
                                    onChange={(e) => setData('kondisi', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all bg-[#f7f9f7] focus:bg-white text-gray-900 font-medium"
                                >
                                    {conditions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <InputError message={errors.kondisi} />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Lengkap</label>
                                <textarea
                                    rows="6"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-5 py-4 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all bg-[#f7f9f7] focus:bg-white text-gray-900 resize-none font-medium leading-relaxed max-w-full"
                                    placeholder="Jelaskan kondisi detail barang, minus (jika ada), kelengkapan, dan alasan dijual..."
                                />
                                <InputError message={errors.deskripsi} />
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 mt-2">
                                        {data.deskripsi?.length || 0} karakter
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── ACTION BUTTONS ── */}
                    {/* Reverse layout on mobile to keep primary action prominent at bottom */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
                        <Link
                            href="/seller/products"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-50 transition-all text-center shadow-sm"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto px-10 py-3.5 bg-[#43552c] text-white font-bold rounded-full hover:bg-[#364423] shadow-[0_4px_20px_rgb(67,85,44,0.3)] hover:shadow-[0_4px_25px_rgb(67,85,44,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed text-sm transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
