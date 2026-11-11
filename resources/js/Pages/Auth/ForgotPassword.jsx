import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowRight, KeyRound, Lock, Phone, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import SandboxOtpBox from '../../Components/SandboxOtpBox';
import ShopLayout from '../../Layouts/ShopLayout';

export default function ForgotPassword({ resetPhone, maskedPhone, otpPreview }) {
    const [cooldown, setCooldown] = useState(otpPreview?.resend_available_in ?? 0);
    const [resending, setResending] = useState(false);

    const requestForm = useForm({
        phone: '',
    });

    const resetForm = useForm({
        code: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setCooldown(otpPreview?.resend_available_in ?? 0);
    }, [otpPreview?.resend_available_in, otpPreview?.code]);

    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setCooldown((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSendOtp = (event) => {
        event.preventDefault();
        requestForm.post('/forgot-password/send-otp');
    };

    const handleResetPassword = (event) => {
        event.preventDefault();
        resetForm.post('/forgot-password/reset');
    };

    const handleResend = () => {
        if (cooldown > 0 || resending) {
            return;
        }
        setResending(true);
        router.post(
            '/forgot-password/resend-otp',
            {},
            {
                preserveScroll: true,
                onFinish: () => setResending(false),
            },
        );
    };

    const handleChangePhone = () => {
        router.post('/forgot-password/change-phone');
    };

    return (
        <ShopLayout>
            <Head title="Forgot Password" />

            <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-12 sm:px-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0095D9]/10 text-[#0095D9]">
                            <KeyRound className="h-6 w-6" />
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900">Reset Password</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {resetPhone
                                ? `Verify OTP for ${resetPhone || maskedPhone} and set a new password.`
                                : 'Enter your registered phone number to receive a 6-digit reset OTP.'}
                        </p>
                    </div>

                    {!resetPhone ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label htmlFor="reset-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Registered Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="reset-phone"
                                        type="tel"
                                        required
                                        value={requestForm.data.phone}
                                        onChange={(e) => requestForm.setData('phone', e.target.value)}
                                        placeholder="01712345678 or +8801712345678"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                                    />
                                </div>
                                {requestForm.errors.phone && (
                                    <p className="mt-1 text-xs font-medium text-rose-600">{requestForm.errors.phone}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={requestForm.processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0095D9] py-3 text-sm font-bold text-white shadow-sm shadow-[#0095D9]/25 transition hover:bg-[#007EB8] disabled:opacity-60"
                            >
                                {requestForm.processing ? 'Generating OTP...' : 'Send Reset OTP'}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    ) : (
                        <>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="reset-otp" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        6-Digit Reset OTP
                                    </label>
                                    <input
                                        id="reset-otp"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        required
                                        value={resetForm.data.code}
                                        onChange={(e) =>
                                            resetForm.setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))
                                        }
                                        placeholder="000000"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center font-mono text-xl font-extrabold tracking-[0.4em] text-slate-900 focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                                    />
                                    {resetForm.errors.code && (
                                        <p className="mt-1 text-xs font-medium text-rose-600">{resetForm.errors.code}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="new-password"
                                            type="password"
                                            required
                                            value={resetForm.data.password}
                                            onChange={(e) => resetForm.setData('password', e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                                        />
                                    </div>
                                    {resetForm.errors.password && (
                                        <p className="mt-1 text-xs font-medium text-rose-600">{resetForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirm-new-password"
                                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
                                    >
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="confirm-new-password"
                                            type="password"
                                            required
                                            value={resetForm.data.password_confirmation}
                                            onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Re-enter new password"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={resetForm.processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0095D9] py-3 text-sm font-bold text-white shadow-sm shadow-[#0095D9]/25 transition hover:bg-[#007EB8] disabled:opacity-60"
                                >
                                    {resetForm.processing ? 'Updating Password...' : 'Verify OTP & Reset Password'}
                                </button>
                            </form>

                            <div className="mt-4 flex items-center justify-between text-xs">
                                <button
                                    type="button"
                                    disabled={cooldown > 0 || resending}
                                    onClick={handleResend}
                                    className="inline-flex items-center gap-1.5 font-semibold text-[#0095D9] hover:text-[#007EB8] disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleChangePhone}
                                    className="font-semibold text-slate-500 hover:text-slate-700"
                                >
                                    Use different number
                                </button>
                            </div>

                            {/* Sandbox OTP displayed right below the password reset OTP form */}
                            <SandboxOtpBox
                                otpPreview={otpPreview}
                                onFillCode={(code) => resetForm.setData('code', code)}
                            />
                        </>
                    )}

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Remember your password?{' '}
                        <Link href="/login" className="font-bold text-[#0095D9] hover:text-[#007EB8]">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </ShopLayout>
    );
}

