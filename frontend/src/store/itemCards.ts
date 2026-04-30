import { defineStore } from 'pinia'
import { ItemCard } from './itemCard'

export type Layout = 'main' | 'grid'

export const useItemCardsStore = defineStore('itemCards', {
    state: () => ({
        items: [] as ItemCard[],
    }),
    actions: {
        setItems(items: ItemCard[]) {
            this.items = items
        }
    }
})