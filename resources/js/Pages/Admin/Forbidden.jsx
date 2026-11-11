import { Head, Link, router } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
    const switchAccount = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <Head title="Admin Access Required" />
            <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <ShieldAlert className="h-7 w-7" />
                </span>
                <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Admin Access Required</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Your current account is a customer account and does not have administrator permissions.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/"
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                        Back to Store
                    </Link>
                    <button
                        type="button"
                        onClick={switchAccount}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                    >
                        Switch to Admin Account
                    </button>
                </div>
            </div>
        </div>
    );
}

