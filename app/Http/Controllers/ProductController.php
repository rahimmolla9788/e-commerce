<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        abort_if(! $product->is_active, 404);

        $product->load('category:id,name,slug');

        $relatedProducts = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->when($product->category_id, fn ($query) => $query->where('category_id', $product->category_id))
            ->latest('id')
            ->limit(4)
            ->get();

        return Inertia::render('Shop/ProductShow', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
