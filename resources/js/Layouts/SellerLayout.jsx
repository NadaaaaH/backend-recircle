import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Wallet,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function SellerLayout({ children, user }) {
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menus = [
        {
            name: "Ringkasan",
            icon: LayoutDashboard,
            href: route("seller.dashboard"),
        },
        { name: "Produk Saya", icon: Package, href: route("products.index") },
        { name: "Pesanan", icon: ShoppingBag, href: route("orders.index") },
        { name: "Keuangan", icon: Wallet, href: route("finance.index") },
        { name: "Pengaturan", icon: Settings, href: route("settings") },
    ];

    const isActive = (href) => url === href || url.startsWith(href + "/");

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* --- DESKTOP SIDEBAR (FIXED KIRI) --- */}
            <aside
                className={`hidden lg:flex flex-col bg-primary fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out shadow-xl border-r border-primary-dark ${
                    isCollapsed ? "w-20" : "w-64"
                }`}
            >
                {/* TOMBOL COLLAPSE MELAYANG (ABSOLUTE) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-4 top-16 bg-white border border-gray-200 text-gray-400 hover:text-primary w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all z-50"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>

                <div className="h-16 flex items-center justify-center border-b border-white/10 shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                        {isCollapsed ? (
                            <span className="text-2xl font-black text-white italic tracking-tighter">
                                R.
                            </span>
                        ) : (
                            <div className="flex items-baseline gap-1 animate-fadeIn">
                                <span className="text-2xl font-black text-white italic tracking-tighter">
                                    Re
                                    <span className="text-primary-light">
                                        Circle
                                    </span>
                                </span>
                                <span className="text-[10px] font-bold text-white bg-white/20 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                    Seller
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                <div
                    className={`py-6 flex flex-col items-center border-b border-white/10 transition-all shrink-0 ${isCollapsed ? "px-2" : "px-6"}`}
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-black text-lg shadow-inner mb-2 shrink-0">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    {!isCollapsed && (
                        <div className="text-center overflow-hidden w-full animate-fadeIn">
                            <h3 className="text-white font-bold text-sm truncate">
                                {user?.name || "Toko Penjual"}
                            </h3>
                            <p className="text-primary-light text-[10px] uppercase tracking-wider mt-0.5">
                                Verified
                            </p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {menus.map((menu) => (
                        <Link
                            key={menu.name}
                            href={menu.href}
                            title={isCollapsed ? menu.name : ""}
                            className={`flex items-center transition-all duration-200 ${
                                isCollapsed
                                    ? "justify-center mx-3 py-3 rounded-xl"
                                    : "gap-3 mx-4 px-4 py-3 rounded-xl"
                            } ${
                                isActive(menu.href)
                                    ? "bg-white text-primary shadow-md"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <menu.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && (
                                <span className="font-bold text-sm whitespace-nowrap">
                                    {menu.name}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        title={isCollapsed ? "Keluar" : ""}
                        className={`flex items-center text-red-200 hover:text-white bg-red-500/10 hover:bg-red-500/30 transition-colors ${
                            isCollapsed
                                ? "justify-center p-3 rounded-xl"
                                : "gap-3 px-4 py-3 rounded-xl"
                        }`}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isCollapsed && (
                            <span className="font-bold text-sm">Keluar</span>
                        )}
                    </Link>
                </div>
            </aside>

            {/* --- MOBILE DRAWER (TETAP SAMA, DIHILANGKAN SEMENTARA DARI SNIPPET AGAR FOKUS KE DESKTOP. JANGAN DIHAPUS DI KODEMU YA!) --- */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="relative w-[280px] max-w-[80vw] bg-primary h-full flex flex-col shadow-2xl animate-slideRight">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                            <span className="text-2xl font-black text-white italic tracking-tighter">
                                Re
                                <span className="text-primary-light">
                                    Circle.
                                </span>
                            </span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white/50 hover:text-white p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 border-b border-white/10 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-white truncate">
                                    {user?.name || "Toko Penjual"}
                                </p>
                                <p className="text-xs text-primary-light mt-0.5">
                                    Verified Seller
                                </p>
                            </div>
                        </div>
                        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
                            {menus.map((menu) => (
                                <Link
                                    key={menu.name}
                                    href={menu.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 mx-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${isActive(menu.href) ? "bg-white text-primary shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                                >
                                    <menu.icon className="w-5 h-5 shrink-0" />{" "}
                                    {menu.name}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* --- AREA KONTEN UTAMA --- */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
            >
                {/* --- TOPBAR --- */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {/* Judul Halaman Kontekstual di Desktop */}
                        <div className="hidden lg:block">
                            <h2 className="text-lg font-black text-gray-900 leading-none">
                                Seller Dashboard
                            </h2>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari pesanan atau produk..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-full transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
                        </button>
                        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <span className="hidden sm:block text-sm font-bold text-gray-700">
                                        {user?.name || "Toko Penjual"}
                                    </span>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route("settings")}>
                                    Pengaturan Toko
                                </Dropdown.Link>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profil Akun
                                </Dropdown.Link>
                                <div className="border-t border-gray-100"></div>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="text-red-600 font-medium"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
