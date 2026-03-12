import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    MessageSquare,
    Package,
    ShoppingCart,
    Clock,
    ArrowLeft,
    Filter
} from 'lucide-react';

export default function Activities({ activities }) {
    const breadcrumbs = [
        { label: 'Seller', href: '/seller/dashboard' },
        { label: 'Aktivitas Toko', href: '/seller/activities' },
    ];

    return (
        <DashboardLayout title="Aktivitas Toko" breadcrumbs={breadcrumbs}>
            <Head title="Aktivitas Toko - Seller Dashboard" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/seller/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#43552c] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>

                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 shadow-sm hover:shadow-md transition-all">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                {/* Activities List */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50">
                        <h3 className="text-xl font-bold text-gray-900">Log Aktivitas Toko</h3>
                        <p className="text-sm text-gray-500 mt-1">Daftar penawaran dan pesanan terbaru untuk produk Anda.</p>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {activities.length > 0 ? (
                            activities.map((activity, idx) => (
                                <div key={idx} className="p-6 flex gap-4 hover:bg-gray-50/50 transition-colors group">
                                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm
                                        ${activity.type === 'offer' ? 'bg-blue-50 text-blue-500' : 'bg-[#43552c]/10 text-[#43552c]'}`}
                                    >
                                        {activity.type === 'offer' ? <MessageSquare className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg leading-tight">{activity.title}</p>
                                                <p className="text-gray-500 mt-1 leading-relaxed">{activity.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                                                <Clock className="w-3.5 h-3.5" />
                                                {activity.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-gray-400 italic">Tidak ada aktivitas yang ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
