import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShieldCheck, MapPin, Package, MessageCircle, ArrowLeft, CheckCircle, CreditCard, Loader2, Truck, Box } from 'lucide-react';
import axios from 'axios';

export default function Checkout({ product, offer, final_price, midtrans_client_key }) {
    const { flash } = usePage().props;
    const [metodePengiriman, setMetodePengiriman] = useState('cod');
    
    // Alamat state
    const [alamat, setAlamat] = useState('');
    const [catatan, setCatatan] = useState('');
    
    // RajaOngkir state
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [courierServiceLabel, setCourierServiceLabel] = useState('');
    const [checkingCost, setCheckingCost] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Load Midtrans Snap.js & Initial Provinces
    useEffect(() => {
        // Load Midtrans Script
        if (midtrans_client_key) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', midtrans_client_key);
            script.async = true;
            document.head.appendChild(script);
        }

        // Fetch Provinces Component Mount
        fetchProvinces();

        return () => {
             const script = document.querySelector(`script[src="https://app.sandbox.midtrans.com/snap/snap.js"]`);
             if (script && document.head.contains(script)) {
                 document.head.removeChild(script);
             }
        };
    }, [midtrans_client_key]);

    const fetchProvinces = async () => {
        try {
            const res = await axios.get('/api/rajaongkir/provinces');
            setProvinces(res.data);
        } catch (error) {
            console.error("Failed to fetch provinces API", error);
        }
    }

    const handleProvinceChange = async (e) => {
        const provId = e.target.value;
        setSelectedProvince(provId);
        setSelectedCity('');
        setShippingCost(0);
        setCities([]);

        if (provId) {
            try {
                const res = await axios.get(`/api/rajaongkir/cities/${provId}`);
                setCities(res.data);
            } catch (error) {
                console.error("Failed to fetch cities API", error);
            }
        }
    }

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setShippingCost(0);
        if (selectedCourier) {
            checkShippingCost(e.target.value, selectedCourier);
        }
    }

    const handleCourierChange = (e) => {
        const courier = e.target.value;
        setSelectedCourier(courier);
        
        if (selectedCity && courier) {
             checkShippingCost(selectedCity, courier);
        }
    }

    const checkShippingCost = async (cityId, courier) => {
        setCheckingCost(true);
        try {
            const res = await axios.post('/api/rajaongkir/cost', {
                origin: product.seller_city_id || 152, // Asumsi 152 adalah Jakarta Pusat as fallback
                destination: cityId,
                weight: 1000, // Hardcoded 1kg untuk demo ReCircle
                courier: courier
            });

            if (res.data && res.data.length > 0 && res.data[0].costs.length > 0) {
                // Pilih servis pertama sebagai default
                const costData = res.data[0].costs[0];
                setShippingCost(costData.cost[0].value);
                setCourierServiceLabel(`${res.data[0].name} - ${costData.service} (${costData.cost[0].etd} Hari)`);
            } else {
                setShippingCost(0);
                alert("Layanan pengiriman tidak tersedia untuk rute ini.");
            }
        } catch (error) {
            console.error("Failed to calculate cost API", error);
            setShippingCost(0);
        } finally {
            setCheckingCost(false);
        }
    }

    const handleMetodeChange = (metode) => {
        setMetodePengiriman(metode);
        if (metode === 'cod') {
            setShippingCost(0);
        } else if (metode === 'kirim_paket' && selectedCity && selectedCourier) {
            checkShippingCost(selectedCity, selectedCourier);
        }
    }

    const grandTotal = Number(final_price) + Number(shippingCost);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (metodePengiriman === 'kirim_paket') {
            if (!alamat.trim() || !selectedProvince || !selectedCity || !selectedCourier) {
                return alert("Mohon lengkapi seluruh data pengiriman.");
            }
            if (shippingCost === 0 && !checkingCost) {
                return alert("Ongkos kirim belum berhasil dihitung. Silakan pilih ulang kurir atau kota Anda.");
            }
        }

        setProcessing(true);

        const fullName = `${firstName} ${lastName}`.trim();

        try {
            const response = await axios.post('/checkout', {
                product_id: product.id,
                offer_id: offer?.id || null,
                metode_pengiriman: metodePengiriman,
                alamat_pengiriman: alamat,
                catatan: catatan,
                shipping_cost: shippingCost,
                courier_info: courierServiceLabel
            });

            if (response.data.success) {
                if (response.data.metode_pengiriman === 'kirim_paket' && response.data.snap_token) {
                    window.snap.pay(response.data.snap_token, {
                        onSuccess: () => setPaymentSuccess(true),
                        onPending: () => {
                            router.visit(response.data.redirect_url);
                        },
                        onError: () => alert('Pembayaran gagal. Silakan coba lagi.'),
                        onClose: () => {
                            router.visit(response.data.redirect_url);
                        },
                    });
                } else {
                    router.visit(response.data.redirect_url);
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error.response?.data?.message || 'Terjadi kesalahan saat checkout.');
            setProcessing(false);
        }
    };

    const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

    if (paymentSuccess) {
        return (
            <MainLayout>
                <Head title="Pembayaran Berhasil" />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                        <div className="w-20 h-20 rounded-full bg-[#43552c]/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-[#43552c]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil</h2>
                        <p className="text-gray-500 mb-6">Pesanan Anda telah kami terima dan akan segera diproses oleh penjual.</p>
                        <a
                            href="/orders"
                            className="inline-block bg-[#43552c] text-white px-8 py-4 rounded-full hover:bg-[#364423] transition-colors font-medium active:scale-[0.98]"
                        >
                            Lihat Pesanan Saya
                        </a>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Checkout" />
            <div className="min-h-screen bg-gray-50 pt-28 pb-16">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#43552c] mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold">Kembali</span>
                    </button>
                    
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Form Area - 8 cols */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Section 1: Contact Information */}
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#43552c]/10 flex items-center justify-center text-[#43552c] font-semibold text-sm">1</div>
                                    <h2 className="text-xl font-bold text-gray-900">1. Informasi Kontak</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Depan</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Budi"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm transition-colors bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Belakang</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Santoso"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm transition-colors bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="budi@student.com"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm transition-colors bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon / WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="08123456789"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm transition-colors bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Delivery Method */}
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#43552c]/10 flex items-center justify-center text-[#43552c] font-semibold text-sm">2</div>
                                    <h2 className="text-xl font-bold text-gray-900">2. Metode Pengiriman</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <label
                                        className={`relative flex flex-col cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-md ${metodePengiriman === 'cod' ? 'border-[#43552c] bg-[#43552c]/[0.10]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        onClick={() => handleMetodeChange('cod')}
                                    >
                                        <input type="radio" name="metode" value="cod" className="sr-only" readOnly checked={metodePengiriman === 'cod'} />
                                        <div className={`p-3 rounded-full w-fit mb-4 ${metodePengiriman === 'cod' ? 'bg-[#43552c] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <p className={`text-lg font-bold mb-1 tracking-tight ${metodePengiriman === 'cod' ? 'text-[#43552c]' : 'text-gray-900'}`}>Ketemuan (COD)</p>
                                        <p className="text-sm text-gray-500">Bayar langsung di tempat</p>
                                    </label>

                                    <label
                                        className={`relative flex flex-col cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-md ${metodePengiriman === 'kirim_paket' ? 'border-[#43552c] bg-[#43552c]/[0.10]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        onClick={() => handleMetodeChange('kirim_paket')}
                                    >
                                        <input type="radio" name="metode" value="kirim_paket" className="sr-only" readOnly checked={metodePengiriman === 'kirim_paket'} />
                                        <div className={`p-3 rounded-full w-fit mb-4 ${metodePengiriman === 'kirim_paket' ? 'bg-[#43552c] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <p className={`text-lg font-bold mb-1 tracking-tight ${metodePengiriman === 'kirim_paket' ? 'text-[#43552c]' : 'text-gray-900'}`}>Kirim Paket</p>
                                        <p className="text-sm text-gray-500">Bayar online via Midtrans</p>
                                    </label>
                                </div>
                            </section>

                            {/* Section 3: Delivery Address (Only if Kirim Paket) */}
                            {metodePengiriman === 'kirim_paket' && (
                                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-[#43552c]/10 flex items-center justify-center text-[#43552c] font-semibold text-sm">3</div>
                                        <h2 className="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Provinsi Tujuan</label>
                                            <select
                                                value={selectedProvince}
                                                onChange={handleProvinceChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm font-medium bg-gray-50 focus:bg-white"
                                            >
                                                <option value="" disabled>Pilih Provinsi</option>
                                                {provinces.map(prov => (
                                                    <option key={prov.province_id} value={prov.province_id}>{prov.province}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Kota / Kabupaten</label>
                                            <select
                                                value={selectedCity}
                                                onChange={handleCityChange}
                                                disabled={!selectedProvince || cities.length === 0}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm font-medium disabled:opacity-50 disabled:bg-gray-100 bg-gray-50 focus:bg-white"
                                            >
                                                <option value="" disabled>{!selectedProvince ? "Pilih provinsi terlebih dahulu" : "Pilih Kota/Kab"}</option>
                                                {cities.map(city => (
                                                    <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Kurir</label>
                                        <select
                                            value={selectedCourier}
                                            onChange={handleCourierChange}
                                            disabled={!selectedCity}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] text-sm font-medium disabled:opacity-50 disabled:bg-gray-100 bg-gray-50 focus:bg-white"
                                        >
                                            <option value="" disabled>Pilih Layanan Pengiriman</option>
                                            <option value="jne">JNE - Jalur Nugraha Ekakurir</option>
                                            <option value="pos">POS - POS Indonesia</option>
                                            <option value="tiki">TIKI - Citra Van Titipan Kilat</option>
                                        </select>
                                        {checkingCost && (
                                            <p className="text-sm text-[#43552c] mt-2 flex items-center gap-1.5 font-medium animate-pulse">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Menghitung ongkos kirim...
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="alamat" className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap (Jl, No Rumah, RT/RW)</label>
                                        <textarea
                                            id="alamat"
                                            value={alamat}
                                            onChange={(e) => setAlamat(e.target.value)}
                                            placeholder="Contoh: Jl. Sudirman No. 10, RT 01/02, Kec. Setiabudi. Patokan pagar kayu."
                                            rows={3}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-4 text-gray-900 focus:border-[#43552c] focus:ring-[#43552c] sm:text-sm resize-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </section>
                            )}

                        </div>

                        {/* Order Summary Area - 4 cols */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sticky top-32 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-5">Ringkasan Belanja</h3>
                                
                                <div className="flex gap-4 mb-8">
                                    <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <p className="font-bold text-gray-900 leading-tight mb-1 truncate text-lg pr-2">{product.name}</p>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 w-fit px-2.5 py-1 rounded-md mb-2">
                                            <Box className="w-3.5 h-3.5" />
                                            <span className="truncate max-w-[120px]">Preloved Item</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 py-6 border-y border-dashed border-gray-200 mb-8">
                                    <div className="flex items-center justify-between text-base">
                                        <span className="text-gray-500 font-medium">Subtotal Produk</span>
                                        <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                                    </div>
                                    {offer && (
                                        <div className="flex items-center justify-between text-base">
                                            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-sm border border-emerald-100">Harga Penawaran</span>
                                            <span className="font-bold text-emerald-600">{formatPrice(offer.harga_deal)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-base transition-all duration-300">
                                        <span className="text-gray-500 font-medium whitespace-nowrap">Biaya Pengiriman</span>
                                        {metodePengiriman === 'cod' ? (
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded text-sm">Gratis</span>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <span className="font-semibold text-gray-900">{shippingCost > 0 ? formatPrice(shippingCost) : '-'}</span>
                                                {courierServiceLabel && (
                                                    <span className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">{courierServiceLabel.split('-')[0].trim()}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col mb-8">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-base font-bold text-gray-900">Total Harga</span>
                                        <span className="text-3xl font-black text-[#43552c] tabular-nums tracking-tight">
                                            {formatPrice(grandTotal)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={processing || checkingCost || (metodePengiriman === 'kirim_paket' && (!alamat.trim() || shippingCost === 0))}
                                    className="w-full bg-[#43552c] text-white py-4.5 px-6 rounded-full font-bold text-lg hover:bg-[#364423] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-[#43552c]/20 min-h-[56px]"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        metodePengiriman === 'kirim_paket' ? (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                <span>Bayar Sekarang</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                <span>Konfirmasi COD</span>
                                            </>
                                        )
                                    )}
                                </button>

                                {metodePengiriman === 'kirim_paket' && (
                                    <div className="mt-6 flex items-start gap-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                                        <div className="bg-[#43552c]/10 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                                            <ShieldCheck className="w-4 h-4 text-[#43552c]" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                            Transaksi dilindungi payment gateway Midtrans. Dana ditahan dengan aman hingga Anda menerima barang.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
