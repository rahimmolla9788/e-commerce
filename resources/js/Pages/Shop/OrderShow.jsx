import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../Components/StatusBadge';
import ShopLayout from '../../Layouts/ShopLayout';
import { formatDate, formatPrice } from '../../utils/format';

export default function OrderShow({ order }) {
    return (
        <ShopLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to My Orders
                </Link>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600" />
                            <div>
                                <h1 className="text-xl font-extrabold text-slate-900">
                                    Order <span className="font-mono">{order.order_number}</span>
                                </h1>
                                <p className="mt-1 text-xs text-slate-500">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </div>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Shipping Details
                            </p>
                            <p className="mt-2 font-bold text-slate-900">{order.customer_name}</p>
                            <p className="text-slate-600">{order.customer_phone}</p>
                            <p className="mt-1 text-slate-600">
                                {order.shipping_address}, {order.shipping_city}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Payment Summary
                            </p>
                            <p className="mt-2 text-slate-700">
                                Method: <strong className="uppercase">{order.payment_method}</strong>
                            </p>
                            <p className="mt-1 text-slate-700">
                                Payment Status:{' '}
                                <strong className="capitalize">{order.payment_status.replaceAll('_', ' ')}</strong>
                            </p>
                            {order.notes && <p className="mt-1 text-xs text-slate-500">Note: {order.notes}</p>}
                        </div>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-3">Item</th>
                                    <th className="py-3 text-right">Price</th>
                                    <th className="py-3 text-right">Qty</th>
                                    <th className="py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-3 font-semibold text-slate-900">{item.product_name}</td>
                                        <td className="py-3 text-right text-slate-600">
                                            {formatPrice(item.product_price)}
                                        </td>
                                        <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                                        <td className="py-3 text-right font-bold text-slate-900">
                                            {formatPrice(item.line_total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <dl className="mt-6 ml-auto max-w-xs space-y-2 border-t border-slate-200 pt-4 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <dt>Subtotal</dt>
                            <dd>{formatPrice(order.subtotal)}</dd>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <dt>Shipping Fee</dt>
                            <dd>{Number(order.shipping_fee) === 0 ? 'Free' : formatPrice(order.shipping_fee)}</dd>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                            <dt>Total</dt>
                            <dd>{formatPrice(order.total)}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </ShopLayout>
    );
}

