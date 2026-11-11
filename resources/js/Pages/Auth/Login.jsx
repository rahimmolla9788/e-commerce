import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import ShopLayout from '../../Layouts/ShopLayout';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <ShopLayout>
            <Head title="Sign In" />

            <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-12 sm:px-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0095D9]/10 text-[#0095D9]">
                            <Lock className="h-6 w-6" />
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Sign in with your verified phone number and password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="01712345678 or +8801712345678"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                                />
                            </div>
                            {errors.phone && <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-[#0095D9] hover:text-[#007EB8]"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Your password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password}</p>}
                        </div>

                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-[#0095D9] focus:ring-[#0095D9]"
                            />
                            Keep me signed in
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0095D9] py-3 text-sm font-bold text-white shadow-sm shadow-[#0095D9]/25 transition hover:bg-[#007EB8] disabled:opacity-60"
                        >
                            {processing ? 'Signing In...' : 'Sign In'}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
                        <p className="text-xs font-medium text-slate-500">New to NovaMart?</p>
                        <Link
                            href="/register"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0095D9]/30 bg-[#0095D9]/8 py-2.5 text-sm font-bold text-[#0095D9] transition hover:bg-[#0095D9] hover:text-white"
                        >
                            Create a new account (OTP Verified)
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <p className="pt-1 text-xs text-slate-400">
                            <Link href="/admin" className="inline-flex items-center gap-1 hover:text-[#0095D9]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Go to Admin Panel
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}

