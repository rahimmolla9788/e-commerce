import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FlashBanner() {
    const { flash } = usePage().props;
    const [dismissedKey, setDismissedKey] = useState(null);

    const activeMessage = flash?.success
        ? { type: 'success', text: flash.success }
        : flash?.error
          ? { type: 'error', text: flash.error }
          : flash?.status
            ? { type: 'info', text: flash.status }
            : null;

    const currentKey = activeMessage ? `${activeMessage.type}:${activeMessage.text}` : null;

    useEffect(() => {
        setDismissedKey(null);
    }, [currentKey]);

    if (!activeMessage || dismissedKey === currentKey) {
        return null;
    }

    const styles = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        error: 'bg-rose-50 border-rose-200 text-rose-900',
        info: 'bg-[#0095D9]/10 border-[#0095D9]/30 text-[#054D73]',
    };

    const Icon =
        activeMessage.type === 'success'
            ? CheckCircle2
            : activeMessage.type === 'error'
              ? AlertCircle
              : Info;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
            <div
                role="alert"
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xs ${styles[activeMessage.type]}`}
            >
                <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{activeMessage.text}</span>
                </div>
                <button
                    type="button"
                    onClick={() => setDismissedKey(currentKey)}
                    className="rounded-lg p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
                    aria-label="Dismiss notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

