import { Link, router, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    FolderTree,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareCode,
    Package,
    ShoppingBag,
    ShoppingCart,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import FlashBanner from '../Components/FlashBanner';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/sms-settings', label: 'SMS & OTP', icon: MessageSquareCode },
];

export default function AdminLayout({ children, title = 'Admin' }) {
    const { auth, appName } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (item) => {
        if (item.exact) {
            return currentUrl === '/admin' || currentUrl === '/admin/';
        }
        return currentUrl.startsWith(item.href);
    };

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-900">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-200 transition-transform lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <ShoppingBag className="h-4 w-4" />
                        </span>
                        <div>
                            <span className="block text-sm font-bold text-white">{appName}</span>
                            <span className="block text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                                Admin Console
                            </span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                                    active
                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-800 p-4 space-y-2">
                    <Link
                        href="/"
                        className="flex w-full items-center justify-between rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                        <span>Visit Storefront</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-950/50 hover:text-rose-300"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex flex-1 flex-col min-w-0">
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                        <div className="text-right">
                            <p className="font-bold text-slate-900">{auth?.user?.name}</p>
                            <p className="text-slate-500">{auth?.user?.phone}</p>
                        </div>
                        <span className="rounded-full bg-indigo-100 px-2.5 py-1 font-bold text-indigo-700">
                            Admin
                        </span>
                    </div>
                </header>

                <FlashBanner />

                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}

