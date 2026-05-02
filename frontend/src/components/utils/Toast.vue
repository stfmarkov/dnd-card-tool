<script setup lang="ts">
import { useGeneralStore } from '../../store/general';
import { computed, watch, ref } from 'vue';

const generalStore = useGeneralStore();

const toast = computed(() => generalStore.toast);

const visible = ref(false);

watch(toast, (newToast) => {
    if (newToast) {
        visible.value = true;
    }
    setTimeout(() => {
        visible.value = false;
    }, toast.value?.duration);
}, { deep: true });

watch(visible, (newVisible) => {
    if (!newVisible) {
        setTimeout(() => {
            generalStore.setToast(null);
        }, 400);
    }
}, { deep: true });

</script>

<template>
    <div class="toast" :class="`toast--${toast?.type} ${visible ? 'toast--visible' : ''}`">
        <div class="toast__content">
            <div class="toast__title">{{ toast?.title }}</div>
            <div class="toast__message">{{ toast?.message }}</div>
        </div>
    </div>
</template>

<style scoped>
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    color: var(--ds-parchment);
    border: 1px solid var(--ds-workspace-border);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
    transform: translateY(10px);
    min-width: 200px;
}

.toast__content {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.toast__title {
    font-size: 16px;
    font-weight: bold;
}

.toast__message {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.toast--success {
    background-color: var(--ds-tint-uncommon);
    border-color: var(--ds-tint-uncommon);
}

.toast--error {
    background-color: var(--ds-tint-artifact);
    border-color: var(--ds-tint-artifact);
}

.toast--warning {
    background-color: var(--ds-tint-legendary);
    border-color: var(--ds-tint-legendary);
}

.toast--info {
    background-color: var(--ds-tint-rare);
    border-color: var(--ds-tint-rare);
}

.toast--visible {
    display: block;
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}
</style>