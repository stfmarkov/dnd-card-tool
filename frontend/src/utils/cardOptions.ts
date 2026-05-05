import type { SelectOption } from '../components/utils/Select.vue'

export const rarityOptions: SelectOption[] = [
    { label: 'Common', value: 'common' },
    { label: 'Uncommon', value: 'uncommon' },
    { label: 'Rare', value: 'rare' },
    { label: 'Very Rare', value: 'very rare' },
    { label: 'Legendary', value: 'legendary' },
    { label: 'Artifact', value: 'artifact' },
]

export const typeOptions: SelectOption[] = [
    { label: 'Generic', value: 'generic' },
    { label: 'Armor', value: 'armor' },
    { label: 'Potion', value: 'potion' },
    { label: 'Ring', value: 'ring' },
    { label: 'Rod', value: 'rod' },
    { label: 'Scroll', value: 'scroll' },
    { label: 'Staff', value: 'staff' },
    { label: 'Wand', value: 'wand' },
    { label: 'Weapon', value: 'weapon' },
    { label: 'Wondrous Item', value: 'wondrous item' },
]
