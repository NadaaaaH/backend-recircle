import React, { Suspense, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { BellRing, ArrowRight, PackageSearch, MessageSquareText } from 'lucide-react';

// Dynamic Import for Recharts to optimize FCP
const AreaChart = React.lazy(() => import('recharts').then(m => ({ default: m.AreaChart })));
const Area = React.lazy(() => import('recharts').then(m => ({ default: m.Area })));
const XAxis = React.lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = React.lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const CartesianGrid = React.lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const Tooltip = React.lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
const ResponsiveContainer = React.lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));

// Sub-components to prevent unnecessary re-renders
const OverviewCard = ({ title, value }) => (
    <div className="p-6">
        <p className="text-sm text-slate-500 mb-2">{title}</p>
        <p className="text-3xl font-semibold text-slate-900 mt-2">{value}</p>
    </div>
);

const ActivityItem = ({ avatar, name, action, time }) => (
    <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
            {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className="text-xs font-bold text-slate-600">{name.charAt(0)}</span>
            )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm text-slate-900 leading-snug">
                <span className="font-medium">{name}</span> {action}
            </p>
            <p className="text-xs text-slate-400 mt-1">{time}</p>
        </div>
    </div>
);

export default function Dashboard() {
    // Destructuring true real data from Inertia props
    // We map backend variables to the requested UI context
    const { auth, stats, chartData, recent_orders } = usePage().props;

    const formatRp = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    // Strict No-Dummy rule: If chartData is empty, we derive a simple realistic trend from total_revenue 
    // or just pass an empty array to let Recharts handle the empty state.
    const activeChartData = useMemo(() => {
        if (chartData && chartData.length > 0) return chartData;
        // Fallback realistic single data point if backend hasn't implemented chartData yet
        return [{ name: 'Saat Ini', total: stats?.total_revenue || 0 }];
    }, [chartData, stats?.total_revenue]);

    return (
        <div className="min-h-screen bg-[#F4F5F7] pb-10">
            <Head title="Seller Dashboard | ReCircle">
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            
            <div className="max-w-[1200px] mx-auto space-y-6">
                
                {/* Header Welcome */}
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Hello, {auth?.user?.name}!
                    </h1>
                </div>

                {/* Asymmetric Grid Layout 70/30 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* A. KOLOM KIRI (span 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Banner Info */}
                        <div className="bg-white border border-slate-200/70 rounded-xl p-3 flex justify-between items-center shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-slate-50 rounded-lg">
                                    <MessageSquareText className="w-4 h-4 text-slate-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-700">Tingkatkan performa tokomu dengan merespons penawaran lebih cepat!</p>
                            </div>
                            <Link href="/seller/offers" className="text-sm font-semibold text-slate-900 hover:opacity-70 transition-opacity">
                                Cek Penawaran &rarr;
                            </Link>
                        </div>

                        {/* Overview Performance (Grid 2x2) */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Performa Toko</h2>
                            </div>
                            
                            <div className="bg-white border border-slate-200/70 rounded-[1.25rem] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
                                    <OverviewCard 
                                        title="Saldo Aktif" 
                                        value={formatRp(stats?.total_revenue)} 
                                    />
                                    <OverviewCard 
                                        title="Dana Ditahan (Escrow)" 
                                        value={formatRp(stats?.pending_balance)} 
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                                    <OverviewCard 
                                        title="Total Produk" 
                                        value={stats?.total_products || 0} 
                                    />
                                    <OverviewCard 
                                        title="Pesanan Aktif" 
                                        value={stats?.active_orders || 0} 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Revenue Graphic */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Grafik Pendapatan</h2>
                            </div>

                            <div className="bg-white border border-slate-200/70 rounded-[1.25rem] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                <p className="text-sm text-slate-500 mb-1">Total Pendapatan</p>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">
                                    {formatRp(stats?.total_revenue)}
                                </h3>
                                
                                <div className="h-64 w-full relative">
                                    <Suspense fallback={<div className="w-full h-full bg-slate-50 animate-pulse rounded-[1.25rem]"></div>}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={activeChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4A5D23" stopOpacity={0.15}/>
                                                        <stop offset="95%" stopColor="#4A5D23" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="name" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                                    dy={10}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                                                    formatter={(value) => [formatRp(value), 'Pendapatan']}
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="total" 
                                                    stroke="#4A5D23" 
                                                    strokeWidth={2}
                                                    fillOpacity={1} 
                                                    fill="url(#colorRevenue)" 
                                                    activeDot={{ r: 6, fill: '#fff', stroke: '#4A5D23', strokeWidth: 2 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Suspense>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* B. KOLOM KANAN (span 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Shop Advisor */}
                        <div className="bg-white border border-slate-200/70 rounded-[1.25rem] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Shop Advisor</h2>
                                <Link href="#" className="text-sm text-slate-900 hover:underline">Lihat Semua &rarr;</Link>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-slate-50 rounded-full text-slate-600 mt-1 flex-shrink-0">
                                    <BellRing className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                        {stats?.needs_shipping > 0 
                                            ? `Kamu memiliki ${stats.needs_shipping} pesanan yang harus dikirim hari ini.`
                                            : 'Semua pesananmu sudah terkirim, toko dalam kondisi prima!'}
                                    </h3>
                                    <Link href="/seller/orders" className="text-xs font-semibold text-slate-600 border border-slate-200/70 rounded-lg px-3 py-1.5 mt-3 inline-block hover:bg-slate-50 transition-colors">
                                        Cek Pesanan
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Products Summary */}
                        <div className="bg-white border border-slate-200/70 rounded-[1.25rem] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Produk</h2>
                                <Link href="/seller/products" className="text-sm text-slate-900 hover:underline">Lihat Semua &rarr;</Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Aktif</span>
                                    <span className="text-sm font-medium text-slate-900">{stats?.active_products || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Terjual</span>
                                    <span className="text-sm font-medium text-slate-900">{stats?.total_sold || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white border border-slate-200/70 rounded-[1.25rem] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h2>
                                <Link href="/seller/orders" className="text-sm text-slate-900 hover:underline">Lihat Semua &rarr;</Link>
                            </div>
                            
                            {!recent_orders || recent_orders.length === 0 ? (
                                <p className="text-sm text-slate-400">Belum ada aktivitas.</p>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {recent_orders.map((activity, index) => (
                                        <ActivityItem 
                                            key={activity.id || index}
                                            avatar={null}
                                            name={activity.buyer_name}
                                            action={`membeli ${activity.product_name}`}
                                            time={activity.created_at}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = page => <SellerLayout>{page}</SellerLayout>;
