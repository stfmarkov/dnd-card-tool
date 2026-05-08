<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useItemCardStore } from '../store/itemCard';
import Arrow from './Icons/arrow.vue';
import IconVerticalDots from './Icons/verticalDots.vue';
import ButtonIcon from './utils/buttons/ButtonIcon.vue';
import IconExport from './Icons/export.vue';
import IconNew from './Icons/new.vue';
import IconSave from './Icons/save.vue';
import { useCardActions } from '../composables/useCardActions';
import CardStandart from './cards/Standart.vue';
import CardMinimalist from './cards/Minimalist.vue';
import CardScroll from './cards/Scroll.vue';
import CardTwoSided from './cards/TwoSided.vue';
import type { Component } from 'vue';
import type { CardTemplate } from '../store/itemCard';

const itemCardStore = useItemCardStore();
const { exportCard, newCard, saveCard } = useCardActions();

const cardId = computed(() => itemCardStore.id)

const isVisible = ref(true)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

const cardComponentMap: Record<CardTemplate, Component> = {
  standart: CardStandart,
  minimalist: CardMinimalist,
  scroll: CardScroll,
  twosided: CardTwoSided,
}

const cardComponent = computed<Component>(() => cardComponentMap[itemCardStore.template] ?? CardStandart)

</script>

<template>
  <div class="item-card__container">
    <div class="item-card__controls" :class="{ 'item-card__controls--visible': isVisible }">
      <ButtonIcon @click="toggleVisibility" class="item-card__control item-card__control-0">
        <IconVerticalDots />
      </ButtonIcon>

      <ButtonIcon @click="exportCard" title="Export card" class="item-card__control item-card__control-1">
        <IconExport />
      </ButtonIcon>
      <ButtonIcon @click="newCard" title="New card" class="item-card__control item-card__control-2">
        <IconNew />
      </ButtonIcon>
      <ButtonIcon @click="saveCard" title="Save card" class="item-card__control item-card__control-3">
        <IconSave />
      </ButtonIcon>
      <ButtonIcon @click="toggleVisibility" class="item-card__control item-card__control-4">
        <Arrow direction="right" />
      </ButtonIcon>
    </div>
    <p class="item-card__status" :class="cardId ? 'item-card__status--id' : 'item-card__status--new'">
      <template v-if="cardId">ID: {{ cardId }}</template>
      <template v-else>New item</template>
    </p>

    <div class="item-card__card">
      <component :is="cardComponent" />
    </div>
  </div>
</template>

<style scoped>
.item-card__container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-4);
  box-sizing: border-box;
  background: var(--ds-workspace-bg);
  gap: var(--ds-space-2);
}

.item-card__controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: var(--ds-space-2);
  z-index: 100;
}

.item-card__control {
  transition: all 0.3s ease-in-out;
  position: absolute;
  top: 0;
  right: 0;
  --control-offset: 2.5rem;
  transform: translateX(0);
  opacity: 0;
}

.item-card__control-0 {
  opacity: 1;
}

.item-card__control-1 {
  z-index: -1;
}

.item-card__control-2 {
  z-index: -2;
}

.item-card__control-3 {
  z-index: -3;
}

.item-card__control-4 {
  z-index: 1;
}

.item-card__controls--visible .item-card__control {
  opacity: 1;
}

.item-card__controls--visible .item-card__control-0 {
  opacity: 0;
  pointer-events: none;
}

.item-card__controls--visible .item-card__control-1 {
  transform: translateX(calc(var(--control-offset) * -1));
}

.item-card__controls--visible .item-card__control-2 {
  transform: translateX(calc(var(--control-offset) * -2));
}

.item-card__controls--visible .item-card__control-3 {
  transform: translateX(calc(var(--control-offset) * -3));
}

.item-card__status {
  margin: 0;
  font-family: var(--ds-font-ui);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.item-card__status--id {
  color: var(--ds-gold);
}

.item-card__status--new {
  color: #6dbf7e;
}

.item-card__card {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
