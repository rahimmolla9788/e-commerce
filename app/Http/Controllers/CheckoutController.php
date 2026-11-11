<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Rules\ValidPhoneNumber;
use App\Services\Cart\CartService;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
    ) {}

    public function create(Request $request): Response|RedirectResponse
    {
        $cart = $this->cartService->summary();

        if ($cart['items'] === []) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty. Add items before checking out.');
        }

        $user = $request->user();

        return Inertia::render('Shop/Checkout', [
            'cart' => $cart,
            'defaults' => [
                'customer_name' => $user?->name ?? '',
                'customer_phone' => $user?->phone ?? '',
                'shipping_address' => $user?->address ?? '',
                'shipping_city' => $user?->city ?? 'Dhaka',
                'payment_method' => 'cod',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'min:2', 'max:140'],
            'customer_phone' => ['required', 'string', new ValidPhoneNumber],
            'shipping_address' => ['required', 'string', 'min:5', 'max:500'],
            'shipping_city' => ['required', 'string', 'min:2', 'max:100'],
            'payment_method' => ['required', 'string', 'in:cod,bkash,nagad'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $rawCart = $this->cartService->raw();
        if ($rawCart === []) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $user = $request->user();
        $normalizedPhone = PhoneNumber::normalize($validated['customer_phone']);

        /** @var Order $order */
        $order = DB::transaction(function () use ($rawCart, $validated, $normalizedPhone, $user): Order {
            $products = Product::query()
                ->whereIn('id', array_keys($rawCart))
                ->where('is_active', true)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0.0;
            $linePayloads = [];

            foreach ($rawCart as $productId => $qty) {
                /** @var Product|null $product */
                $product = $products->get($productId);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'cart' => 'One of the products in your cart is no longer available.',
                    ]);
                }

                if ($product->stock < $qty) {
                    throw ValidationException::withMessages([
                        'cart' => "Insufficient stock for {$product->name}. Available: {$product->stock}.",
                    ]);
                }

                $unitPrice = (float) $product->price;
                $lineTotal = round($unitPrice * $qty, 2);
                $subtotal += $lineTotal;

                $linePayloads[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $unitPrice,
                    'quantity' => $qty,
                    'line_total' => $lineTotal,
                ];

                $product->decrement('stock', $qty);
            }

            $subtotal = round($subtotal, 2);
            $shippingFee = $subtotal >= 2000.0 ? 0.0 : 60.0;
            $total = round($subtotal + $shippingFee, 2);

            $order = Order::query()->create([
                'order_number' => 'ORD-'.now()->format('Ymd').'-'.strtoupper(Str::random(5)),
                'user_id' => $user->id,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $normalizedPhone,
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'notes' => $validated['notes'] ?? null,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'cod' ? 'unpaid' : 'pending_verification',
                'status' => OrderStatus::Pending,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
            ]);

            $order->items()->createMany($linePayloads);

            if (! $user->address || ! $user->city) {
                $user->forceFill([
                    'address' => $user->address ?: $validated['shipping_address'],
                    'city' => $user->city ?: $validated['shipping_city'],
                ])->save();
            }

            return $order;
        });

        $this->cartService->clear();

        return redirect()->route('orders.show', $order->order_number)
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
