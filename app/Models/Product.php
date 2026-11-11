<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'category_id',
    'name',
    'slug',
    'sku',
    'short_description',
    'description',
    'price',
    'compare_price',
    'stock',
    'image_path',
    'is_featured',
    'is_active',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $appends = ['image_url', 'discount_percentage'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'stock' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return Attribute<string, never>
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::get(function (): string {
            if (! $this->image_path) {
                return '/images/products/default-product.svg';
            }

            if (str_starts_with($this->image_path, 'http://') || str_starts_with($this->image_path, 'https://') || str_starts_with($this->image_path, '/')) {
                return $this->image_path;
            }

            return Storage::disk('public')->url($this->image_path);
        });
    }

    /**
     * @return Attribute<int, never>
     */
    protected function discountPercentage(): Attribute
    {
        return Attribute::get(function (): int {
            $price = (float) $this->price;
            $compare = (float) ($this->compare_price ?? 0);

            if ($compare <= $price || $compare <= 0) {
                return 0;
            }

            return (int) round((($compare - $price) / $compare) * 100);
        });
    }
}
