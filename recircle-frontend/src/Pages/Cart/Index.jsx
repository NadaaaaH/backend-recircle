import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/Components/Navbar';

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen Countdown Timer
const CountdownTimer = ({ expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(expiresAt) - new Date();
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                return `${hours} Jam ${minutes} menit tersisa`;
            }
            return 'Waktu Habis';
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update setiap 1 menit sudah cukup untuk Jam & Menit

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (timeLeft === 'Waktu Habis') {
        return <span className="text-red-500 text-xs mt-1 block">{timeLeft}</span>;
    }

    return <span className="text-gray-500 text-xs mt-1 block">{timeLeft}</span>;
};

export default function CartIndex() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock data for initial SPA phase
    const dummyCarts = [
        {
            seller: { id: 1, name: "Budi Santoso", universitas: "IPB University" },
            items: [
                {
                    id: 1,
                    product: { id: 1, name: "MacBook Pro M1 2020", price: 12000000, image: "https://placehold.co/400x400?text=MacBook" },
                    offer: { harga_deal: 11500000, expires_at: new Date(Date.now() + 86400000).toISOString() }
                }
            ]
        }
    ];

    const [groupedCarts, setGroupedCarts] = useState(dummyCarts);

    // State untuk menyimpan ID item keranjang yang dipilih
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        document.title = "Keranjang Pembelian - ReCircle";
    }, []);

    // Toggle 1 item
    const handleSelectItem = (cartItemId) => {
        setSelectedItems((prev) =>
            prev.includes(cartItemId)
                ? prev.filter((id) => id !== cartItemId)
                : [...prev, cartItemId]
        );
    };

    // Toggle semua item milik satu penjual
    const handleSelectSellerAll = (arrayCartItemIds) => {
        // Cek apakah semua item penjual ini sudah terpilih
        const allSelected = arrayCartItemIds.every((id) => selectedItems.includes(id));
        
        if (allSelected) {
            // Uncheck semua item penjual ini
            setSelectedItems((prev) => prev.filter((id) => !arrayCartItemIds.includes(id)));
        } else {
            // Check semua item penjual ini
            setSelectedItems((prev) => {
                const newSelection = new Set([...prev, ...arrayCartItemIds]);
                return Array.from(newSelection);
            });
        }
    };

    // Kalkulasi Real-time
    const { totalPrice, totalSaved } = useMemo(() => {
        let price = 0;
        let saved = 0;

        groupedCarts.forEach((group) => {
            group.items.forEach((item) => {
                if (selectedItems.includes(item.id)) {
                    const originalPrice = item.product.price;
                    const negotiatedPrice = item.offer ? item.offer.harga_deal : originalPrice;
                    
                    price += negotiatedPrice;
                    saved += (originalPrice - negotiatedPrice);
                }
            });
        });

        return { totalPrice: price, totalSaved: saved };
    }, [selectedItems, groupedCarts]);

    return (
        <div className="min-h-screen bg-gray-50 p-28">
            <Navbar user={user} />

            <div className="max-w-3xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center space-x-2">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Keranjang Pembelian</h1>
                </div>

                {groupedCarts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">Keranjangmu masih kosong.</p>
                        <Link to="/products" className="mt-4 inline-block text-[#118B50] font-semibold">
                            Cari Barang Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedCarts.map((group) => {
                            const sellerItemIds = group.items.map((i) => i.id);
                            const isAllSellerItemsSelected = sellerItemIds.every((id) => selectedItems.includes(id));

                            return (
                                <div key={group.seller.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    {/* Header Penjual */}
                                    <div className="flex justify-between items-center p-4 border-b border-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-[#118B50] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {group.seller.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{group.seller.name}</h3>
                                                <p className="text-xs text-gray-500">{group.seller.universitas || 'Lokasi tidak diketahui'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSelectSellerAll(sellerItemIds)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                                                isAllSellerItemsSelected
                                                    ? 'bg-[#118B50] text-white border-[#118B50]'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {isAllSellerItemsSelected ? 'Terpilih (' + sellerItemIds.length + ')' : 'Pilih Semua (' + sellerItemIds.length + ')'}
                                        </button>
                                    </div>

                                    {/* Daftar Item Penjual */}
                                    <div className="p-4 space-y-4">
                                        {group.items.map((item) => {
                                            const isSelected = selectedItems.includes(item.id);
                                            const hasOffer = item.offer !== null;

                                            return (
                                                <div key={item.id} className="flex items-center space-x-4">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 text-[#118B50] border-gray-300 rounded focus:ring-[#118B50] cursor-pointer"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectItem(item.id)}
                                                    />
                                                    
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.product.image ? (
                                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</h4>
                                                        
                                                        {hasOffer ? (
                                                            <div className="mt-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs text-gray-400 line-through">{formatRupiah(item.product.price)}</span>
                                                                    <span className="text-sm font-bold text-gray-900">{formatRupiah(item.offer.harga_deal)}</span>
                                                                </div>
                                                                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#118B50]/10 text-[#118B50]">
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                    Penawaran Disetujui
                                                                </div>
                                                                <CountdownTimer expiresAt={item.offer.expires_at} />
                                                            </div>
                                                        ) : (
                                                            <div className="mt-1 text-sm font-bold text-gray-900">
                                                                {formatRupiah(item.product.price)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sticky Bottom Bar */}
            {groupedCarts.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Item yang dipilih ({selectedItems.length})</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{formatRupiah(totalPrice)}</p>
                            {totalSaved > 0 && (
                                <p className="text-xs text-[#118B50] font-medium mt-1">Kamu hemat: {formatRupiah(totalSaved)}</p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className={`px-8 py-3 rounded-xl font-bold shadow-sm transition-all ${
                                selectedItems.length > 0
                                    ? 'bg-[#118B50] text-white hover:bg-[#0a6639]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={selectedItems.length === 0}
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
