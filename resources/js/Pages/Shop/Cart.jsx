import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import ShopLayout from '../../Layouts/ShopLayout';
import { formatPrice } from '../../utils/format';

export default function Cart({ cart }) {
    const updateQuantity = (productId, quantity) => {
        router.patch(`/cart/items/${productId}`, { quantity }, { preserveScroll: true });
    };

    const removeItem = (productId) => {
        router.delete(`/cart/items/${productId}`, { preserveScroll: true });
    };

    const clearCart = () => {
        router.delete('/cart', { preserveScroll: true });
    };

    const freeThreshold = cart.free_shipping_threshold || 2000;
    const amountUntilFree = Math.max(0, freeThreshold - cart.subtotal);

    return (
        <ShopLayout>
            <Head title="Shopping Cart" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {cart.total_quantity} item(s) in your cart
                        </p>
                    </div>
                    {cart.items.length > 0 && (
                        <button
                            type="button"
                            onClick={clearCart}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Clear Cart
                        </button>
                    )}
                </div>

                {cart.items.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
                        <h2 className="mt-4 text-lg font-bold text-slate-900">Your cart is empty</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Browse our catalog and add your favorite products to get started.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                        >
                            Explore Storefront
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            {cart.items.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </Link>
                                        <div>
                                            {item.category_name && (
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                                                    {item.category_name}
                                                </p>
                                            )}
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="text-base font-bold text-slate-900 hover:text-indigo-600"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="mt-1 text-xs font-semibold text-slate-500">
                                                Unit Price: {formatPrice(item.price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="px-2.5 py-2 text-slate-600 hover:text-slate-900"
                                                aria-label="Decrease"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="min-w-8 text-center text-sm font-bold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={item.quantity >= item.stock}
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="px-2.5 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40"
                                                aria-label="Increase"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-base font-extrabold text-slate-900">
                                                {formatPrice(item.line_total)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.product_id)}
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                            <h2 className="text-lg font-extrabold text-slate-900">Order Summary</h2>

                            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                                {amountUntilFree > 0 ? (
                                    <span>
                                        Add <strong>{formatPrice(amountUntilFree)}</strong> more for{' '}
                                        <strong className="text-emerald-600">Free Shipping</strong>.
                                    </span>
                                ) : (
                                    <span className="font-bold text-emerald-600">
                                        You unlocked Free Shipping!
                                    </span>
                                )}
                            </div>

                            <dl className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <dt>Subtotal</dt>
                                    <dd className="font-semibold text-slate-900">{formatPrice(cart.subtotal)}</dd>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <dt>Delivery Fee</dt>
                                    <dd className="font-semibold text-slate-900">
                                        {cart.shipping_fee === 0 ? 'Free' : formatPrice(cart.shipping_fee)}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
                                    <dt>Total</dt>
                                    <dd>{formatPrice(cart.total)}</dd>
                                </div>
                            </dl>

                            <Link
                                href="/checkout"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}

