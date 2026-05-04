<script lang="ts" setup>
import { computed } from 'vue';
import { useItemCardsStore } from '../store/itemCards';
import GridItem from './GridItem.vue';
import type { ItemCard } from '../store/itemCard';
import { useGeneralStore } from '../store/general';
import { useItemCardStore } from '../store/itemCard';
import { useConfirmationStore } from '../store/confirmationStore';

const generalStore = useGeneralStore()
const itemCardStore = useItemCardStore()
const itemCardsStore = useItemCardsStore()
const confirmationStore = useConfirmationStore()

const items = computed(() => itemCardsStore.items)

const selectForEdit = (item: ItemCard) => {
    const execute = () => {
        generalStore.setSelectedLayout('main')
        itemCardStore.setSelectedItem(item)
    }

    if (!itemCardStore.isSaved) {
        confirmationStore.setConfirmation({
            title: 'Unsaved changes',
            message: 'You have unsaved changes. Are you sure you want to edit this item?',
            onConfirm: () => {
                execute()
            },
            onCancel: () => { },
            type: 'warning',
            show: true,
            confirmText: 'Edit item',
            cancelText: 'Cancel',
        })
    } else {
        execute()
    }
}

const deleteItem = (item: ItemCard) => {
    confirmationStore.setConfirmation({
        title: 'Delete item',
        message: 'Are you sure you want to delete this item?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'error',
        show: true,
        onCancel: () => {
            console.log('cancel delete item', item)
        },
        onConfirm: () => {
            itemCardsStore.deleteItem(item)
        }
    })
}

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
            <GridItem v-for="item in items" :key="item.id || item.name" :item="item" @click="selectForEdit(item)"
                @delete="deleteItem(item)" />
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
