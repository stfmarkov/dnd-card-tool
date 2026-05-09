import placeholderUrl from '../assets/images/placeholder.svg?url';

const sniffBinaryImageMime = (bytes: Uint8Array): string => {
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return 'image/jpeg';
    }
    if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
        return 'image/png';
    }
    if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
        const tag = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
        if (tag === 'WEBP') {
            return 'image/webp';
        }
    }
    if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        return 'image/gif';
    }
    return 'image/png';
}

/** Detect image MIME from raw base64 payload (backend stores bytes only, no data: prefix). */
const sniffMimeFromBase64Payload = (b64: string): string => {
    const s = b64.trim().replace(/\s/g, '');
    if (!s) {
        return 'image/png';
    }
    const chunk = s.slice(0, 96);
    const pad = (4 - (chunk.length % 4)) % 4;
    const padded = chunk + '='.repeat(pad);
    let binary: string;
    try {
        binary = atob(padded);
    } catch {
        return 'image/png';
    }
    const bytes = Uint8Array.from(binary.slice(0, 32), (c) => c.charCodeAt(0));
    return sniffBinaryImageMime(bytes);
}

export const toBase64Src = (artwork?: string) => {
    const raw = artwork?.trim();
    if (!raw) {
        return placeholderUrl;
    }
    const mime = sniffMimeFromBase64Payload(raw);
    return `data:${mime};base64,${raw}`;
};
