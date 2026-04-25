import { defineStore } from 'pinia'

export const useItemCardStore = defineStore('itemCard', {
  state: () => ({
    name: '',
    typeLine: '',
    description: '',
    footerText: '',
    artwork: '',
    rarity: '',
  }),
  actions: {
    setName(name: string) {
      this.name = name
    },
    setTypeLine(typeLine: string) {
      this.typeLine = typeLine
    },
    setDescription(description: string) {
      this.description = description
    },
    setFooterText(footerText: string) {
      this.footerText = footerText
    },
    setArtwork(artwork: string) {
      this.artwork = artwork
    },
    setRarity(rarity: string) {
      this.rarity = rarity
    }
  }
})