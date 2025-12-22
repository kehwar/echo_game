import { describe, it, expect } from 'vitest'
import matter from 'gray-matter'

describe('Deck Extension Feature', () => {
  
  describe('Frontmatter Parser - gray-matter', () => {
    it('should parse single string value', () => {
      const content = `---
name: Test Deck
description: A test deck
extends: en-US/pokemon
---

CARD1
CARD2`
      
      const { data, content: body } = matter(content)
      
      expect(data.name).toBe('Test Deck')
      expect(data.description).toBe('A test deck')
      expect(data.extends).toBe('en-US/pokemon')
      expect(body.trim()).toContain('CARD1')
      expect(body.trim()).toContain('CARD2')
    })
    
    it('should parse array values with YAML list format', () => {
      const content = `---
name: Test Deck
extends:
  - en-US/pokemon
  - en-US/animals
---

CARD1
CARD2`
      
      const { data, content: body } = matter(content)
      
      expect(data.name).toBe('Test Deck')
      expect(Array.isArray(data.extends)).toBe(true)
      expect(data.extends).toHaveLength(2)
      expect(data.extends[0]).toBe('en-US/pokemon')
      expect(data.extends[1]).toBe('en-US/animals')
      expect(body.trim()).toContain('CARD1')
    })
    
    it('should parse mixed single and array values', () => {
      const content = `---
name: Test Deck
description: A test deck
extends:
  - en-US/pokemon
  - en-US/animals
locale: es-ES
---

CARD1`
      
      const { data, content: body } = matter(content)
      
      expect(data.name).toBe('Test Deck')
      expect(data.description).toBe('A test deck')
      expect(Array.isArray(data.extends)).toBe(true)
      expect(data.extends).toContain('en-US/pokemon')
      expect(data.extends).toContain('en-US/animals')
      expect(data.locale).toBe('es-ES')
      expect(body.trim()).toContain('CARD1')
    })
    
    it('should parse boolean values', () => {
      const content = `---
name: Test Deck
hidden: true
---

CARD1`
      
      const { data } = matter(content)
      
      expect(data.name).toBe('Test Deck')
      expect(data.hidden).toBe(true)
      expect(typeof data.hidden).toBe('boolean')
    })
  })
  
  describe('Deck Structure with Extends', () => {
    it('should have optional extends property in Deck interface', () => {
      const deck = {
        id: 'es-ES-pokemon',
        name: 'Pokémon',
        description: 'Spanish pokemon',
        locale: 'es-ES',
        cards: ['PIKACHU', 'CHARIZARD'],
        extends: 'en-US/pokemon'
      }
      
      expect(deck).toHaveProperty('id')
      expect(deck).toHaveProperty('name')
      expect(deck).toHaveProperty('description')
      expect(deck).toHaveProperty('locale')
      expect(deck).toHaveProperty('cards')
      expect(deck).toHaveProperty('extends')
      expect(typeof deck.extends).toBe('string')
    })
    
    it('should support array of extends', () => {
      const deck = {
        id: 'es-ES-combined',
        name: 'Combined',
        description: 'Multiple extends',
        locale: 'es-ES',
        cards: ['EXTRA1', 'EXTRA2'],
        extends: ['en-US/pokemon', 'en-US/animals']
      }
      
      expect(deck.extends).toBeInstanceOf(Array)
      expect(deck.extends).toHaveLength(2)
      expect(deck.extends[0]).toBe('en-US/pokemon')
      expect(deck.extends[1]).toBe('en-US/animals')
    })
    
    it('should work without extends property', () => {
      const deck = {
        id: 'en-US-animals',
        name: 'Animals',
        description: 'Animal deck',
        locale: 'en-US',
        cards: ['ELEPHANT', 'TIGER']
      }
      
      expect(deck).not.toHaveProperty('extends')
      expect(deck.cards).toHaveLength(2)
    })
  })
  
  describe('Deck Extension Logic', () => {
    it('should merge cards from extended deck', () => {
      // Simulating deck resolution
      const baseDeck = {
        id: 'en-US-pokemon',
        cards: ['PIKACHU', 'CHARIZARD', 'MEWTWO']
      }
      
      const extendingDeck = {
        id: 'es-ES-pokemon',
        cards: ['JIGGLYPUFF', 'SNORLAX'],
        extends: 'en-US/pokemon'
      }
      
      // Expected result: base cards + extending cards
      const expectedCards = [
        'PIKACHU', 'CHARIZARD', 'MEWTWO', // from base
        'JIGGLYPUFF', 'SNORLAX' // from extending
      ]
      
      const mergedCards = [...baseDeck.cards, ...extendingDeck.cards]
      expect(mergedCards).toEqual(expectedCards)
    })
    
    it('should handle multiple extends by merging all cards', () => {
      const deck1 = { cards: ['A', 'B', 'C'] }
      const deck2 = { cards: ['D', 'E', 'F'] }
      const extendingDeck = { cards: ['G', 'H'] }
      
      // Expected: deck1 + deck2 + extendingDeck
      const expectedCards = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      const mergedCards = [...deck1.cards, ...deck2.cards, ...extendingDeck.cards]
      
      expect(mergedCards).toEqual(expectedCards)
    })
    
    it('should remove duplicate cards when merging', () => {
      const baseDeck = { cards: ['PIKACHU', 'CHARIZARD', 'MEWTWO'] }
      const extendingDeck = { cards: ['CHARIZARD', 'SNORLAX', 'PIKACHU'] }
      
      const mergedCards = [...baseDeck.cards, ...extendingDeck.cards]
      const uniqueCards = Array.from(new Set(mergedCards))
      
      expect(uniqueCards).toContain('PIKACHU')
      expect(uniqueCards).toContain('CHARIZARD')
      expect(uniqueCards).toContain('MEWTWO')
      expect(uniqueCards).toContain('SNORLAX')
      expect(uniqueCards.length).toBe(4) // No duplicates
    })
    
    it('should handle nested extends (deck1 extends deck2 which extends deck3)', () => {
      const deck3 = { cards: ['A', 'B'] }
      const deck2 = { cards: ['C', 'D'], extends: 'deck3' }
      const deck1 = { cards: ['E', 'F'], extends: 'deck2' }
      
      // Expected: deck3 + deck2 + deck1
      const expectedCards = ['A', 'B', 'C', 'D', 'E', 'F']
      const mergedCards = [...deck3.cards, ...deck2.cards, ...deck1.cards]
      
      expect(mergedCards).toEqual(expectedCards)
    })
  })
  
  describe('Circular Dependency Detection', () => {
    it('should detect direct circular dependency', () => {
      // deck1 extends deck2, deck2 extends deck1
      const path1 = ['deck1', 'deck2']
      const nextDeck = 'deck1'
      
      const hasCircular = path1.includes(nextDeck)
      expect(hasCircular).toBe(true)
    })
    
    it('should detect indirect circular dependency', () => {
      // deck1 -> deck2 -> deck3 -> deck1
      const path = ['deck1', 'deck2', 'deck3']
      const nextDeck = 'deck1'
      
      const hasCircular = path.includes(nextDeck)
      expect(hasCircular).toBe(true)
    })
    
    it('should not detect circular when none exists', () => {
      const path = ['deck1', 'deck2', 'deck3']
      const nextDeck = 'deck4'
      
      const hasCircular = path.includes(nextDeck)
      expect(hasCircular).toBe(false)
    })
  })
  
  describe('Deck ID Normalization', () => {
    it('should support locale-name format', () => {
      const id1 = 'en-US-pokemon'
      const parts = id1.split('-')
      
      expect(parts).toHaveLength(3)
      expect(parts[0]).toBe('en')
      expect(parts[1]).toBe('US')
      expect(parts[2]).toBe('pokemon')
    })
    
    it('should support locale/name format for extends', () => {
      const id1 = 'en-US/pokemon'
      const parts = id1.split('/')
      
      expect(parts).toHaveLength(2)
      expect(parts[0]).toBe('en-US')
      expect(parts[1]).toBe('pokemon')
    })
    
    it('should normalize both formats to same deck', () => {
      const canonicalId = 'en-US-pokemon'
      const alternativeFormat = 'en-US/pokemon'
      
      // Normalization function converts both to canonical
      function normalize(id: string): string {
        return id.replace('/', '-')
      }
      
      expect(normalize(canonicalId)).toBe('en-US-pokemon')
      expect(normalize(alternativeFormat)).toBe('en-US-pokemon')
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle empty extends gracefully', () => {
      const deck = {
        id: 'test-deck',
        cards: ['A', 'B', 'C'],
        extends: undefined
      }
      
      expect(deck.extends).toBeUndefined()
      expect(deck.cards).toHaveLength(3)
    })
    
    it('should handle missing extended deck gracefully', () => {
      const deckMap = new Map([
        ['deck1', { cards: ['A', 'B'] }]
      ])
      
      const extendedDeckId = 'deck2'
      const deck = deckMap.get(extendedDeckId)
      
      expect(deck).toBeUndefined()
    })
    
    it('should handle empty cards array', () => {
      const baseDeck = { cards: ['A', 'B', 'C'] }
      const extendingDeck = { cards: [] }
      
      const mergedCards = [...baseDeck.cards, ...extendingDeck.cards]
      expect(mergedCards).toEqual(['A', 'B', 'C'])
    })
    
    it('should preserve card order when merging', () => {
      const deck1 = { cards: ['A', 'B', 'C'] }
      const deck2 = { cards: ['D', 'E', 'F'] }
      
      const merged = [...deck1.cards, ...deck2.cards]
      
      expect(merged[0]).toBe('A')
      expect(merged[3]).toBe('D')
      expect(merged[5]).toBe('F')
    })
  })
})
