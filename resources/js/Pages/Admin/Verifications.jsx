import React, { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ShieldCheck, Check, X, Eye, Clock, User, Mail, School, Hash, ArrowLeft } from 'lucide-react';

export default function AdminVerifications({ verifications }) {
    const { flash } = usePage().props;
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Verifikasi', href: '/admin/verifications' },
    ];

    const handleApprove = (id) => {
        if (confirm('Setujui user ini sebagai penjual?')) {
            router.post(`/admin/verifications/${id}/approve`);
        }
    };

    const handleReject = (id) => {
        if (!rejectReason.trim()) return alert('Masukkan alasan penolakan.');
        router.post(`/admin/verifications/${id}/reject`, { catatan_admin: rejectReason });
        setRejectId(null);
        setRejectReason('');
    };

    return (
        <DashboardLayout title="Verifikasi Seller" breadcrumbs={breadcrumbs}>
            <Head title="Admin — Verifikasi Penjual" />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-[#43552c]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Verifikasi Penjual</h1>
                            <p className="text-gray-500 mt-0.5">Review pengajuan KTM dari user untuk mendapatkan akses selller.</p>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-6 py-4 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4" />
                        </div>
                        {flash.success}
                    </div>
                )}

                {verifications.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-[#f7f9f7] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Semua Beres!</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Tidak ada pengajuan verifikasi yang tertunda saat ini.</p>
                        <Link href="/admin/dashboard" className="mt-8 inline-flex items-center gap-2 text-[#43552c] font-bold hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {verifications.map((v) => (
                            <div key={v.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                                <div className="flex flex-col lg:flex-row items-stretch gap-8">
                                    {/* KTM Preview Section */}
                                    <div className="lg:w-72 flex-shrink-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dokumen KTM</p>
                                        <a href={v.foto_ktm} target="_blank" rel="noopener" className="block relative group/img rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-[3/2]">
                                            <img src={v.foto_ktm} alt="KTM" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                                                    <Eye className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 flex flex-col pt-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{v.user.name}</h3>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {v.user.email}
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Diajukan {v.created_at}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pb-8 border-b border-gray-50">
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#f7f9f7]/50 border border-gray-100/50">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                                                    <School className="w-[18px] h-[18px] text-[#43552c]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kampus</p>
                                                    <p className="text-sm font-bold text-gray-800">{v.nama_kampus}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#f7f9f7]/50 border border-gray-100/50">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                                                    <Hash className="w-[18px] h-[18px] text-[#43552c]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NIM</p>
                                                    <p className="text-sm font-bold text-gray-800">{v.nim}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-8">
                                            {rejectId === v.id ? (
                                                <div className="space-y-4 animate-in fade-in zoom-in-95">
                                                    <textarea
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        placeholder="Tuliskan alasan mengapa pengajuan ini ditolak..."
                                                        rows={3}
                                                        className="w-full rounded-2xl border-gray-200 px-5 py-4 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none transition-shadow"
                                                    />
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => handleReject(v.id)}
                                                            className="flex-1 bg-red-500 text-white h-12 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
                                                        >
                                                            Konfirmasi Tolak
                                                        </button>
                                                        <button
                                                            onClick={() => { setRejectId(null); setRejectReason(''); }}
                                                            className="px-6 text-gray-500 text-sm font-bold hover:text-gray-900 transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => handleApprove(v.id)}
                                                        className="flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-[#43552c] text-white h-12 rounded-xl text-sm font-bold hover:bg-[#364423] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                                                    >
                                                        <Check className="w-4 h-4" /> Setujui User
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectId(v.id)}
                                                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 h-12 px-6 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" /> Tolak
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

