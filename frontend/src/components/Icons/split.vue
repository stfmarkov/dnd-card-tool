<script lang="ts" setup>
const props = defineProps<{
    direction?: 'horizontal' | 'vertical'
}>()
</script>
<template>
    <svg :class="direction === 'horizontal' ? 'icon-split--horizontal' : 'icon-split--vertical'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="9" rx="2.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <rect x="2" y="14" width="20" height="9" rx="2.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
</template>
<style scoped>
svg {
    width: 100%;
    height: 100%;
}
.icon-split--horizontal {
    transform: rotate(90deg);
}
.icon-split--vertical {
    transform: rotate(0deg);
}
</style>
