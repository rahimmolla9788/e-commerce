import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatPrice } from '../../../utils/format';

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const form = useForm({
        category_id: '',
        name: '',
        sku: '',
        short_description: '',
        description: '',
        price: '',
        compare_price: '',
        stock: 10,
        image: null,
        is_featured: false,
        is_active: true,
    });

    const applyFilter = (nextSearch, nextCat) => {
        const params = {};
        if (nextSearch) params.search = nextSearch;
        if (nextCat) params.category_id = nextCat;
        router.get('/admin/products', params, { preserveState: true });
    };

    const openCreate = () => {
        setEditing(null);
        form.setData({
            category_id: categories[0]?.id || '',
            name: '',
            sku: '',
            short_description: '',
            description: '',
            price: '',
            compare_price: '',
            stock: 10,
            image: null,
            is_featured: false,
            is_active: true,
        });
        form.clearErrors();
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        form.setData({
            category_id: product.category_id || '',
            name: product.name,
            sku: product.sku || '',
            short_description: product.short_description || '',
            description: product.description || '',
            price: product.price,
            compare_price: product.compare_price || '',
            stock: product.stock,
            image: null,
            is_featured: Boolean(product.is_featured),
            is_active: Boolean(product.is_active),
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editing) {
            form.transform((data) => ({
                ...data,
                _method: 'put',
            }));
            form.post(`/admin/products/${editing.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    form.transform((d) => d);
                },
            });
        } else {
            form.transform((data) => data);
            form.post('/admin/products', {
                forceFormData: true,
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (product) => {
        if (confirm(`Delete product "${product.name}"?`)) {
            router.delete(`/admin/products/${product.id}`);
        }
    };

    return (
        <AdminLayout title="Products">
            <Head title="Admin Products" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilter(search, categoryId);
                        }}
                        className="relative"
                    >
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or SKU..."
                            className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
                        />
                    </form>

                    <select
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            applyFilter(search, e.target.value);
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-5 py-3">Product</th>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3 text-right">Price</th>
                                <th className="px-5 py-3 text-right">Stock</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-11 w-12 rounded-lg bg-slate-100 object-cover"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {product.sku || product.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">
                                        {product.category?.name || 'Uncategorized'}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <p className="font-bold text-slate-900">{formatPrice(product.price)}</p>
                                        {product.compare_price && (
                                            <p className="text-xs text-slate-400 line-through">
                                                {formatPrice(product.compare_price)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold">{product.stock}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                    product.is_active
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {product.is_active ? 'Active' : 'Draft'}
                                            </span>
                                            {product.is_featured && (
                                                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(product)}
                                                className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product)}
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

            {products.last_page > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                    {products.links.map((link, index) => (
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-slate-900">
                                {editing ? 'Edit Product' : 'Create Product'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Product Name
                                </label>
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
                                    Category
                                </label>
                                <select
                                    value={form.data.category_id}
                                    onChange={(e) => form.setData('category_id', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.category_id && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.category_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    SKU (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={form.data.sku}
                                    onChange={(e) => form.setData('sku', e.target.value)}
                                    placeholder="e.g. NM-1001"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                                {form.errors.sku && <p className="mt-1 text-xs text-rose-600">{form.errors.sku}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Price (৳)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    required
                                    value={form.data.price}
                                    onChange={(e) => form.setData('price', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                                {form.errors.price && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.price}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Compare Price (Optional)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.data.compare_price}
                                    onChange={(e) => form.setData('compare_price', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                                {form.errors.compare_price && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.compare_price}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={form.data.stock}
                                    onChange={(e) => form.setData('stock', Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                                {form.errors.stock && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.stock}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Product Image
                                </label>
                                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-400">
                                    <Upload className="h-4 w-4 text-indigo-600" />
                                    <span className="truncate">
                                        {form.data.image ? form.data.image.name : 'Upload PNG/JPG (max 2MB)'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => form.setData('image', e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                </label>
                                {form.errors.image && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.image}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Short Summary
                                </label>
                                <input
                                    type="text"
                                    value={form.data.short_description}
                                    onChange={(e) => form.setData('short_description', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                                    Full Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-6 sm:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded text-indigo-600"
                                    />
                                    Active in Store
                                </label>
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_featured}
                                        onChange={(e) => form.setData('is_featured', e.target.checked)}
                                        className="h-4 w-4 rounded text-indigo-600"
                                    />
                                    Featured Product
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
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
                                    {form.processing ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
