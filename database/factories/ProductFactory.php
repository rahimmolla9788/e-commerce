<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = Str::title(fake()->words(3, true));
        $price = fake()->numberBetween(350, 12500);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 9999),
            'sku' => 'NM-'.strtoupper(Str::random(6)),
            'short_description' => fake()->sentence(8),
            'description' => fake()->paragraphs(2, true),
            'price' => $price,
            'compare_price' => $price + fake()->numberBetween(150, 1500),
            'stock' => fake()->numberBetween(5, 60),
            'image_path' => '/images/products/default-product.svg',
            'is_featured' => fake()->boolean(35),
            'is_active' => true,
        ];
    }
}
