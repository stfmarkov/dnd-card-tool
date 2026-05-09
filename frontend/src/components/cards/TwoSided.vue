<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useCardData } from './composables/useCardData';

const { name, typeLine, description, footerText, rarityClass, artSrc } = useCardData('card-twosided');
const isFlipped = ref(false);
const isLinux = ref(false);

const isBackVisible = computed(() => !isLinux.value || !isFlipped.value);
const isFrontVisible = computed(() => !isLinux.value || isFlipped.value);

onMounted(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = (
        nav.userAgentData?.platform ||
        navigator.platform ||
        navigator.userAgent
    ).toLowerCase();
    isLinux.value = platform.includes('linux');
});
</script>

<template>
    <div class="card-twosided" :class="{ 'card-twosided--linux': isLinux }">

        <div class="card-twosided__scene" role="article" aria-label="Item card preview">
            <div class="card-twosided__inner" :class="{ 'is-flipped': isFlipped }">

                <!-- Back face (default): minimalist text layout, no background -->
                <div class="card-twosided__face card-twosided__face--back" :class="{ 'is-visible': isBackVisible, 'is-hidden': !isBackVisible }">
                    <header class="ctd-back__header">
                        <h2 class="ctd-back__title">{{ name }}</h2>
                        <div class="ctd-back__rule" aria-hidden="true" />
                        <p class="ctd-back__type-line" :class="rarityClass">
                            {{ typeLine }}
                        </p>
                    </header>

                    <div class="ctd-back__body">
                        <div class="ctd-back__description" v-html="description" />
                    </div>

                    <footer class="ctd-back__footer">
                        <p class="ctd-back__footer-text">{{ footerText }}</p>
                    </footer>
                </div>

                <!-- Front face (flipped): full-bleed art with name overlay -->
                <div class="card-twosided__face card-twosided__face--front" :class="{ 'is-visible': isFrontVisible, 'is-hidden': !isFrontVisible }">
                    <img :src="artSrc" alt="" class="ctd-front__art" />
                    <div class="ctd-front__overlay">
                        <p class="ctd-front__type-line" :class="rarityClass">{{ typeLine }}</p>
                        <h2 class="ctd-front__title">{{ name }}</h2>
                    </div>
                </div>

            </div>
        </div>

        <button
            class="card-twosided__flip"
            @click="isFlipped = !isFlipped"
            :aria-label="isFlipped ? 'Show text side' : 'Show art side'"
            :title="isFlipped ? 'Show text side' : 'Show art side'"
        >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path d="M3.5 6.5A7 7 0 0 1 16 8" stroke-linecap="round"/>
                <path d="M16.5 13.5A7 7 0 0 1 4 12" stroke-linecap="round"/>
                <path d="M16 8l1.5-3-3 .5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 12l-1.5 3 3-.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

    </div>
</template>

<style scoped>
/* ── Wrapper & 3-D scene ──────────────────────────────────── */
.card-twosided {
    --card-w: min(100%, 20rem, 42vh);
    position: relative;
    width: var(--card-w);
}

.card-twosided__scene {
    width: 100%;
    aspect-ratio: 2.5 / 3.5;
    max-height: min(88vh, 100%);
    perspective: 1200px;
    border-radius: var(--ds-card-radius);
}

.card-twosided__inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
    border-radius: var(--ds-card-radius);
}

.card-twosided__inner.is-flipped {
    transform: rotateY(180deg);
}

.card-twosided__face {
    position: absolute;
    inset: 0;
    border-radius: var(--ds-card-radius);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    box-shadow: var(--ds-shadow-card), 0 0 0 1px var(--ds-hairline);
    border: 1px solid var(--ds-hairline);
}

/* ── Back face: text (default) ───────────────────────────── */
.card-twosided__face--back {
    background: #fff;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: var(--ds-space-4) var(--ds-space-4) var(--ds-space-3);
    container-type: inline-size;
}

.ctd-back__header {
    flex-shrink: 0;
    text-align: center;
    padding-bottom: var(--ds-space-2);
}

.ctd-back__title {
    margin: 0 0 var(--ds-space-2);
    font-family: var(--ds-font-card);
    font-size: clamp(0.95rem, 0.15cqw + 0.65rem, 1.3rem);
    font-weight: 700;
    letter-spacing: 0.03em;
    line-height: 1.2;
    color: var(--ds-ink);
}

.ctd-back__rule {
    height: 2px;
    background: var(--ds-ink);
    margin: 0 auto var(--ds-space-2);
    opacity: 0.12;
}

.ctd-back__type-line {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--ds-ink-muted);
}

.ctd-back__type-line--common   { color: var(--ds-ink-muted); }
.ctd-back__type-line--uncommon { color: var(--ds-tint-uncommon); }
.ctd-back__type-line--rare     { color: var(--ds-tint-rare); }
.ctd-back__type-line--very-rare  { color: var(--ds-tint-very-rare); }
.ctd-back__type-line--legendary  { color: var(--ds-tint-legendary); }
.ctd-back__type-line--artifact   { color: var(--ds-tint-artifact); }

.ctd-back__body {
    flex: 1 1 0;
    min-height: 0;
    overflow: auto;
    color: var(--ds-ink);
    font-family: var(--ds-font-card);
    font-size: var(--ds-text-sm);
    line-height: 1.5;
    text-align: left;
    padding: var(--ds-space-2) 0;
    border-top: 1px solid rgba(26, 18, 13, 0.1);
}

.ctd-back__description {
    hyphens: auto;
    -webkit-font-smoothing: antialiased;
}

.ctd-back__description :deep(p) { margin: 0 0 var(--ds-space-2); }
.ctd-back__description :deep(p:last-child) { margin-bottom: 0; }
.ctd-back__description :deep(b) { font-weight: 700; color: var(--ds-ink); }

.ctd-back__footer {
    flex-shrink: 0;
    padding-top: var(--ds-space-2);
    border-top: 1px solid rgba(26, 18, 13, 0.1);
}

.ctd-back__footer-text {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ds-ink-faint);
    text-align: center;
    opacity: 0.65;
}

/* ── Front face: full-bleed art ──────────────────────────── */
.card-twosided__face--front {
    background: #111;
    transform: rotateY(180deg);
}

/* Linux fallback: avoid 3-D flip rendering artifacts */
.card-twosided--linux .card-twosided__scene {
    perspective: none;
}

.card-twosided--linux .card-twosided__inner {
    transform: none !important;
    transform-style: flat;
}

.card-twosided--linux .card-twosided__face {
    backface-visibility: visible;
    -webkit-backface-visibility: visible;
    transition: opacity 0.22s ease;
}

.card-twosided--linux .card-twosided__face--front {
    transform: none;
}

.card-twosided--linux .card-twosided__face.is-visible {
    opacity: 1;
    pointer-events: auto;
}

.card-twosided--linux .card-twosided__face.is-hidden {
    opacity: 0;
    pointer-events: none;
}

.ctd-front__art {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.ctd-front__overlay {
    position: absolute;
    inset: auto 0 0;
    padding: var(--ds-space-5) var(--ds-space-3) var(--ds-space-3);
    background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 60%, transparent 100%);
    text-align: center;
}

.ctd-front__type-line {
    margin: 0 0 var(--ds-space-1);
    font-family: var(--ds-font-stat);
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(255,255,255,0.7);
}

.ctd-front__type-line--uncommon { color: #7dd99a; }
.ctd-front__type-line--rare     { color: #7aabf5; }
.ctd-front__type-line--very-rare  { color: #c687f5; }
.ctd-front__type-line--legendary  { color: var(--ds-gold-bright); }
.ctd-front__type-line--artifact   { color: #f57a7a; }

.ctd-front__title {
    margin: 0;
    font-family: var(--ds-font-card);
    font-size: clamp(0.9rem, 4cqw, 1.25rem);
    font-weight: 700;
    font-style: italic;
    letter-spacing: 0.03em;
    line-height: 1.2;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

/* ── Flip button ─────────────────────────────────────────── */
.card-twosided__flip {
    position: absolute;
    right: -1.1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--ds-burgundy);
    border: 1px solid var(--ds-gold-mid);
    color: #e8c870;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    transition: background 0.15s ease, box-shadow 0.15s ease;
    z-index: 10;
    padding: 0;
}

.card-twosided__flip svg {
    width: 1rem;
    height: 1rem;
}

.card-twosided__flip:hover {
    background: var(--ds-burgundy-mid);
    box-shadow: 0 3px 10px rgba(0,0,0,0.5);
}

.card-twosided__flip:focus-visible {
    outline: 2px solid var(--ds-gold-mid);
    outline-offset: 2px;
}

/* ── Print ───────────────────────────────────────────────── */
@media print {
    .card-twosided__flip {
        display: none;
    }

    .card-twosided {
        width: 2.5in;
    }

    .card-twosided__scene {
        max-height: none;
        height: 3.5in;
        perspective: none;
    }

    .card-twosided__inner {
        transform: none !important;
        transform-style: flat;
    }

    /* Always print the back (text) face */
    .card-twosided__face {
        backface-visibility: visible;
        -webkit-backface-visibility: visible;
        box-shadow: none;
    }

    .card-twosided__face--front {
        display: none;
    }

    .card-twosided__face--back {
        position: static;
        height: 100%;
    }
}
</style>
