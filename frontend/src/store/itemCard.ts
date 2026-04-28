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
    /** Replace artwork URL; revokes a previous `blob:` URL so the WebView can release the file. */
    setArtwork(artwork: string) {
      if (this.artwork && this.artwork.startsWith('blob:')) {
        URL.revokeObjectURL(this.artwork)
      }
      this.artwork = artwork
    },
    setRarity(rarity: string) {
      this.rarity = rarity
    },
    /** Clear all card fields; used from the OS / File / New card menu. */
    newCard() {
      console.log('newCard')
      this.name = 'Item Name'
      this.typeLine = 'Wondrous item'
      this.rarity = 'common'
      this.description = '<p>This is a <b>cool</b> description of the item. Flavor text can run a few lines and stay readable on print.</p>'
      this.footerText = 'D&amp;D 5e — item card (preview)'
      this.setArtwork('')
    },
  }
})