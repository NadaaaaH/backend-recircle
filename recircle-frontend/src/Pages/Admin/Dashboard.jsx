import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import api from '@/lib/axios';
import {
    Users,
    ShoppingBag,
    ShieldCheck,
    TrendingUp,
    ArrowUpRight,
    Clock,
    UserPlus,
    Package,
    ShoppingCart,
    Loader2
} from 'lucide-react';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashData, setDashData] = useState(null);

    useEffect(() => {
        document.title = "Admin Dashboard | ReCircle";
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/dashboard');
            setDashData(response.data?.data);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#2c4055]" />
                        <p className="text-sm font-bold text-[#2c4055] animate-pulse">Memuat Dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const stats = dashData?.stats || {};
    const monthlyStats = dashData?.monthlyStats || [];
    const recentActivities = dashData?.recentActivities || [];

    const statCards = [
        {
            label: 'Total Pengguna',
            value: stats.totalUsers || 0,
            trend: stats.usersTrend,
            icon: Users,
            bg: 'bg-blue-50',
            textColor: 'text-blue-600',
            href: '/admin/users'
        },
        {
            label: 'Total Produk',
            value: stats.totalProducts || 0,
            trend: stats.productsTrend,
            icon: ShoppingBag,
            bg: 'bg-[#2c4055]/10',
            textColor: 'text-[#2c4055]',
            href: '/admin/products'
        },
        {
            label: 'Transaksi',
            value: stats.totalTransactions || 0,
            trend: stats.transactionsTrend,
            icon: ShoppingCart,
            bg: 'bg-amber-50',
            textColor: 'text-amber-600',
            href: '/admin/transactions'
        },
        {
            label: 'Verifikasi Pending',
            value: stats.pendingVerifications || 0,
            trend: stats.verificationsTrend,
            icon: ShieldCheck,
            bg: 'bg-rose-50',
            textColor: 'text-rose-600',
            href: '/admin/verifications'
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 pb-10">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Halo, Administrator!</h2>
                        <p className="text-slate-500 mt-1 font-medium">Berikut adalah ringkasan aktivitas ReCircle hari ini.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/60 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sistem Online</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/60 group hover:shadow-md transition-shadow relative flex flex-col">
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                                <Link
                                    to={stat.href}
                                    className="text-slate-300 hover:text-[#2c4055] transition-colors p-1 z-10"
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                                    {stat.trend !== undefined && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg mb-1 ${stat.trend > 0 ? 'text-emerald-600 bg-emerald-50' :
                                            stat.trend < 0 ? 'text-rose-600 bg-rose-50' :
                                                'text-slate-500 bg-slate-50'
                                            }`}>
                                            {stat.trend > 0 ? '+' : ''}{stat.trend}%
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Link overlay spanning the card area */}
                            <Link to={stat.href} className="absolute inset-0 rounded-2xl" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Report / Chart Placeholder */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/60 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Statistik Pendapatan</h3>
                                    <p className="text-sm text-slate-500 font-medium">Total akumulasi penjualan 6 bulan terakhir</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        Aktif
                                    </div>
                                </div>
                            </div>

                            {/* Visual Dynamic Chart scaled by API response value */}
                            <div className="flex-1 flex items-end gap-3 min-h-[220px] pt-6 border-b border-slate-100 pb-2 relative">
                                {/* Gridlines */}
                                <div className="absolute inset-0 flex flex-col justify-between pt-6 pb-2 pointer-events-none">
                                    <div className="w-full border-t border-slate-100 border-dashed"></div>
                                    <div className="w-full border-t border-slate-100 border-dashed"></div>
                                    <div className="w-full"></div>
                                </div>
                                
                                {monthlyStats.length > 0 ? (
                                    monthlyStats.map((item, i) => {
                                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                                        const labelStr = monthNames[parseInt(item.month) - 1] || 'M' + item.month;

                                        const maxRev = Math.max(...monthlyStats.map(s => s.revenue), 1);
                                        const calcHeight = (item.revenue / maxRev) * 90; // Percentage range up to 90%
                                        const visualHeight = Math.max(calcHeight, 5); // enforce minimal visible representation

                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group z-10">
                                                <div className="w-full relative flex items-end justify-center h-full">
                                                    <div
                                                        className="w-full max-w-[2.5rem] bg-[#2c4055] opacity-80 rounded-t-xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-x-105 relative"
                                                        style={{ height: `${visualHeight}%` }}
                                                    >
                                                        {/* Tooltip */}
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                                                            Rp {Number(item.revenue).toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {labelStr}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
                                        Menunggu data terkumpul
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities Feed */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200/60 flex flex-col">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Aktivitas Terbaru</h3>
                                <Link to="/admin/activities" className="text-xs font-bold text-[#2c4055] hover:underline uppercase tracking-wider">Semua</Link>
                            </div>

                            <div className="space-y-5 flex-1">
                                {recentActivities.length > 0 ? recentActivities.map((activity, idx) => (
                                    <div key={idx} className="flex gap-3 relative group">
                                        {idx !== recentActivities.length - 1 && (
                                            <div className="absolute left-[16px] top-8 bottom-[-24px] w-0.5 bg-slate-100 group-hover:bg-slate-200 transition-colors" />
                                        )}
                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm z-10 border
                                            ${activity.type === 'user' ? 'bg-blue-50 border-blue-100 text-blue-500' :
                                                activity.type === 'product' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                    'bg-amber-50 border-amber-100 text-amber-600'}`}
                                        >
                                            {activity.type === 'user' ? <UserPlus className="w-4 h-4" /> :
                                                activity.type === 'product' ? <Package className="w-4 h-4" /> :
                                                    <ShoppingCart className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{activity.title}</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2 font-medium">{activity.description}</p>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-400 italic text-center py-8">Belum ada aktivitas.</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Notification Tile */}
                        <div className="bg-[#2c4055] p-8 rounded-2xl shadow-lg shadow-[#2c4055]/10 relative overflow-hidden group text-white">
                            <div className="absolute top-0 right-0 opacity-10 -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-700">
                                <ShieldCheck className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl tracking-tight mb-1">Verifikasi Pending</h3>
                                <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
                                    Ada <strong>{stats.pendingVerifications || 0}</strong> vendor menanti aktivasi identitas.
                                </p>
                                <Link
                                    to="/admin/verifications"
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#2c4055] rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm transform active:scale-95"
                                >
                                    Review Sekarang
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
