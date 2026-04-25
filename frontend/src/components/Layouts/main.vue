<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { Component } from 'vue';
import ItemCardEditor from '../ItemCardEditor.vue';
import ItemCardPreview from '../ItemCardPreview.vue';

const selectedLeftComponent = ref<Component | null>(null)
const selectedRightComponent = ref<Component | null>(null)

onMounted(() => {
    selectedLeftComponent.value = ItemCardPreview
    selectedRightComponent.value = ItemCardEditor
})
</script>

<template>
    <div class="layout">
        <div class="left">
            <component :is="selectedLeftComponent" />
        </div>
        <div class="right">
            <component :is="selectedRightComponent" />
        </div>
    </div>
</template>

<style scoped>
.layout {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100vw;
    flex-grow: 1;
    align-items: stretch;
    justify-content: stretch;
}

.left {
    width: 50%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: var(--ds-workspace-bg);
    box-shadow: 8px 0 24px rgba(0, 0, 0, 0.35), 2px 0 6px rgba(0, 0, 0, 0.25);
}

.right {
    width: 50%;
    height: 100%;
    background-color: var(--ds-workspace-bg);
}
</style>