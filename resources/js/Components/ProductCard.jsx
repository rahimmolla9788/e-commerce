import { Link, router } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);

    const handleAddToCart = () => {
        if (product.stock <= 0 || adding) {
            return;
        }

        setAdding(true);
        router.post(
            '/cart/items',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onFinish: () => setAdding(false),
            },
        );
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-[#0095D9]/60 hover:shadow-md">
            <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-[5/4] overflow-hidden border-b border-slate-100 bg-slate-50"
            >
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {product.discount_percentage > 0 && (
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                            -{product.discount_percentage}% OFF
                        </span>
                    )}
                    {product.is_featured && (
                        <span className="rounded-md bg-[#0095D9] px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                            Hot Deal
                        </span>
                    )}
                </div>
                {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px]">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900">
                            Out of Stock
                        </span>
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-4">
                {product.category && (
                    <Link
                        href={`/?category=${product.category.slug}`}
                        className="text-[11px] font-bold uppercase tracking-wider text-[#0095D9] hover:text-[#007EB8]"
                    >
                        {product.category.name}
                    </Link>
                )}

                <Link
                    href={`/products/${product.slug}`}
                    className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 transition hover:text-[#0095D9] sm:text-base"
                >
                    {product.name}
                </Link>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {product.short_description}
                </p>

                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <div>
                        <div className="text-lg font-extrabold text-[#0095D9]">
                            {formatPrice(product.price)}
                        </div>
                        {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                            <div className="text-xs text-slate-400 line-through">
                                {formatPrice(product.compare_price)}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={product.stock <= 0 || adding}
                        onClick={handleAddToCart}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0095D9] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#007EB8] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {adding ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}
