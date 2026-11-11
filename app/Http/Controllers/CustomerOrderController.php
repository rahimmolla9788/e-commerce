<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->withCount('items')
            ->latest('id')
            ->paginate(10);

        return Inertia::render('Shop/OrdersIndex', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load('items');

        return Inertia::render('Shop/OrderShow', [
            'order' => $order,
        ]);
    }
}
