import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function CategoriesIndex({ categories }) {
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const form = useForm({
        name: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });

    const openCreate = () => {
        setEditing(null);
        form.setData({ name: '', description: '', sort_order: 0, is_active: true });
        form.clearErrors();
        setShowModal(true);
    };

    const openEdit = (category) => {
        setEditing(category);
        form.setData({
            name: category.name,
            description: category.description || '',
            sort_order: category.sort_order ?? 0,
            is_active: Boolean(category.is_active),
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (editing) {
            form.put(`/admin/categories/${editing.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            form.post('/admin/categories', {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (category) => {
        if (confirm(`Delete category "${category.name}"?`)) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <AdminLayout title="Categories">
            <Head title="Admin Categories" />

            <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-slate-500">Organize storefront products into clean categories.</p>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Slug</th>
                                <th className="px-5 py-3">Products</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900">{cat.name}</p>
                                        {cat.description && (
                                            <p className="text-xs text-slate-500">{cat.description}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{cat.slug}</td>
                                    <td className="px-5 py-3.5 font-semibold text-slate-700">{cat.products_count}</td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                cat.is_active
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {cat.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(cat)}
                                                className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cat)}
                                                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-slate-900">
                                {editing ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                                {form.errors.name && <p className="mt-1 text-xs text-rose-600">{form.errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={form.data.sort_order}
                                        onChange={(e) => form.setData('sort_order', Number(e.target.value))}
                                        className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                                <label className="flex items-center gap-2 pt-5 text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded text-indigo-600"
                                    />
                                    Active
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                                >
                                    {form.processing ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
