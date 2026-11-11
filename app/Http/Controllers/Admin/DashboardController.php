<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalRevenue = (float) Order::query()
            ->where('status', '!=', OrderStatus::Cancelled)
            ->sum('total');

        $stats = [
            'total_revenue' => $totalRevenue,
            'total_orders' => Order::query()->count(),
            'pending_orders' => Order::query()->where('status', OrderStatus::Pending)->count(),
            'total_products' => Product::query()->count(),
            'low_stock_count' => Product::query()->where('stock', '<=', 10)->count(),
            'verified_customers' => User::query()
                ->where('role', UserRole::Customer)
                ->whereNotNull('phone_verified_at')
                ->count(),
            'unverified_customers' => User::query()
                ->where('role', UserRole::Customer)
                ->whereNull('phone_verified_at')
                ->count(),
        ];

        $recentOrders = Order::query()
            ->withCount('items')
            ->latest('id')
            ->limit(6)
            ->get();

        $lowStockProducts = Product::query()
            ->with('category:id,name')
            ->where('stock', '<=', 10)
            ->orderBy('stock')
            ->limit(6)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
