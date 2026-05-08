import { defineStore } from 'pinia'
import { SaveCardData, UpdateCardData } from '../../wailsjs/go/main/App'
import { useGeneralStore } from './general'

const extFromFilename = (name: string): string => {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot).toLowerCase() : '.png'
}

export type CardTemplate = 'standart' | 'minimalist' | 'scroll' | 'twosided'

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
  template: CardTemplate;
}

interface ItemCardState extends ItemCard {
  isSaved: boolean;
}

export const useItemCardStore = defineStore('itemCard', {
  state: (): ItemCardState => ({
    id: '',
    name: '',
    typeLine: '',
    description: '',
    footerText: '',
    artwork: '',
    /** Last picked image file for save (hash + dedup on disk); cleared when artwork is cleared. */
    artworkSourceFile: null as File | null,
    rarity: '',
    template: 'standart',

    isSaved: true,
  }),
  actions: {
    setName(name: string) {
      this.name = name
      this.setIsSaved(false)
    },
    setTypeLine(typeLine: string) {
      this.typeLine = typeLine
      this.setIsSaved(false)
    },
    setDescription(description: string) {
      this.description = description
      this.setIsSaved(false)
    },
    setFooterText(footerText: string) {
      this.footerText = footerText
      this.setIsSaved(false)
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
      this.setIsSaved(false)
    },
    setArtworkSourceFile(file: File | null) {
      this.artworkSourceFile = file
      this.setIsSaved(false)
    },
    setRarity(rarity: string) {
      this.rarity = rarity
      this.setIsSaved(false)
    },
    setTemplate(template: CardTemplate) {
      this.template = template
      this.setIsSaved(false)
    },
    setIsSaved(isSaved: boolean) {
      this.isSaved = isSaved
    },
    setSelectedItem(item: ItemCard) {
      this.id = item.id
      this.name = item.name
      this.typeLine = item.typeLine
      this.rarity = item.rarity
      this.description = item.description
      this.footerText = item.footerText
      this.artwork = item.artwork
      this.artworkSourceFile = null
      this.template = (item.template as CardTemplate) || 'standart'
      this.setIsSaved(true)
    },
    /** Clear all card fields; used from the OS / File / New card menu. */
    newCard() {
      this.id = ''
      this.name = 'Item Name'
      this.typeLine = 'generic'
      this.rarity = 'common'
      this.description = '<p>This is a <b>cool</b> description of the item. Flavor text can run a few lines and stay readable on print.</p>'
      this.footerText = 'D&amp;D 5e — item card (preview)'
      this.template = 'standart'
      this.setArtwork('')
      this.setIsSaved(false)
    },
    /**
     * Saves the current card. On the first save, appends a new row and stores the returned ID.
     * Subsequent saves update the same row via UpdateCardData so no duplicates are created.
     */
    async saveCard() {
      const generalStore = useGeneralStore()

      // Snapshot all reactive state immediately — before any await — so that
      // navigating to a different card while the async work is in-flight
      // cannot mix this card's image bytes with the next card's metadata/id.
      const snapId = this.id
      const snapName = this.name
      const snapTypeLine = this.typeLine
      const snapDescription = this.description
      const snapFooterText = this.footerText
      const snapRarity = this.rarity
      const snapSourceFile = this.artworkSourceFile
      const snapArtwork = this.artwork
      const snapTemplate = this.template

      try {
        let imageBytes: number[] = []
        let imageExt = '.png'
        if (snapSourceFile) {
          const buf = await snapSourceFile.arrayBuffer()
          imageBytes = Array.from(new Uint8Array(buf))
          imageExt = extFromFilename(snapSourceFile.name)
        } else if (snapArtwork.startsWith('blob:')) {
          const buf = await fetch(snapArtwork).then((r) => r.arrayBuffer())
          imageBytes = Array.from(new Uint8Array(buf))
          imageExt = '.png'
        }

        const payload = {
          name: snapName,
          typeLine: snapTypeLine,
          description: snapDescription,
          footerText: snapFooterText,
          rarity: snapRarity,
          template: snapTemplate,
          artwork: '',
          imageBytes,
          imageExt,
        }

        if (snapId) {
          await UpdateCardData(snapId, payload)
        } else {
          const newId = await SaveCardData(payload)
          // Only write back the id if the user hasn't switched to a different
          // card while this save was in-flight.
          if (!this.id) this.id = newId
        }

        this.artworkSourceFile = null
        generalStore.setToast({ title: 'Card saved', message: snapName || '', type: 'success' })
        this.setIsSaved(true)
      } catch (e) {
        generalStore.setToast({ title: 'Save failed', message: String(e), type: 'error' })
      }
    }
  }
})