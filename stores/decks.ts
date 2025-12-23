/**
 * Decks Store using Pinia
 * Manages deck data centrally
 */
import { defineStore } from 'pinia'
import { decks as decksData } from '@/data/decks'
import { useUserDecksStore } from './userDecks'

export interface Deck {
  id: string
  name: string
  description: string
  locale: string
  cards: string[]
  extends?: string | string[]
  hidden?: boolean
  isUserDeck?: boolean
}

export const useDecksStore = defineStore('decks', {
  state: () => ({
    decks: decksData as Deck[],
  }),

  getters: {
    /**
     * Get all decks (system + user decks)
     */
    allDecks: (state) => {
      const userDecksStore = useUserDecksStore()
      return [...state.decks, ...userDecksStore.decks]
    },

    /**
     * Get visible decks (not hidden, including user decks)
     */
    visibleDecks() {
      const userDecksStore = useUserDecksStore()
      return [...this.decks.filter(d => !d.hidden), ...userDecksStore.decks]
    },

    /**
     * Find a deck by ID (checks both system and user decks)
     */
    getDeckById() {
      return (id: string) => {
        const userDecksStore = useUserDecksStore()
        return this.decks.find(d => d.id === id) || userDecksStore.getDeckById(id)
      }
    },

    /**
     * Get decks for a specific locale (including user decks)
     */
    getDecksByLocale() {
      return (locale: string) => {
        const userDecksStore = useUserDecksStore()
        const systemDecks = this.decks.filter(d => d.locale === locale && !d.hidden)
        const userDecks = userDecksStore.decks.filter(d => d.locale === locale)
        return [...systemDecks, ...userDecks]
      }
    },

    /**
     * Get decks sorted by locale priority (including user decks)
     */
    getDisplayedDecks() {
      return (currentLocale: string, deckLocaleFilter = 'auto') => {
        const userDecksStore = useUserDecksStore()
        const allDecks = [...this.decks, ...userDecksStore.decks]
        
        // Determine which locale to use for filtering
        const filterLocale = deckLocaleFilter === 'auto' ? currentLocale : deckLocaleFilter

        // If deckLocaleFilter is 'auto', show current locale first, then others
        if (deckLocaleFilter === 'auto') {
          // Separate decks by locale and filter out hidden decks
          const currentLocaleDecks = allDecks.filter(
            d => d.locale === currentLocale && !d.hidden
          )
          const otherLocaleDecks = allDecks.filter(
            d => d.locale !== currentLocale && !d.hidden
          )

          // Return current locale decks first, followed by other locales
          return [...currentLocaleDecks, ...otherLocaleDecks]
        } else {
          // Only show decks matching the selected locale
          return allDecks.filter(
            d => d.locale === filterLocale && !d.hidden
          )
        }
      }
    },

    /**
     * Get available deck locales (including user decks)
     */
    availableDeckLocales() {
      const userDecksStore = useUserDecksStore()
      const allDecks = [...this.decks, ...userDecksStore.decks]
      const locales = new Set(allDecks.filter(d => !d.hidden).map(d => d.locale))
      return Array.from(locales).sort()
    },
  },
})
