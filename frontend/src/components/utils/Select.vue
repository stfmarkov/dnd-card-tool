<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

export interface SelectOption {
    label: string;
    value: string;
}

const props = defineProps<{
    label?: string;
    modelValue: string;
    options: SelectOption[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const value = ref(props.modelValue);

watch(value, (newValue) => {
    if (newValue !== props.modelValue) {
        emit('update:modelValue', newValue);
    }
});

watch(() => props.modelValue, (newValue) => {
    if (newValue !== value.value) {
        value.value = newValue;
    }
});

const id = computed(() =>
    props.label ? props.label.toLowerCase().replace(/\s+/g, '-') : undefined
);
</script>

<template>
    <div class="select">
        <label v-if="label" :for="id" class="select__label">{{ label }}</label>
        <select :id="id" v-model="value" class="select__input">
            <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
    </div>
</template>

<style scoped>
.select {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
}

.select__label {
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ds-workspace-muted);
    font-weight: 600;
}

.select__input {
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

.select__input:hover {
    border-color: rgba(200, 168, 100, 0.4);
}

.select__input:focus {
    outline: none;
    border-color: var(--ds-gold-mid);
    box-shadow: 0 0 0 1px var(--ds-gold-mid);
}

.select__input option {
    background: var(--ds-workspace-bg-elevated);
    color: var(--ds-workspace-text);
}
</style>
