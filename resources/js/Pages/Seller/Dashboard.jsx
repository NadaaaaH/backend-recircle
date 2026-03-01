import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    MessageSquare,
    Truck,
    Wallet,
    Package,
    TrendingUp,
    ArrowRight,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus,
    Eye,
} from 'lucide-react';

export default function SellerDashboard({ stats, recent_orders = [] }) {
    const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

    const statusCfg = {
        pending: { bg: 'bg-yellow-50 text-yellow-700', icon: Clock, label: 'Menunggu Bayar' },
        dibayar: { bg: 'bg-blue-50 text-blue-700', icon: CheckCircle, label: 'Dibayar' },
        dikirim: { bg: 'bg-purple-50 text-purple-700', icon: Truck, label: 'Dikirim' },
        selesai: { bg: 'bg-[#43552c]/10 text-[#43552c]', icon: CheckCircle, label: 'Selesai' },
        dibatalkan: { bg: 'bg-red-50 text-red-500', icon: XCircle, label: 'Dibatalkan' },
    };

    const actionItems = [
        stats.pending_offers > 0 && {
            icon: MessageSquare,
            title: `${stats.pending_offers} penawaran masuk`,
            sub: 'Butuh respons kamu',
            href: '/seller/offers',
            accent: 'bg-amber-50 text-amber-600',
        },
        stats.needs_shipping > 0 && {
            icon: Truck,
            title: `${stats.needs_shipping} pesanan perlu dikirim`,
            sub: 'Segera kirim ke pembeli',
            href: '/seller/orders',
            accent: 'bg-blue-50 text-blue-600',
        },
    ].filter(Boolean);

    return (
        <DashboardLayout
            title="Dashboard"
            breadcrumbs={[
                { label: 'Seller', href: '/seller/dashboard' },
                { label: 'Dashboard' },
            ]}
        >
            <Head title="Dashboard Penjual" />

            {/* ═══════════════════════════════════════
                ACTION CENTER — urgent task cards
            ═══════════════════════════════════════ */}
            {actionItems.length > 0 && (
                <div className="mb-7 space-y-3">
                    {actionItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group"
                        >
                            <div className={`w-11 h-11 rounded-xl ${item.accent} flex items-center justify-center flex-shrink-0`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5 font-serif italic">{item.sub}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#43552c] group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            )}

            {/* ═══════════════════════════════════════
                WALLET TRACKER — cloned from "Store Earning" card style
            ═══════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
                {/* Saldo Aktif (Green tinted like Store Earning) */}
                <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo Aktif</p>
                            <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">siap dicairkan</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#43552c]/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[#43552c]" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight mb-4">
                        {formatPrice(stats.total_revenue)}
                    </p>
                    {/* Accent bar (mimicking the colored bars in Store Earning card) */}
                    <div className="flex gap-2 mb-4">
                        <div className="h-1.5 flex-1 bg-[#43552c] rounded-full" />
                        <div className="h-1.5 w-16 bg-[#43552c]/20 rounded-full" />
                    </div>
                    <Link
                        href="/seller/balance"
                        className="inline-flex items-center gap-1.5 text-sm text-[#43552c] font-semibold hover:underline"
                    >
                        Lihat riwayat <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Dana Ditahan / Escrow */}
                <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dana Ditahan</p>
                            <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">escrow aktif</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#d4a373]/15 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-[#d4a373]" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight mb-4">
                        {formatPrice(stats.pending_balance)}
                    </p>
                    <div className="flex gap-2 mb-4">
                        <div className="h-1.5 flex-1 bg-[#d4a373] rounded-full" />
                        <div className="h-1.5 w-16 bg-[#d4a373]/20 rounded-full" />
                    </div>
                    <p className="text-xs text-gray-400">Dilepas setelah buyer konfirmasi terima barang</p>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                STORE STATISTICS — cloned card style with status badges
            ═══════════════════════════════════════ */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50 mb-7">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Statistik Toko</h3>
                    <Link
                        href="/seller/products"
                        className="text-xs text-[#43552c] font-semibold hover:underline flex items-center gap-1"
                    >
                        Kelola produk <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Main metric */}
                <p className="text-sm text-gray-500 mb-1">Total Produk</p>
                <p className="text-4xl font-black text-gray-900 mb-6">{stats.total_products}</p>

                {/* Status badges — like the reference image's Approved/Disapproved/Disabled */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#43552c]/8 border-l-[3px] border-[#43552c]">
                        <span className="text-sm font-bold text-[#43552c]">Aktif: {stats.active_products}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4a373]/10 border-l-[3px] border-[#d4a373]">
                        <span className="text-sm font-bold text-[#d4a373]">Terjual: {stats.total_sold}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border-l-[3px] border-gray-300">
                        <span className="text-sm font-bold text-gray-500">Pesanan Aktif: {stats.active_orders}</span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                QUICK ACTIONS
            ═══════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {[
                    { label: 'Tambah Produk', icon: Plus, href: '/jual', primary: true },
                    { label: 'Penawaran', icon: MessageSquare, href: '/seller/offers', badge: stats.pending_offers },
                    { label: 'Pesanan', icon: Truck, href: '/seller/orders', badge: stats.active_orders },
                    { label: 'Dompet', icon: Wallet, href: '/seller/balance' },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className={`relative rounded-2xl p-5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group ${action.primary
                                ? 'bg-[#43552c] text-white shadow-[0_4px_20px_rgb(67,85,44,0.3)]'
                                : 'bg-white text-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50'
                            }`}
                    >
                        <action.icon className={`w-5 h-5 mb-3 ${action.primary ? 'text-white/80' : 'text-gray-400'}`} />
                        <p className={`text-sm font-semibold ${action.primary ? '' : 'text-gray-800'}`}>{action.label}</p>
                        {action.badge > 0 && (
                            <span className="absolute top-3 right-3 w-5 h-5 bg-[#d4a373] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {action.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            {/* ═══════════════════════════════════════
                ACTIVITY FEED — recent orders (clean list cards)
            ═══════════════════════════════════════ */}
            <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100/50">
                <div className="flex items-center justify-between px-6 py-5">
                    <h3 className="text-sm font-bold text-gray-900">Aktivitas Terbaru</h3>
                    <Link
                        href="/seller/orders"
                        className="text-xs text-[#43552c] font-semibold hover:underline flex items-center gap-1"
                    >
                        Semua pesanan <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recent_orders.length === 0 ? (
                    <div className="px-6 pb-10 pt-4 text-center">
                        <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 font-serif italic">Belum ada aktivitas pesanan</p>
                    </div>
                ) : (
                    <div>
                        {recent_orders.map((order, idx) => {
                            const cfg = statusCfg[order.status] || statusCfg.pending;
                            return (
                                <div
                                    key={order.id}
                                    className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f7f9f7]/60 transition-colors ${idx < recent_orders.length - 1 ? 'border-b border-gray-50' : ''
                                        }`}
                                >
                                    <img
                                        src={
                                            order.product_img ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(order.product_name)}&background=f7f9f7&color=43552c&size=44`
                                        }
                                        alt=""
                                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-gray-100/50"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{order.product_name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                                            {order.buyer_name} &middot; {order.kode_pesanan}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.bg}`}>
                                            <cfg.icon className="w-3 h-3" />
                                            {cfg.label}
                                        </span>
                                        <p className="text-[11px] text-gray-400 mt-1.5">{order.created_at}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
