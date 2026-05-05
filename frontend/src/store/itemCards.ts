import { defineStore } from 'pinia'
import { ItemCard } from './itemCard'
import { DeleteCardData } from '../../wailsjs/go/main/App'
import { useItemCardStore } from './itemCard'

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

            const currentItem = useItemCardStore()

            if(currentItem.id === item.id) {
                currentItem.newCard()
            }

            this.items = this.items.filter(i => i.id !== item.id)
            DeleteCardData(item.id)
        }
    }
})