<script lang="ts" setup>
import { computed } from 'vue';
import { useItemCardsStore } from '../store/itemCards';
import GridItem from './GridItem.vue';

const itemCardsStore = useItemCardsStore()

const items = computed(() => itemCardsStore.items)

</script>

<template>
    <div class="grid-page">
        <header class="grid-page__header">
            <h1 class="grid-page__title">Library</h1>
            <p class="grid-page__subtitle">Saved item cards</p>
        </header>

        <p v-if="items.length === 0" class="grid-page__empty">
            No cards yet. Create one in the editor and save.
        </p>

        <div v-else class="grid-page__grid" role="list">
            <GridItem v-for="item in items" :key="item.id || item.name" :item="item" />
        </div>
    </div>
</template>

<style scoped>
.grid-page {
    max-width: 72rem;
    margin: 0 auto;
}

.grid-page__header {
    text-align: right;
    margin-bottom: var(--ds-space-6);
    padding-bottom: var(--ds-space-4);
    border-bottom: 1px solid var(--ds-workspace-border);
}

.grid-page__title {
    margin: 0 0 var(--ds-space-1);
    font-family: var(--ds-font-ui);
    font-size: var(--ds-text-title);
    font-weight: 700;
    color: var(--ds-workspace-text);
    letter-spacing: 0.02em;
}

.grid-page__subtitle {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-workspace-muted);
}

.grid-page__empty {
    margin: var(--ds-space-8) 0;
    padding: var(--ds-space-6);
    text-align: center;
    color: var(--ds-workspace-muted);
    font-size: var(--ds-text-base);
    background: var(--ds-workspace-bg-elevated);
    border: 1px dashed var(--ds-workspace-border);
    border-radius: 8px;
}

.grid-page__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
    gap: var(--ds-space-5);
}
</style>
