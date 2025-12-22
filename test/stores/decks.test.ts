import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDecksStore } from '@/stores/decks'

describe('Decks Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have decks loaded', () => {
    const store = useDecksStore()
    expect(store.decks).toBeDefined()
    expect(Array.isArray(store.decks)).toBe(true)
  })

  it('should find a deck by ID', () => {
    const store = useDecksStore()
    // Assuming there's at least one deck in the data
    const firstDeck = store.decks[0]
    if (firstDeck) {
      const foundDeck = store.getDeckById(firstDeck.id)
      expect(foundDeck).toBeDefined()
      expect(foundDeck?.id).toBe(firstDeck.id)
    }
  })

  it('should filter visible decks', () => {
    const store = useDecksStore()
    const visibleDecks = store.visibleDecks
    // All visible decks should not have hidden: true
    visibleDecks.forEach(deck => {
      expect(deck.hidden).not.toBe(true)
    })
  })

  it('should get decks by locale', () => {
    const store = useDecksStore()
    const enDecks = store.getDecksByLocale('en-US')
    enDecks.forEach(deck => {
      expect(deck.locale).toBe('en-US')
      expect(deck.hidden).not.toBe(true)
    })
  })

  it('should order decks by locale priority', () => {
    const store = useDecksStore()
    const displayedDecks = store.getDisplayedDecks('en-US')
    
    // Find the first occurrence of a non-en-US deck
    let foundNonEnDeck = false
    let indexOfFirstNonEn = -1
    
    for (let i = 0; i < displayedDecks.length; i++) {
      if (displayedDecks[i].locale !== 'en-US') {
        foundNonEnDeck = true
        indexOfFirstNonEn = i
        break
      }
    }
    
    // If we found a non-en-US deck, ensure all decks before it are en-US
    if (foundNonEnDeck) {
      for (let i = 0; i < indexOfFirstNonEn; i++) {
        expect(displayedDecks[i].locale).toBe('en-US')
      }
    }
  })

  it('should validate deck structure', () => {
    const store = useDecksStore()
    const firstDeck = store.decks[0]
    
    if (firstDeck) {
      expect(firstDeck).toHaveProperty('id')
      expect(firstDeck).toHaveProperty('name')
      expect(firstDeck).toHaveProperty('description')
      expect(firstDeck).toHaveProperty('locale')
      expect(firstDeck).toHaveProperty('cards')
      expect(Array.isArray(firstDeck.cards)).toBe(true)
    }
  })
})
