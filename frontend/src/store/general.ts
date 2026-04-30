import { defineStore } from 'pinia'

export type Layout = 'main' | 'grid'

export const useGeneralStore = defineStore('general', {
    state: () => ({
        selectedLayout: 'main' as Layout,
    }),
    actions: {
        setSelectedLayout(layout: Layout) {
            this.selectedLayout = layout
        },
    }
})