<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SellerBalance;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SellerDashboardApiController extends Controller
{
    use ApiResponse;

    /**
     * Calculate MoM percentage change safely.
     */
    private function calculateTrend($current, $previous): float|int
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * Get seller dashboard statistics, chart data, and recent orders.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $productIds = $user->products()->pluck('id');

            // --- MoM Trends using Carbon ---
            $now = Carbon::now();
            $startOfCurrentMonth = $now->copy()->startOfMonth();
            $endOfCurrentMonth = $now->copy()->endOfMonth();
            $startOfPrevMonth = $now->copy()->subMonth()->startOfMonth();
            $endOfPrevMonth = $now->copy()->subMonth()->endOfMonth();

            // 1. Saldo MoM
            $currentSaldo = SellerBalance::where('user_id', $user->id)
                ->whereIn('status', ['dilepas', 'ditarik'])
                ->whereBetween('created_at', [$startOfCurrentMonth, $endOfCurrentMonth])
                ->sum('jumlah');

            $prevSaldo = SellerBalance::where('user_id', $user->id)
                ->whereIn('status', ['dilepas', 'ditarik'])
                ->whereBetween('created_at', [$startOfPrevMonth, $endOfPrevMonth])
                ->sum('jumlah');

            // 2. Escrow MoM
            $currentEscrow = SellerBalance::where('user_id', $user->id)
                ->where('status', 'ditahan')
                ->whereBetween('created_at', [$startOfCurrentMonth, $endOfCurrentMonth])
                ->sum('jumlah');

            $prevEscrow = SellerBalance::where('user_id', $user->id)
                ->where('status', 'ditahan')
                ->whereBetween('created_at', [$startOfPrevMonth, $endOfPrevMonth])
                ->sum('jumlah');

            // 3. Total Produk MoM
            $currentProducts = $user->products()
                ->whereBetween('created_at', [$startOfCurrentMonth, $endOfCurrentMonth])
                ->count();

            $prevProducts = $user->products()
                ->whereBetween('created_at', [$startOfPrevMonth, $endOfPrevMonth])
                ->count();

            // 4. Pesanan Aktif MoM
            $currentActiveOrders = Order::whereIn('product_id', $productIds)
                ->whereIn('status', ['pending', 'dibayar', 'dikirim'])
                ->whereBetween('created_at', [$startOfCurrentMonth, $endOfCurrentMonth])
                ->count();

            $prevActiveOrders = Order::whereIn('product_id', $productIds)
                ->whereIn('status', ['pending', 'dibayar', 'dikirim'])
                ->whereBetween('created_at', [$startOfPrevMonth, $endOfPrevMonth])
                ->count();

            // --- Other Legacy Stats (needed by sidebar / advisor) ---
            $activeProducts = $user->products()->where('status', 'active')->count();
            $totalSold      = $user->products()->where('status', 'sold')->count();
            $needsShipping  = Order::whereIn('product_id', $productIds)
                ->where('status', 'dibayar')
                ->count();

            // --- Wallet active ---
            $walletActive = SellerBalance::where('user_id', $user->id)
                ->whereIn('status', ['dilepas', 'ditarik'])
                ->sum('jumlah');

            // --- Chart Data: Pendapatan 7 hari terakhir dari orders selesai ---
            $dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

            $chartRaw = Order::whereIn('product_id', $productIds)
                ->where('status', 'selesai')
                ->where('created_at', '>=', now()->subDays(6)->startOfDay())
                ->select(
                    DB::raw('DAYOFWEEK(created_at) as day_num'),
                    DB::raw('SUM(total_harga) as total')
                )
                ->groupBy('day_num')
                ->pluck('total', 'day_num');

            // Build 7-day series (today minus 6 days)
            $chartData = [];
            for ($i = 6; $i >= 0; $i--) {
                $date   = now()->subDays($i);
                $dayNum = (int) $date->format('w') + 1; // PHP: 0=Sun, MySQL DAYOFWEEK: 1=Sun
                $chartData[] = [
                    'name'  => $dayLabels[$date->dayOfWeek], // Carbon: 0=Sun
                    'total' => (int) ($chartRaw[$dayNum] ?? 0),
                ];
            }

            // --- Recent Orders ---
            $recentOrders = Order::whereIn('product_id', $productIds)
                ->with(['user', 'product'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($o) => [
                    'id'           => $o->id,
                    'buyer_name'   => $o->user->name ?? 'Pembeli',
                    'product_name' => $o->product->nama_barang ?? 'Produk',
                    'created_at'   => $o->created_at->diffForHumans(),
                ]);

            return $this->successResponse([
                'stats' => [
                    'saldo' => [
                        'value' => $currentSaldo,
                        'trend' => $this->calculateTrend($currentSaldo, $prevSaldo),
                    ],
                    'escrow' => [
                        'value' => $currentEscrow,
                        'trend' => $this->calculateTrend($currentEscrow, $prevEscrow),
                    ],
                    'total_produk' => [
                        'value' => $currentProducts,
                        'trend' => $this->calculateTrend($currentProducts, $prevProducts),
                    ],
                    'pesanan_aktif' => [
                        'value' => $currentActiveOrders,
                        'trend' => $this->calculateTrend($currentActiveOrders, $prevActiveOrders),
                    ],
                    'active_products' => $activeProducts,
                    'total_sold'      => $totalSold,
                    'needs_shipping'  => $needsShipping,
                    'total_revenue'   => $walletActive,
                ],
                'chartData'     => $chartData,
                'recent_orders' => $recentOrders,
            ], 'Seller dashboard statistics retrieved successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve dashboard statistics: ' . $e->getMessage(), 500);
        }
    }
}
