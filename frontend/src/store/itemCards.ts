import { defineStore } from 'pinia'
import { ItemCard } from './itemCard'
import { DeleteCardData } from '../../wailsjs/go/main/App'

export type Layout = 'main' | 'grid'

export const useItemCardsStore = defineStore('itemCards', {
    state: () => ({
        items: [] as ItemCard[],
    }),
    actions: {
        setItems(items: ItemCard[]) {
            this.items = items
        },
        deleteItem(item: ItemCard) {
            this.items = this.items.filter(i => i.id !== item.id)
            DeleteCardData(item.id)
        }
    }
})