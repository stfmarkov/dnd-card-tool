import { defineStore } from 'pinia'

export type Layout = 'main' | 'grid'

export type Toast = {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export type ToastWithDuration = Toast & { duration: number }

type GeneralState = {
    selectedLayout: Layout;
    toast: ToastWithDuration | null;
}

export const useGeneralStore = defineStore('general', {
    state: (): GeneralState => ({
        selectedLayout: 'main',
        toast: null
    }),
    actions: {
        setSelectedLayout(layout: Layout) {
            this.selectedLayout = layout
        },
        setToast(toast: Toast | null, duration: number = 3000) {
            this.toast = toast ? { ...toast, duration } : null
        },
    }
})