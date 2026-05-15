import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/Components/Navbar';
import api from '@/lib/axios';
import { Loader2, Trash2 } from 'lucide-react';

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
        if (!expiresAt) return;
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
        }, 60000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (!expiresAt) return null;

    if (timeLeft === 'Waktu Habis') {
        return <span className="text-red-500 text-xs mt-1 block">{timeLeft}</span>;
    }

    return <span className="text-gray-500 text-xs mt-1 block">{timeLeft}</span>;
};

export default function CartIndex() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [groupedCarts, setGroupedCarts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]); // List of cart item IDs

    useEffect(() => {
        document.title = "Keranjang Pembelian - ReCircle";
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/carts');
            // Response will be wrapped in standard resource format from ApiV1 controller
            setGroupedCarts(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = async (cartId) => {
        if (!confirm("Hapus item ini dari keranjang?")) return;
        try {
            await api.delete(`/carts/${cartId}`);
            // Refetch or manually filter
            setGroupedCarts(prev => 
                prev.map(group => ({
                    ...group,
                    items: group.items.filter(i => i.id !== cartId)
                })).filter(group => group.items.length > 0)
            );
            setSelectedItems(prev => prev.filter(id => id !== cartId));
        } catch (error) {
            alert("Gagal menghapus item.");
        }
    };

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
        const allSelected = arrayCartItemIds.every((id) => selectedItems.includes(id));
        
        if (allSelected) {
            setSelectedItems((prev) => prev.filter((id) => !arrayCartItemIds.includes(id)));
        } else {
            setSelectedItems((prev) => {
                const newSelection = new Set([...prev, ...arrayCartItemIds]);
                return Array.from(newSelection);
            });
        }
    };

    // Kalkulasi Real-time based on CamelCase API resources
    const { totalPrice, totalSaved } = useMemo(() => {
        let price = 0;
        let saved = 0;

        groupedCarts.forEach((group) => {
            group.items.forEach((item) => {
                if (selectedItems.includes(item.id)) {
                    const originalPrice = Number(item.normalPrice || 0);
                    const negotiatedPrice = item.negotiatedPrice ? Number(item.negotiatedPrice) : originalPrice;
                    
                    price += negotiatedPrice;
                    saved += (originalPrice - negotiatedPrice);
                }
            });
        });

        return { totalPrice: price, totalSaved: saved };
    }, [selectedItems, groupedCarts]);

    const handleCheckoutClick = () => {
        if (selectedItems.length === 0) return;
        
        // Currently backend only supports one product checkout per hit
        if (selectedItems.length > 1) {
            alert("Maaf, untuk saat ini sistem hanya mendukung checkout 1 barang sekali bayar. Silakan pilih 1 item saja.");
            return;
        }

        // Find the selected item and get its product ID and offer ID
        let targetItem = null;
        for (const group of groupedCarts) {
            const found = group.items.find(i => i.id === selectedItems[0]);
            if (found) {
                targetItem = found;
                break;
            }
        }

        if (targetItem) {
            // Use actual offerId passed from resource to preserve accepted negotiation price
            const qs = targetItem.offerId ? `?offer_id=${targetItem.offerId}` : ''; 
            navigate(`/checkout/${targetItem.productId}${qs}`);
        }
    };

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

                {isLoading ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Loader2 className="w-8 h-8 animate-spin text-[#118B50] mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Memuat isi keranjang...</p>
                    </div>
                ) : groupedCarts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">Keranjangmu masih kosong.</p>
                        <Link to="/explore" className="mt-4 inline-block text-[#118B50] font-semibold">
                            Cari Barang Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 pb-32">
                        {groupedCarts.map((group) => {
                            const sellerItemIds = group.items.map((i) => i.id);
                            const isAllSellerItemsSelected = sellerItemIds.every((id) => selectedItems.includes(id));

                            return (
                                <div key={group.seller.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    {/* Header Penjual */}
                                    <div className="flex justify-between items-center p-4 border-b border-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-[#118B50]/10 text-[#118B50] rounded-full flex items-center justify-center font-bold text-sm">
                                                {group.seller.name ? group.seller.name.substring(0, 2).toUpperCase() : 'UN'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{group.seller.name || 'Penjual'}</h3>
                                                <p className="text-xs text-gray-500">{group.seller.universitas || 'Lokasi tidak diketahui'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSelectSellerAll(sellerItemIds)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                                isAllSellerItemsSelected
                                                    ? 'bg-[#118B50] text-white border-[#118B50]'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {isAllSellerItemsSelected ? 'Terpilih' : 'Pilih Semua'}
                                        </button>
                                    </div>

                                    {/* Daftar Item Penjual */}
                                    <div className="p-4 space-y-4">
                                        {group.items.map((item) => {
                                            const isSelected = selectedItems.includes(item.id);
                                            const hasOffer = item.negotiatedPrice !== null && item.negotiatedPrice > 0;

                                            return (
                                                <div key={item.id} className="flex items-center space-x-4 group">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 text-[#118B50] border-gray-300 rounded focus:ring-[#118B50] cursor-pointer"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectItem(item.id)}
                                                    />
                                                    
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                        {item.productImage ? (
                                                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-sm font-semibold text-gray-900 truncate pr-4">{item.productName}</h4>
                                                            <button 
                                                                onClick={() => handleDeleteItem(item.id)}
                                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        
                                                        {hasOffer ? (
                                                            <div className="mt-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs text-gray-400 line-through">{formatRupiah(item.normalPrice)}</span>
                                                                    <span className="text-sm font-bold text-gray-900">{formatRupiah(item.negotiatedPrice)}</span>
                                                                </div>
                                                                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#118B50]/10 text-[#118B50]">
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                    Harga Nego
                                                                </div>
                                                                {item.expiresAt && <CountdownTimer expiresAt={item.expiresAt} />}
                                                            </div>
                                                        ) : (
                                                            <div className="mt-1 text-sm font-bold text-gray-900">
                                                                {formatRupiah(item.normalPrice)}
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
            {!isLoading && groupedCarts.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-40 pb-safe">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Item terpilih ({selectedItems.length})</p>
                            <p className="text-xl font-black text-[#118B50] mt-0.5 tracking-tight">{formatRupiah(totalPrice)}</p>
                            {totalSaved > 0 && (
                                <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                                    🎉 Hemat {formatRupiah(totalSaved)}!
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleCheckoutClick}
                            className={`px-10 py-3.5 rounded-full font-bold shadow-lg transition-all active:scale-95 ${
                                selectedItems.length > 0
                                    ? 'bg-[#118B50] text-white hover:bg-[#0a6639] shadow-[#118B50]/20'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                            disabled={selectedItems.length === 0}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
