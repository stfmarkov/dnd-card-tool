<script lang="ts" setup>
import { useCardData } from './composables/useCardData';
const { name, typeLine, description, footerText, rarity, rarityClass, artSrc } = useCardData('card-minimalist');
</script>

<template>
    <div class="card-minimalist" :style="{ backgroundImage: `url(${artSrc})` }" role="article" aria-label="Item card preview">
        <header class="card-minimalist__header">
            <h2 class="card-minimalist__title">{{ name }}</h2>
            <div class="card-minimalist__rule" aria-hidden="true" />
            <p class="card-minimalist__type-line" :class="rarityClass">
                {{ typeLine }} · {{ rarity }}
            </p>
        </header>

        <div class="card-minimalist__body">
            <div class="card-minimalist__description" v-html="description" />
        </div>

        <footer class="card-minimalist__footer">
            <p class="card-minimalist__footer-text">{{ footerText }}</p>
        </footer>
    </div>
</template>

<style scoped>
.card-minimalist {
    --card-w: min(100%, 20rem, 42vh);
    width: var(--card-w);
    aspect-ratio: 2.5 / 3.5;
    max-height: min(88vh, 100%);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: var(--ds-parchment);
    border-radius: var(--ds-card-radius);
    box-shadow: var(--ds-shadow-card), 0 0 0 1px var(--ds-hairline);
    border: 1px solid var(--ds-hairline);
    overflow: hidden;
    container-type: inline-size;
    padding: var(--ds-space-4) var(--ds-space-4) var(--ds-space-3);
    background-image: url('../../../assets/images/minimalist-bg.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: rgba(250, 246, 239, 0.9);
    background-blend-mode: lighten;
}

.card-minimalist__header {
    flex-shrink: 0;
    text-align: center;
    padding-bottom: var(--ds-space-2);
}

.card-minimalist__title {
    margin: 0 0 var(--ds-space-2);
    font-family: var(--ds-font-card);
    font-size: clamp(0.95rem, 0.15cqw + 0.65rem, 1.3rem);
    font-weight: 700;
    letter-spacing: 0.03em;
    line-height: 1.2;
    color: var(--ds-ink);
}

.card-minimalist__rule {
    height: 2px;
    background: var(--ds-ink);
    margin: 0 auto var(--ds-space-2);
    opacity: 0.15;
}

.card-minimalist__type-line {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--ds-ink-muted);
}

.card-minimalist__type-line--common   { color: var(--ds-ink-muted); }
.card-minimalist__type-line--uncommon { color: var(--ds-tint-uncommon); }
.card-minimalist__type-line--rare     { color: var(--ds-tint-rare); }
.card-minimalist__type-line--very-rare  { color: var(--ds-tint-very-rare); }
.card-minimalist__type-line--legendary  { color: var(--ds-tint-legendary); }
.card-minimalist__type-line--artifact   { color: var(--ds-tint-artifact); }

.card-minimalist__body {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    overflow: auto;
    color: var(--ds-ink);
    font-family: var(--ds-font-card);
    font-size: var(--ds-text-sm);
    line-height: 1.5;
    text-align: left;
    padding: var(--ds-space-2) 0;
    border-top: 1px solid rgba(26, 18, 13, 0.12);
}

.card-minimalist__description {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    hyphens: auto;
    -webkit-font-smoothing: antialiased;
}

.card-minimalist__description :deep(p) {
    margin: 0 0 var(--ds-space-2);
}

.card-minimalist__description :deep(p:last-child) {
    margin-bottom: 0;
}

.card-minimalist__description :deep(b) {
    font-weight: 700;
    color: var(--ds-ink);
}

.card-minimalist__footer {
    flex-shrink: 0;
    padding-top: var(--ds-space-2);
    border-top: 1px solid rgba(26, 18, 13, 0.12);
}

.card-minimalist__footer-text {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ds-ink-faint);
    text-align: center;
    opacity: 0.7;
}

@media print {
    .card-minimalist {
        max-height: none;
        width: 2.5in;
        min-height: 3.5in;
        height: 3.5in;
        box-shadow: none;
    }
}
</style>
