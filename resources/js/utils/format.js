export function formatPrice(amount) {
    const num = Number(amount ?? 0);
    return `৳${num.toLocaleString('en-US', {
        minimumFractionDigits: num % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })}`;
}

export function formatDate(isoString) {
    if (!isoString) {
        return '-';
    }

    return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

