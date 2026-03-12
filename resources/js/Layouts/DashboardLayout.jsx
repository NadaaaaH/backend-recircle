import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    Truck,
    Wallet,
    ShieldCheck,
    DollarSign,
    Grid3X3,
    ShoppingBag,
    Menu,
    X,
    Bell,
    ChevronRight,
    LogOut,
    ChevronDown,
    Store,
    Search,
    Home,
    Users,
    Clock,
} from 'lucide-react';

const sellerNav = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'Produk Saya', href: '/seller/products', icon: Package },
    { label: 'Penawaran', href: '/seller/offers', icon: MessageSquare },
    { label: 'Pesanan', href: '/seller/orders', icon: Truck },
    { label: 'Dompet', href: '/seller/balance', icon: Wallet },
];

const adminNav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Verifikasi Seller', href: '/admin/verifications', icon: ShieldCheck },
    { label: 'Kelola Pengguna', href: '/admin/users', icon: Users },
    { label: 'Semua Produk', href: '/admin/products', icon: ShoppingBag },
    { label: 'Monitoring Tawaran', href: '/admin/offers', icon: MessageSquare },
    { label: 'Data Transaksi', href: '/admin/transactions', icon: ShoppingBag },
];

function SidebarLink({ item, isActive }) {
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 group ${isActive
                ? 'bg-[#43552c]/10 text-[#43552c] font-bold'
                : 'text-gray-500 hover:bg-[#f7f9f7] hover:text-gray-800'
                }`}
        >
            <item.icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-[#43552c]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
            />
            {item.label}
        </Link>
    );
}

export default function DashboardLayout({ children, title, breadcrumbs = [] }) {
    const { auth } = usePage().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const { adminActivities, sellerActivities } = usePage().props;

    const isAdmin = auth?.user?.role === 'admin';
    const isSeller = auth?.user?.is_seller;
    const navItems = isAdmin ? adminNav : sellerNav;
    const activities = isAdmin ? adminActivities : (isSeller ? sellerActivities : []);

    const isActive = (href) => currentPath.startsWith(href);

    return (
        <div className="min-h-screen bg-[#f7f9f7]">
            {/* ── Mobile Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ═══════════════════════════════════════
                SIDEBAR (Fixed, white)
            ═══════════════════════════════════════ */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-[4px_0_24px_rgb(0,0,0,0.04)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo area */}
                <div className="flex items-center justify-between px-6 h-[72px]">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-[#43552c] rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-[#364423] transition-colors">
                            <Store className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold text-[#43552c] tracking-tight">
                            Re<span className="text-[#5e7244]">Circle</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Role Badge */}
                <div className="px-6 pt-3 pb-4">
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase ${isAdmin ? 'bg-red-50 text-red-600' : 'bg-[#43552c]/8 text-[#43552c]'
                            }`}
                    >
                        {isAdmin ? (
                            <><ShieldCheck className="w-3.5 h-3.5" /> Administrator</>
                        ) : (
                            <><Package className="w-3.5 h-3.5" /> Seller Panel</>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-gray-100/60" />

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <SidebarLink key={item.href} item={item} isActive={isActive(item.href)} />
                    ))}
                </nav>

                {/* Bottom: Back to Store */}
                <div className="px-3 pb-6 pt-3">
                    <div className="mx-3 mb-3 border-t border-gray-100/60" />
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-gray-400 hover:text-[#43552c] hover:bg-[#f7f9f7] transition-colors"
                    >
                        <Home className="w-[18px] h-[18px]" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </aside>

            {/* ═══════════════════════════════════════
                MAIN CONTENT (right of sidebar)
            ═══════════════════════════════════════ */}
            <div className="lg:pl-[260px] min-h-screen flex flex-col">
                {/* ── TOPBAR: Solid Primary (cloned from reference image header) ── */}
                <header className="sticky top-0 z-30 h-[64px] bg-[#43552c] flex items-center justify-between px-4 lg:px-8 shadow-sm">
                    {/* Left: Hamburger + Breadcrumb */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Breadcrumb — white text on dark */}
                        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                            {breadcrumbs.length > 0 ? (
                                breadcrumbs.map((crumb, idx) => (
                                    <React.Fragment key={idx}>
                                        {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
                                        {idx === breadcrumbs.length - 1 ? (
                                            <span className="font-semibold text-white">{crumb.label}</span>
                                        ) : (
                                            <Link href={crumb.href} className="text-white/50 hover:text-white/80 transition-colors">
                                                {crumb.label}
                                            </Link>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <span className="font-semibold text-white">{title}</span>
                            )}
                        </nav>
                        <span className="sm:hidden font-semibold text-white text-sm">{title}</span>
                    </div>

                    {/* Right: Search, Bell, Profile */}
                    <div className="flex items-center gap-1.5">
                        {/* Mini search */}
                        <button className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors hidden md:block">
                            <Search className="w-[18px] h-[18px]" />
                        </button>

                        {/* Notification bell */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={`relative p-2.5 rounded-xl transition-colors ${notificationsOpen ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Bell className="w-[18px] h-[18px]" />
                                {(activities && activities.length > 0) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#d4a373] rounded-full ring-2 ring-[#43552c]" />
                                )}
                            </button>

                            {notificationsOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/60 w-80 sm:w-96 z-50 overflow-hidden transform origin-top-right transition-all">
                                        <div className="px-4 py-4 border-b border-gray-100/60 flex items-center justify-between bg-gray-50/50">
                                            <h3 className="text-sm font-bold text-gray-900">Notifikasi Aktivitas</h3>
                                            <span className="text-[10px] bg-[#43552c]/10 text-[#43552c] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Terbaru</span>
                                        </div>

                                        <div className="max-h-[400px] overflow-y-auto">
                                            {activities && activities.length > 0 ? (
                                                <div className="divide-y divide-gray-50">
                                                    {activities.map((activity, idx) => (
                                                        <div key={idx} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors group">
                                                            <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm
                                                                ${activity.type === 'user' ? 'bg-blue-50 text-blue-500' :
                                                                    activity.type === 'product' || activity.type === 'order' ? 'bg-[#43552c]/10 text-[#43552c]' :
                                                                        activity.type === 'offer' ? 'bg-blue-50 text-blue-500' :
                                                                            'bg-[#d4a373]/10 text-[#d4a373]'}`}
                                                            >
                                                                {activity.type === 'user' ? <Users className="w-4 h-4" /> :
                                                                    activity.type === 'product' ? <Package className="w-4 h-4" /> :
                                                                        activity.type === 'offer' ? <MessageSquare className="w-4 h-4" /> :
                                                                            <ShoppingBag className="w-4 h-4" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#43552c] transition-colors">
                                                                    {activity.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                                    {activity.description}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> {activity.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Bell className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                    <p className="text-sm text-gray-400">Tidak ada aktivitas baru</p>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            href={isAdmin ? "/admin/activities" : "/seller/activities"}
                                            onClick={() => setNotificationsOpen(false)}
                                            className="block py-3 text-center text-xs font-bold text-[#43552c] bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100/60"
                                        >
                                            Lihat Semua Aktivitas
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative ml-1">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center font-bold text-sm">
                                    {auth?.user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-sm font-medium text-white hidden md:block">
                                    {auth?.user?.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden md:block" />
                            </button>

                            {profileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/60 py-2 w-52 z-50">
                                        <div className="px-4 py-2.5 border-b border-gray-100/60">
                                            <p className="text-sm font-semibold text-gray-800">{auth?.user?.name}</p>
                                            <p className="text-xs text-gray-400">{auth?.user?.email}</p>
                                        </div>
                                        <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                            Profil Saya
                                        </Link>
                                        <Link href="/" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                            Ke Marketplace
                                        </Link>
                                        <div className="border-t border-gray-100/60 my-1" />
                                        <Link href="/logout" method="post" as="button" className="w-full text-left block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                            <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Keluar</span>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-5 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
