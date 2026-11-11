import { Head, Link, router } from '@inertiajs/react';
import { Award, ShieldCheck, Smartphone, Truck } from 'lucide-react';
import HomeBentoBanner from '../../Components/HomeBentoBanner';
import HomeCategoryStrip from '../../Components/HomeCategoryStrip';
import ProductCard from '../../Components/ProductCard';
import ShopLayout from '../../Layouts/ShopLayout';

const SERVICE_HIGHLIGHTS = [
    {
        icon: Smartphone,
        title: 'OTP-Verified Security',
        desc: 'Phone verification protects every customer account',
        color: 'text-[#0095D9] bg-[#0095D9]/10',
    },
    {
        icon: Truck,
        title: 'Fast Express Delivery',
        desc: 'Free shipping on orders above ৳2,000 nationwide',
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        icon: ShieldCheck,
        title: 'COD, bKash & Nagad',
        desc: 'Pay comfortably with cash or mobile banking',
        color: 'text-amber-600 bg-amber-50',
    },
    {
        icon: Award,
        title: '100% Authentic Gear',
        desc: 'Curated electronics, wearables, fashion & workspace',
        color: 'text-indigo-600 bg-indigo-50',
    },
];

export default function Home({ categories, products, filters }) {
    const applyFilter = (next) => {
        const params = {
            ...filters,
            ...next,
        };

        const cleaned = Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
        );

        router.get('/', cleaned, { preserveState: true, preserveScroll: true });
    };

    return (
        <ShopLayout initialSearch={filters.search || ''}>
            <Head title="Shop Quality Tech, Fashion & Lifestyle" />

            <HomeCategoryStrip categories={categories} filters={filters} onApplyFilter={applyFilter} />

            <HomeBentoBanner />

            {/* Compact E-Commerce Trust Bar */}
            <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs lg:grid-cols-4">
                    {SERVICE_HIGHLIGHTS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div key={item.title} className="flex items-center gap-3 px-1">
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                </span>
                                <div className="min-w-0">
                                    <div className="truncate text-xs font-bold text-slate-900">{item.title}</div>
                                    <div className="truncate text-[11px] text-slate-500">{item.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Product Catalog Section */}
            <section id="catalog" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => applyFilter({ category: '' })}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                                !filters.category
                                    ? 'bg-[#0095D9] text-white shadow-2xs'
                                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0095D9]/50 hover:text-[#0095D9]'
                            }`}
                        >
                            All Products
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => applyFilter({ category: cat.slug })}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                                    filters.category === cat.slug
                                        ? 'bg-[#0095D9] text-white shadow-2xs'
                                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0095D9]/50 hover:text-[#0095D9]'
                                }`}
                            >
                                {cat.name} ({cat.products_count})
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2.5">
                        <label htmlFor="sort" className="text-xs font-semibold text-slate-500">
                            Sort by
                        </label>
                        <select
                            id="sort"
                            value={filters.sort || 'featured'}
                            onChange={(e) => applyFilter({ sort: e.target.value })}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#0095D9] focus:bg-white focus:outline-none"
                        >
                            <option value="featured">Featured Deals</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {filters.search && (
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs">
                        <span>
                            Showing results for <strong>&ldquo;{filters.search}&rdquo;</strong>
                        </span>
                        <button
                            type="button"
                            onClick={() => applyFilter({ search: '' })}
                            className="font-bold text-[#0095D9] hover:text-[#007EB8]"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {products.data.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <p className="text-base font-bold text-slate-800">No products found</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Try clearing your filters or searching with another keyword.
                        </p>
                        <button
                            type="button"
                            onClick={() => router.get('/')}
                            className="mt-4 rounded-lg bg-[#0095D9] px-4 py-2 text-xs font-bold text-white hover:bg-[#007EB8]"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.last_page > 1 && (
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                                {products.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                                            link.active
                                                ? 'bg-[#0095D9] text-white'
                                                : link.url
                                                  ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                                                  : 'cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </ShopLayout>
    );
}
