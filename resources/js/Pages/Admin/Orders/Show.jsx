import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import StatusBadge from '../../../Components/StatusBadge';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatDate, formatPrice } from '../../../utils/format';

export default function OrderShow({ order, statuses }) {
    const form = useForm({
        status: order.status,
        payment_status: order.payment_status,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        form.patch(`/admin/orders/${order.id}/status`);
    };

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`Admin Order ${order.order_number}`} />

            <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Orders
            </Link>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="font-mono text-lg font-extrabold text-slate-900">
                                    {order.order_number}
                                </h2>
                                <p className="text-xs text-slate-500">Placed on {formatDate(order.created_at)}</p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                                        <th className="py-2.5">Product</th>
                                        <th className="py-2.5 text-right">Price</th>
                                        <th className="py-2.5 text-right">Qty</th>
                                        <th className="py-2.5 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-3 font-semibold text-slate-900">{item.product_name}</td>
                                            <td className="py-3 text-right text-slate-600">
                                                {formatPrice(item.product_price)}
                                            </td>
                                            <td className="py-3 text-right">{item.quantity}</td>
                                            <td className="py-3 text-right font-bold text-slate-900">
                                                {formatPrice(item.line_total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <dl className="mt-4 ml-auto max-w-xs space-y-2 border-t border-slate-200 pt-4 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <dt>Subtotal</dt>
                                <dd>{formatPrice(order.subtotal)}</dd>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <dt>Shipping Fee</dt>
                                <dd>{formatPrice(order.shipping_fee)}</dd>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                                <dt>Total</dt>
                                <dd>{formatPrice(order.total)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <h3 className="text-base font-bold text-slate-900">Update Status</h3>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Order Status
                                </label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                >
                                    {statuses.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Payment Status
                                </label>
                                <select
                                    value={form.data.payment_status}
                                    onChange={(e) => form.setData('payment_status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="pending_verification">Pending Verification</option>
                                    <option value="paid">Paid</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                            >
                                <Save className="h-4 w-4" />
                                {form.processing ? 'Updating...' : 'Save Status'}
                            </button>
                        </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-sm">
                        <h3 className="text-base font-bold text-slate-900">Customer &amp; Shipping</h3>
                        <p className="mt-3 font-bold text-slate-900">{order.customer_name}</p>
                        <p className="font-mono text-xs text-slate-600">{order.customer_phone}</p>
                        <p className="mt-2 text-slate-600">
                            {order.shipping_address}, {order.shipping_city}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                            Payment: <strong className="uppercase">{order.payment_method}</strong>
                        </p>
                        {order.notes && <p className="mt-2 text-xs text-slate-500">Note: {order.notes}</p>}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
