export function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}