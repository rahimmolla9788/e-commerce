<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\Cart\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Shop/Cart', [
            'cart' => $this->cartService->summary(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        /** @var Product $product */
        $product = Product::query()->findOrFail($validated['product_id']);

        if (! $product->is_active || $product->stock <= 0) {
            return back()->with('error', 'This product is currently out of stock.');
        }

        $this->cartService->add($product, (int) ($validated['quantity'] ?? 1));

        return back()->with('success', "{$product->name} added to your cart.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $this->cartService->updateQuantity($product, (int) $validated['quantity']);

        return back()->with('status', 'Cart updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->cartService->remove($product->id);

        return back()->with('status', 'Item removed from cart.');
    }

    public function clear(): RedirectResponse
    {
        $this->cartService->clear();

        return back()->with('status', 'Cart cleared.');
    }
}
