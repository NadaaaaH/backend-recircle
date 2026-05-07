import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, ShoppingCart, Menu, X, Store, ClipboardList, Package, ShieldCheck, LogOut, MessageCircle } from "lucide-react";
import axios from "@/lib/axios";

export default function Navbar() {
    const [auth, setAuth] = useState({ user: null });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        // Fetch current authenticated user info
        axios.get('/user')
            .then(response => {
                setAuth({ user: response.data.data });
            })
            .catch(() => {
                setAuth({ user: null });
            });
    }, []);

    // Robust click-away listener to automatically close dropdowns
    useEffect(() => {
        const handleOutsideClick = () => {
            setIsDropdownOpen(false);
        };
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setAuth({ user: null });
            window.location.href = '/login';
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-soft group-hover:bg-primary-hover transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold text-primary tracking-tight">
                                Re
                                <span className="text-primary-light">
                                    Circle
                                </span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 mx-12 max-w-xl relative group">
                        <input
                            type="text"
                            placeholder="Cari barang..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 text-sm transition-all"
                        />
                        <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                    </div>

                    {/* Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="p-2 text-gray-500 hover:text-primary transition-colors relative"
                                    title="Keranjang"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/chat"
                                    className="p-2 text-gray-500 hover:text-primary transition-colors"
                                    title="Pesan"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/my-offers"
                                    className="p-2 text-gray-500 hover:text-primary transition-colors"
                                    title="Penawaran Saya"
                                >
                                    <ClipboardList className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/orders"
                                    className="p-2 text-gray-500 hover:text-primary transition-colors"
                                    title="Pesanan Saya"
                                >
                                    <Package className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Wishlist Saya"
                                >
                                    <Heart className="w-5 h-5" />
                                </Link>

                                {/* User Dropdown */}
                                <div className="relative pl-3 border-l border-gray-200">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent immediate closing from document listener
                                            setIsDropdownOpen(!isDropdownOpen);
                                        }}
                                        className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-gray-700">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {auth.user.is_seller ? 'Penjual' : auth.user.role === 'admin' ? 'Admin' : 'Pembeli'}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                            {auth.user.name ? auth.user.name.charAt(0) : 'U'}
                                        </div>
                                    </button>

                                    {isDropdownOpen && (
                                        <div 
                                            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside it
                                            className="absolute right-0 top-14 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                                        >
                                            {auth.user.is_seller && (
                                                <Link 
                                                    to="/seller/dashboard" 
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary transition-colors"
                                                >
                                                    <Store className="w-4 h-4 text-primary" /> Dashboard Penjual
                                                </Link>
                                            )}
                                            {!auth.user.is_seller && auth.user.role !== 'admin' && (
                                                <Link 
                                                    to="/seller/verification" 
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary transition-colors"
                                                >
                                                    <ShieldCheck className="w-4 h-4 text-primary" /> Jadi Penjual
                                                </Link>
                                            )}
                                            {auth.user.role === 'admin' && (
                                                <Link 
                                                    to="/admin/verifications" 
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary transition-colors"
                                                >
                                                    <ShieldCheck className="w-4 h-4 text-primary" /> Admin Panel
                                                </Link>
                                            )}
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary transition-colors"
                                            >
                                                <Heart className="w-4 h-4 text-gray-400" /> Profil Saya
                                            </Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button 
                                                onClick={(e) => {
                                                    setIsDropdownOpen(false);
                                                    handleLogout(e);
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" /> Keluar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 font-medium hover:text-primary"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium shadow-soft transition-all hover:-translate-y-0.5"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-600 p-2"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden px-4 pb-4 bg-white border-b border-gray-100">
                    <div className="relative mb-4 mt-2">
                        <input
                            type="text"
                            placeholder="Cari barang..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-none text-sm"
                        />
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    </div>
                    {auth.user && (
                        <div className="space-y-1">
                            <Link to="/cart" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary rounded-xl">Keranjang</Link>
                            <Link to="/chat" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary rounded-xl">Pesan</Link>
                            <Link to="/my-offers" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary rounded-xl">Penawaran Saya</Link>
                            <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary rounded-xl">Pesanan Saya</Link>
                            <Link to="/wishlist" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl">Wishlist Saya</Link>
                            {auth.user.is_seller && (
                                <Link to="/seller/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary rounded-xl">Dashboard Penjual</Link>
                            )}
                            {!auth.user.is_seller && auth.user.role !== 'admin' && (
                                <Link to="/seller/verification" className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-secondary rounded-xl">Jadi Penjual</Link>
                            )}
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl">Keluar</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
