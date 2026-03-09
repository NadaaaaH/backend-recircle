import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Users,
    ShoppingBag,
    ShieldCheck,
    TrendingUp,
    ArrowUpRight,
    Clock,
    UserPlus,
    Package,
    ShoppingCart
} from 'lucide-react';

export default function Dashboard({ stats, monthlyStats, recentActivities }) {
    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Dashboard', href: '/admin/dashboard' },
    ];

    const statCards = [
        {
            label: 'Total Pengguna',
            value: stats.total_users,
            icon: Users,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            textColor: 'text-blue-600',
            href: '/admin/users'
        },
        {
            label: 'Total Produk',
            value: stats.total_products,
            icon: ShoppingBag,
            color: 'bg-[#43552c]',
            bg: 'bg-[#43552c]/10',
            textColor: 'text-[#43552c]',
            href: '/admin/products'
        },
        {
            label: 'Transaksi Berhasil',
            value: stats.total_transactions,
            icon: ShoppingCart,
            color: 'bg-[#d4a373]',
            bg: 'bg-[#d4a373]/10',
            textColor: 'text-[#d4a373]',
            href: '/admin/transactions'
        },
        {
            label: 'Verifikasi Pending',
            value: stats.pending_verifications,
            icon: ShieldCheck,
            color: 'bg-red-500',
            bg: 'bg-red-50',
            textColor: 'text-red-600',
            href: '/admin/verifications'
        },
    ];

    return (
        <DashboardLayout title="Dashboard Overview" breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Halo, Administrator!</h2>
                        <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas ReCircle hari ini.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-gray-600">Sistem Online</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-md transition-shadow relative">
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                                <Link
                                    href={stat.href}
                                    className="text-gray-300 hover:text-[#43552c] transition-colors p-1"
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                    {/* Dummy trend */}
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">
                                        +12%
                                    </span>
                                </div>
                            </div>
                            {/* Overlay link for the whole card */}
                            <Link href={stat.href} className="absolute inset-0 rounded-[2rem]" aria-label={stat.label} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Report / Chart Placeholder */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Statistik Penjualan</h3>
                                    <p className="text-sm text-gray-500">Pertumbuhan 6 bulan terakhir</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-medium text-gray-600">
                                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                        Meningkat
                                    </div>
                                </div>
                            </div>

                            {/* Simple Visual Chart from real data */}
                            <div className="flex-1 flex items-end gap-3 min-h-[200px] pt-4">
                                {monthlyStats.length > 0 ? (
                                    monthlyStats.map((stat, i) => {
                                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                                        const monthLabel = monthNames[parseInt(stat.month) - 1] || '???';

                                        // Calculate height relative to max revenue or a fixed max
                                        const maxRevenue = Math.max(...monthlyStats.map(s => s.revenue), 1);
                                        const height = (stat.revenue / maxRevenue) * 90 + 10; // min 10% height

                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                                <div
                                                    className="w-full bg-[#f7f9f7] rounded-xl relative overflow-hidden group-hover:bg-[#43552c]/5 transition-colors"
                                                    style={{ height: '100%' }}
                                                >
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 bg-[#43552c] rounded-t-xl transition-all duration-1000 ease-out sm:opacity-80 group-hover:opacity-100"
                                                        style={{ height: `${height}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {monthLabel}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                                        Belum ada data transaksi
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities Feed */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h3>
                                <Link href="#" className="text-xs font-bold text-[#43552c] hover:underline">Lihat Semua</Link>
                            </div>

                            <div className="space-y-6">
                                {recentActivities.map((activity, idx) => (
                                    <div key={idx} className="flex gap-4 relative group">
                                        {idx !== recentActivities.length - 1 && (
                                            <div className="absolute left-[18px] top-10 bottom-[-24px] w-0.5 bg-gray-100" />
                                        )}
                                        <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm z-10 
                                            ${activity.type === 'user' ? 'bg-blue-50 text-blue-500' :
                                                activity.type === 'product' ? 'bg-[#43552c]/10 text-[#43552c]' :
                                                    'bg-[#d4a373]/10 text-[#d4a373]'}`}
                                        >
                                            {activity.type === 'user' ? <UserPlus className="w-4 h-4" /> :
                                                activity.type === 'product' ? <Package className="w-4 h-4" /> :
                                                    <ShoppingCart className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 leading-none">{activity.title}</p>
                                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{activity.description}</p>
                                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-medium text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#43552c] p-8 rounded-[2rem] shadow-lg shadow-[#43552c]/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-24 h-24 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg relative z-10">Verifikasi Seller</h3>
                            <p className="text-white/70 text-sm mt-2 relative z-10 leading-relaxed">
                                Ada <strong>{stats.pending_verifications}</strong> pengajuan yang butuh review.
                            </p>
                            <Link
                                href="/admin/verifications"
                                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#43552c] rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm relative z-10"
                            >
                                Proses Sekarang
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
