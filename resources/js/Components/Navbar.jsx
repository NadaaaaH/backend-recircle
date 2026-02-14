import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
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
                    <div className="hidden md:flex items-center space-x-6">
                        {auth.user ? (
                            <>
                                <Link
                                    href="#"
                                    className="p-2 text-gray-500 hover:text-primary relative"
                                >
                                    <Heart className="w-6 h-6" />
                                </Link>
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-700">
                                            {auth.user.name}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("login")}
                                    className="text-gray-600 font-medium hover:text-primary"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route("register")}
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
                </div>
            )}
        </nav>
    );
}
