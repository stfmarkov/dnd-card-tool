<script lang="ts" setup>
import MainLayout from './components/Layouts/main.vue'
import { onMounted, shallowRef, computed, watch } from 'vue'
import NavigationMenu from './components/NavigationMenu.vue'
import Toast from './components/utils/Toast.vue'
import type { Component } from 'vue';
import GridLayout from './components/Layouts/grid.vue'
import { useGeneralStore } from './store/general'
import type { Layout } from './store/general'
import Confirmation from './components/utils/popups/Confirmation.vue'
import { EventsOn } from '../wailsjs/runtime/runtime';
import { useCardActions } from './composables/useCardActions';


const generalStore = useGeneralStore()
const { exportCard, newCard, saveCard } = useCardActions()

const layouts = {
  main: MainLayout,
  grid: GridLayout,
} as Record<Layout, Component>

const selectedLayoutComponent = shallowRef<Component | null>(null)

const selectedLayout = computed(() => {
  return generalStore.selectedLayout
})

watch(selectedLayout, (newLayout) => {
  selectedLayoutComponent.value = layouts[newLayout]
})

onMounted(() => {
  selectedLayoutComponent.value = MainLayout

  EventsOn('menu:action', async (event) => {
    if (event === 'print-card') await exportCard()
    if (event === 'new-card') newCard()
    if (event === 'save-card') await saveCard()
  });
})

</script>
<template>
  <component :is="selectedLayoutComponent" />
  <NavigationMenu />
  <Confirmation />
  <Toast />
</template>

<style>
#logo {
  display: block;
  width: 50%;
  height: 50%;
  margin: auto;
  padding: 10% 0 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-origin: content-box;
}
</style>
