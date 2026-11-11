<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_visiting_admin_redirects_to_admin_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_non_admin_customer_cannot_access_admin_panel(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->get('/admin')
            ->assertStatus(403)
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Forbidden'));
    }

    public function test_admin_can_sign_in_and_manage_categories_products_orders_and_sms_settings(): void
    {
        $admin = User::factory()->admin()->create([
            'phone' => '+8801700000000',
            'password' => Hash::make('Admin@1234'),
        ]);

        $this->post('/admin/login', [
            'phone' => '01700000000',
            'password' => 'Admin@1234',
        ])->assertRedirect('/admin');

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Dashboard'));

        // Category CRUD
        $this->actingAs($admin)->post('/admin/categories', [
            'name' => 'Gadgets',
            'description' => 'Smart accessories',
            'sort_order' => 1,
            'is_active' => true,
        ])->assertRedirect();

        $category = Category::query()->where('name', 'Gadgets')->firstOrFail();

        // Product CRUD
        $this->actingAs($admin)->post('/admin/products', [
            'category_id' => $category->id,
            'name' => 'USB-C Hub 7-in-1',
            'sku' => 'HUB-701',
            'price' => 1290,
            'compare_price' => 1590,
            'stock' => 25,
            'is_active' => true,
            'is_featured' => true,
        ])->assertRedirect();

        $product = Product::query()->where('sku', 'HUB-701')->firstOrFail();
        $this->assertSame('USB-C Hub 7-in-1', $product->name);

        $this->actingAs($admin)->put("/admin/products/{$product->id}", [
            'category_id' => $category->id,
            'name' => 'USB-C Hub Pro',
            'sku' => 'HUB-701',
            'price' => 1390,
            'stock' => 30,
            'is_active' => true,
        ])->assertRedirect();

        $this->assertSame('USB-C Hub Pro', $product->fresh()->name);

        // Order status management
        $order = Order::factory()->create();
        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'status' => OrderStatus::Confirmed->value,
            'payment_status' => 'paid',
        ])->assertRedirect();

        $this->assertSame(OrderStatus::Confirmed, $order->fresh()->status);
        $this->assertSame('paid', $order->fresh()->payment_status);

        // Customers and SMS Settings views
        $this->actingAs($admin)->get('/admin/customers')->assertOk();
        $this->actingAs($admin)->get('/admin/sms-settings')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/SmsSettings')
                ->where('smsSettings.active_driver', 'sandbox')
                ->where('smsSettings.show_otp_on_page', true));

        $this->actingAs($admin)->delete("/admin/products/{$product->id}")->assertRedirect();
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_database_seeder_creates_admin_customer_categories_and_products(): void
    {
        $this->seed();

        $this->assertDatabaseHas('users', [
            'phone' => '+8801700000000',
            'role' => 'admin',
        ]);
        $this->assertDatabaseHas('users', [
            'phone' => '+8801800000000',
            'role' => 'customer',
        ]);
        $this->assertSame(4, Category::query()->count());
        $this->assertSame(8, Product::query()->count());
    }

    public function test_admin_can_upload_product_image_and_update_with_empty_image(): void
    {
        Storage::fake('public');

        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();

        $png1x1 = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');

        $this->actingAs($admin)->post('/admin/products', [
            'category_id' => $category->id,
            'name' => 'Camera Tripod',
            'price' => 1850,
            'stock' => 12,
            'image' => UploadedFile::fake()->createWithContent('tripod.png', $png1x1),
            'is_active' => '1',
            'is_featured' => '0',
        ])->assertRedirect();

        $product = Product::query()->where('name', 'Camera Tripod')->firstOrFail();
        $this->assertStringStartsWith('products/', (string) $product->image_path);
        Storage::disk('public')->assertExists((string) $product->image_path);

        $this->actingAs($admin)->post("/admin/products/{$product->id}", [
            '_method' => 'put',
            'category_id' => $category->id,
            'name' => 'Camera Tripod Pro',
            'price' => 2100,
            'compare_price' => '',
            'stock' => 15,
            'image' => '',
            'is_active' => '1',
            'is_featured' => '1',
        ])->assertRedirect();

        $product->refresh();
        $this->assertSame('Camera Tripod Pro', $product->name);
        $this->assertTrue($product->is_featured);
        $this->assertStringStartsWith('products/', (string) $product->image_path);
    }
}
