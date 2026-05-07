<script lang="ts" setup>
import type { SelectProps } from './types/propTypes';
import { useSelectEssentials } from './composables/useSelectEssentials';
import type { SelectEmit } from './types/emitTypes';

const props = defineProps<SelectProps>();
const emit = defineEmits<SelectEmit>();

const { value, id } = useSelectEssentials(props, emit);

</script>

<template>
    <select :id="id" v-model="value" class="select-list">
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
</template>

<style scoped>
.select-list {
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
}

.select-list:hover {
    border-color: rgba(200, 168, 100, 0.4);
}

.select-list:focus {
    outline: none;
    border-color: var(--ds-gold-mid);
    box-shadow: 0 0 0 1px var(--ds-gold-mid);
}

.select-list option {
    background: var(--ds-workspace-bg-elevated);
    color: var(--ds-workspace-text);
}
</style>