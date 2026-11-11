import { Head, Link, router } from '@inertiajs/react';
import { BadgeCheck, Clock, Search } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatDate, formatPrice } from '../../../utils/format';

export default function CustomersIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (event) => {
        event.preventDefault();
        router.get('/admin/customers', search ? { search } : {}, { preserveState: true });
    };

    return (
        <AdminLayout title="Customers">
            <Head title="Admin Customers" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, phone, city..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
                    />
                </form>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-5 py-3">User</th>
                                <th className="px-5 py-3">Phone</th>
                                <th className="px-5 py-3">OTP Verification</th>
                                <th className="px-5 py-3">Role</th>
                                <th className="px-5 py-3 text-right">Orders</th>
                                <th className="px-5 py-3 text-right">Spent</th>
                                <th className="px-5 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.data.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.city || 'No city'}</p>
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">{user.phone}</td>
                                    <td className="px-5 py-3.5">
                                        {user.phone_verified_at ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                                <BadgeCheck className="h-3.5 w-3.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                                <Clock className="h-3.5 w-3.5" />
                                                Pending OTP
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold">{user.orders_count}</td>
                                    <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                                        {formatPrice(user.orders_sum_total || 0)}
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-slate-500">
                                        {formatDate(user.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {customers.last_page > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                    {customers.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                                link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'border border-slate-200 bg-white text-slate-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
