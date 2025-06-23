export function extractPublicId(url: string): string {
    try {
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return '';

        const arr = url.split('/');

        const end = arr.length - 1;

        const st = arr[end].split('.');

        return arr[end - 1] + "/" + st[0];

    } catch {
        return '';
    }
}

