<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

const props = defineProps<{
    type?: 'text' | 'textarea';
    label: string;
    placeholder: string;
    modelValue: string;
}>();

const type = computed(() => {
    return props.type || 'text';
});

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

const id = computed(() => {
    return props.label.toLowerCase().replace(' ', '-');
});

</script>

<template>
    <div class="editor-field">
        <label :for="id" class="editor-field__label">{{ label }}</label>
        <input v-if="type === 'text'" :id="id" v-model="value" type="text" class="editor-field__input"
            :placeholder="placeholder" autocomplete="off" />
        <textarea v-else :id="id" v-model="value" class="editor-field__textarea" :placeholder="placeholder"
            autocomplete="off" />
    </div>
</template>

<style scoped>
.editor-field {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
}

.editor-field__label {
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ds-workspace-muted);
    font-weight: 600;
}

.editor-field__input,
.editor-field__textarea {
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
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.editor-field__input::placeholder,
.editor-field__textarea::placeholder {
    color: var(--ds-workspace-muted);
    opacity: 0.85;
}

.editor__input:hover,
.editor-field__textarea:hover {
    border-color: rgba(200, 168, 100, 0.4);
}

.editor-field__input:focus,
.editor-field__textarea:focus {
    outline: none;
    border-color: var(--ds-gold-mid);
    box-shadow: 0 0 0 1px var(--ds-gold-mid);
}

.editor-field__textarea {
    min-height: 7.5rem;
    resize: vertical;
}
</style>