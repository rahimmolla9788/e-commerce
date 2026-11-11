<?php

namespace App\Services\Cart;

use App\Models\Product;
use Illuminate\Support\Collection;

class CartService
{
    private const SESSION_KEY = 'shopping_cart';

    private const FREE_SHIPPING_THRESHOLD = 2000.00;

    private const FLAT_SHIPPING_FEE = 60.00;

    /**
     * @return array<int, int>
     */
    public function raw(): array
    {
        $cart = session()->get(self::SESSION_KEY, []);

        if (! is_array($cart)) {
            return [];
        }

        $clean = [];
        foreach ($cart as $productId => $qty) {
            $id = (int) $productId;
            $quantity = (int) $qty;
            if ($id > 0 && $quantity > 0) {
                $clean[$id] = $quantity;
            }
        }

        return $clean;
    }

    public function add(Product $product, int $quantity = 1): void
    {
        $cart = $this->raw();
        $current = $cart[$product->id] ?? 0;
        $next = min($product->stock, max(1, $current + $quantity));

        if ($next <= 0) {
            return;
        }

        $cart[$product->id] = $next;
        session()->put(self::SESSION_KEY, $cart);
    }

    public function updateQuantity(Product $product, int $quantity): void
    {
        $cart = $this->raw();

        if ($quantity <= 0) {
            unset($cart[$product->id]);
        } else {
            $cart[$product->id] = min($product->stock, $quantity);
        }

        session()->put(self::SESSION_KEY, $cart);
    }

    public function remove(int $productId): void
    {
        $cart = $this->raw();
        unset($cart[$productId]);
        session()->put(self::SESSION_KEY, $cart);
    }

    public function clear(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    public function totalQuantity(): int
    {
        return array_sum($this->raw());
    }

    /**
     * Build the hydrated cart summary with active database products.
     *
     * @return array{
     *   items: array<int, array<string, mixed>>,
     *   total_quantity: int,
     *   subtotal: float,
     *   shipping_fee: float,
     *   total: float,
     *   free_shipping_threshold: float
     * }
     */
    public function summary(): array
    {
        $raw = $this->raw();

        if ($raw === []) {
            return [
                'items' => [],
                'total_quantity' => 0,
                'subtotal' => 0.0,
                'shipping_fee' => 0.0,
                'total' => 0.0,
                'free_shipping_threshold' => self::FREE_SHIPPING_THRESHOLD,
            ];
        }

        /** @var Collection<int, Product> $products */
        $products = Product::query()
            ->with('category')
            ->whereIn('id', array_keys($raw))
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        $items = [];
        $subtotal = 0.0;
        $totalQuantity = 0;
        $sanitizedCart = [];

        foreach ($raw as $productId => $qty) {
            /** @var Product|null $product */
            $product = $products->get($productId);

            if (! $product || $product->stock <= 0) {
                continue;
            }

            $cappedQty = min($qty, $product->stock);
            $unitPrice = (float) $product->price;
            $lineTotal = round($unitPrice * $cappedQty, 2);

            $sanitizedCart[$product->id] = $cappedQty;
            $subtotal += $lineTotal;
            $totalQuantity += $cappedQty;

            $items[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_name' => $product->category?->name,
                'image_url' => $product->image_url,
                'price' => $unitPrice,
                'compare_price' => $product->compare_price !== null ? (float) $product->compare_price : null,
                'stock' => $product->stock,
                'quantity' => $cappedQty,
                'line_total' => $lineTotal,
            ];
        }

        if ($sanitizedCart !== $raw) {
            session()->put(self::SESSION_KEY, $sanitizedCart);
        }

        $subtotal = round($subtotal, 2);
        $shippingFee = ($items === [] || $subtotal >= self::FREE_SHIPPING_THRESHOLD)
            ? 0.0
            : self::FLAT_SHIPPING_FEE;

        return [
            'items' => $items,
            'total_quantity' => $totalQuantity,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => round($subtotal + $shippingFee, 2),
            'free_shipping_threshold' => self::FREE_SHIPPING_THRESHOLD,
        ];
    }
}
