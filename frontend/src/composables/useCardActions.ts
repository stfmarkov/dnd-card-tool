import { printCard } from '../utils/printCard';
import { useItemCardStore } from '../store/itemCard';
import { useGeneralStore } from '../store/general';
import { useConfirmationStore } from '../store/confirmationStore';

export const useCardActions = () => {
    const itemCardStore = useItemCardStore();
    const generalStore = useGeneralStore();
    const confirmationStore = useConfirmationStore();

    const exportCard = async () => {
        try {
            await printCard('.item-card__card', `${itemCardStore.name}-${itemCardStore.typeLine}-${itemCardStore.rarity}`)
        } catch (e) {
            generalStore.setToast({ title: 'Export failed', message: String(e), type: 'error' })
        }
    }

    const newCard = () => {
        const execute = () => {
            itemCardStore.newCard();
            generalStore.setSelectedLayout('main');
        }

        if (!itemCardStore.isSaved) {
            confirmationStore.setConfirmation({
                title: 'Unsaved changes',
                message: 'You have unsaved changes. Are you sure you want to create a new card?',
                onConfirm: execute,
                onCancel: () => { },
                type: 'warning',
                show: true,
                confirmText: 'Create new card',
                cancelText: 'Cancel',
            });
        } else {
            execute();
        }
    }

    const saveCard = async () => {
        const execute = async () => {
            try {
                await itemCardStore.saveCard();
                generalStore.setToast({ title: 'Card saved', message: 'Card saved successfully', type: 'success' })
            } catch (e) {
                generalStore.setToast({ title: 'Save failed', message: String(e), type: 'error' })
            }
        }

        const isNew = !itemCardStore.id;
        if (!isNew) {
            execute();
        } else {
            confirmationStore.setConfirmation({
                title: 'New card',
                message: 'Are you sure you want to continue? This action will create a card',
                onConfirm: execute,
                onCancel: () => { },
                type: 'warning',
                show: true,
                confirmText: 'Save card',
                cancelText: 'Cancel',
            });
        }
    }

    return { exportCard, newCard, saveCard }
}
