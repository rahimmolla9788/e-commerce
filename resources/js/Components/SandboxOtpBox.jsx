import { Check, Copy, KeyRound, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SandboxOtpBox({ otpPreview, onFillCode }) {
    const [copied, setCopied] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        if (!otpPreview?.expires_at) {
            setSecondsLeft(0);
            return;
        }

        const updateRemaining = () => {
            const diff = Math.max(
                0,
                Math.floor((new Date(otpPreview.expires_at).getTime() - Date.now()) / 1000),
            );
            setSecondsLeft(diff);
        };

        updateRemaining();
        const timer = setInterval(updateRemaining, 1000);
        return () => clearInterval(timer);
    }, [otpPreview?.expires_at, otpPreview?.code]);

    if (!otpPreview?.enabled || !otpPreview?.code) {
        return null;
    }

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(otpPreview.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard may be unavailable in non-HTTPS contexts
        }
    };

    return (
        <div
            data-testid="sandbox-otp-box"
            className="mt-5 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-50 p-4 shadow-xs"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200/80 text-amber-800">
                        <KeyRound className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                            Demo / Sandbox OTP Preview
                        </p>
                        <p className="text-xs text-amber-700">
                            SMS gateway is not connected yet — use this OTP to verify.
                        </p>
                    </div>
                </div>
                <span className="shrink-0 rounded-full bg-amber-200/70 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                    {secondsLeft > 0 ? `${minutes}:${seconds}` : 'Expired'}
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3">
                <div className="font-mono text-2xl font-extrabold tracking-[0.35em] text-slate-900">
                    {otpPreview.code}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    {onFillCode && (
                        <button
                            type="button"
                            onClick={() => onFillCode(otpPreview.code)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            Auto-fill
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

