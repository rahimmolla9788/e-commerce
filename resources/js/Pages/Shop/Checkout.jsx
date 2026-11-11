import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, CreditCard, MapPin, Phone, User } from 'lucide-react';
import ShopLayout from '../../Layouts/ShopLayout';
import { formatPrice } from '../../utils/format';

const PAYMENT_OPTIONS = [
    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay in cash when your order arrives.' },
    { id: 'bkash', label: 'bKash Mobile Banking', desc: 'Pay via bKash merchant upon confirmation.' },
    { id: 'nagad', label: 'Nagad Mobile Banking', desc: 'Instant digital wallet payment.' },
];

export default function Checkout({ cart, defaults }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: defaults.customer_name || '',
        customer_phone: defaults.customer_phone || '',
        shipping_address: defaults.shipping_address || '',
        shipping_city: defaults.shipping_city || 'Dhaka',
        payment_method: defaults.payment_method || 'cod',
        notes: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/checkout');
    };

    return (
        <ShopLayout>
            <Head title="Checkout" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Checkout</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Complete your delivery information and confirm your order.
                </p>

                {errors.cart && (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                        {errors.cart}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                            <h2 className="text-lg font-bold text-slate-900">Shipping Information</h2>
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                    {errors.customer_name && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.customer_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Receiver Phone
                                    </label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                    {errors.customer_phone && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.customer_phone}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Delivery Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <textarea
                                            rows={2}
                                            required
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            placeholder="House, Road, Area..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                    {errors.shipping_address && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.shipping_address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        City / District
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.shipping_city}
                                        onChange={(e) => setData('shipping_city', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none"
                                    />
                                    {errors.shipping_city && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.shipping_city}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Delivery Note (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="e.g. Call before arrival"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-[#0095D9]" />
                                <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {PAYMENT_OPTIONS.map((option) => {
                                    const selected = data.payment_method === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => setData('payment_method', option.id)}
                                            className={`rounded-2xl border p-4 text-left transition ${
                                                selected
                                                    ? 'border-[#0095D9] bg-[#0095D9]/8 ring-2 ring-[#0095D9]/20'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <p className="text-sm font-bold text-slate-900">{option.label}</p>
                                            <p className="mt-1 text-xs text-slate-500">{option.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                        <h2 className="text-lg font-extrabold text-slate-900">Order Summary</h2>
                        <ul className="mt-4 divide-y divide-slate-100">
                            {cart.items.map((item) => (
                                <li key={item.product_id} className="flex items-center justify-between py-3 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        {formatPrice(item.line_total)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <dl className="mt-4 space-y-2.5 border-t border-slate-200 pt-4 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <dt>Subtotal</dt>
                                <dd className="font-semibold text-slate-900">{formatPrice(cart.subtotal)}</dd>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <dt>Shipping</dt>
                                <dd className="font-semibold text-slate-900">
                                    {cart.shipping_fee === 0 ? 'Free' : formatPrice(cart.shipping_fee)}
                                </dd>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
                                <dt>Total</dt>
                                <dd>{formatPrice(cart.total)}</dd>
                            </div>
                        </dl>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0095D9] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#007EB8] disabled:opacity-60"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {processing ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </ShopLayout>
    );
}

