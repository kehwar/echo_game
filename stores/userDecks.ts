/**
 * User Decks Store using Pinia
 * Manages custom user-created decks with localStorage persistence
 */
import { defineStore } from 'pinia'

export interface UserDeck {
  id: string
  name: string
  description: string
  locale: string
  cards: string[]
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
 * - Use // for multiline cards
 * - Use # for comments (ignored)
 * - Empty lines are ignored
 */
export function parseCards(text: string): string[] {
  const lines = text.split('\n')
  const cards: string[] = []
  let currentCard = ''

  for (let line of lines) {
    line = line.trim()

    // Skip comments and empty lines
    if (line.startsWith('#') || line.length === 0) {
      continue
    }

    // Check for multiline continuation
    if (line.endsWith('//')) {
      // Remove the // and add to current card
      currentCard += line.slice(0, -2).trim() + '\n'
    } else {
      // Complete the card
      if (currentCard) {
        currentCard += line
        cards.push(currentCard.trim())
        currentCard = ''
      } else {
        cards.push(line)
      }
    }
  }

  // Add any remaining card
  if (currentCard.trim()) {
    cards.push(currentCard.trim())
  }

  return cards.filter(card => card.length > 0)
}

/**
 * Format cards to text for editing
 */
export function formatCardsToText(cards: string[]): string {
  return cards.map(card => {
    // If card has newlines, add // to continue on next line
    if (card.includes('\n')) {
      const lines = card.split('\n')
      return lines.map((line, i) => i < lines.length - 1 ? line + ' //' : line).join('\n')
    }
    return card
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
    cloneDeck(sourceDeck: { name: string; description: string; locale: string; cards: string[] }): UserDeck {
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

      const yaml = `---
name: ${deck.name}
description: ${deck.description}
locale: ${deck.locale}
---

${deck.cards.join('\n')}
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
