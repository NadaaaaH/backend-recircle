import React, { useState, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import {
    Upload,
    X,
    Image as ImageIcon,
    Info,
    ChevronLeft,
    CheckCircle2,
} from "lucide-react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: "",
        harga: "",
        kategori: "",
        kondisi: "Bekas - Layak Pakai",
        deskripsi: "",
        lokasi_kampus: auth.user?.kampus || "IPB University", // Default dari data user
        images: [],
    });

    const [previewUrls, setPreviewUrls] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const categories = [
        "Elektronik",
        "Furniture",
        "Fashion",
        "Buku",
        "Gadget",
        "Hobi",
        "Kendaraan",
        "Perlengkapan Kost",
    ];
    const conditions = [
        "Baru",
        "Bekas - Seperti Baru",
        "Bekas - Layak Pakai",
        "Bekas - Butuh Perbaikan",
    ];

    // --- LOGIKA MULTIPLE IMAGES ---
    const processFiles = (files) => {
        const validFiles = files.filter((file) =>
            file.type.startsWith("image/"),
        );
        const availableSlots = 5 - data.images.length;
        const filesToAdd = validFiles.slice(0, availableSlots);

        if (filesToAdd.length > 0) {
            const newImages = [...data.images, ...filesToAdd];
            setData("images", newImages);

            const newPreviews = filesToAdd.map((file) =>
                URL.createObjectURL(file),
            );
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const removeImage = (indexToRemove) => {
        URL.revokeObjectURL(previewUrls[indexToRemove]); // Clean up memory
        setData(
            "images",
            data.images.filter((_, index) => index !== indexToRemove),
        );
        setPreviewUrls(
            previewUrls.filter((_, index) => index !== indexToRemove),
        );
    };

    // --- LOGIKA DRAG & DROP ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover")
            setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("product.store"));
    };

    return (
        <SellerLayout user={auth.user}>
            <Head title="Pasang Iklan Baru - ReCircle" />

            <div className="max-w-6xl mx-auto pb-12">
                {/* Header Page */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={route("products.index")}
                        className="p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Pasang Iklan
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">
                            Lengkapi detail barang yang ingin kamu jual.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-col lg:flex-row gap-8 items-start"
                >
                    {/* ==========================================
                        KOLOM KIRI: FORM AREA
                    ========================================== */}
                    <div className="flex-1 w-full space-y-6">
                        {/* --- 1. UPLOAD FOTO (ADVANCED UX) --- */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-black text-slate-900">
                                    Foto Produk
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Format gambar .jpg .jpeg .png dan ukuran
                                    minimum 300 x 300px (Untuk gambar optimal
                                    gunakan ukuran minimum 700 x 700 px).
                                </p>
                            </div>

                            <div
                                className={`grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 rounded-[2rem] border-2 border-dashed transition-colors ${
                                    dragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 bg-gray-50/50"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {/* Mapping slot 1 sampai 5 */}
                                {[...Array(5)].map((_, idx) => {
                                    const hasImage = idx < previewUrls.length;
                                    const isCover = idx === 0;

                                    return (
                                        <div
                                            key={idx}
                                            className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 group flex items-center justify-center"
                                        >
                                            {hasImage ? (
                                                <>
                                                    <img
                                                        src={previewUrls[idx]}
                                                        alt={`Preview ${idx}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(idx)
                                                            }
                                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {isCover && (
                                                        <div className="absolute bottom-0 inset-x-0 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-black tracking-widest uppercase py-1.5 text-center">
                                                            Foto Utama
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center p-2 opacity-50">
                                                    <ImageIcon className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        Foto {idx + 1}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {data.images.length < 5 && (
                                <div className="mt-4 text-center">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" /> Pilih
                                        Foto ({5 - data.images.length} slot
                                        tersisa)
                                    </button>
                                </div>
                            )}
                            {errors.images && (
                                <p className="text-red-500 text-xs font-bold mt-3 text-center">
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* --- 2. INFORMASI DASAR --- */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-slate-900 mb-4">
                                Informasi Dasar
                            </h2>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Nama Produk
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_barang}
                                    onChange={(e) =>
                                        setData("nama_barang", e.target.value)
                                    }
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all placeholder:font-medium placeholder:text-slate-300"
                                    placeholder="Contoh: Meja Belajar IKEA Lipat"
                                />
                                {errors.nama_barang && (
                                    <p className="text-red-500 text-xs font-bold mt-1">
                                        {errors.nama_barang}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Harga (Rp)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={data.harga}
                                            onChange={(e) =>
                                                setData("harga", e.target.value)
                                            }
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.harga && (
                                        <p className="text-red-500 text-xs font-bold mt-1">
                                            {errors.harga}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Kategori
                                    </label>
                                    <select
                                        value={data.kategori}
                                        onChange={(e) =>
                                            setData("kategori", e.target.value)
                                        }
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="" disabled>
                                            Pilih Kategori...
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- 3. DETAIL PRODUK --- */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-slate-900 mb-4">
                                Detail Tambahan
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Kondisi Barang
                                    </label>
                                    <select
                                        value={data.kondisi}
                                        onChange={(e) =>
                                            setData("kondisi", e.target.value)
                                        }
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                                    >
                                        {conditions.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Lokasi COD / Kampus
                                    </label>
                                    <input
                                        type="text"
                                        value={data.lokasi_kampus}
                                        onChange={(e) =>
                                            setData(
                                                "lokasi_kampus",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Deskripsi Lengkap
                                    </label>
                                </div>
                                {/* Rich Text Fake Toolbar */}
                                <div className="border border-gray-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-slate-50">
                                    <div className="bg-white px-4 py-3 border-b border-gray-100 flex gap-4 text-slate-400">
                                        <button
                                            type="button"
                                            className="font-serif font-black hover:text-slate-900 transition-colors"
                                        >
                                            B
                                        </button>
                                        <button
                                            type="button"
                                            className="font-serif italic font-bold hover:text-slate-900 transition-colors"
                                        >
                                            I
                                        </button>
                                        <button
                                            type="button"
                                            className="underline font-bold hover:text-slate-900 transition-colors"
                                        >
                                            U
                                        </button>
                                    </div>
                                    <textarea
                                        rows="6"
                                        value={data.deskripsi}
                                        onChange={(e) =>
                                            setData("deskripsi", e.target.value)
                                        }
                                        className="w-full bg-transparent border-none p-4 font-medium text-slate-700 focus:ring-0 resize-none placeholder:text-slate-300"
                                        placeholder="Tuliskan spesifikasi, alasan jual, atau minus barang jika ada..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==========================================
                        KOLOM KANAN: LIVE PREVIEW & ACTION
                    ========================================== */}
                    <div className="w-full lg:w-80 shrink-0 space-y-6">
                        {/* Sticky Container */}
                        <div className="sticky top-28 space-y-6">
                            {/* Live Preview Card */}
                            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hidden sm:block">
                                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Info className="w-4 h-4" /> Live
                                        Preview
                                    </h3>
                                </div>
                                <div className="aspect-square bg-slate-50 relative flex items-center justify-center">
                                    {previewUrls.length > 0 ? (
                                        <img
                                            src={previewUrls[0]}
                                            className="w-full h-full object-cover"
                                            alt="Cover Preview"
                                        />
                                    ) : (
                                        <div className="text-slate-300 flex flex-col items-center">
                                            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Foto Utama
                                            </span>
                                        </div>
                                    )}
                                    {data.kondisi && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                {data.kondisi.split(" - ")[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-tight mb-2">
                                        {data.nama_barang ||
                                            "Nama Produk Akan Tampil Disini"}
                                    </h3>
                                    <span className="text-2xl font-black text-primary block mb-3">
                                        {data.harga
                                            ? `Rp ${parseInt(data.harga).toLocaleString("id-ID")}`
                                            : "Rp 0"}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>
                                            {data.lokasi_kampus ||
                                                "Lokasi Kampus"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Terbitkan Produk"}
                                </button>
                                <Link
                                    href={route("products.index")}
                                    className="w-full text-center bg-white text-slate-500 font-bold py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Simpan sebagai Draf
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}
