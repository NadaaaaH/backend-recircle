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
        <SellerLayout user={auth.user}>
            <Head title="Pengaturan Toko - ReCircle" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Pengaturan Toko
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Kelola informasi publik dan data rekening pencairan.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Card 1: Profil Publik */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">
                                    Profil Publik
                                </h2>
                                <p className="text-sm font-medium text-slate-500">
                                    Informasi ini akan dilihat oleh calon
                                    pembeli.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Nama Toko / Penjual
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_toko}
                                        onChange={(e) =>
                                            setData("nama_toko", e.target.value)
                                        }
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Lokasi Kampus
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kampus}
                                        onChange={(e) =>
                                            setData("kampus", e.target.value)
                                        }
                                        placeholder="Contoh: IPB University"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Deskripsi Bio
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    placeholder="Tuliskan sedikit tentang tokomu..."
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Rekening Bank */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">
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
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Nama Bank / E-Wallet
                                    </label>
                                    <input
                                        type="text"
                                        value={data.bank_name}
                                        onChange={(e) =>
                                            setData("bank_name", e.target.value)
                                        }
                                        placeholder="BCA / GoPay / OVO"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
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
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Nama Pemilik Rekening
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_owner}
                                    onChange={(e) =>
                                        setData("bank_owner", e.target.value)
                                    }
                                    placeholder="Sesuai buku tabungan"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200"
                        >
                            <Save className="w-5 h-5" /> Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}
