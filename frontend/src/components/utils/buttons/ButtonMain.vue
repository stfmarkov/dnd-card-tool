<script setup lang="ts">

const props = defineProps<{
    text: string
    type: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
}>()

</script>

<template>
    <button :class="`button-main button-main--${type}`" :disabled="disabled">
        <slot />
        {{ text }}
    </button>
</template>

<style scoped>
.button-main {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-ui);
    font-size: var(--ds-text-sm);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: var(--ds-space-2) var(--ds-space-5);
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    white-space: nowrap;
}

.button-main:focus-visible {
    outline: 2px solid var(--ds-gold-mid);
    outline-offset: 2px;
}

.button-main:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

/* Primary — burgundy action button */
.button-main--primary {
    background-color: var(--ds-burgundy);
    color: var(--ds-parchment);
    border-color: var(--ds-burgundy-light);
}

.button-main--primary:hover:not(:disabled) {
    background-color: var(--ds-burgundy-mid);
    border-color: var(--ds-gold);
    box-shadow: 0 2px 8px rgba(74, 15, 15, 0.45);
}

.button-main--primary:active:not(:disabled) {
    background-color: var(--ds-burgundy-light);
    box-shadow: none;
}

/* Secondary — workspace ghost button */
.button-main--secondary {
    background-color: var(--ds-workspace-bg-elevated);
    color: var(--ds-workspace-text);
    border-color: var(--ds-workspace-border);
}

.button-main--secondary:hover:not(:disabled) {
    background-color: var(--ds-workspace-border);
    border-color: var(--ds-workspace-muted);
}

.button-main--secondary:active:not(:disabled) {
    background-color: var(--ds-workspace-bg);
}

/* Danger — dark destructive red */
.button-main--danger {
    background-color: var(--ds-danger);
    color: var(--ds-parchment);
    border-color: var(--ds-danger-mid);
}

.button-main--danger:hover:not(:disabled) {
    background-color: var(--ds-danger-mid);
    border-color: var(--ds-danger-light);
    box-shadow: 0 2px 8px rgba(92, 16, 16, 0.5);
}

.button-main--danger:active:not(:disabled) {
    background-color: var(--ds-danger-light);
    box-shadow: none;
}
</style>