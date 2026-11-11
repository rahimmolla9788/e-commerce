import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, Phone, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import ShopLayout from '../../Layouts/ShopLayout';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/register');
    };

    return (
        <ShopLayout>
            <Head title="Register" />

            <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-12 sm:px-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <ShieldCheck className="h-6 w-6" />
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Register with your phone number &amp; verify via 6-digit OTP.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Rahim Ahmed"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
                        </div>

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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">
                                Bangladeshi numbers (017...) or international E.164 (+...) supported.
                            </p>
                            {errors.phone && <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {processing ? 'Creating Account...' : 'Register & Send OTP'}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </ShopLayout>
    );
}

