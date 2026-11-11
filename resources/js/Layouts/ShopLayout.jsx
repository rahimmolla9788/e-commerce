import { Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    LogIn,
    LogOut,
    Menu,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import FlashBanner from '../Components/FlashBanner';

export default function ShopLayout({ children, initialSearch = '' }) {
    const { auth, cartCount, appName } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const handleSearch = (event) => {
        event.preventDefault();
        router.get('/', searchTerm.trim() ? { search: searchTerm.trim() } : {}, {
            preserveState: true,
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F4F6F8] text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex shrink-0 items-center gap-5">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0095D9] text-white shadow-2xs">
                                <ShoppingBag className="h-4.5 w-4.5" />
                            </span>
                            <span className="text-2xl font-black tracking-tight text-[#0095D9]">
                                {appName?.toLowerCase() || 'novamart'}
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-4 xl:flex">
                            <Link
                                href="/"
                                className="text-xs font-semibold text-slate-600 transition hover:text-[#0095D9]"
                            >
                                Shop
                            </Link>
                            {auth?.user && (
                                <Link
                                    href="/orders"
                                    className="text-xs font-semibold text-slate-600 transition hover:text-[#0095D9]"
                                >
                                    My Orders
                                </Link>
                            )}
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-[#0095D9]/10 hover:text-[#0095D9]"
                            >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin
                            </Link>
                        </nav>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="hidden flex-1 justify-center px-2 md:flex"
                    >
                        <div className="flex w-full max-w-2xl items-center overflow-hidden rounded-lg border border-slate-200/90 bg-[#F3F4F6] transition focus-within:border-[#0095D9] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0095D9]/15">
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for Products, Brands and More"
                                className="w-full bg-transparent px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                            />
                            <button
                                type="submit"
                                aria-label="Search products"
                                className="flex h-10 w-12 shrink-0 items-center justify-center bg-[#0095D9] text-white transition hover:bg-[#007EB8]"
                            >
                                <Search className="h-4.5 w-4.5" />
                            </button>
                        </div>
                    </form>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        {auth?.user ? (
                            <div className="hidden items-center gap-2 sm:flex">
                                <Link
                                    href="/orders"
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0095D9]"
                                >
                                    <User className="h-4 w-4 text-[#0095D9]" />
                                    <span className="max-w-28 truncate">{auth.user.name}</span>
                                    {auth.user.phone_verified && (
                                        <BadgeCheck
                                            className="h-4 w-4 text-emerald-600"
                                            title="Phone Verified"
                                        />
                                    )}
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:text-[#0095D9] sm:inline-flex"
                            >
                                <LogIn className="h-4.5 w-4.5 text-[#0095D9]" />
                                Login
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            className="relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0095D9]"
                        >
                            <ShoppingCart className="h-5 w-5 text-[#0095D9]" />
                            <span className="hidden sm:inline">Cart</span>
                            <span
                                data-testid="cart-count"
                                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0095D9] px-1.5 text-[11px] font-bold text-white"
                            >
                                {cartCount ?? 0}
                            </span>
                        </Link>

                        <Link
                            href="/admin"
                            className="hidden items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#0095D9]/40 hover:text-[#0095D9] sm:inline-flex xl:hidden"
                        >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Admin
                        </Link>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-600 sm:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Row */}
                <div className="border-t border-slate-100 bg-white px-4 py-2.5 md:hidden">
                    <form onSubmit={handleSearch}>
                        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-[#F3F4F6]">
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for Products, Brands and More"
                                className="w-full bg-transparent px-3.5 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                            />
                            <button
                                type="submit"
                                aria-label="Search products"
                                className="flex h-9 w-11 shrink-0 items-center justify-center bg-[#0095D9] text-white"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-slate-200 bg-white px-4 py-4 sm:hidden">
                        <div className="flex flex-col gap-2 text-sm font-semibold">
                            <Link href="/" className="rounded-lg px-3 py-2 hover:bg-slate-100">
                                Shop
                            </Link>
                            <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-slate-100">
                                Admin Portal (/admin)
                            </Link>
                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/orders"
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100"
                                    >
                                        <Package className="h-4 w-4 text-[#0095D9]" />
                                        My Orders
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#0095D9] py-2.5 text-center text-white transition hover:bg-[#007EB8]"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <FlashBanner />

            <main className="flex-1">{children}</main>

            <footer className="mt-16 border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0095D9] text-white">
                                <ShoppingBag className="h-4 w-4" />
                            </span>
                            <span className="text-lg font-black tracking-tight text-[#0095D9]">
                                {appName?.toLowerCase() || 'novamart'}
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-500">
                            Phone-verified e-commerce powered by Laravel, Inertia &amp; React.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-600">
                        <Link href="/" className="hover:text-[#0095D9]">
                            Storefront
                        </Link>
                        <Link href="/cart" className="hover:text-[#0095D9]">
                            Cart
                        </Link>
                        <Link href="/login" className="hover:text-[#0095D9]">
                            Login
                        </Link>
                        <Link href="/register" className="hover:text-[#0095D9]">
                            Register
                        </Link>
                        <Link href="/forgot-password" className="hover:text-[#0095D9]">
                            Forgot Password
                        </Link>
                        <Link href="/admin" className="text-[#0095D9] hover:text-[#007EB8]">
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
