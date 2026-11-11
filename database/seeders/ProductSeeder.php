<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::query()->pluck('id', 'slug');

        $products = [
            [
                'category_slug' => 'electronics-audio',
                'name' => 'AeroBeat ANC Wireless Headphones',
                'slug' => 'aerobeat-anc-wireless-headphones',
                'sku' => 'NM-EL-101',
                'short_description' => 'Active noise cancelling over-ear headphones with 40-hour battery.',
                'description' => 'Engineered with hybrid active noise cancellation, crisp 40mm dynamic drivers, dual-device Bluetooth 5.4 pairing, and plush memory foam ear cushions for all-day comfort.',
                'price' => 3490.00,
                'compare_price' => 4290.00,
                'stock' => 24,
                'image_path' => '/images/products/headphones.jpg',
                'is_featured' => true,
            ],
            [
                'category_slug' => 'electronics-audio',
                'name' => 'PulseFit AMOLED Smart Watch',
                'slug' => 'pulsefit-amoled-smart-watch',
                'sku' => 'NM-EL-102',
                'short_description' => '1.43-inch AMOLED display, Bluetooth calling, and 10-day battery life.',
                'description' => 'Stay connected with crystal-clear Bluetooth calling, continuous heart rate & SpO2 tracking, 100+ workout modes, and IP68 water resistance.',
                'price' => 2850.00,
                'compare_price' => 3500.00,
                'stock' => 18,
                'image_path' => '/images/products/smartwatch.jpg',
                'is_featured' => true,
            ],
            [
                'category_slug' => 'fashion-footwear',
                'name' => 'StrideAir Urban Running Sneakers',
                'slug' => 'strideair-urban-running-sneakers',
                'sku' => 'NM-FA-201',
                'short_description' => 'Breathable knit upper with responsive EVA cushioned sole.',
                'description' => 'Lightweight everyday sneakers crafted for Dhaka streets and daily training, featuring breathable mesh ventilation and high-grip rubber outsoles.',
                'price' => 2190.00,
                'compare_price' => 2690.00,
                'stock' => 32,
                'image_path' => '/images/products/sneakers.jpg',
                'is_featured' => true,
            ],
            [
                'category_slug' => 'fashion-footwear',
                'name' => 'Monsoon Weatherproof Bomber Jacket',
                'slug' => 'monsoon-weatherproof-bomber-jacket',
                'sku' => 'NM-FA-202',
                'short_description' => 'Water-repellent shell with breathable mesh lining.',
                'description' => 'Designed for sudden showers and cool evenings, featuring sealed utility pockets, storm-flap zipper, and tailored modern fit.',
                'price' => 2450.00,
                'compare_price' => null,
                'stock' => 15,
                'image_path' => '/images/products/jacket.jpg',
                'is_featured' => false,
            ],
            [
                'category_slug' => 'accessories-bags',
                'name' => 'NomadPro 22L Laptop Backpack',
                'slug' => 'nomadpro-22l-laptop-backpack',
                'sku' => 'NM-AC-301',
                'short_description' => 'Fits 16-inch laptops with hidden anti-theft pocket and USB port.',
                'description' => 'Built with splash-resistant ballistic nylon, padded 16-inch laptop sleeve, luggage pass-through strap, and ergonomic breathable back panel.',
                'price' => 1890.00,
                'compare_price' => 2250.00,
                'stock' => 40,
                'image_path' => '/images/products/backpack.jpg',
                'is_featured' => true,
            ],
            [
                'category_slug' => 'home-workspace',
                'name' => 'LumiArc Minimal LED Desk Lamp',
                'slug' => 'lumiarc-minimal-led-desk-lamp',
                'sku' => 'NM-HW-401',
                'short_description' => 'Stepless dimming, 3 color temperatures, and aluminum body.',
                'description' => 'Flicker-free eye-care illumination with touch brightness control, 3000K-6000K color modes, and foldable anodized aluminum arm.',
                'price' => 1450.00,
                'compare_price' => 1790.00,
                'stock' => 28,
                'image_path' => '/images/products/lamp.jpg',
                'is_featured' => false,
            ],
            [
                'category_slug' => 'home-workspace',
                'name' => 'KeyCraft 75% Mechanical Keyboard',
                'slug' => 'keycraft-75-mechanical-keyboard',
                'sku' => 'NM-HW-402',
                'short_description' => 'Hot-swappable tactile switches with wireless & USB-C modes.',
                'description' => 'Compact 75% layout with PBT keycaps, gasket-mounted typing feel, multi-host wireless switching, and subtle warm white backlight.',
                'price' => 4650.00,
                'compare_price' => 5200.00,
                'stock' => 12,
                'image_path' => '/images/products/keyboard.jpg',
                'is_featured' => true,
            ],
            [
                'category_slug' => 'home-workspace',
                'name' => 'BrewMaster Pour-Over Coffee Kettle',
                'slug' => 'brewmaster-pour-over-coffee-kettle',
                'sku' => 'NM-HW-403',
                'short_description' => 'Precision gooseneck matte black stainless steel kettle.',
                'description' => '304 food-grade stainless steel with slow-flow gooseneck spout for balanced manual pour-over extraction every morning.',
                'price' => 1650.00,
                'compare_price' => 1950.00,
                'stock' => 20,
                'image_path' => '/images/products/coffee-maker.jpg',
                'is_featured' => false,
            ],
        ];

        foreach ($products as $item) {
            Product::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'category_id' => $categories->get($item['category_slug']),
                    'name' => $item['name'],
                    'sku' => $item['sku'],
                    'short_description' => $item['short_description'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'compare_price' => $item['compare_price'],
                    'stock' => $item['stock'],
                    'image_path' => $item['image_path'],
                    'is_featured' => $item['is_featured'],
                    'is_active' => true,
                ],
            );
        }
    }
}
