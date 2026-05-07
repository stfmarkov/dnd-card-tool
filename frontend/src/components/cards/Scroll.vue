<script lang="ts" setup>
import { useCardData } from './composables/useCardData';
const { name, typeLine, description, footerText, rarity, rarityClass, artSrc } = useCardData('card-scroll');
</script>

<template>
    <div class="card-scroll" role="article" aria-label="Item card preview">
        <!-- Top scroll cap -->
        <div class="card-scroll__cap card-scroll__cap--top" aria-hidden="true">
            <div class="card-scroll__cap-inner">
                <span class="card-scroll__ornament">❧</span>
                <div class="card-scroll__cap-rule" />
                <span class="card-scroll__ornament">❧</span>
            </div>
        </div>

        <div class="card-scroll__content">
            <header class="card-scroll__header">
                <h2 class="card-scroll__title">{{ name }}</h2>
                <p class="card-scroll__type-line" :class="rarityClass">
                    {{ typeLine }} · {{ rarity }}
                </p>
            </header>

            <div class="card-scroll__divider" aria-hidden="true">
                <span class="card-scroll__divider-wing" />
                <span class="card-scroll__divider-gem">✦</span>
                <span class="card-scroll__divider-wing" />
            </div>

            <div class="card-scroll__body">
                <figure class="card-scroll__art">
                    <div class="card-scroll__art-frame">
                        <img :src="artSrc" alt="" class="card-scroll__art-img" width="280" height="280" />
                    </div>
                </figure>

                <div class="card-scroll__description" v-html="description" />
            </div>

            <div class="card-scroll__divider" aria-hidden="true">
                <span class="card-scroll__divider-wing" />
                <span class="card-scroll__divider-gem">✦</span>
                <span class="card-scroll__divider-wing" />
            </div>

            <footer class="card-scroll__footer">
                <p class="card-scroll__footer-text">{{ footerText }}</p>
            </footer>
        </div>

        <!-- Bottom scroll cap -->
        <div class="card-scroll__cap card-scroll__cap--bottom" aria-hidden="true">
            <div class="card-scroll__cap-inner">
                <span class="card-scroll__ornament">☙</span>
                <div class="card-scroll__cap-rule" />
                <span class="card-scroll__ornament">☙</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-scroll {
    --card-w: min(100%, 20rem, 42vh);
    --scroll-sepia: #c8a96e;
    --scroll-cap-bg: #7a4f1e;
    --scroll-cap-edge: #5c3810;
    width: var(--card-w);
    aspect-ratio: 2.5 / 3.5;
    max-height: min(88vh, 100%);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background:
        repeating-linear-gradient(
            0deg,
            rgba(160, 110, 50, 0.03) 0px,
            rgba(160, 110, 50, 0.03) 1px,
            transparent 1px,
            transparent 4px
        ),
        linear-gradient(
            160deg,
            #f2e0b8 0%,
            #e8d09c 30%,
            #f0ddb0 55%,
            #e4cc90 80%,
            #eed9a8 100%
        );
    border-radius: 3px;
    box-shadow: var(--ds-shadow-card), 0 0 0 2px var(--scroll-cap-edge), 0 0 0 3px var(--scroll-sepia);
    overflow: hidden;
    container-type: inline-size;
}

/* ── Scroll cap (top / bottom bands) ─────────────────────── */
.card-scroll__cap {
    flex-shrink: 0;
    background: linear-gradient(180deg, var(--scroll-cap-bg) 0%, var(--scroll-cap-edge) 100%);
    padding: var(--ds-space-1) var(--ds-space-3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-scroll__cap--bottom {
    background: linear-gradient(0deg, var(--scroll-cap-bg) 0%, var(--scroll-cap-edge) 100%);
}

.card-scroll__cap-inner {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    width: 100%;
}

.card-scroll__cap-rule {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 220, 150, 0.5) 30%, rgba(255, 220, 150, 0.5) 70%, transparent);
}

.card-scroll__ornament {
    font-size: 0.8rem;
    color: #e8c870;
    line-height: 1;
    opacity: 0.9;
}

/* ── Scroll body ─────────────────────────────────────────── */
.card-scroll__content {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: var(--ds-space-2) var(--ds-space-3);
    gap: var(--ds-space-1);
    overflow: hidden;
}

.card-scroll__header {
    flex-shrink: 0;
    text-align: center;
}

.card-scroll__title {
    margin: 0 0 var(--ds-space-1);
    font-family: var(--ds-font-card);
    font-size: clamp(0.9rem, 0.12cqw + 0.6rem, 1.2rem);
    font-weight: 700;
    font-style: italic;
    letter-spacing: 0.04em;
    line-height: 1.2;
    color: var(--ds-burgundy);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.card-scroll__type-line {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ds-ink-muted);
}

.card-scroll__type-line--common   { color: var(--ds-ink-muted); }
.card-scroll__type-line--uncommon { color: var(--ds-tint-uncommon); }
.card-scroll__type-line--rare     { color: var(--ds-tint-rare); }
.card-scroll__type-line--very-rare  { color: var(--ds-tint-very-rare); }
.card-scroll__type-line--legendary  { color: var(--ds-tint-legendary); }
.card-scroll__type-line--artifact   { color: var(--ds-tint-artifact); }

/* ── Ornamental divider ──────────────────────────────────── */
.card-scroll__divider {
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
    flex-shrink: 0;
}

.card-scroll__divider-wing {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ds-gold-mid));
    opacity: 0.6;
}

.card-scroll__divider-wing:last-child {
    background: linear-gradient(90deg, var(--ds-gold-mid), transparent);
}

.card-scroll__divider-gem {
    font-size: 0.55rem;
    color: var(--ds-gold-mid);
    line-height: 1;
}

/* ── Body ───────────────────────────────────────────────── */
.card-scroll__body {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    overflow: auto;
    color: var(--ds-ink);
    font-family: var(--ds-font-card);
    font-size: var(--ds-text-sm);
    line-height: 1.45;
    text-align: left;
}

.card-scroll__art {
    margin: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
}

.card-scroll__art-frame {
    width: 68%;
    max-width: 11rem;
    aspect-ratio: 1;
    box-sizing: border-box;
    background: rgba(120, 80, 20, 0.08);
    border: 1px solid var(--ds-gold-mid);
    box-shadow: 0 0 0 3px rgba(200, 169, 110, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    border-radius: 1px;
    overflow: hidden;
}

.card-scroll__art-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.card-scroll__description {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    hyphens: auto;
    -webkit-font-smoothing: antialiased;
}

.card-scroll__description :deep(p) {
    margin: 0 0 var(--ds-space-2);
}

.card-scroll__description :deep(p:last-child) {
    margin-bottom: 0;
}

.card-scroll__description :deep(b) {
    font-weight: 700;
    color: var(--ds-ink);
}

/* ── Footer ─────────────────────────────────────────────── */
.card-scroll__footer {
    flex-shrink: 0;
}

.card-scroll__footer-text {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: 0.6rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ds-ink-faint);
    text-align: center;
    opacity: 0.75;
}

@media print {
    .card-scroll {
        max-height: none;
        width: 2.5in;
        min-height: 3.5in;
        height: 3.5in;
        box-shadow: none;
    }
}
</style>
