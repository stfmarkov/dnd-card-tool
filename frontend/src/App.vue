<script lang="ts" setup>
import MainLayout from './components/Layouts/main.vue'
import { onMounted, shallowRef, computed, watch } from 'vue'
import { GetCardData } from '../wailsjs/go/main/App'
import NavigationMenu from './components/NavigationMenu.vue'
import Toast from './components/utils/Toast.vue'
import type { Component } from 'vue';
import GridLayout from './components/Layouts/grid.vue'
import { useGeneralStore } from './store/general'
import type { Layout } from './store/general'
import { useItemCardsStore } from './store/itemCards'

const generalStore = useGeneralStore()
const itemCardsStore = useItemCardsStore()

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
  if (newLayout === 'grid') {
    getItems()
  }
})

const getItems = async () => {
  const cards = await GetCardData()

  itemCardsStore.setItems(cards.map(card => ({
    id: card.id,
    name: card.name,
    typeLine: card.typeLine,
    description: card.description,
    footerText: card.footerText,
    artwork: card.artwork,
    artworkSourceFile: null,
    rarity: card.rarity,
  })))

}

onMounted(async () => {
  selectedLayoutComponent.value = MainLayout

  await getItems()
})

</script>
<template>
  <component :is="selectedLayoutComponent" />
  <NavigationMenu />
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
