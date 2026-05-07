<script lang="ts" setup>
import { useCardData } from './composables/useCardData';
const { name, typeLine, description, footerText, rarity, rarityClass, artSrc } = useCardData('card-standart');

</script>

<template>
    <div class="card-standart" role="article" aria-label="Item card preview">
        <header class="card-standart__header">
            <div class="card-standart__header-bar">
                <h2 class="card-standart__title">{{ name }}</h2>
            </div>
            <p class="card-standart__type-line" :class="rarityClass">
                {{ typeLine }}, {{ rarity }}
            </p>
        </header>

        <div class="card-standart__body">
            <figure class="card-standart__art">
                <div class="card-standart__art-frame">
                    <img :src="artSrc" alt="" class="card-standart__art-img" width="280" height="280" />
                </div>
            </figure>

            <div class="card-standart__description" v-html="description" />
        </div>

        <footer class="card-standart__footer">
            <div class="card-standart__footer-rule" aria-hidden="true" />
            <p class="card-standart__footer-text">{{ footerText }}</p>
        </footer>
    </div>
</template>

<style scoped>
.card-standart {
    --card-w: min(100%, 20rem, 42vh);
    width: var(--card-w);
    aspect-ratio: 2.5 / 3.5;
    max-height: min(88vh, 100%);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: linear-gradient(180deg,
            var(--ds-parchment) 0%,
            var(--ds-parchment-dark) 100%);
    border-radius: var(--ds-card-radius);
    box-shadow: var(--ds-shadow-card), 0 0 0 1px var(--ds-hairline),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);
    border: 1px solid var(--ds-rule-light);
    overflow: hidden;
    container-type: inline-size;
}

.card-standart__header {
    flex-shrink: 0;
    text-align: center;
}

.card-standart__header-bar {
    background: linear-gradient(180deg, var(--ds-burgundy-mid) 0%, var(--ds-burgundy) 100%);
    padding: var(--ds-space-3) var(--ds-space-3);
    box-shadow: inset 0 -2px 0 var(--ds-gold-mid);
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.card-standart__title {
    margin: 0;
    font-family: var(--ds-font-card);
    font-size: clamp(0.9rem, 0.1cqw + 0.6rem, 1.2rem);
    font-weight: 700;
    letter-spacing: 0.02em;
    line-height: 1.2;
    color: #f5ecd8;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
}

.card-standart__type-line {
    margin: 0;
    padding: var(--ds-space-2) var(--ds-space-3);
    font-family: var(--ds-font-stat);
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ds-ink-muted);
    background: var(--ds-parchment-dark);
    border-bottom: 1px solid var(--ds-hairline);
}

.card-standart__type-line--common {
    color: var(--ds-ink-muted);
}

.card-standart__type-line--uncommon {
    color: var(--ds-tint-uncommon);
}

.card-standart__type-line--rare {
    color: var(--ds-tint-rare);
}

.card-standart__type-line--very-rare {
    color: var(--ds-tint-very-rare);
}

.card-standart__type-line--legendary {
    color: var(--ds-tint-legendary);
}

.card-standart__type-line--artifact {
    color: var(--ds-tint-artifact);
}

.card-standart__body {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: var(--ds-space-2) var(--ds-space-3) var(--ds-space-3);
    gap: var(--ds-space-2);
    overflow: auto;
    color: var(--ds-ink);
    font-family: var(--ds-font-card);
    font-size: var(--ds-text-sm);
    line-height: 1.45;
    text-align: left;
}

.card-standart__art {
    margin: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-standart__art-frame {
    width: 72%;
    max-width: 12rem;
    aspect-ratio: 1;
    box-sizing: border-box;
    background: var(--ds-parchment-shadow);
    box-shadow: var(--ds-shadow-inset), inset 0 0 0 1px var(--ds-hairline);
    border: 1px solid var(--ds-gold);
    border-radius: 2px;
    overflow: hidden;
}

.card-standart__art-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.card-standart__description {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: 0 var(--ds-space-0);
    hyphens: auto;
    -webkit-font-smoothing: antialiased;
}

.card-standart__description :deep(p) {
    margin: 0 0 var(--ds-space-2);
}

.card-standart__description :deep(p:last-child) {
    margin-bottom: 0;
}

.card-standart__description :deep(b) {
    font-weight: 700;
    color: var(--ds-ink);
}

.card-standart__footer {
    flex-shrink: 0;
    padding: 0 var(--ds-space-3) var(--ds-space-2);
}

.card-standart__footer-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ds-gold-mid) 20%, var(--ds-gold-mid) 80%, transparent);
    margin-bottom: var(--ds-space-2);
    opacity: 0.9;
}

.card-standart__footer-text {
    margin: 0;
    font-family: var(--ds-font-stat);
    font-size: 0.65rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ds-ink-faint);
    text-align: center;
}

@media print {
    .card-standart {
        background: none;
        padding: 0;
    }

    .card-standart {
        max-height: none;
        width: 2.5in;
        min-height: 3.5in;
        height: 3.5in;
        box-shadow: none;
    }
}
</style>