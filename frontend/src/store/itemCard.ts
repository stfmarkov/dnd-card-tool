import { defineStore } from 'pinia'
import { SaveCardData, UpdateCardData } from '../../wailsjs/go/main/App'
import { useGeneralStore } from './general'

const extFromFilename = (name: string): string => {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot).toLowerCase() : '.png'
}

export interface ItemCard {
  /** Set when row comes from GetCardData (for list keys) */
  id: string;
  name: string;
  typeLine: string;
  description: string;
  footerText: string;
  artwork: string;
  artworkSourceFile: File | null;
  rarity: string;
}

export const useItemCardStore = defineStore('itemCard', {
  state: (): ItemCard => ({
    id: '',
    name: '',
    typeLine: '',
    description: '',
    footerText: '',
    artwork: '',
    /** Last picked image file for save (hash + dedup on disk); cleared when artwork is cleared. */
    artworkSourceFile: null as File | null,
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
      if (!artwork) {
        this.artworkSourceFile = null
      }
    },
    setArtworkSourceFile(file: File | null) {
      this.artworkSourceFile = file
    },
    setRarity(rarity: string) {
      this.rarity = rarity
    },
    /** Clear all card fields; used from the OS / File / New card menu. */
    newCard() {
      console.log('newCard')
      this.id = ''
      this.name = 'Item Name'
      this.typeLine = 'Wondrous item'
      this.rarity = 'common'
      this.description = '<p>This is a <b>cool</b> description of the item. Flavor text can run a few lines and stay readable on print.</p>'
      this.footerText = 'D&amp;D 5e — item card (preview)'
      this.setArtwork('')
    },
    /**
     * Saves the current card. On the first save, appends a new row and stores the returned ID.
     * Subsequent saves update the same row via UpdateCardData so no duplicates are created.
     */
    async saveCard() {
      const generalStore = useGeneralStore()
      try {
        let imageBytes: number[] = []
        let imageExt = '.png'
        if (this.artworkSourceFile) {
          const buf = await this.artworkSourceFile.arrayBuffer()
          imageBytes = Array.from(new Uint8Array(buf))
          imageExt = extFromFilename(this.artworkSourceFile.name)
        } else if (this.artwork.startsWith('blob:')) {
          const buf = await fetch(this.artwork).then((r) => r.arrayBuffer())
          imageBytes = Array.from(new Uint8Array(buf))
          imageExt = '.png'
        }

        const payload = {
          name: this.name,
          typeLine: this.typeLine,
          description: this.description,
          footerText: this.footerText,
          rarity: this.rarity,
          artwork: '',
          imageBytes,
          imageExt,
        }

        if (this.id) {
          await UpdateCardData(this.id, payload)
        } else {
          const newId = await SaveCardData(payload)
          this.id = newId
        }

        generalStore.setToast({ title: 'Card saved', message: this.name || '', type: 'success' })
      } catch (e) {
        generalStore.setToast({ title: 'Save failed', message: String(e), type: 'error' })
      }
    },
  }
})