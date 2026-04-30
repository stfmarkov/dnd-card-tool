<script lang="ts" setup>
import ButtonIcon from './utils/buttons/ButtonIcon.vue'
import IconsHamburger from './Icons/hamburger.vue'
import IconsGrid from './Icons/grid.vue'
import { ref } from 'vue'
import { useGeneralStore } from '../store/general'
import IconsSplit from './Icons/split.vue'
const isOpen = ref(false)

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}

const generalStore = useGeneralStore()

const toGridView = () => {
    generalStore.setSelectedLayout('grid')
}

const toMainView = () => {
    generalStore.setSelectedLayout('main')
}

</script>
<template>
    <div class="navigation-menu" :class="{ 'navigation-menu--open': isOpen }">
        <ButtonIcon class="navigation-menu__main"  @click="toggleMenu">
            <IconsHamburger />
        </ButtonIcon>
        <ButtonIcon class="navigation-menu__right-button" @click="toGridView">
            <IconsGrid />
        </ButtonIcon>
        <ButtonIcon class="navigation-menu__bottom-button" @click="toMainView">
            <IconsSplit direction="horizontal" />
        </ButtonIcon>
    </div>
</template>
<style scoped>
.navigation-menu {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    box-sizing: border-box;
}
.navigation-menu__main {
    z-index: 1001;
}
.navigation-menu__right-button {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(0);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    pointer-events: none;
}

.navigation-menu__bottom-button {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateX(0);
    transform: translateY(0);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    pointer-events: none;
}

.navigation-menu--open .navigation-menu__right-button {
    transform: translateX(3rem);
    pointer-events: auto;
    opacity: 1;
}

.navigation-menu--open .navigation-menu__bottom-button {
    transform: translateY(3rem);
    pointer-events: auto;
    opacity: 1;
}
</style>