const parse = (value: string | null | undefined) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
};

export function formatDate(value: string | null | undefined): string {
    const date = parse(value);
    if (!date) return '-';

    return date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDateTime(value: string | null | undefined): string {
    const date = parse(value);
    if (!date) return '-';

    return date.toLocaleString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kuala_Lumpur',
    });
}