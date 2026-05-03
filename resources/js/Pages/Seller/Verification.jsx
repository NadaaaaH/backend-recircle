import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { ShieldCheck, Upload, CheckCircle, XCircle, Clock, Camera } from 'lucide-react';

export default function SellerVerification({ latestVerification, is_seller }) {
    const { flash } = usePage().props;
    const [fotoKtm, setFotoKtm] = useState(null);
    const [preview, setPreview] = useState(null);
    const [namaKampus, setNamaKampus] = useState('');
    const [nim, setNim] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoKtm(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('foto_ktm', fotoKtm);
        formData.append('nama_kampus', namaKampus);
        formData.append('nim', nim);

        router.post('/seller/verification', formData, {
            onFinish: () => setProcessing(false),
        });
    };

    if (is_seller) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Head>
                    <title>Verifikasi Penjual | ReCircle</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <div className="bg-white rounded-[1.25rem] p-10 max-w-md w-full text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/70">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Sudah Terverifikasi!</h2>
                    <p className="text-slate-500 mb-8 font-medium">Akun kamu sudah terverifikasi sebagai penjual. Kamu bisa mulai menjual barang.</p>
                    <a href="/jual" className="inline-flex bg-[#4A5D23] text-white px-8 py-3.5 rounded-xl hover:bg-[#3B4A1C] transition-colors font-bold shadow-sm">
                        Mulai Jual Barang
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-12 max-w-[800px] mx-auto">
            <Head>
                <title>Verifikasi Penjual | ReCircle</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="text-center mb-8 lg:mb-12">
                <div className="w-16 h-16 rounded-2xl bg-[#4A5D23]/10 flex items-center justify-center mx-auto mb-5 border border-[#4A5D23]/20">
                    <ShieldCheck className="w-8 h-8 text-[#4A5D23]" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verifikasi Penjual</h1>
                <p className="text-slate-500 mt-2 font-medium">Upload foto KTM untuk memverifikasi identitas mahasiswamu</p>
            </div>

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4 mb-8 text-sm font-bold flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                    {flash.success}
                </div>
            )}

            {/* Status verifikasi terakhir */}
            {latestVerification && (
                <div className={`rounded-[1.25rem] p-6 mb-8 ${latestVerification.status === 'pending' ? 'bg-amber-50 border border-amber-200' :
                        latestVerification.status === 'rejected' ? 'bg-rose-50 border border-rose-200' :
                            'bg-emerald-50 border border-emerald-200'
                    }`}>
                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            {latestVerification.status === 'pending' && <Clock className="w-6 h-6 text-amber-500" />}
                            {latestVerification.status === 'rejected' && <XCircle className="w-6 h-6 text-rose-500" />}
                            {latestVerification.status === 'approved' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-lg">
                                {latestVerification.status === 'pending' && 'Menunggu review admin...'}
                                {latestVerification.status === 'rejected' && 'Verifikasi ditolak'}
                                {latestVerification.status === 'approved' && 'Verifikasi disetujui'}
                            </p>
                            {latestVerification.catatan_admin && (
                                <p className="text-sm text-slate-600 mt-2 font-medium bg-white/50 p-3 rounded-lg border border-black/5">Alasan: {latestVerification.catatan_admin}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">{latestVerification.created_at}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form hanya ditampilkan jika belum ada pending */}
            {(!latestVerification || latestVerification.status === 'rejected') && (
                <form onSubmit={handleSubmit} className="bg-white rounded-[1.25rem] p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/70 space-y-8">
                    {/* Foto KTM */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Foto KTM</label>
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#4A5D23] hover:bg-[#4A5D23]/5 transition-all group"
                            onClick={() => document.getElementById('ktm-input').click()}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview KTM" className="max-h-56 mx-auto rounded-xl shadow-sm object-cover" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#4A5D23] transition-colors" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">Klik untuk upload foto KTM</p>
                                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Format: JPG, PNG (Maks 5MB)</p>
                                </div>
                            )}
                        </div>
                        <input id="ktm-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Nama Kampus */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Nama Kampus</label>
                            <input
                                type="text"
                                value={namaKampus}
                                onChange={(e) => setNamaKampus(e.target.value)}
                                placeholder="Contoh: IPB University"
                                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                required
                            />
                        </div>

                        {/* NIM */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">NIM (Nomor Induk Mahasiswa)</label>
                            <input
                                type="text"
                                value={nim}
                                onChange={(e) => setNim(e.target.value)}
                                placeholder="Masukkan NIM kamu"
                                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing || !fotoKtm || !namaKampus || !nim}
                            className="w-full bg-[#4A5D23] text-white py-4 rounded-xl font-bold hover:bg-[#3B4A1C] transition-all disabled:opacity-50 disabled:hover:bg-[#4A5D23] disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
                        >
                            {processing ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            {processing ? 'Mengirim Data...' : 'Kirim Verifikasi'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

SellerVerification.layout = page => <SellerLayout>{page}</SellerLayout>;
