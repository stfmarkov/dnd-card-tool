<script lang="ts" setup>
import MainLayout from './components/Layouts/main.vue'
import { onMounted, shallowRef, computed, watch } from 'vue'
import { GetCardData } from '../wailsjs/go/main/App'
import NavigationMenu from './components/NavigationMenu.vue'
import type { Component } from 'vue';
import GridLayout from './components/Layouts/grid.vue'
import { useGeneralStore } from './store/general'
import type { Layout } from './store/general'

const generalStore = useGeneralStore()

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

onMounted(async () => {
  selectedLayoutComponent.value = MainLayout
  const cards = await GetCardData()
  console.log(cards)
})

</script>
<template>
  <component :is="selectedLayoutComponent" />
  <NavigationMenu />
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
