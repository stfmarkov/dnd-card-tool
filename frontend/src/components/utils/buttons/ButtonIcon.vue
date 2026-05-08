<script lang="ts" setup>
import { ref } from 'vue'
import Tooltip from '../Tooltip.vue'

const props = defineProps<{
    empty?: boolean
    title?: string
}>()

const showTitle = ref(false)

const toggleTitle = () => {
    if (!props.title) {
        return
    }
    showTitle.value = !showTitle.value
}

</script>
<template>
    <button class="button-icon" :class="{ 'button-icon--empty': empty }" @mouseenter="toggleTitle" @mouseleave="toggleTitle">
        <slot />
        <Tooltip v-if="title" :title="title" :show="showTitle" />
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
.button-icon--empty {
    background-color: transparent;
}
</style>