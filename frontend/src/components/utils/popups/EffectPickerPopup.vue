<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import effectsData from '../../../data/itemEffects.json'
import Field from '../Field.vue'
import Select from '../selects/Select.vue'
import ButtonIcon from '../buttons/ButtonIcon.vue'
import IconClose from '../../Icons/close.vue'

const props = defineProps<{ show: boolean }>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'select', snippet: string): void
}>()

const search = ref('')
const selectedCategory = ref('')

watch(() => props.show, (val) => {
    if (val) {
        search.value = ''
        selectedCategory.value = ''
    }
})

const categories = [...new Set(effectsData.map(e => e.category))]

const categoryOptions = [
    { label: 'All categories', value: '' },
    ...categories.map(c => ({ label: c, value: c })),
]

const filtered = computed(() => {
    const q = search.value.toLowerCase()
    return effectsData.filter(effect => {
        const matchesSearch = !q
            || effect.name.toLowerCase().includes(q)
            || effect.category.toLowerCase().includes(q)
        const matchesCategory = !selectedCategory.value || effect.category === selectedCategory.value
        return matchesSearch && matchesCategory
    })
})

const handleSelect = (snippet: string) => {
    emit('select', snippet)
    emit('close')
}
</script>

<template>
    <div class="effect-picker" :class="{ 'effect-picker--show': show }" @click.self="emit('close')">
        <div class="effect-picker__panel">
            <header class="effect-picker__header">
                <h2 class="effect-picker__title">Add Effect</h2>
                <ButtonIcon @click="emit('close')">
                    <IconClose />
                </ButtonIcon>
            </header>

            <div class="effect-picker__toolbar">
                <Field class="effect-picker__search" v-model="search" placeholder="Search effects…" />
                <Select v-model="selectedCategory" :options="categoryOptions" label="Category" />
            </div>

            <ul class="effect-picker__list" role="listbox" aria-label="Effects">
                <li v-for="effect in filtered" :key="effect.id" class="effect-picker__item" role="option" tabindex="0"
                    @click="handleSelect(effect.snippet)" @keydown.enter.prevent="handleSelect(effect.snippet)"
                    @keydown.space.prevent="handleSelect(effect.snippet)">
                    <span class="effect-picker__item-name">{{ effect.name }}</span>
                    <span class="effect-picker__item-category">{{ effect.category }}</span>
                </li>

                <li v-if="filtered.length === 0" class="effect-picker__empty">
                    No effects match your search.
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.effect-picker {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}

.effect-picker--show {
    opacity: 1;
    pointer-events: auto;
}

.effect-picker__panel {
    background-color: var(--ds-workspace-bg-elevated);
    color: var(--ds-workspace-text);
    border: 1px solid var(--ds-workspace-border);
    border-radius: 6px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 520px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    transform: scale(0.92);
    transition: transform 0.2s ease;
    overflow: hidden;
}

.effect-picker--show .effect-picker__panel {
    transform: scale(1);
}

.effect-picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ds-space-4) var(--ds-space-5);
    border-bottom: 1px solid var(--ds-workspace-border);
    flex-shrink: 0;
}

.effect-picker__title {
    margin: 0;
    font-size: var(--ds-text-md);
    font-weight: 700;
    color: var(--ds-workspace-text);
    letter-spacing: 0.02em;
}

.effect-picker__toolbar {
    display: flex;
    align-items: flex-end;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3) var(--ds-space-5);
    border-bottom: 1px solid var(--ds-workspace-border);
    flex-shrink: 0;
}

.effect-picker__search {
    flex: 1;
}

.effect-picker__list {
    list-style: none;
    margin: 0;
    padding: var(--ds-space-2) 0;
    overflow-y: auto;
    flex: 1;
    scrollbar-color: var(--ds-gold-mid) var(--ds-workspace-bg-elevated);
    scrollbar-width: thin;
}

.effect-picker__item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-3);
    padding: var(--ds-space-2) var(--ds-space-5);
    cursor: pointer;
    transition: background 0.1s ease;
    border-radius: 0;
    outline: none;
}

.effect-picker__item:hover,
.effect-picker__item:focus-visible {
    background: rgba(168, 134, 50, 0.12);
}

.effect-picker__item:focus-visible {
    box-shadow: inset 2px 0 0 var(--ds-gold-mid);
}

.effect-picker__item-name {
    font-size: var(--ds-text-base);
    color: var(--ds-workspace-text);
    flex: 1;
    min-width: 0;
}

.effect-picker__item-category {
    font-size: var(--ds-text-xs);
    color: var(--ds-workspace-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
}

.effect-picker__empty {
    padding: var(--ds-space-6) var(--ds-space-5);
    text-align: center;
    color: var(--ds-workspace-muted);
    font-size: var(--ds-text-base);
}
</style>
