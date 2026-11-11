import { Head, Link, router, useForm } from '@inertiajs/react';
import { CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import SandboxOtpBox from '../../Components/SandboxOtpBox';
import ShopLayout from '../../Layouts/ShopLayout';

export default function VerifyOtp({ phone, maskedPhone, otpPreview }) {
    const [cooldown, setCooldown] = useState(otpPreview?.resend_available_in ?? 0);
    const [resending, setResending] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
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

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/verify-otp');
    };

    const handleResend = () => {
        if (cooldown > 0 || resending) {
            return;
        }

        setResending(true);
        router.post(
            '/verify-otp/resend',
            {},
            {
                preserveScroll: true,
                onFinish: () => setResending(false),
            },
        );
    };

    return (
        <ShopLayout>
            <Head title="Verify Phone OTP" />

            <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-12 sm:px-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Smartphone className="h-6 w-6" />
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900">Verify Phone Number</h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Enter the 6-digit OTP code for{' '}
                            <span className="font-bold text-slate-800">{phone || maskedPhone}</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="otp-code" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                6-Digit OTP Code
                            </label>
                            <input
                                id="otp-code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-center font-mono text-2xl font-extrabold tracking-[0.4em] text-slate-900 focus:border-[#0095D9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0095D9]/20"
                            />
                            {errors.code && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.code}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.code.length !== 6}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0095D9] py-3 text-sm font-bold text-white shadow-sm shadow-[#0095D9]/25 transition hover:bg-[#007EB8] disabled:opacity-60"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {processing ? 'Verifying...' : 'Verify OTP & Continue'}
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

                        <Link href="/register" className="font-semibold text-slate-500 hover:text-slate-700">
                            Change phone
                        </Link>
                    </div>

                    {/* Sandbox OTP displayed right below the verification form */}
                    <SandboxOtpBox otpPreview={otpPreview} onFillCode={(code) => setData('code', code)} />
                </div>
            </div>
        </ShopLayout>
    );
}

