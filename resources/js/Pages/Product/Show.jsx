import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    MapPin,
    ShieldCheck,
    MessageCircle,
    Share2,
    Heart,
    AlertCircle,
    Check,
    ArrowLeft,
    Calendar,
} from "lucide-react";
import NegoModal from "@/Components/NegoModal";

export default function Show() {
    // --- DUMMY DATA (Backend Replacement Later) ---
    const product = {
        id: 1,
        name: "Sony WH-1000XM4 Noise Cancelling",
        price: 2100000,
        original_price: 4500000,
        description:
            "Pemakaian 6 bulan, kondisi baterai masih awet banget. Jarang dipake karena sibuk skripsi. Kelengkapan fullset (box, kabel, pouch). Minus pemakaian wajar di earpad dikit, tapi ga ngaruh ke suara.",
        condition: "Bekas Bagus", // Used Good
        category: "Elektronik",
        location: "Dramaga, Bogor",
        posted_at: "2 hari lalu",
        images: [
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop",
        ],
        seller: {
            name: "Dian Sastro",
            university: "Institut Pertanian Bogor",
            major: "Ilmu Komputer 2023",
            is_verified: true,
            avatar: "https://i.pravatar.cc/150?u=dian",
            joined: "Jan 2024",
        },
    };

    // State for Image Gallery Interaction
    const [activeImage, setActiveImage] = useState(
        product.images ? product.images[0] : "",
    );
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isNegoOpen, setIsNegoOpen] = useState(false);

    return (
        <MainLayout>
            <Head title={`${product.name} - ReCircle`} />

            {/* --- BREADCRUMB & BACK BUTTON --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-400 hover:text-primary transition-colors text-sm font-medium gap-1"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* --- LEFT COLUMN: GALLERY (Editorial Grid) --- */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Image */}
                        <div className="aspect-[4/3] w-full rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative group">
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Floating Action (Desktop) */}
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition-all shadow-sm"
                            >
                                <Heart
                                    className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                                />
                            </button>
                        </div>

                        {/* Thumbnails Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-primary opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}
                                >
                                    <img
                                        src={img}
                                        alt="Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: DETAILS & ACTION --- */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28 space-y-8">
                            {/* Header Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-secondary text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/10">
                                        {product.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                                        <MapPin className="w-3 h-3" />{" "}
                                        {product.location}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                                        <Calendar className="w-3 h-3" />{" "}
                                        {product.posted_at}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-3 mt-4">
                                    <span className="text-3xl font-bold text-primary">
                                        Rp{" "}
                                        {product.price.toLocaleString("id-ID")}
                                    </span>
                                    {product.original_price > product.price && (
                                        <span className="text-lg text-gray-400 line-through font-medium">
                                            Rp{" "}
                                            {product.original_price.toLocaleString(
                                                "id-ID",
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Seller Profile Card */}
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={product.seller.avatar}
                                            alt={product.seller.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                        />
                                        {product.seller.is_verified && (
                                            <div
                                                className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full border-2 border-white"
                                                title="Verified Student"
                                            >
                                                <ShieldCheck className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">
                                            {product.seller.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {product.seller.major}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {product.seller.university}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors">
                                    Lihat Profil
                                </button>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                                    Deskripsi{" "}
                                    <span className="font-serif italic text-primary font-light">
                                        Barang
                                    </span>
                                </h3>
                                <div className="prose prose-sm prose-gray text-gray-500 leading-relaxed">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {/* Condition & Safety Badge */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-secondary rounded-2xl border border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1">
                                        Kondisi
                                    </p>
                                    <p className="font-bold text-gray-800 flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary" />{" "}
                                        {product.condition}
                                    </p>
                                </div>
                                <div className="p-4 bg-secondary rounded-2xl border border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1">
                                        Keamanan
                                    </p>
                                    <p className="font-bold text-gray-800 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary" />{" "}
                                        Verifikasi KTM
                                    </p>
                                </div>
                            </div>

                            {/* Safety Notice */}
                            <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-start">
                                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Utamakan COD di area kampus atau tempat
                                    ramai. Jangan transfer uang sebelum melihat
                                    barang secara langsung.
                                </p>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden lg:flex gap-4 pt-4">
                                <button
                                    onClick={() => setIsNegoOpen(true)} // TRIGGER MODAL
                                    className="flex-1 bg-white border-2 border-primary text-primary font-bold py-4 rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    Nego Harga
                                </button>
                                <button className="flex-[2] bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                    <MessageCircle className="w-5 h-5" /> Beli
                                    Langsung
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MOBILE STICKY BOTTOM BAR --- */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-40 safe-area-pb">
                <div className="flex gap-3 max-w-7xl mx-auto">
                    <button className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                        Nego Harga
                    </button>
                    <button className="flex-[2] bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm">
                        <MessageCircle className="w-4 h-4" /> Chat WhatsApp
                    </button>
                </div>
            </div>
            <NegoModal
                isOpen={isNegoOpen}
                onClose={() => setIsNegoOpen(false)}
                product={product}
            />
        </MainLayout>
    );
}
