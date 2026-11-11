<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics & Audio',
                'slug' => 'electronics-audio',
                'description' => 'Wireless audio, wearables, and everyday smart gadgets.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Fashion & Footwear',
                'slug' => 'fashion-footwear',
                'description' => 'Modern apparel, jackets, and everyday sneakers.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Accessories & Bags',
                'slug' => 'accessories-bags',
                'description' => 'Travel backpacks, tech organizers, and carry essentials.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Home & Workspace',
                'slug' => 'home-workspace',
                'description' => 'Minimal desk lighting, coffee gear, and productivity tools.',
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'sort_order' => $category['sort_order'],
                    'is_active' => true,
                ],
            );
        }
    }
}
