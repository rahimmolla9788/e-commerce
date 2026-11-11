<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $categorySlug = trim((string) $request->query('category', ''));
        $sort = trim((string) $request->query('sort', 'featured'));

        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn (Builder $query) => $query->where('is_active', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description']);

        $productsQuery = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->when($categorySlug !== '', function (Builder $query) use ($categorySlug): void {
                $query->whereHas('category', fn (Builder $catQuery) => $catQuery->where('slug', $categorySlug));
            })
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $subQuery) use ($search): void {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('short_description', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            });

        match ($sort) {
            'price_asc' => $productsQuery->orderBy('price'),
            'price_desc' => $productsQuery->orderByDesc('price'),
            'newest' => $productsQuery->latest('id'),
            default => $productsQuery->orderByDesc('is_featured')->latest('id'),
        };

        $products = $productsQuery->paginate(12)->withQueryString();

        return Inertia::render('Shop/Home', [
            'categories' => $categories,
            'products' => $products,
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
                'sort' => $sort,
            ],
        ]);
    }
}
