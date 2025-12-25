/**
 * User Decks Store using Pinia
 * Manages custom user-created decks with localStorage persistence
 */
import { defineStore } from 'pinia'
import type { Card } from '@/data/decks'

export interface UserDeck {
  id: string
  name: string
  description: string
  locale: string
  cards: Card[]
  createdAt: string
  updatedAt: string
  isUserDeck: true
}

export interface UserDeckInput {
  name: string
  description: string
  locale: string
  cardsText: string
}

/**
 * Parse cards from text input
 * - One card per line
 * - Use "Text // Subtext" for cards with subtext (creates CardContent object)
 * - Use # for comments (ignored)
 * - Empty lines are ignored
 */
export function parseCards(text: string): Card[] {
  const lines = text.split('\n')
  const cards: Card[] = []

  for (let line of lines) {
    line = line.trim()

    // Skip comments
    if (line.startsWith('#')) {
      continue
    }

    // Skip empty lines
    if (line.length === 0) {
      continue
    }

    // Check if line contains // (inline separator for subtext)
    if (line.includes('//')) {
      const separatorIndex = line.indexOf('//')
      const text = line.substring(0, separatorIndex).trim()
      const subtext = line.substring(separatorIndex + 2).trim()
      
      if (text && subtext) {
        // Create CardContent object
        cards.push({ text, subtext })
      } else if (text) {
        // No subtext, just add text as string
        cards.push(text)
      }
      continue
    }

    // Regular line - single line card
    if (line.length > 0) {
      cards.push(line)
    }
  }

  return cards.filter(card => {
    if (typeof card === 'string') {
      return card.length > 0
    }
    return card.text.length > 0
  })
}

/**
 * Format cards to text for editing
 */
export function formatCardsToText(cards: Card[]): string {
  return cards.map(card => {
    // Handle CardContent objects
    if (typeof card === 'object' && 'text' in card) {
      return card.subtext ? `${card.text} // ${card.subtext}` : card.text
    }
    
    // Handle string cards
    if (typeof card === 'string') {
      return card
    }
    
    return ''
  }).join('\n')
}

const STORAGE_KEY = 'echo_game_user_decks'

export const useUserDecksStore = defineStore('userDecks', {
  state: () => ({
    decks: [] as UserDeck[],
  }),

  actions: {
    /**
     * Load decks from localStorage
     */
    loadDecks() {
      if (typeof window === 'undefined') return

      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          this.decks = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Failed to load user decks:', error)
        this.decks = []
      }
    },

    /**
     * Save decks to localStorage
     */
    saveDecks() {
      if (typeof window === 'undefined') return

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.decks))
      } catch (error) {
        console.error('Failed to save user decks:', error)
      }
    },

    /**
     * Create a new user deck
     */
    createDeck(input: UserDeckInput): UserDeck {
      const now = new Date().toISOString()
      const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

      const deck: UserDeck = {
        id,
        name: input.name,
        description: input.description,
        locale: input.locale,
        cards: parseCards(input.cardsText),
        createdAt: now,
        updatedAt: now,
        isUserDeck: true,
      }

      this.decks.push(deck)
      this.saveDecks()
      return deck
    },

    /**
     * Update an existing user deck
     */
    updateDeck(id: string, input: UserDeckInput): UserDeck | null {
      const index = this.decks.findIndex(d => d.id === id)
      if (index === -1) return null

      const deck = this.decks[index]
      deck.name = input.name
      deck.description = input.description
      deck.locale = input.locale
      deck.cards = parseCards(input.cardsText)
      deck.updatedAt = new Date().toISOString()

      this.saveDecks()
      return deck
    },

    /**
     * Delete a user deck
     */
    deleteDeck(id: string): boolean {
      const index = this.decks.findIndex(d => d.id === id)
      if (index === -1) return false

      this.decks.splice(index, 1)
      this.saveDecks()
      return true
    },

    /**
     * Get a user deck by ID
     */
    getDeckById(id: string): UserDeck | undefined {
      return this.decks.find(d => d.id === id)
    },

    /**
     * Clone a system deck to create a user deck
     */
    cloneDeck(sourceDeck: { name: string; description: string; locale: string; cards: Card[] }): UserDeck {
      const now = new Date().toISOString()
      const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

      const deck: UserDeck = {
        id,
        name: `${sourceDeck.name} (Copy)`,
        description: sourceDeck.description,
        locale: sourceDeck.locale,
        cards: [...sourceDeck.cards],
        createdAt: now,
        updatedAt: now,
        isUserDeck: true,
      }

      this.decks.push(deck)
      this.saveDecks()
      return deck
    },

    /**
     * Export a deck to YAML format
     */
    exportDeck(id: string): string | null {
      const deck = this.getDeckById(id)
      if (!deck) return null

      // Format cards for export
      const cardsText = formatCardsToText(deck.cards)

      const yaml = `---
name: ${deck.name}
description: ${deck.description}
locale: ${deck.locale}
---

${cardsText}
`
      return yaml
    },

    /**
     * Import a deck from YAML format
     */
    importDeck(yamlContent: string): UserDeck | null {
      try {
        // Simple YAML parsing for our use case
        const lines = yamlContent.split('\n')
        let inFrontmatter = false
        const frontmatterData: Record<string, string> = {}
        let cardsText = ''

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]

          if (line.trim() === '---') {
            if (!inFrontmatter) {
              inFrontmatter = true
            } else {
              inFrontmatter = false
            }
            continue
          }

          if (inFrontmatter) {
            const match = line.match(/^(\w+):\s*(.+)$/)
            if (match) {
              frontmatterData[match[1]] = match[2]
            }
          } else if (!inFrontmatter && line.trim() !== '---') {
            cardsText += line + '\n'
          }
        }

        const input: UserDeckInput = {
          name: frontmatterData.name || 'Imported Deck',
          description: frontmatterData.description || '',
          locale: frontmatterData.locale || 'en-US',
          cardsText: cardsText.trim(),
        }

        return this.createDeck(input)
      } catch (error) {
        console.error('Failed to import deck:', error)
        return null
      }
    },
  },
})
