<script lang="ts" setup>

const props = defineProps<{
    title: string
    show: boolean
}>()

</script>

<template>
            <span class="tooltip" :class="{ 'tooltip--visible': show }">{{ title }}</span>
</template>

<style scoped>
.tooltip {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--ds-workspace-text-primary);
    background-color: var(--ds-ink);
    padding: 0.5rem;
    box-shadow: 8px 0 24px rgba(0, 0, 0, 0.35), 2px 0 6px rgba(0, 0, 0, 0.25);
    white-space: nowrap;
    pointer-events: none;
    z-index: 1001;
}
.tooltip--visible {
    opacity: 1;
}
</style>

