import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserDecksStore, parseCards, formatCardsToText } from '@/stores/userDecks'

describe('UserDecks Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('parseCards', () => {
    it('should parse single line cards', () => {
      const text = 'Card 1\nCard 2\nCard 3'
      const result = parseCards(text)
      expect(result).toEqual(['Card 1', 'Card 2', 'Card 3'])
    })

    it('should skip empty lines', () => {
      const text = 'Card 1\n\nCard 2\n\n\nCard 3'
      const result = parseCards(text)
      expect(result).toEqual(['Card 1', 'Card 2', 'Card 3'])
    })

    it('should skip comment lines starting with #', () => {
      const text = 'Card 1\n# This is a comment\nCard 2\n# Another comment\nCard 3'
      const result = parseCards(text)
      expect(result).toEqual(['Card 1', 'Card 2', 'Card 3'])
    })

    it('should parse multiline cards with // at end of line', () => {
      const text = 'Text //\nSubtext'
      const result = parseCards(text)
      expect(result).toEqual(['Text\nSubtext'])
    })

    it('should parse multiline cards with // inline separator', () => {
      const text = 'Text // Subtext'
      const result = parseCards(text)
      expect(result).toEqual(['Text', 'Subtext'])
    })

    it('should handle // inline separator with continuation', () => {
      const text = 'Text // Subtext\nMore text'
      const result = parseCards(text)
      expect(result).toEqual(['Text', 'Subtext\nMore text'])
    })

    it('should handle multiple // separators', () => {
      const text = 'Card 1 // Card 2 // Card 3'
      const result = parseCards(text)
      expect(result).toEqual(['Card 1', 'Card 2', 'Card 3'])
    })

    it('should handle mixed inline and end-of-line separators', () => {
      const text = 'Card 1 // Card 2 //\nCard 2 continued'
      const result = parseCards(text)
      expect(result).toEqual(['Card 1', 'Card 2\nCard 2 continued'])
    })

    it('should handle complex multiline card with // at end', () => {
      const text = 'Line 1 //\nLine 2 //\nLine 3'
      const result = parseCards(text)
      expect(result).toEqual(['Line 1\nLine 2\nLine 3'])
    })

    it('should trim whitespace from cards', () => {
      const text = '  Card 1  \n  Card 2  \n  Card 3  '
      const result = parseCards(text)
      expect(result).toEqual(['Card 1', 'Card 2', 'Card 3'])
    })

    it('should trim whitespace around // separator', () => {
      const text = 'Text   //   Subtext'
      const result = parseCards(text)
      expect(result).toEqual(['Text', 'Subtext'])
    })

    it('should handle // with no text after (end of line)', () => {
      const text = 'Text //\n\nSubtext'
      const result = parseCards(text)
      expect(result).toEqual(['Text\nSubtext'])
    })

    it('should handle empty card text gracefully', () => {
      const text = ''
      const result = parseCards(text)
      expect(result).toEqual([])
    })

    it('should handle only comments and empty lines', () => {
      const text = '# Comment 1\n\n# Comment 2\n\n'
      const result = parseCards(text)
      expect(result).toEqual([])
    })
  })

  describe('formatCardsToText', () => {
    it('should format single line cards', () => {
      const cards = ['Card 1', 'Card 2', 'Card 3']
      const result = formatCardsToText(cards)
      expect(result).toBe('Card 1\nCard 2\nCard 3')
    })

    it('should format multiline cards with //', () => {
      const cards = ['Text\nSubtext']
      const result = formatCardsToText(cards)
      expect(result).toBe('Text //\nSubtext')
    })

    it('should format multiline cards with multiple lines', () => {
      const cards = ['Line 1\nLine 2\nLine 3']
      const result = formatCardsToText(cards)
      expect(result).toBe('Line 1 //\nLine 2 //\nLine 3')
    })

    it('should handle mixed single and multiline cards', () => {
      const cards = ['Card 1', 'Text\nSubtext', 'Card 2']
      const result = formatCardsToText(cards)
      expect(result).toBe('Card 1\nText //\nSubtext\nCard 2')
    })
  })

  describe('UserDecks Store', () => {
    it('should create a new deck', () => {
      const store = useUserDecksStore()
      const deck = store.createDeck({
        name: 'Test Deck',
        description: 'Test Description',
        locale: 'en-US',
        cardsText: 'Card 1\nCard 2\nCard 3',
      })

      expect(deck).toBeDefined()
      expect(deck.name).toBe('Test Deck')
      expect(deck.cards).toEqual(['Card 1', 'Card 2', 'Card 3'])
    })

    it('should create a deck with multiline cards using inline //', () => {
      const store = useUserDecksStore()
      const deck = store.createDeck({
        name: 'Multiline Deck',
        description: 'Test multiline cards',
        locale: 'en-US',
        cardsText: 'Text // Subtext',
      })

      expect(deck.cards).toEqual(['Text', 'Subtext'])
    })

    it('should create a deck with multiline cards using end-of-line //', () => {
      const store = useUserDecksStore()
      const deck = store.createDeck({
        name: 'Multiline Deck',
        description: 'Test multiline cards',
        locale: 'en-US',
        cardsText: 'Text //\nSubtext',
      })

      expect(deck.cards).toEqual(['Text\nSubtext'])
    })

    it('should update an existing deck', () => {
      const store = useUserDecksStore()
      const deck = store.createDeck({
        name: 'Original Deck',
        description: 'Original Description',
        locale: 'en-US',
        cardsText: 'Card 1\nCard 2',
      })

      const updated = store.updateDeck(deck.id, {
        name: 'Updated Deck',
        description: 'Updated Description',
        locale: 'en-US',
        cardsText: 'Card A // Card B',
      })

      expect(updated).toBeDefined()
      expect(updated?.name).toBe('Updated Deck')
      expect(updated?.cards).toEqual(['Card A', 'Card B'])
    })

    it('should delete a deck', () => {
      const store = useUserDecksStore()
      const deck = store.createDeck({
        name: 'Deck to Delete',
        description: 'Test',
        locale: 'en-US',
        cardsText: 'Card 1',
      })

      const result = store.deleteDeck(deck.id)
      expect(result).toBe(true)
      expect(store.getDeckById(deck.id)).toBeUndefined()
    })

    it('should get a deck by ID', () => {
      const store = useUserDecksStore()
      const deck = store.createDeck({
        name: 'Find Me',
        description: 'Test',
        locale: 'en-US',
        cardsText: 'Card 1',
      })

      const found = store.getDeckById(deck.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(deck.id)
    })
  })
})
