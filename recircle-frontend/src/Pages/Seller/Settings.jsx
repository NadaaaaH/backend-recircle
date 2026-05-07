import React from "react";
import { Head, useForm } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";
import { Store, CreditCard, Save } from "lucide-react";

export default function Settings({ auth }) {
    const { data, setData, post, processing } = useForm({
        nama_toko: auth.user?.name || "",
        kampus: "IPB University", // Mengisi placeholder sesuai konteks mahasiswa
        deskripsi: "",
        bank_name: "",
        bank_account: "",
        bank_owner: "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Logika simpan profil backend
    };

    return (
        <div className="pb-12 max-w-[1000px] mx-auto">
            <Head>
                <title>Pengaturan Toko | ReCircle</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Pengaturan Toko
                </h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">
                    Kelola informasi publik dan data rekening pencairan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6 md:space-y-8">
                {/* Card 1: Profil Publik */}
                <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Profil Publik
                            </h2>
                            <p className="text-sm font-medium text-slate-500">
                                Informasi ini akan dilihat oleh calon pembeli.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Nama Toko / Penjual
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_toko}
                                    onChange={(e) =>
                                        setData("nama_toko", e.target.value)
                                    }
                                    className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Lokasi Kampus
                                </label>
                                <input
                                    type="text"
                                    value={data.kampus}
                                    onChange={(e) =>
                                        setData("kampus", e.target.value)
                                    }
                                    placeholder="Contoh: IPB University"
                                    className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Deskripsi Bio
                            </label>
                            <textarea
                                rows="3"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                                placeholder="Tuliskan sedikit tentang tokomu..."
                                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Card 2: Rekening Bank */}
                <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 bg-[#4A5D23]/10 text-[#4A5D23] rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Informasi Rekening
                            </h2>
                            <p className="text-sm font-medium text-slate-500">
                                Penting untuk mencairkan dana penjualan.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Nama Bank / E-Wallet
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_name}
                                    onChange={(e) =>
                                        setData("bank_name", e.target.value)
                                    }
                                    placeholder="BCA / GoPay / OVO"
                                    className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="number"
                                    value={data.bank_account}
                                    onChange={(e) =>
                                        setData(
                                            "bank_account",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="08123xxx"
                                    className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Nama Pemilik Rekening
                            </label>
                            <input
                                type="text"
                                value={data.bank_owner}
                                onChange={(e) =>
                                    setData("bank_owner", e.target.value)
                                }
                                placeholder="Sesuai buku tabungan"
                                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-[#4A5D23] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#3B4A1C] transition-all shadow-sm w-full sm:w-auto justify-center"
                    >
                        {processing ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}

Settings.layout = page => <SellerLayout>{page}</SellerLayout>;
