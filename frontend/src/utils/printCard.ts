import { nextTick } from 'vue';
import { toBlob } from 'html-to-image';
import { toValidFileName } from './toValidFileName';
import { SaveCardPNG } from '../../wailsjs/go/main/App';


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


/**
 * html-to-image renders a flat 2D snapshot and doesn't honour CSS 3D transforms or
 * backface-visibility. For the two-sided card both faces are position:absolute and the
 * art face (front, later in DOM order) would paint on top regardless of flip state.
 * This function temporarily hides the inactive face and strips the 3-D transforms so
 * the snapshot matches what the user actually sees.
 */
const prepareTwoSidedForExport = (root: HTMLElement): (() => void) => {
    const inner = root.querySelector<HTMLElement>('.card-twosided__inner');
    if (!inner) return () => {};

    const isFlipped = inner.classList.contains('is-flipped');
    const backFace = root.querySelector<HTMLElement>('.card-twosided__face--back');
    const frontFace = root.querySelector<HTMLElement>('.card-twosided__face--front');

    const saved = new Map<HTMLElement, Record<string, [string, string]>>();
    const set = (el: HTMLElement, prop: string, val: string) => {
        if (!saved.has(el)) saved.set(el, {});
        saved.get(el)![prop] = [el.style.getPropertyValue(prop), el.style.getPropertyPriority(prop)];
        el.style.setProperty(prop, val, 'important');
    };

    // Flatten the 3-D container so both faces sit in normal stacking order.
    set(inner, 'transform', 'none');
    set(inner, 'transform-style', 'flat');
    set(inner, 'transition', 'none');

    if (!isFlipped) {
        // Text (back) face is active — hide the art face.
        if (frontFace) set(frontFace, 'display', 'none');
        if (backFace) {
            set(backFace, 'position', 'static');
            set(backFace, 'height', '100%');
            set(backFace, 'backface-visibility', 'visible');
        }
    } else {
        // Art (front) face is active — hide the text face and remove its rotateY.
        if (backFace) set(backFace, 'display', 'none');
        if (frontFace) {
            set(frontFace, 'transform', 'none');
            set(frontFace, 'position', 'static');
            set(frontFace, 'height', '100%');
            set(frontFace, 'backface-visibility', 'visible');
        }
    }

    return () => {
        for (const [el, props] of saved) {
            for (const [prop, [val, priority]] of Object.entries(props)) {
                if (val) {
                    el.style.setProperty(prop, val, priority);
                } else {
                    el.style.removeProperty(prop);
                }
            }
        }
    };
};

const prepareDomForCardExport = async (root: HTMLElement): Promise<() => void> => {
    const restoreTwoSided = prepareTwoSidedForExport(root);

    const imgInitial = new Map<HTMLImageElement, string | null>();
    for (const img of Array.from(root.querySelectorAll<HTMLImageElement>('img'))) {
        imgInitial.set(img, img.getAttribute('src'));
    }

    await awaitSubtreeImagesReady(root);

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
        restoreTwoSided();
        for (const [img, s] of imgInitial) {
            if (s === null) {
                img.removeAttribute('src');
            } else {
                img.setAttribute('src', s);
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
