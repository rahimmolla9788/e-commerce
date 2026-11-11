import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '../../Components/ProductCard';
import ShopLayout from '../../Layouts/ShopLayout';
import { formatPrice } from '../../utils/format';

export default function ProductShow({ product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const handleAddToCart = (redirectToCart = false) => {
        if (product.stock <= 0 || submitting) {
            return;
        }
        setSubmitting(true);
        router.post(
            '/cart/items',
            { product_id: product.id, quantity },
            {
                preserveScroll: !redirectToCart,
                onSuccess: () => {
                    if (redirectToCart) {
                        router.visit('/cart');
                    }
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <ShopLayout>
            <Head title={product.name} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-[#0095D9]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Storefront
                </Link>

                <div className="mt-6 grid grid-cols-1 gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:grid-cols-2 lg:p-10">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full max-h-[440px] w-full object-cover"
                        />
                        {product.discount_percentage > 0 && (
                            <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">
                                Save {product.discount_percentage}%
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        {product.category && (
                            <Link
                                href={`/?category=${product.category.slug}`}
                                className="text-xs font-bold uppercase tracking-wider text-[#0095D9] hover:text-[#007EB8]"
                            >
                                {product.category.name}
                            </Link>
                        )}
                        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                            {product.name}
                        </h1>

                        {product.sku && (
                            <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>
                        )}

                        <div className="mt-5 flex items-baseline gap-3">
                            <span className="text-3xl font-extrabold text-[#0095D9]">
                                {formatPrice(product.price)}
                            </span>
                            {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                                <span className="text-lg text-slate-400 line-through">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                        </div>

                        <div className="mt-4">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        <p className="mt-5 text-sm leading-relaxed text-slate-600">
                            {product.description || product.short_description}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
                            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="px-3 py-2.5 text-slate-600 hover:text-slate-900"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-10 text-center text-sm font-bold">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                                    className="px-3 py-2.5 text-slate-600 hover:text-slate-900"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                type="button"
                                disabled={product.stock <= 0 || submitting}
                                onClick={() => handleAddToCart(false)}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0095D9] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#007EB8] disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                {submitting ? 'Adding...' : 'Add to Cart'}
                            </button>

                            <button
                                type="button"
                                disabled={product.stock <= 0 || submitting}
                                onClick={() => handleAddToCart(true)}
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <Truck className="h-4 w-4 text-[#0095D9]" />
                                <span>Free shipping over ৳2,000</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span>Phone-verified secure ordering</span>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="mt-14">
                        <h2 className="text-xl font-extrabold text-slate-900">Related Products</h2>
                        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </ShopLayout>
    );
}

