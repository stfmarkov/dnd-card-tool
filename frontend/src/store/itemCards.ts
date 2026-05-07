import { defineStore } from 'pinia'
import { ItemCard } from './itemCard'
import type { CardTemplate } from './itemCard'
import { DeleteCardData, DuplicateCardData, GetCardData } from '../../wailsjs/go/main/App'
import { useItemCardStore } from './itemCard'
import { useGeneralStore } from './general'

export type Layout = 'main' | 'grid'

interface Filter {
    property: string
    value: string
    comparison: "eq" | "gte" | "lte"
}

export const useItemCardsStore = defineStore('itemCards', {
    state: () => ({
        items: [] as ItemCard[],
    }),
    actions: {

        async getItems(search: string = '', filter: Filter[] = []) {



            const items = await GetCardData(search, filter)
            this.items = items.map(item => ({
                id: item.id,
                name: item.name,
                typeLine: item.typeLine,
                description: item.description,
                footerText: item.footerText,
                artwork: item.artwork,
                artworkSourceFile: null,
                rarity: item.rarity,
                template: (item.template as CardTemplate) || 'standart',
            }))
        },

        async duplicateItem(item: ItemCard) {
            const generalStore = useGeneralStore()
            try {
                await DuplicateCardData(item.id)
                await this.getItems()

                generalStore.setToast({ title: 'Card duplicated', message: item.name || '', type: 'success' })
            } catch (e) {
                generalStore.setToast({ title: 'Duplicate failed', message: String(e), type: 'error' })
            }
        },

        setItems(items: ItemCard[]) {
            this.items = items
        },
        deleteItem(item: ItemCard) {

            const currentItem = useItemCardStore()

            if (currentItem.id === item.id) {
                currentItem.newCard()
            }

            this.items = this.items.filter(i => i.id !== item.id)
            DeleteCardData(item.id)
        }
    }
})