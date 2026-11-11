import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../../../Components/StatusBadge';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatDate, formatPrice } from '../../../utils/format';

export default function OrdersIndex({ orders, statuses, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilter = (nextSearch, nextStatus) => {
        const params = {};
        if (nextSearch) params.search = nextSearch;
        if (nextStatus) params.status = nextStatus;
        router.get('/admin/orders', params, { preserveState: true });
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Admin Orders" />

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilter(search, status);
                    }}
                    className="relative"
                >
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Order #, customer, phone..."
                        className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
                    />
                </form>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        applyFilter(search, e.target.value);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                    <option value="">All Statuses</option>
                    {statuses.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-5 py-3">Order #</th>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Items</th>
                                <th className="px-5 py-3">Payment</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Total</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                                        No matching orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3.5">
                                            <p className="font-mono text-xs font-bold text-indigo-600">
                                                {order.order_number}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="font-bold text-slate-900">{order.customer_name}</p>
                                            <p className="text-xs text-slate-500">{order.customer_phone}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600">{order.items_count}</td>
                                        <td className="px-5 py-3.5 text-xs">
                                            <span className="font-bold uppercase">{order.payment_method}</span>
                                            <p className="capitalize text-slate-500">
                                                {order.payment_status.replaceAll('_', ' ')}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
