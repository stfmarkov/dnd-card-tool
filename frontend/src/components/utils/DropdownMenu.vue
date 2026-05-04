<script lang="ts" setup>
import ButtonIcon from './buttons/ButtonIcon.vue';
import IconsVerticalDots from '../Icons/verticalDots.vue';
import { ref, computed } from 'vue';

const props = defineProps<{
    horizontal?: 'left' | 'right'
    vertical?: 'top' | 'bottom'
    items: {
        label: string;
        value: string;
    }[]
}>()

const horizontalPosition = computed(() => {
    return props.horizontal === 'left' ? 'left' : 'right';
})

const verticalPosition = computed(() => {
    return props.vertical === 'top' ? 'top' : 'bottom';
})

const emit = defineEmits<{
    (e: 'selected', value: string): void
}>()

const isOpen = ref(false);

const openMenu = () => {
    isOpen.value = !isOpen.value;
}

const handleItemClick = (value: string) => {
    emit('selected', value);
    isOpen.value = false;
}

const closeMenu = () => {
    isOpen.value = false;
}

</script>

<template>
    <div class="dropdown-menu" :class="{ 'dropdown-menu--open': isOpen, 'dropdown-menu--position-top': verticalPosition === 'top', 'dropdown-menu--position-bottom': verticalPosition === 'bottom', 'dropdown-menu--position-left': horizontalPosition === 'left', 'dropdown-menu--position-right': horizontalPosition === 'right' }" @mouseleave="closeMenu">
        <ButtonIcon empty @click.stop.prevent="openMenu">
            <IconsVerticalDots />
        </ButtonIcon>
        <div class="dropdown-menu__content">
            <ul>
                <li v-for="item in items" :key="item.value" @click.stop.prevent="handleItemClick(item.value)">
                    {{ item.label }}
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
.dropdown-menu {
    position: relative;
}

.dropdown-menu--position-top .dropdown-menu__content {
    bottom: 100%;
    top: auto;
}
.dropdown-menu--position-bottom .dropdown-menu__content {
    top: 100%;
    bottom: auto;
}
.dropdown-menu--position-left .dropdown-menu__content {
    right: 0%;
    left: auto;
}

.dropdown-menu--position-right .dropdown-menu__content {
    left: 0%;
    right: auto;
}

.dropdown-menu__content {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: var(--ds-parchment);
    color: var(--ds-ink);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    min-width: 100px;
    z-index: 1000;
    list-style: none;
    margin: 0;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    pointer-events: none;
}

.dropdown-menu__content li {
    padding: 4px;
    cursor: pointer;
    font-size: var(--ds-text-sm);
    font-weight: 600;
    color: var(--ds-ink);
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    border-radius: 4px;
}

.dropdown-menu__content li:hover {
    background-color: var(--ds-parchment-dark);
    color: var(--ds-ink-muted);
    border-radius: 4px;
}

.dropdown-menu--open .dropdown-menu__content {
    opacity: 1;
    pointer-events: auto;
}
</style>