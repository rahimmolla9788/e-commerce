import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Package } from 'lucide-react';
import StatusBadge from '../../Components/StatusBadge';
import ShopLayout from '../../Layouts/ShopLayout';
import { formatDate, formatPrice } from '../../utils/format';

export default function OrdersIndex({ orders }) {
    return (
        <ShopLayout>
            <Head title="My Orders" />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-extrabold text-slate-900">My Orders</h1>
                <p className="mt-1 text-sm text-slate-500">Track your purchases and delivery status.</p>

                {orders.data.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-slate-300" />
                        <h2 className="mt-4 text-lg font-bold text-slate-900">No orders yet</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Once you place an order, you can track its status here.
                        </p>
                        <Link
                            href="/"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0095D9] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#007EB8]"
                        >
                            Start Shopping
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.order_number}`}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#0095D9]/50 sm:flex-row sm:items-center"
                            >
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-mono text-sm font-extrabold text-slate-900">
                                            {order.order_number}
                                        </span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        Placed on {formatDate(order.created_at)} &bull; {order.items_count} item(s) &bull;{' '}
                                        <span className="uppercase">{order.payment_method}</span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                    <span className="text-lg font-extrabold text-slate-900">
                                        {formatPrice(order.total)}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}

