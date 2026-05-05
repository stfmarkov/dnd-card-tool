<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useItemCardsStore } from '../store/itemCards';
import GridItem from './GridItem.vue';
import type { ItemCard } from '../store/itemCard';
import { useGeneralStore } from '../store/general';
import { useItemCardStore } from '../store/itemCard';
import { useConfirmationStore } from '../store/confirmationStore';
import ButtonMain from './utils/buttons/ButtonMain.vue';
import Field from './utils/Field.vue';
import Select from './utils/Select.vue';
import { rarityOptions as baseRarityOptions, typeOptions as baseTypeOptions } from '../utils/cardOptions';

const generalStore = useGeneralStore()
const itemCardStore = useItemCardStore()
const itemCardsStore = useItemCardsStore()
const confirmationStore = useConfirmationStore()

const items = computed(() => itemCardsStore.items)

const search = ref('')
const selectedRarity = ref('')
const selectedType = ref('')

const rarityOptions = [{ label: 'All rarities', value: '' }, ...baseRarityOptions]
const typeOptions = [{ label: 'All types', value: '' }, ...baseTypeOptions]

const hasActiveFilters = computed(() =>
    search.value !== '' || selectedRarity.value !== '' || selectedType.value !== ''
)

const fetchItems = () => {
    const filters = []
    if (selectedRarity.value) {
        filters.push({ property: 'rarity', value: selectedRarity.value, comparison: 'eq' as const })
    }
    if (selectedType.value) {
        filters.push({ property: 'typeLine', value: selectedType.value, comparison: 'eq' as const })
    }
    void itemCardsStore.getItems(search.value, filters)
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
    if (searchDebounce) clearTimeout(searchDebounce)
    searchDebounce = setTimeout(fetchItems, 250)
})
watch(selectedRarity, fetchItems)
watch(selectedType, fetchItems)

onMounted(fetchItems)

const selectForEdit = (item: ItemCard) => {
    const execute = () => {
        generalStore.setSelectedLayout('main')
        itemCardStore.setSelectedItem(item)
    }

    if (!itemCardStore.isSaved) {
        confirmationStore.setConfirmation({
            title: 'Unsaved changes',
            message: 'You have unsaved changes. Are you sure you want to edit this item?',
            onConfirm: () => { execute() },
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
        onCancel: () => { },
        onConfirm: () => { itemCardsStore.deleteItem(item) }
    })
}

const duplicateItem = (item: ItemCard) => {
    void itemCardsStore.duplicateItem(item)
}

const createNewCard = () => {
    generalStore.setSelectedLayout('main')
    itemCardStore.newCard()
}
</script>

<template>
    <div class="grid-page">
        <header class="grid-page__header">
            <h1 class="grid-page__title">Library</h1>
            <p class="grid-page__subtitle">Saved item cards</p>
        </header>

        <div class="grid-page__toolbar">
            <Field class="grid-page__search-field" v-model="search" placeholder="Search cards…" />
            <Select v-model="selectedType" :options="typeOptions" />
            <Select v-model="selectedRarity" :options="rarityOptions" />
        </div>

        <div v-if="items.length === 0 && !hasActiveFilters" class="grid-page__empty">
            <p>No cards yet. Create one in the editor and save.</p>
            <ButtonMain @click="createNewCard" text="Create new card" type="primary" />
        </div>

        <div v-else-if="items.length === 0" class="grid-page__empty grid-page__empty--no-results">
            <p>No cards match your search.</p>
        </div>

        <div v-else class="grid-page__grid" role="list">
            <GridItem v-for="item in items" :key="item.id || item.name" :item="item" @click="selectForEdit(item)"
                @delete="deleteItem(item)" @duplicate="duplicateItem(item)" />
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

.grid-page__toolbar {
    display: flex;
    align-items: flex-end;
    gap: var(--ds-space-3);
    margin-bottom: var(--ds-space-5);
}

.grid-page__search-field {
    flex: 1;
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
