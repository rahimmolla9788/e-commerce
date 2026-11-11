<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StorefrontAndCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_storefront_displays_and_filters_active_products(): void
    {
        $electronics = Category::factory()->create(['name' => 'Electronics', 'slug' => 'electronics']);
        $fashion = Category::factory()->create(['name' => 'Fashion', 'slug' => 'fashion']);

        $activePhone = Product::factory()->create([
            'category_id' => $electronics->id,
            'name' => 'Smart Wireless Buds',
            'is_active' => true,
        ]);
        Product::factory()->create([
            'category_id' => $fashion->id,
            'name' => 'Denim Jacket',
            'is_active' => true,
        ]);
        Product::factory()->create([
            'category_id' => $electronics->id,
            'name' => 'Hidden Draft Item',
            'is_active' => false,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Home')
                ->has('products.data', 2));

        $this->get('/?category=electronics&search=Buds')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('products.data', 1)
                ->where('products.data.0.id', $activePhone->id));
    }

    public function test_cart_operations_and_verified_checkout_create_order_and_decrement_stock(): void
    {
        $product = Product::factory()->create([
            'name' => 'Mechanical Keyboard',
            'price' => 1500,
            'stock' => 5,
            'is_active' => true,
        ]);

        $this->post('/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ])->assertRedirect();

        $this->get('/cart')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Cart')
                ->where('cart.total_quantity', 2)
                ->where('cart.subtotal', 3000)
                ->where('cart.shipping_fee', 0)
                ->where('cart.total', 3000));

        // Guest cannot access checkout
        $this->get('/checkout')->assertRedirect('/login');

        // Unverified customer is sent to OTP verification
        $unverified = User::factory()->unverifiedPhone()->create();
        $this->actingAs($unverified)
            ->get('/checkout')
            ->assertRedirect('/verify-otp');

        // Verified customer completes checkout
        $customer = User::factory()->create([
            'phone' => '+8801712340000',
        ]);

        $response = $this->actingAs($customer)->post('/checkout', [
            'customer_name' => 'Farhana Yasmin',
            'customer_phone' => '01712340000',
            'shipping_address' => 'House 42, Road 8, Uttara',
            'shipping_city' => 'Dhaka',
            'payment_method' => 'cod',
            'notes' => 'Deliver after 5 PM',
        ]);

        $order = Order::query()->firstOrFail();
        $response->assertRedirect("/orders/{$order->order_number}");

        $this->assertSame(3000.0, (float) $order->total);
        $this->assertSame(3, $product->fresh()->stock);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->actingAs($customer)
            ->get("/orders/{$order->order_number}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/OrderShow')
                ->where('order.order_number', $order->order_number));
    }
}
