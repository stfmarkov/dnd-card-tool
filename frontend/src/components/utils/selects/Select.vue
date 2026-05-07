<script lang="ts" setup>
import SelectList from './SelectList.vue';
import type { SelectProps } from './types/propTypes';
import { useSelectEssentials } from './composables/useSelectEssentials';
import type { SelectEmit } from './types/emitTypes';

const props = defineProps<SelectProps>();
const emit = defineEmits<SelectEmit>();

const { value, id } = useSelectEssentials(props, emit);

</script>

<template>
    <div class="select">
        <label v-if="label" :for="id" class="select__label">{{ label }}</label>
        <SelectList :label="label" :options="options" v-model="value" />
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
</style>
