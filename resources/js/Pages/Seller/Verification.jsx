import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
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
            <MainLayout>
                <Head title="Verifikasi Penjual" />
                <div className="min-h-screen bg-secondary flex items-center justify-center">
                    <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-lg">
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sudah Terverifikasi!</h2>
                        <p className="text-gray-500 mb-6">Akun kamu sudah terverifikasi sebagai penjual. Kamu bisa mulai menjual barang.</p>
                        <a href="/jual" className="inline-block bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors font-medium">
                            Mulai Jual Barang
                        </a>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Verifikasi Penjual" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-xl mx-auto px-4 py-8 pt-28">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Verifikasi Penjual</h1>
                        <p className="text-gray-500 mt-2">Upload foto KTM untuk memverifikasi akun penjualmu</p>
                    </div>

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{flash.success}</div>
                    )}

                    {/* Status verifikasi terakhir */}
                    {latestVerification && (
                        <div className={`rounded-2xl p-5 mb-6 ${latestVerification.status === 'pending' ? 'bg-amber-50 border border-amber-200' :
                                latestVerification.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                                    'bg-green-50 border border-green-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                {latestVerification.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
                                {latestVerification.status === 'rejected' && <XCircle className="w-5 h-5 text-red-500" />}
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {latestVerification.status === 'pending' && 'Menunggu review admin...'}
                                        {latestVerification.status === 'rejected' && 'Verifikasi ditolak'}
                                    </p>
                                    {latestVerification.catatan_admin && (
                                        <p className="text-sm text-gray-600 mt-1">Alasan: {latestVerification.catatan_admin}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">{latestVerification.created_at}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form hanya ditampilkan jika belum ada pending */}
                    {(!latestVerification || latestVerification.status === 'rejected') && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 shadow-sm space-y-6">
                            {/* Foto KTM */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto KTM</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                                    onClick={() => document.getElementById('ktm-input').click()}
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview KTM" className="max-h-48 mx-auto rounded-lg" />
                                    ) : (
                                        <>
                                            <Camera className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">Klik untuk upload foto KTM</p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, max 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input id="ktm-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>

                            {/* Nama Kampus */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kampus</label>
                                <input
                                    type="text"
                                    value={namaKampus}
                                    onChange={(e) => setNamaKampus(e.target.value)}
                                    placeholder="Contoh: IPB University"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    required
                                />
                            </div>

                            {/* NIM */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
                                <input
                                    type="text"
                                    value={nim}
                                    onChange={(e) => setNim(e.target.value)}
                                    placeholder="Masukkan NIM kamu"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !fotoKtm || !namaKampus || !nim}
                                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                {processing ? 'Mengirim...' : 'Kirim Verifikasi'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
