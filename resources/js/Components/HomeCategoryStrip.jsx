import { ChevronDown, LayoutGrid } from 'lucide-react';

const CATEGORY_THUMBNAILS = {
    'electronics-audio': '/images/products/headphones.jpg',
    'fashion-footwear': '/images/products/sneakers.jpg',
    'accessories-bags': '/images/products/backpack.jpg',
    'home-workspace': '/images/products/lamp.jpg',
};

const QUICK_COLLECTION_ITEMS = [
    {
        key: 'smartwatch',
        label: 'Smart Watches',
        image: '/images/products/smartwatch.jpg',
        filter: { category: '', search: 'Watch' },
    },
    {
        key: 'outerwear',
        label: 'Jackets & Apparel',
        image: '/images/products/jacket.jpg',
        filter: { category: '', search: 'Jacket' },
    },
    {
        key: 'keyboards',
        label: 'Mechanical Gear',
        image: '/images/products/keyboard.jpg',
        filter: { category: '', search: 'Keyboard' },
    },
    {
        key: 'coffee',
        label: 'Coffee & Living',
        image: '/images/products/coffee-maker.jpg',
        filter: { category: '', search: 'Coffee' },
    },
];

export default function HomeCategoryStrip({ categories, filters, onApplyFilter }) {
    const isAllActive = !filters.category && !filters.search;

    return (
        <div className="border-b border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-stretch justify-start gap-2 overflow-x-auto py-3 lg:justify-between">
                    <button
                        type="button"
                        onClick={() => onApplyFilter({ category: '', search: '' })}
                        className={`group flex min-w-[92px] shrink-0 flex-col items-center gap-1.5 rounded-xl px-2.5 py-2 text-center transition ${
                            isAllActive
                                ? 'bg-[#0095D9]/8 text-[#0095D9]'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#0095D9]'
                        }`}
                    >
                        <span
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-white shadow-2xs transition ${
                                isAllActive
                                    ? 'border-[#0095D9] text-[#0095D9]'
                                    : 'border-slate-200/80 text-slate-600 group-hover:border-[#0095D9]/40'
                            }`}
                        >
                            <LayoutGrid className="h-5 w-5" />
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold leading-tight whitespace-nowrap">
                            All Deals
                            <ChevronDown className="h-3 w-3 opacity-60" />
                        </span>
                    </button>

                    {categories.map((cat) => {
                        const active = filters.category === cat.slug;
                        const thumb = CATEGORY_THUMBNAILS[cat.slug] || '/images/products/default-product.svg';

                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => onApplyFilter({ category: cat.slug, search: '' })}
                                className={`group flex min-w-[104px] shrink-0 flex-col items-center gap-1.5 rounded-xl px-2.5 py-2 text-center transition ${
                                    active
                                        ? 'bg-[#0095D9]/8 text-[#0095D9]'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0095D9]'
                                }`}
                            >
                                <span
                                    className={`h-11 w-11 overflow-hidden rounded-xl border bg-slate-50 p-0.5 transition ${
                                        active
                                            ? 'border-[#0095D9] ring-2 ring-[#0095D9]/20'
                                            : 'border-slate-200/80 group-hover:border-[#0095D9]/40'
                                    }`}
                                >
                                    <img
                                        src={thumb}
                                        alt={cat.name}
                                        className="h-full w-full rounded-lg object-cover transition duration-200 group-hover:scale-105"
                                    />
                                </span>
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold leading-tight whitespace-nowrap">
                                    {cat.name}
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </span>
                            </button>
                        );
                    })}

                    {QUICK_COLLECTION_ITEMS.map((item) => {
                        const active =
                            filters.search &&
                            filters.search.toLowerCase() === item.filter.search.toLowerCase();

                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => onApplyFilter(item.filter)}
                                className={`group flex min-w-[100px] shrink-0 flex-col items-center gap-1.5 rounded-xl px-2.5 py-2 text-center transition ${
                                    active
                                        ? 'bg-[#0095D9]/8 text-[#0095D9]'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0095D9]'
                                }`}
                            >
                                <span
                                    className={`h-11 w-11 overflow-hidden rounded-xl border bg-slate-50 p-0.5 transition ${
                                        active
                                            ? 'border-[#0095D9] ring-2 ring-[#0095D9]/20'
                                            : 'border-slate-200/80 group-hover:border-[#0095D9]/40'
                                    }`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.label}
                                        className="h-full w-full rounded-lg object-cover transition duration-200 group-hover:scale-105"
                                    />
                                </span>
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold leading-tight whitespace-nowrap">
                                    {item.label}
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

