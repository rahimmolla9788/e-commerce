import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Lock, Phone, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ demoCredentials }) {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/admin/login');
    };

    const fillDemo = () => {
        if (!demoCredentials) {
            return;
        }
        setData({
            phone: demoCredentials.phone,
            password: demoCredentials.password,
            remember: true,
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <Head title="Admin Sign In" />

            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Storefront
                </Link>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
                    <div className="mb-6 text-center">
                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                            <ShieldCheck className="h-6 w-6" />
                        </span>
                        <h1 className="text-2xl font-extrabold text-white">Admin Console</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Sign in with your administrator credentials.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="admin-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                                Admin Phone
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="admin-phone"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="01700000000"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            </div>
                            {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="admin-password"
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                        >
                            {processing ? 'Signing In...' : 'Sign In to Admin'}
                        </button>
                    </form>

                    {demoCredentials && (
                        <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-800/70 p-4 text-xs text-slate-300">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-indigo-300">Seeded Demo Admin</span>
                                <button
                                    type="button"
                                    onClick={fillDemo}
                                    className="rounded-lg bg-indigo-600/20 px-2.5 py-1 font-semibold text-indigo-300 hover:bg-indigo-600/30"
                                >
                                    Fill Credentials
                                </button>
                            </div>
                            <p className="mt-2 font-mono text-slate-400">
                                Phone: {demoCredentials.phone} &bull; Pass: {demoCredentials.password}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

