<script lang="ts" setup>
import Layout from './components/Layouts/main.vue'
import { onMounted } from 'vue'
import { GetCardData, SaveCardData } from '../wailsjs/go/main/App'

onMounted(async () => {
  const cards = await GetCardData()
  console.log(cards)
})

</script>
<template>
  <Layout />
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
