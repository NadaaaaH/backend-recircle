import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShieldCheck, Check, X, Eye, Clock } from 'lucide-react';

export default function AdminVerifications({ verifications }) {
    const { flash } = usePage().props;
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

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
        <MainLayout>
            <Head title="Admin — Verifikasi Penjual" />
            <div className="min-h-screen bg-secondary">
                <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Verifikasi Penjual</h1>
                            <p className="text-gray-500">Review pengajuan KTM dari user</p>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">{flash.success}</div>
                    )}

                    {verifications.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm">
                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Tidak ada pengajuan pending</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {verifications.map((v) => (
                                <div key={v.id} className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-start gap-5">
                                        {/* KTM Preview */}
                                        <a href={v.foto_ktm} target="_blank" rel="noopener" className="flex-shrink-0 group">
                                            <div className="w-28 h-20 rounded-xl overflow-hidden bg-gray-100 relative">
                                                <img src={v.foto_ktm} alt="KTM" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                    <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        </a>

                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{v.user.name}</p>
                                            <p className="text-sm text-gray-500">{v.user.email}</p>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                <span>Kampus: <strong>{v.nama_kampus}</strong></span>
                                                <span>NIM: <strong>{v.nim}</strong></span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{v.created_at}</p>

                                            {/* Actions */}
                                            {rejectId === v.id ? (
                                                <div className="mt-4 space-y-3">
                                                    <textarea
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        placeholder="Alasan penolakan..."
                                                        rows={2}
                                                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button onClick={() => handleReject(v.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                                                            Konfirmasi Tolak
                                                        </button>
                                                        <button onClick={() => { setRejectId(null); setRejectReason(''); }} className="text-gray-500 text-sm hover:text-gray-700">
                                                            Batal
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={() => handleApprove(v.id)}
                                                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" /> Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectId(v.id)}
                                                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" /> Tolak
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
