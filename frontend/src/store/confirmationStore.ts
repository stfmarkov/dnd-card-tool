import { defineStore } from 'pinia'

export type ConfirmationType = 'info' | 'warning' | 'error'

type ConfirmationState = {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: ConfirmationType;
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const useConfirmationStore = defineStore('confirmation', {
    state: (): ConfirmationState => ({
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        type: 'info',
        show: false,
        onConfirm: () => { },
        onCancel: () => { }
    }),
    actions: {
        setConfirmation(confirmation: ConfirmationState) {
            this.title = confirmation.title
            this.message = confirmation.message;
            this.confirmText = confirmation.confirmText;
            this.cancelText = confirmation.cancelText;
            this.type = confirmation.type;
            this.show = true;
            this.onConfirm = () => {
                confirmation.onConfirm();
                this.hideConfirmation();
            };
            this.onCancel = () => {
                confirmation.onCancel();
                this.hideConfirmation();
            };
        },
        hideConfirmation() {
            this.show = false
        }
    }
})