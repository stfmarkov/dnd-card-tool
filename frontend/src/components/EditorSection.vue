<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
    title: string;
    hint?: string;
}>();

const id = computed(() => {
    return props.title.toLowerCase().replace(' ', '-') + '-section';
});

</script>

<template>
    <section class="editor__section" :aria-labelledby="`label-${id}`">
        <h2 :id="`label-${id}`" class="editor__section-title">{{ title }}</h2>
        <p v-if="hint" class="editor__section-hint">{{ hint }}</p>

        <slot />
    </section>
</template>

<style scoped>
.editor__section {
    margin: 0;
    padding: var(--ds-space-4);
    background: var(--ds-workspace-bg-elevated);
    border: 1px solid var(--ds-workspace-border);
    border-radius: 4px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04) inset;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
}

.editor__section-title {
    margin: 0;
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: #e8d9b8;
    font-weight: 600;
    border-left: 3px solid var(--ds-gold-mid);
    padding-left: var(--ds-space-3);
}

.editor__section-hint {
    margin: calc(-1 * var(--ds-space-1)) 0 0;
    padding-left: calc(var(--ds-space-3) + 3px);
    font-size: var(--ds-text-xs);
    color: var(--ds-workspace-muted);
    line-height: 1.4;
}
</style>