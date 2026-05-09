import { nextTick } from 'vue';
import { toBlob } from 'html-to-image';
import { toValidFileName } from './toValidFileName';
import { SaveCardPNG } from '../../wailsjs/go/main/App';

const URL_IN_CSS = /url\((['"]?)([^'")]+)\1\)/g;

const HTML_TO_IMAGE_OPTS = {
    skipFonts: true as const,
    /** Omit UI chrome (e.g. two-sided card flip tab) from PNG. */
    filter: (node: HTMLElement): boolean => {
        if (!(node instanceof HTMLElement)) {
            return true;
        }
        return !node.classList.contains('card-twosided__flip');
    },
};

const blobUrlToDataUrl = async (blobUrl: string): Promise<string> => {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error ?? new Error('readAsDataURL failed'));
        reader.readAsDataURL(blob);
    });
};

const waitForImageDecode = async (img: HTMLImageElement): Promise<void> => {
    if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Image failed to load for export'));
        });
    }
    if (img.naturalWidth > 0 && img.decode) {
        try {
            await img.decode();
        } catch {
            /* still usable for canvas in many engines */
        }
    }
};

/** Prefer attribute (Vue binding), then what the browser actually resolved. */
const getExportImgSrc = (img: HTMLImageElement): string | null => {
    const fromAttr = img.getAttribute('src')?.trim() ?? '';
    if (fromAttr) {
        return fromAttr;
    }
    const cur = (img.currentSrc || '').trim();
    if (cur) {
        return cur;
    }
    const prop = (img.src || '').trim();
    return prop || null;
};

/**
 * WebKit/Wails can report complete before naturalWidth is set; wait until pixels exist or timeout.
 */
const waitUntilImageHasPixels = async (img: HTMLImageElement, timeoutMs = 4000): Promise<void> => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (getExportImgSrc(img) === null) {
            return;
        }
        if (!img.complete) {
            await new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
            });
        }
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            if (img.decode) {
                try {
                    await img.decode();
                } catch {
                    /* ignore */
                }
            }
            return;
        }
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
};

const awaitSubtreeImagesReady = async (root: HTMLElement): Promise<void> => {
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
    await Promise.all(imgs.map((img) => waitUntilImageHasPixels(img)));
};

const resolveCssUrl = (u: string): string => {
    const t = u.trim();
    if (t.startsWith('blob:') || t.startsWith('data:')) {
        return t;
    }
    try {
        return new URL(t, window.location.href).href;
    } catch {
        return t;
    }
};

/**
 * Decode any loadable image URL and re-encode as PNG. Avoids WebKitGTK/Wails bugs where
 * html-to-image's SVG foreignObject pass drops artwork even though it renders on-screen.
 */
const urlToPngDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const im = new Image();
        im.onload = () => {
            (async () => {
                try {
                    if (im.decode) {
                        try {
                            await im.decode();
                        } catch {
                            /* ignore */
                        }
                    }
                    const w = im.naturalWidth;
                    const h = im.naturalHeight;
                    if (!w || !h) {
                        reject(new Error('Image has no dimensions for export'));
                        return;
                    }
                    const c = document.createElement('canvas');
                    c.width = w;
                    c.height = h;
                    const ctx = c.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas unsupported'));
                        return;
                    }
                    ctx.drawImage(im, 0, 0);
                    resolve(c.toDataURL('image/png'));
                } catch (e) {
                    reject(e instanceof Error ? e : new Error(String(e)));
                }
            })();
        };
        im.onerror = () => reject(new Error('Failed to decode image for export'));
        im.src = url;
    });
};

const anySrcToPngDataUrl = async (src: string): Promise<string> => {
    const t = src.trim();
    if (t.startsWith('blob:')) {
        return urlToPngDataUrl(await blobUrlToDataUrl(t));
    }
    return urlToPngDataUrl(resolveCssUrl(t));
};

const rasterizeInlineStyleUrls = async (
    el: HTMLElement,
    touchStyle: (e: HTMLElement) => void,
): Promise<void> => {
    const attr = el.getAttribute('style');
    if (!attr || !attr.includes('url(')) {
        return;
    }
    const matches = [...attr.matchAll(URL_IN_CSS)];
    if (matches.length === 0) {
        return;
    }
    let next = attr;
    let changed = false;
    for (const m of matches) {
        const raw = m[2].trim();
        if (!raw || raw === 'none') {
            continue;
        }
        const png = await anySrcToPngDataUrl(raw);
        next = next.replace(m[0], `url("${png}")`);
        changed = true;
    }
    if (changed) {
        touchStyle(el);
        el.setAttribute('style', next);
    }
};

const prepareDomForCardExport = async (root: HTMLElement): Promise<() => void> => {
    const imgInitial = new Map<HTMLImageElement, string | null>();
    for (const img of Array.from(root.querySelectorAll<HTMLImageElement>('img'))) {
        imgInitial.set(img, img.getAttribute('src'));
    }

    const styleInitial = new Map<HTMLElement, string | null>();
    const touchStyle = (el: HTMLElement) => {
        if (!styleInitial.has(el)) {
            styleInitial.set(el, el.getAttribute('style'));
        }
    };

    const elementsWithStyle = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];

    await awaitSubtreeImagesReady(root);

    for (const el of elementsWithStyle) {
        await rasterizeInlineStyleUrls(el, touchStyle);
    }

    for (const img of Array.from(root.querySelectorAll<HTMLImageElement>('img'))) {
        const src = getExportImgSrc(img);
        if (!src) {
            continue;
        }
        const png = await anySrcToPngDataUrl(src);
        img.setAttribute('src', png);
        await waitUntilImageHasPixels(img);
    }

    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    return () => {
        for (const [img, s] of imgInitial) {
            if (s === null) {
                img.removeAttribute('src');
            } else {
                img.setAttribute('src', s);
            }
        }
        for (const [el, s] of styleInitial) {
            if (s === null) {
                el.removeAttribute('style');
            } else {
                el.setAttribute('style', s);
            }
        }
    };
};

/**
 * First html-to-image pass on WebKit/Wails often drops freshly swapped <img> bitmaps; a second pass matches.
 */
const toBlobFirstNonEmpty = async (node: HTMLElement): Promise<Blob> => {
    const attempts: (Blob | null)[] = [];
    for (let i = 0; i < 2; i++) {
        attempts.push(await toBlob(node, HTML_TO_IMAGE_OPTS));
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
    const blobs = attempts.filter((b): b is Blob => b != null && b.size > 0);
    if (blobs.length === 0) {
        throw new Error('Failed to render card image');
    }
    return blobs.reduce((a, b) => (b.size > a.size ? b : a));
};

export const printCard = async (elementSelector: string, name: string) => {
    await nextTick();
    await nextTick();

    const el = document.querySelector(elementSelector) as HTMLElement | null;
    if (!el) {
        throw new Error('Card element not found');
    }

    const restoreDom = await prepareDomForCardExport(el);
    try {
        const blob = await toBlobFirstNonEmpty(el);

        const defaultName = `${toValidFileName(`${name}`)}.png`;
        const buf = new Uint8Array(await blob.arrayBuffer());
        await SaveCardPNG(defaultName, Array.from(buf));
        return defaultName;
    } finally {
        restoreDom();
    }
};
