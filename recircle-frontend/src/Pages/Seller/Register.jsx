import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Store,
    Mail,
    Phone,
    MapPin,
    Upload,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

export default function RegisterSeller() {
    const { data, setData, post, processing, errors } = useForm({
        store_name: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        document: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("seller.register")); // sesuaikan dengan route backend
    };

    return (
        <MainLayout>
            <Head title="Daftar sebagai Penjual - ReCircle" />

            {/* Header Kembali */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
                        <Store className="w-4 h-4 text-primary" />
                        Buka Toko Mahasiswa
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-4">
                        Jual Barang Bekasmu, <br />
                        <span className="font-serif italic font-thin text-gray-800">
                            Raih Penghasilan Tambahan
                        </span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Daftarkan tokomu sekarang, hanya untuk mahasiswa
                        terverifikasi. Proses mudah, aman, dan gratis.
                    </p>
                </div>
            </section>

            {/* Form Pendaftaran */}
            <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama Toko */}
                        <div>
                            <label
                                htmlFor="store_name"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Nama Toko{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="store_name"
                                    type="text"
                                    value={data.store_name}
                                    onChange={(e) =>
                                        setData("store_name", e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="Mis: Toko Buku Bekas Andi"
                                />
                            </div>
                            {errors.store_name && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.store_name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Email Aktif{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="kamu@mahasiswa.edu"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* No Telepon */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Nomor WhatsApp{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="08123456789"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Alamat */}
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Alamat Lengkap{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    id="address"
                                    rows="3"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                                    placeholder="Jalan, gedung, kamar, dsb."
                                />
                            </div>
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Deskripsi Toko */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Deskripsi Toko
                            </label>
                            <textarea
                                id="description"
                                rows="3"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                                placeholder="Ceritakan sedikit tentang toko kamu..."
                            />
                        </div>

                        {/* Upload Dokumen */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload KTP / Kartu Mahasiswa
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition">
                                <input
                                    type="file"
                                    id="document"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) =>
                                        setData("document", e.target.files[0])
                                    }
                                />
                                <div className="text-center">
                                    <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Klik atau drag & drop file di sini
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, PDF maks. 2MB
                                    </p>
                                </div>
                            </div>
                            {data.document && (
                                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    {data.document.name}
                                </p>
                            )}
                            {errors.document && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.document}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {processing
                                    ? "Mendaftarkan..."
                                    : "Daftar sebagai Penjual"}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                Dengan mendaftar, kamu setuju dengan{" "}
                                <Link
                                    href="/syarat-ketentuan"
                                    className="text-primary underline"
                                >
                                    Syarat & Ketentuan
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </MainLayout>
    );
}
