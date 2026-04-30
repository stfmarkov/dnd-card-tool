<script lang="ts" setup>
</script>
<template>
    <button class="button-icon">
        <slot />
    </button>
</template>
<style scoped>
.button-icon {
    border-radius: 50%;
    background-color: var(--ds-workspace-bg-elevated);
    border: none;
    color: var(--ds-workspace-text-primary);
    box-shadow: 8px 0 24px rgba(0, 0, 0, 0.35), 2px 0 6px rgba(0, 0, 0, 0.25);
    padding: 0.5rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>