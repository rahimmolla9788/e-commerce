import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowRight, BadgeDollarSign, Clock, Package, ShoppingCart, Users } from 'lucide-react';
import StatusBadge from '../../Components/StatusBadge';
import AdminLayout from '../../Layouts/AdminLayout';
import { formatDate, formatPrice } from '../../utils/format';

export default function Dashboard({ stats, recentOrders, lowStockProducts }) {
    const cards = [
        {
            label: 'Total Revenue',
            value: formatPrice(stats.total_revenue),
            sub: `${stats.total_orders} total orders`,
            icon: BadgeDollarSign,
            tone: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Pending Orders',
            value: stats.pending_orders,
            sub: 'Needs processing',
            icon: Clock,
            tone: 'bg-amber-50 text-amber-600',
        },
        {
            label: 'Active Catalog',
            value: stats.total_products,
            sub: `${stats.low_stock_count} low stock`,
            icon: Package,
            tone: 'bg-indigo-50 text-indigo-600',
        },
        {
            label: 'Verified Customers',
            value: stats.verified_customers,
            sub: `${stats.unverified_customers} unverified`,
            icon: Users,
            tone: 'bg-sky-50 text-sky-600',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {card.label}
                                </p>
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.tone}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-3 text-2xl font-extrabold text-slate-900">{card.value}</p>
                            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-indigo-600" />
                            <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                            View All <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="mt-6 text-sm text-slate-500">No orders placed yet.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                                        <th className="py-2.5">Order</th>
                                        <th className="py-2.5">Customer</th>
                                        <th className="py-2.5">Status</th>
                                        <th className="py-2.5 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50">
                                            <td className="py-3">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="font-mono text-xs font-bold text-indigo-600 hover:underline"
                                                >
                                                    {order.order_number}
                                                </Link>
                                                <p className="text-[11px] text-slate-400">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </td>
                                            <td className="py-3">
                                                <p className="font-semibold text-slate-900">{order.customer_name}</p>
                                                <p className="text-xs text-slate-500">{order.customer_phone}</p>
                                            </td>
                                            <td className="py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-3 text-right font-bold text-slate-900">
                                                {formatPrice(order.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <h2 className="text-base font-bold text-slate-900">Low Stock Alerts</h2>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                            Manage
                        </Link>
                    </div>

                    {lowStockProducts.length === 0 ? (
                        <p className="mt-6 text-sm text-slate-500">All products are well stocked.</p>
                    ) : (
                        <ul className="mt-4 space-y-3">
                            {lowStockProducts.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs"
                                >
                                    <div>
                                        <p className="font-bold text-slate-900">{item.name}</p>
                                        <p className="text-slate-500">{item.category?.name || 'Uncategorized'}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 font-bold ${
                                            item.stock === 0
                                                ? 'bg-rose-100 text-rose-700'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {item.stock} left
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

