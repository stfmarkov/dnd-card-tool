<script lang="ts" setup>
import type { SelectProps } from './types/propTypes';
import SelectList from './SelectList.vue';
import type { SelectEmit } from './types/emitTypes';
import { computed, ref, watch } from 'vue';
import Field from '../Field.vue';

const CUSTOM_SENTINEL = '__custom__';

const props = defineProps<SelectProps>();
const emit = defineEmits<SelectEmit>();

const id = computed(() =>
    props.label.toLowerCase().replace(/\s+/g, '-')
);

const combinedOptions = computed(() => [{ label: 'Custom', value: CUSTOM_SENTINEL }, ...props.options]);

const isKnownOption = (val: string) => props.options.some(o => o.value === val);

const dropdownValue = ref(isKnownOption(props.modelValue) ? props.modelValue : CUSTOM_SENTINEL);
const customValue = ref(isKnownOption(props.modelValue) ? '' : props.modelValue);

const isCustom = computed(() => dropdownValue.value === CUSTOM_SENTINEL);

watch(dropdownValue, (newVal) => {
    if (newVal !== CUSTOM_SENTINEL) {
        emit('update:modelValue', newVal);
    } else if (customValue.value) {
        emit('update:modelValue', customValue.value);
    }
});

watch(customValue, (newVal) => {
    if (isCustom.value && newVal !== props.modelValue) {
        emit('update:modelValue', newVal);
    }
});

watch(() => props.modelValue, (newVal) => {
    if (isKnownOption(newVal)) {
        dropdownValue.value = newVal;
        customValue.value = '';
    } else {
        dropdownValue.value = CUSTOM_SENTINEL;
        customValue.value = newVal;
    }
});
</script>

<template>
    <div class="combobox">
        <label v-if="label" :for="id" class="combobox__label">{{ label }}</label>
        <SelectList :label="label" :options="combinedOptions" v-model="dropdownValue" />
        <Field v-if="isCustom" :id="id" v-model="customValue" type="text" class="combobox__input" autocomplete="off" />
    </div>
</template>

<style scoped>
.combobox {
    display: flex;
    gap: var(--ds-space-1);
    align-items: center;
    gap: var(--ds-space-2);
}

.combobox__label {
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ds-workspace-muted);
    font-weight: 600;
    flex: 0 0 auto;
}

.combobox__input {
    width: 100%;
}
</style>
