import { computed } from "vue"
import { useItemCardStore } from "../../../store/itemCard";
import { toBase64Src } from "../../../utils/toBase64Src";
import placeholderUrl from "../../../assets/images/placeholder.svg?url";

export const useCardData = (cardType: string) => {
    const itemCardStore = useItemCardStore();
    const name = computed(() => itemCardStore.name || 'Item Name')
    const typeLine = computed(() => itemCardStore.typeLine || 'Wondrous item')
    const description = computed(() => itemCardStore.description || '<p>This is a <b>cool</b> description of the item. Flavor text can run a few lines and stay readable on print.</p>')
    const footerText = computed(() => itemCardStore.footerText || 'D&amp;D 5e — item card (preview)')
    const rarity = computed(() => itemCardStore.rarity || 'common')
    const rarityClass = computed(() => `${cardType}__type-line--${rarity.value.replace(/\s+/g, '-')}`)

    const artSrc = computed(() => {
        if (!itemCardStore.artwork.includes('blob:')) {
            return toBase64Src(itemCardStore.artwork)
        }
        return itemCardStore.artwork || placeholderUrl
    })


    return {
        name,
        typeLine,
        description,
        footerText,
        rarity,
        rarityClass,
        artSrc,
    }
}