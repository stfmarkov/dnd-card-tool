<script lang="ts" setup>
import { ref, watch } from 'vue';

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
}>();

const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);

watch(fileUrl, (newUrl) => {
    emit('update:modelValue', newUrl);
});

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        file.value = input.files[0];
        fileUrl.value = URL.createObjectURL(file.value as Blob);
    }
};
</script>

<template>
    <label class="editor__upload">
        <input type="file" class="editor__file" accept="image/*" @change="handleFileChange" />
        <span class="editor__upload-box">
            <span class="editor__upload-text">
                <span class="editor__upload-lead">Choose image or drop here</span>
                <span class="editor__upload-meta">PNG, JPG, WebP — for layout only; no import yet</span>
            </span>
            <span class="editor__upload-btn" aria-hidden="true">Browse</span>
        </span>
    </label>
</template>

<style scoped>
/* Upload: label + visually hidden file input (opens picker; no handler yet) */
.editor__upload {
    position: relative;
    display: block;
    cursor: pointer;
    border-radius: 3px;
    margin: 0;
}

.editor__file {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    opacity: 0;
}

.editor__upload-box {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    min-height: 5.5rem;
    padding: var(--ds-space-3) var(--ds-space-4);
    border: 1px dashed rgba(168, 134, 50, 0.45);
    background: linear-gradient(160deg, rgba(0, 0, 0, 0.2) 0%, rgba(36, 48, 68, 0.6) 100%);
    border-radius: 3px;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.editor__upload:hover .editor__upload-box,
.editor__upload:focus-within .editor__upload-box {
    border-color: var(--ds-gold-mid);
    background: linear-gradient(160deg, rgba(0, 0, 0, 0.15) 0%, rgba(50, 62, 82, 0.75) 100%);
}

.editor__upload-text {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-0);
    min-width: 0;
    flex: 1;
    text-align: left;
}

.editor__upload-lead {
    font-size: var(--ds-text-sm);
    font-weight: 600;
    color: var(--ds-workspace-text);
}

.editor__upload-meta {
    font-size: var(--ds-text-xs);
    color: var(--ds-workspace-muted);
    line-height: 1.35;
}

.editor__upload-btn {
    flex-shrink: 0;
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f0e6d2;
    padding: var(--ds-space-2) var(--ds-space-3);
    background: var(--ds-burgundy);
    border: 1px solid var(--ds-gold);
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
    pointer-events: none;
}
</style>