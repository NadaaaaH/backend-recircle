import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: "",
        harga: "",
        kategori: "",
        kondisi: "Bekas",
        deskripsi: "",
        lokasi_kampus: "IPB University",
        images: [], // UBAH JADI ARRAY
    });

    const [previewUrls, setPreviewUrls] = useState([]);

    // Handle Multiple Images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Gabungkan file baru dengan yang sudah ada (Limit misal 5)
        const newImages = [...data.images, ...files].slice(0, 5);
        setData("images", newImages);

        // Buat URL Preview
        const newPreviews = newImages.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    // Hapus satu gambar dari preview
    const removeImage = (indexToRemove) => {
        const updatedImages = data.images.filter(
            (_, index) => index !== indexToRemove,
        );
        const updatedPreviews = previewUrls.filter(
            (_, index) => index !== indexToRemove,
        );

        setData("images", updatedImages);
        setPreviewUrls(updatedPreviews);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("product.store"));
    };

    // ... categories & conditions tetap sama ...
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-bold text-xl text-gray-800">
                    Pasang Iklan
                </h2>
            }
        >
            <Head title="Jual Barang" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form
                    onSubmit={submit}
                    className="flex flex-col lg:flex-row gap-8"
                >
                    {/* KOLOM KIRI */}
                    <div className="flex-1 space-y-6">
                        {/* 1. Upload Multiple Foto */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <label className="block font-bold text-gray-900 mb-4">
                                Foto Produk (Maks. 5)
                            </label>

                            {/* Grid Preview */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                                {previewUrls.map((url, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                                    >
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* Tombol Tambah (Upload Box) */}
                                {data.images.length < 5 && (
                                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500 font-bold">
                                            Tambah
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.images && (
                                <p className="text-red-600 text-xs">
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* ... SISA FORM SAMA SEPERTI SEBELUMNYA ... */}
                        {/* (Copy paste bagian Informasi Barang dari kode sebelumnya di sini) */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                            <h3 className="font-bold text-lg text-gray-900 pb-2 border-b border-gray-100">
                                Informasi Barang
                            </h3>
                            {/* Nama Barang */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Produk
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_barang}
                                    onChange={(e) =>
                                        setData("nama_barang", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm text-sm"
                                    placeholder="Contoh: Meja Belajar"
                                />
                                {errors.nama_barang && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.nama_barang}
                                    </p>
                                )}
                            </div>
                            {/* Harga & Kategori */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.harga}
                                        onChange={(e) =>
                                            setData("harga", e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm text-sm"
                                        placeholder="0"
                                    />
                                    {errors.harga && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {errors.harga}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        value={data.kategori}
                                        onChange={(e) =>
                                            setData("kategori", e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm text-sm"
                                    >
                                        <option value="" disabled>
                                            Pilih Kategori
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Kondisi & Lokasi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kondisi
                                    </label>
                                    <select
                                        value={data.kondisi}
                                        onChange={(e) =>
                                            setData("kondisi", e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm text-sm"
                                    >
                                        {conditions.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lokasi Kampus
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
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm text-sm"
                                    />
                                </div>
                            </div>
                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    rows="5"
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm text-sm resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-sm disabled:opacity-50 text-sm"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : "Tayangkan Iklan"}
                            </button>
                        </div>
                    </div>

                    {/* KOLOM KANAN: LIVE PREVIEW (SAMA, Cuma ambil gambar pertama) */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                                    {previewUrls.length > 0 ? (
                                        <img
                                            src={previewUrls[0]}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                            <span className="text-xs">
                                                Foto Sampul
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <span className="text-lg font-bold text-primary block">
                                        {data.harga
                                            ? `Rp ${parseInt(data.harga).toLocaleString("id-ID")}`
                                            : "Rp -"}
                                    </span>
                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                        {data.nama_barang || "Judul Produk..."}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
