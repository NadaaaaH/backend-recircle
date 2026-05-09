import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/Layouts/SellerLayout";
import { Store, Save, CheckCircle } from "lucide-react";
import api from "@/lib/axios";

export default function Settings() {
    const { user } = useAuth();
    const [data, setDataState] = useState({
        name:     '',
        kampus:   '',
        bio:      '',
        nomor_wa: '',
    });
    const setData = (key, value) => setDataState(prev => ({ ...prev, [key]: value }));
    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [flash, setFlash] = useState({});

    // Load current settings from API
    useEffect(() => {
        document.title = "Pengaturan Toko | ReCircle";
        api.get('/seller/settings')
            .then((res) => {
                const u = res.data?.data;
                if (u) {
                    setDataState({
                        name:     u.name     ?? user?.name ?? '',
                        kampus:   u.kampus   ?? '',
                        bio:      u.bio      ?? '',
                        nomor_wa: u.nomor_wa ?? '',
                    });
                }
            })
            .catch(() => {
                // Fallback ke data dari AuthContext
                setDataState({
                    name:     user?.name     ?? '',
                    kampus:   user?.kampus   ?? '',
                    bio:      user?.bio      ?? '',
                    nomor_wa: user?.nomor_wa ?? '',
                });
            })
            .finally(() => setIsLoading(false));
    }, [user]);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setFlash({});
        api.patch('/seller/settings', data)
            .then(() => {
                setFlash({ success: "Pengaturan berhasil disimpan." });
                setTimeout(() => setFlash({}), 3000);
            })
            .catch((err) => {
                const msg = err.response?.data?.message || 'Gagal menyimpan pengaturan.';
                setFlash({ error: msg });
                setTimeout(() => setFlash({}), 4000);
            })
            .finally(() => setProcessing(false));
    };

    if (isLoading) {
        return (
            <SellerLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-600"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
        <div className="pb-12 max-w-[1000px] mx-auto">

            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Pengaturan Toko
                </h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">
                    Kelola informasi publik toko dan nomor kontakmu.
                </p>
            </div>

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4 mb-8 text-sm font-bold flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-5 py-4 mb-8 text-sm font-bold">
                    {flash.error}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 md:space-y-8">
                {/* Card 1: Profil Publik */}
                <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Profil Publik</h2>
                            <p className="text-sm font-medium text-slate-500">Informasi ini akan dilihat oleh calon pembeli.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Toko / Penjual</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Lokasi Kampus</label>
                                <input
                                    type="text"
                                    value={data.kampus}
                                    onChange={(e) => setData("kampus", e.target.value)}
                                    placeholder="Contoh: IPB University"
                                    className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nomor WhatsApp</label>
                            <input
                                type="tel"
                                value={data.nomor_wa}
                                onChange={(e) => setData("nomor_wa", e.target.value)}
                                placeholder="08xxxxxxxxxx"
                                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Deskripsi Bio</label>
                            <textarea
                                rows="3"
                                value={data.bio}
                                onChange={(e) => setData("bio", e.target.value)}
                                placeholder="Tuliskan sedikit tentang tokomu..."
                                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-[#4A5D23] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#3B4A1C] transition-all shadow-sm w-full sm:w-auto justify-center disabled:opacity-60"
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
        </SellerLayout>
    );
}
