import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    ShieldCheck,
    MessageSquare,
    ShoppingCart,
    Activity,
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    X,
    User,
    Settings
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Pengguna', href: '/admin/users', icon: Users },
        { name: 'Produk', href: '/admin/products', icon: ShoppingBag },
        { name: 'Transaksi', href: '/admin/transactions', icon: ShoppingCart },
        { name: 'Penawaran', href: '/admin/offers', icon: MessageSquare },
        { name: 'Verifikasi', href: '/admin/verifications', icon: ShieldCheck },
        { name: 'Aktivitas', href: '/admin/activities', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/60 transform transition-transform duration-300 ease-in-out flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="h-20 flex items-center px-8 border-b border-slate-200/60">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-[#43552c] rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-[#324021] transition-colors">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Re<span className="text-[#43552c]">Circle</span>
                            </span>
                            <p className="text-[9px] font-bold text-[#d4a373] uppercase tracking-widest -mt-0.5">Admin Panel</p>
                        </div>
                    </Link>
                    {/* Mobile Close */}
                    <button
                        className="ml-auto lg:hidden text-slate-500 hover:text-slate-900"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 py-6 overflow-y-auto">
                    <div className="px-4 mb-4">
                        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Menu Admin</p>
                    </div>
                    <nav className="space-y-1 px-3">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                        ${active
                                            ? 'bg-[#43552c] text-white shadow-sm shadow-[#43552c]/30'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User info + Logout */}
                <div className="p-4 border-t border-slate-200/60 space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#43552c]/10 text-[#43552c] flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-[#43552c] font-bold">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        {title && (
                            <h1 className="text-base font-bold text-slate-800 hidden sm:block">{title}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="w-px h-8 bg-slate-200/60 hidden sm:block"></div>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#43552c]/10 text-[#43552c] flex items-center justify-center border border-[#43552c]/20 font-bold text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                            </button>

                            {isProfileDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-50">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Pengaturan Profil
                                        </Link>
                                        <Link
                                            to="/"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                        >
                                            Kembali ke Beranda
                                        </Link>
                                        <hr className="my-1 border-slate-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
