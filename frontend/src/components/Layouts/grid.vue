<script lang="ts" setup>
import GridItems from '../GridItems.vue';
</script>
<template>
    <div class="grid-layout">
        <GridItems />
    </div>
</template>
<style scoped>
.grid-layout {
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    background: radial-gradient(ellipse 120% 80% at 50% -20%, rgba(196, 160, 58, 0.08), transparent 55%),
        var(--ds-workspace-bg);
    padding: var(--ds-space-5) var(--ds-space-6) var(--ds-space-8);
    text-align: left;
}
</style>
