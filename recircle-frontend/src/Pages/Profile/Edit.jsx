import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    User,
    Settings,
    ShoppingBag,
    Clock,
    Star,
    ShieldCheck,
    LogOut,
    ChevronRight,
    MapPin,
    Package,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

export default function Edit() {
    const { user, logout, isSeller } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("orders");

    // Mock data for initial SPA phase
    const stats = { verified: false, rating: 5.0, reviews_count: 0 };
    const orders = { ongoing: [], history: [] };

    useEffect(() => {
        document.title = "Profil & Pengaturan | ReCircle";
    }, []);

    const StatusBadge = ({ status }) => {
        const colors = {
            "Menunggu COD": "bg-yellow-100 text-yellow-700 border-yellow-200",
            Selesai: "bg-green-100 text-green-700 border-green-200",
            Dibatalkan: "bg-red-100 text-red-700 border-red-200",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${colors[status] || "bg-gray-100"}`}
            >
                {status}
            </span>
        );
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-secondary">
            <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>
                {/* --- 1. PROFILE CARD HERO --- */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm mb-8 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-secondary border-4 border-white shadow-lg overflow-hidden">
                                <img
                                    src={
                                        user?.avatar_url
                                            || `https://ui-avatars.com/api/?name=${user?.name}&background=43552c&color=fff`
                                    }
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Verification Badge */}
                            <div
                                className={`absolute bottom-0 right-0 p-1.5 rounded-full border-2 border-white shadow-sm ${stats.verified ? "bg-blue-500" : "bg-gray-400"}`}
                            >
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-2xl font-black text-gray-900 mb-1">
                                {user?.name}
                            </h3>
                            <p className="text-gray-500 font-medium text-xs mb-2">
                                Mahasiswa •{" "}
                                {user?.kampus || "Kampus Belum Diatur"}
                            </p>
                            {/* Stats Row */}
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="font-bold text-gray-900">
                                        {stats.rating}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        ({stats.reviews_count} ulasan)
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-gray-200"></div>
                                <div>
                                    <p className="text-xs text-gray-400">
                                        Bergabung
                                    </p>
                                    <p className="font-bold text-gray-900 text-sm">
                                        Jan 2026
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action: Daftar Penjual (Jika belum verified) */}
                        {!stats.verified && (
                            <div className="mt-4 md:mt-0">
                                <button className="bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />{" "}
                                    Verifikasi Mahasiswa
                                </button>
                                <p className="text-[10px] text-gray-400 mt-2 text-center md:text-right max-w-[150px]">
                                    Upload KTM untuk mulai berjualan.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                </div>

                {/* --- 2. TABS NAVIGATION (Pill Style) --- */}
                <div className="flex p-1 bg-white border border-gray-100 rounded-2xl mb-8 shadow-sm overflow-x-auto">
                    {[
                        {
                            id: "orders",
                            label: "Pesanan Berlangsung",
                            icon: Package,
                        },
                        {
                            id: "history",
                            label: "Riwayat Belanja",
                            icon: Clock,
                        },
                        { id: "settings", label: "Pengaturan", icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-secondary text-primary shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- 3. TAB CONTENT --- */}

                {/* TAB: ONGOING ORDERS */}
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">
                                Sedang Diproses
                            </h3>
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-md font-bold">
                                {orders.ongoing.length}
                            </span>
                        </div>

                        {orders.ongoing.length > 0 ? (
                            orders.ongoing.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:border-primary/30 transition-colors shadow-sm"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={order.img}
                                            alt={order.product}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900 line-clamp-1">
                                                    {order.product}
                                                </h4>
                                                <StatusBadge
                                                    status={order.status}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Penjual: {order.seller}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-primary font-bold">
                                                Rp{" "}
                                                {order.price.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </p>
                                            <button className="text-xs font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover">
                                                Chat Penjual
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="Belum ada pesanan aktif." />
                        )}
                    </div>
                )}

                {/* TAB: HISTORY */}
                {activeTab === "history" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">
                                Riwayat Transaksi
                            </h3>
                        </div>
                        {orders.history.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 opacity-80 hover:opacity-100 transition-opacity"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden grayscale">
                                    <img
                                        src={order.img}
                                        alt={order.product}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-700">
                                            {order.product}
                                        </h4>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {order.id} • {order.seller}
                                    </p>

                                    {order.status === "Selesai" &&
                                        !order.rating_given && (
                                            <button className="text-xs font-bold text-primary border border-primary/20 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors">
                                                Beri Ulasan
                                            </button>
                                        )}
                                    {order.rating_given && (
                                        <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                            <Star className="w-3 h-3 fill-current" />{" "}
                                            {order.rating_given}.0
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB: SETTINGS (Menu Grid) */}
                {activeTab === "settings" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Profile Edit */}
                        <div
                            onClick={() => navigate('/profile/edit')}
                            className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900">
                                Edit Profil
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Nama, Email, Foto Profil, Bio
                            </p>
                        </div>

                        {/* Address */}
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900">
                                Alamat & Titik COD
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Atur lokasi pertemuan favoritmu
                            </p>
                        </div>

                        {/* Seller Center */}
                        <div
                            onClick={() => navigate(isSeller ? '/seller/dashboard' : '/seller/verification')}
                            className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900">
                                Menu Penjual
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Kelola barang daganganmu
                            </p>
                        </div>

                        {/* Security */}
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900">
                                Keamanan Akun
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Password & Verifikasi 2 Langkah
                            </p>
                        </div>

                        {/* Logout Button (Full Width) */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Keluar Akun
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </MainLayout>
    );
}

// Helper: Empty State
const EmptyState = ({ message }) => (
    <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm text-gray-400 font-medium">{message}</p>
    </div>
);
