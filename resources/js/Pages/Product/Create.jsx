import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Upload, X, Image as ImageIcon, ArrowLeft, Eye, Tag, MapPin, FileText, Layers } from 'lucide-react';

export default function Create({ categories = [] }) {
    const { errors: serverErrors } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nama_barang: '',
        harga: '',
        category_id: '',
        kondisi: 'Bekas - Layak Pakai',
        deskripsi: '',
        lokasi_kampus: 'IPB University',
        images: [],
    });

    const [previewUrls, setPreviewUrls] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const conditions = [
        'Baru',
        'Bekas - Seperti Baru',
        'Bekas - Layak Pakai',
        'Bekas - Butuh Perbaikan',
    ];

    // ── Image Handlers ──
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...data.images, ...files].slice(0, 5);
        setData('images', newImages);

        const newPreviews = newImages.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    const removeImage = (indexToRemove) => {
        // Revoke old preview URL to prevent memory leak
        URL.revokeObjectURL(previewUrls[indexToRemove]);

        const updatedImages = data.images.filter((_, i) => i !== indexToRemove);
        const updatedPreviews = previewUrls.filter((_, i) => i !== indexToRemove);

        setData('images', updatedImages);
        setPreviewUrls(updatedPreviews);
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
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            if (files.length > 0) {
                const newImages = [...data.images, ...files].slice(0, 5);
                setData('images', newImages);

                const newPreviews = newImages.map((file) => {
                    // if it's already a URL string from backend (in edit mode), wait this is create mode so it's all File objects
                    return URL.createObjectURL(file);
                });
                setPreviewUrls(newPreviews);
            }
        }
    };

    // ── Submit with forceFormData ──
    const submit = (e) => {
        e.preventDefault();
        post(route('product.store'), {
            forceFormData: true,
        });
    };

    // ── Inline Error Component ──
    const InputError = ({ field }) => {
        const msg = errors[field];
        if (!msg) return null;
        return <p className="text-red-500 text-xs mt-1.5 font-medium">{msg}</p>;
    };

    return (
        <DashboardLayout
            title="Jual Barang"
            breadcrumbs={[
                { label: 'Seller', href: '/seller/dashboard' },
                { label: 'Produk Saya', href: '/seller/products' },
                { label: 'Tambah Produk' },
            ]}
        >
            <Head title="Jual Barang" />

            <form onSubmit={submit} className="flex flex-col xl:flex-row gap-8 max-w-5xl">
                {/* ── LEFT COLUMN: Form Fields ── */}
                <div className="flex-1 space-y-6">

                    {/* 1. Photo Upload */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        <div className="flex items-center gap-2 mb-5">
                            <ImageIcon className="w-5 h-5 text-[#43552c]" />
                            <h3 className="font-semibold text-gray-800">Foto Produk</h3>
                            <span className="text-xs text-gray-400 ml-auto">{data.images.length}/5</span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {previewUrls.map((url, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-100/50 group"
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur rounded-lg text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                    {idx === 0 && (
                                        <span className="absolute bottom-0 left-0 right-0 bg-[#43552c]/80 text-white text-[10px] text-center py-1 font-medium tracking-wide uppercase">
                                            Cover
                                        </span>
                                    )}
                                </div>
                            ))}

                            {data.images.length < 5 && (
                                <label 
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-[#43552c] bg-[#43552c]/10' : 'border-gray-200 hover:border-[#43552c]/40 hover:bg-[#43552c]/5'}`}
                                >
                                    <Upload className={`w-5 h-5 mb-1 ${isDragging ? 'text-[#43552c]' : 'text-gray-300'}`} />
                                    <span className="text-[11px] text-gray-400 font-medium">Tambah</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        <InputError field="images" />
                        {/* Show per-image errors */}
                        {Object.keys(errors).filter(k => k.startsWith('images.')).map(k => (
                            <p key={k} className="text-red-500 text-xs mt-1 font-medium">{errors[k]}</p>
                        ))}
                    </div>

                    {/* 2. Product Info */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 space-y-5">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100/50">
                            <FileText className="w-5 h-5 text-[#43552c]" />
                            <h3 className="font-semibold text-gray-800">Informasi Barang</h3>
                        </div>

                        {/* Nama Barang */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Produk</label>
                            <input
                                type="text"
                                value={data.nama_barang}
                                onChange={(e) => setData('nama_barang', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-shadow"
                                placeholder="Contoh: Meja Belajar IKEA"
                            />
                            <InputError field="nama_barang" />
                        </div>

                        {/* Harga & Kategori */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Harga (Rp)</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.harga}
                                    onChange={(e) => setData('harga', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-shadow"
                                    placeholder="0"
                                    min="1000"
                                />
                                <InputError field="harga" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Kategori</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-shadow"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <InputError field="category_id" />
                            </div>
                        </div>

                        {/* Kondisi & Lokasi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Kondisi</label>
                                <select
                                    value={data.kondisi}
                                    onChange={(e) => setData('kondisi', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-shadow"
                                >
                                    {conditions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <InputError field="kondisi" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Lokasi Kampus</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.lokasi_kampus}
                                    onChange={(e) => setData('lokasi_kampus', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-shadow"
                                    placeholder="IPB University"
                                />
                                <InputError field="lokasi_kampus" />
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Deskripsi</label>
                            <textarea
                                rows="4"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-shadow resize-none"
                                placeholder="Jelaskan kondisi barang, kelengkapan, dan alasan dijual..."
                            />
                            <InputError field="deskripsi" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/seller/dashboard"
                            className="px-5 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-[#43552c] text-white font-semibold rounded-xl hover:bg-[#364423] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Tayangkan Iklan'
                            )}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Live Preview ── */}
                <div className="xl:w-80 flex-shrink-0">
                    <div className="sticky top-[88px]">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Preview</p>
                        </div>
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                            <div className="aspect-square bg-[#f7f9f7] relative flex items-center justify-center">
                                {previewUrls.length > 0 ? (
                                    <img src={previewUrls[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center">
                                        <ImageIcon className="w-10 h-10 mb-2" />
                                        <span className="text-xs font-medium">Foto Sampul</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <span className="text-xl font-black text-[#43552c] block">
                                    {data.harga
                                        ? `Rp ${parseInt(data.harga).toLocaleString('id-ID')}`
                                        : 'Rp -'}
                                </span>
                                <h3 className="font-semibold text-gray-800 text-sm mt-1 leading-snug line-clamp-2">
                                    {data.nama_barang || 'Judul Produk...'}
                                </h3>
                                {data.lokasi_kampus && (
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {data.lokasi_kampus}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
