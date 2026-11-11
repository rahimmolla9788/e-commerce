const ORDER_STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-sky-100 text-sky-800 border-sky-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-violet-100 text-violet-800 border-violet-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function StatusBadge({ status }) {
    const normalized = String(status || 'pending').toLowerCase();
    const classes = ORDER_STATUS_STYLES[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${classes}`}
        >
            {normalized.replaceAll('_', ' ')}
        </span>
    );
}

