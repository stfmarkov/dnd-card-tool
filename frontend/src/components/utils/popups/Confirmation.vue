<script setup lang="ts">
import ButtonMain from '../buttons/ButtonMain.vue';
import { useConfirmationStore } from '../../../store/confirmationStore';

const confirmationStore = useConfirmationStore();
</script>

<template>

    <div class="confirmation" :class="confirmationStore.show ? 'confirmation--show' : ''">
        <div class="confirmation__content">
            <h2>{{ confirmationStore.title }}</h2>
            <p>{{ confirmationStore.message }}</p>
            <div class="confirmation__buttons">
                <ButtonMain type="secondary" @click="confirmationStore.onCancel" :text="confirmationStore.cancelText" />
                <ButtonMain type="primary" @click="confirmationStore.onConfirm" :text="confirmationStore.confirmText" />
            </div>
        </div>
    </div>

</template>

<style scoped>
.confirmation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    pointer-events: none;
}

.confirmation__content {
    background-color: var(--ds-parchment);
    color: var(--ds-ink);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    max-width: 400px;
    width: 100%;
    text-align: center;
    transform: scale(0.5);
    transition: transform 0.3s ease-in-out;
    h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    p {
        font-size: 16px;
        margin-bottom: 20px;
    }
}

.confirmation__buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.confirmation--show {
    opacity: 1;
    pointer-events: auto;
}

.confirmation--show .confirmation__content {
    transform: scale(1);
} 
</style>