/**
 * Decks Store using Pinia
 * Manages deck data centrally
 */
import { defineStore } from 'pinia'
import { decks as decksData } from '@/data/decks'

export interface Deck {
  id: string
  name: string
  description: string
  locale: string
  cards: string[]
  extends?: string | string[]
  hidden?: boolean
}

export const useDecksStore = defineStore('decks', {
  state: () => ({
    decks: decksData as Deck[],
  }),

  getters: {
    /**
     * Get all decks
     */
    allDecks: (state) => state.decks,

    /**
     * Get visible decks (not hidden)
     */
    visibleDecks: (state) => state.decks.filter(d => !d.hidden),

    /**
     * Find a deck by ID
     */
    getDeckById: (state) => (id: string) => {
      return state.decks.find(d => d.id === id)
    },

    /**
     * Get decks for a specific locale
     */
    getDecksByLocale: (state) => (locale: string) => {
      return state.decks.filter(d => d.locale === locale && !d.hidden)
    },

    /**
     * Get decks sorted by locale priority
     */
    getDisplayedDecks: (state) => (currentLocale: string) => {
      // Separate decks by locale and filter out hidden decks
      const currentLocaleDecks = state.decks.filter(
        d => d.locale === currentLocale && !d.hidden
      )
      const otherLocaleDecks = state.decks.filter(
        d => d.locale !== currentLocale && !d.hidden
      )

      // Return current locale decks first, followed by other locales
      return [...currentLocaleDecks, ...otherLocaleDecks]
    },
  },
})
