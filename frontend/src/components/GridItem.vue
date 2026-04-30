<script lang="ts" setup>
import type { ItemCard } from '../store/itemCard';
import { computed } from 'vue';
import placeholderUrl from '../assets/images/placeholder.svg?url';

const props = defineProps<{
    item: ItemCard;
}>();

/** Backend fills `artwork` with raw base64; empty when read failed or no art. */
const artSrc = computed(() => {
    const raw = props.item.artwork?.trim()
    if (!raw) return placeholderUrl
    return `data:image/png;base64,${raw}`
})

const rarityLabel = computed(() =>
    (props.item.rarity || 'common').toLowerCase().replace(/\s+/g, '-')
)

</script>

<template>
    <article class="grid-card" :data-rarity="rarityLabel" role="listitem">
        <div class="grid-card__frame">
            <img class="grid-card__img" :src="artSrc" alt="" loading="lazy" />
        </div>
        <div class="grid-card__bar">
            <h2 class="grid-card__name">{{ item.name || 'Untitled' }}</h2>
        </div>
        <p class="grid-card__type">{{ item.typeLine }}</p>
    </article>
</template>

<style scoped>
.grid-card {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    background: var(--ds-workspace-bg-elevated);
    border: 1px solid var(--ds-workspace-border);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(196, 160, 58, 0.12);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.grid-card:hover {
    transform: translateY(-2px);
    border-color: var(--ds-gold-mid);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(196, 160, 58, 0.35);
}

.grid-card__frame {
    aspect-ratio: 1;
    background: linear-gradient(145deg, #1a2230 0%, #141c28 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.grid-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.grid-card__bar {
    background: linear-gradient(180deg, var(--ds-burgundy-mid), var(--ds-burgundy));
    padding: var(--ds-space-2) var(--ds-space-3);
    border-top: 1px solid rgba(196, 160, 58, 0.25);
}

.grid-card__name {
    margin: 0;
    font-family: var(--ds-font-card);
    font-size: var(--ds-text-sm);
    font-weight: 600;
    color: var(--ds-parchment);
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.grid-card__type {
    margin: 0;
    padding: var(--ds-space-2) var(--ds-space-3) var(--ds-space-3);
    font-size: var(--ds-text-xs);
    color: var(--ds-workspace-muted);
    text-transform: capitalize;
    line-height: 1.35;
}

/* Subtle left accent by rarity */
.grid-card[data-rarity='uncommon'] {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 3px 0 0 var(--ds-tint-uncommon);
}

.grid-card[data-rarity='rare'] {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 3px 0 0 var(--ds-tint-rare);
}

.grid-card[data-rarity='very-rare'] {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 3px 0 0 var(--ds-tint-very-rare);
}

.grid-card[data-rarity='legendary'] {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 3px 0 0 var(--ds-tint-legendary);
}

.grid-card[data-rarity='artifact'] {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 3px 0 0 var(--ds-tint-artifact);
}
</style>
