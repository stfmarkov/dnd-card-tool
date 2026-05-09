<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { SelectProps } from './types/propTypes';
import { useSelectEssentials } from './composables/useSelectEssentials';
import type { SelectEmit } from './types/emitTypes';

const props = defineProps<SelectProps>();
const emit = defineEmits<SelectEmit>();

const { value, id } = useSelectEssentials(props, emit);

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const listId = computed(() => `${id.value}-listbox`);

const selectedLabel = computed(() => {
    const opt = props.options.find((o) => o.value === value.value);
    return opt?.label ?? '';
});

const toggle = () => {
    open.value = !open.value;
}

const selectOption = (v: string) => {
    value.value = v;
    open.value = false;
}

const onDocPointerDown = (ev: PointerEvent) => {
    const el = rootRef.value;
    if (!el || el.contains(ev.target as Node)) {
        return;
    }
    open.value = false;
}

onMounted(() => {
    document.addEventListener('pointerdown', onDocPointerDown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocPointerDown);
});
</script>

<template>
    <div ref="rootRef" class="select-list">
        <button
            type="button"
            :id="id"
            class="select-list__trigger"
            :aria-expanded="open"
            aria-haspopup="listbox"
            :aria-controls="listId"
            @click="toggle"
        >
            <span class="select-list__value">{{ selectedLabel }}</span>
            <span class="select-list__caret" aria-hidden="true" />
        </button>
        <ul
            v-show="open"
            :id="listId"
            class="select-list__options"
            role="listbox"
            :aria-labelledby="id"
        >
            <li
                v-for="opt in options"
                :key="opt.value"
                role="option"
                class="select-list__option"
                :class="{ 'is-selected': opt.value === value }"
                :aria-selected="opt.value === value"
                @click="selectOption(opt.value)"
            >
                {{ opt.label }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.select-list {
    position: relative;
    width: 100%;
}

.select-list__trigger {
    width: 100%;
    box-sizing: border-box;
    padding: var(--ds-space-2) var(--ds-space-3);
    font: inherit;
    font-size: var(--ds-text-base);
    line-height: 1.4;
    color: var(--ds-workspace-text);
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--ds-workspace-border);
    border-radius: 3px;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    text-align: left;
}

.select-list__trigger:hover {
    border-color: rgba(200, 168, 100, 0.4);
}

.select-list__trigger:focus {
    outline: none;
    border-color: var(--ds-gold-mid);
    box-shadow: 0 0 0 1px var(--ds-gold-mid);
}

.select-list__value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.select-list__caret {
    flex-shrink: 0;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--ds-workspace-muted);
    opacity: 0.85;
}

.select-list__options {
    position: absolute;
    z-index: 50;
    left: 0;
    right: 0;
    top: calc(100% + 2px);
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: min(40vh, 16rem);
    overflow-y: auto;
    border-radius: 3px;
    border: 1px solid var(--ds-workspace-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    background: var(--ds-workspace-bg-elevated);
}

.select-list__option {
    margin: 0;
    padding: var(--ds-space-2) var(--ds-space-3);
    font: inherit;
    font-size: var(--ds-text-base);
    line-height: 1.4;
    background: var(--ds-workspace-bg-elevated);
    color: var(--ds-workspace-text);
    cursor: pointer;
    transition: background-color 0.12s ease;
}

.select-list__option:hover,
.select-list__option:focus {
    background: rgba(200, 168, 100, 0.12);
    outline: none;
}

.select-list__option.is-selected {
    background: rgba(200, 168, 100, 0.18);
}
</style>
