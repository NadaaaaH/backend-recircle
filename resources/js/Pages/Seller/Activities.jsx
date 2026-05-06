import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import {
    MessageSquare,
    Package,
    ShoppingCart,
    Clock,
    ArrowLeft,
    Filter
} from 'lucide-react';

export default function Activities({ activities }) {
    return (
        <div className="pb-12 max-w-[1000px] mx-auto">
            <Head>
                <title>Aktivitas Toko | ReCircle</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Header Section */}
            <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <Link
                    href="/seller/dashboard"
                    className="p-3 bg-white border border-slate-200/70 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Aktivitas Toko</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Pantau semua aktivitas dan notifikasi terkait tokomu</p>
                </div>
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/70 rounded-xl text-sm font-bold text-slate-600 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-slate-50 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            <div className="bg-white rounded-[1.25rem] shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/70 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between sm:hidden">
                    <h3 className="text-xl font-bold text-slate-900">Log Aktivitas</h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-bold text-slate-600">
                        <Filter className="w-3 h-3" />
                        Filter
                    </button>
                </div>

                <div className="divide-y divide-slate-100">
                    {activities.length > 0 ? (
                        activities.map((activity, idx) => (
                            <div key={idx} className="p-5 md:p-6 flex gap-4 hover:bg-slate-50/50 transition-colors group">
                                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border
                                    ${activity.type === 'offer' ? 'bg-blue-50 text-blue-600 border-blue-100/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'}`}
                                >
                                    {activity.type === 'offer' ? <MessageSquare className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                    <div>
                                        <p className="font-bold text-slate-900 text-base leading-tight">{activity.title}</p>
                                        <p className="text-slate-500 mt-1 text-sm leading-relaxed">{activity.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 w-fit">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Package className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada aktivitas</h3>
                            <p className="text-slate-500 text-sm">Aktivitas toko seperti pesanan masuk akan muncul di sini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Activities.layout = page => <SellerLayout>{page}</SellerLayout>;
