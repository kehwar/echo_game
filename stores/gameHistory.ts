/**
 * Game History Store using Pinia
 * Manages game history in localStorage
 */
import { defineStore } from 'pinia'

export interface GameRecord {
  id: string
  deckId: string
  deckName: string
  startDateTime: string // ISO 8601 format
  duration: number // in seconds
  correctWords: string[]
  skippedWords: string[]
  accuracy: number // percentage (0-100)
}

const STORAGE_KEY = 'echo-game-history'

export const useGameHistoryStore = defineStore('gameHistory', {
  state: () => ({
    records: [] as GameRecord[],
  }),

  getters: {
    /**
     * Get all game records
     */
    allRecords: (state) => state.records,

    /**
     * Get history for a specific deck
     */
    getHistoryForDeck: (state) => (deckId: string) => {
      return state.records.filter(record => record.deckId === deckId)
    },
  },

  actions: {
    /**
     * Load game history from localStorage
     */
    loadHistory() {
      if (typeof window === 'undefined') return

      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const history = JSON.parse(stored)
          this.records = Array.isArray(history) ? history : []
        }
      } catch (error) {
        console.error('Error loading game history:', error)
        this.records = []
      }
    },

    /**
     * Save game history to localStorage
     */
    saveHistory() {
      if (typeof window === 'undefined') return

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records))
      } catch (error) {
        console.error('Error saving game history:', error)
      }
    },

    /**
     * Add a new game record to history
     */
    addGameRecord(record: Omit<GameRecord, 'id' | 'accuracy'>) {
      // Calculate accuracy
      const total = record.correctWords.length + record.skippedWords.length
      const accuracy = total > 0 
        ? Math.round((record.correctWords.length / total) * 100) 
        : 0

      // Create complete record with ID and accuracy
      const completeRecord: GameRecord = {
        ...record,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        accuracy,
      }

      // Add to beginning of history (most recent first)
      this.records.unshift(completeRecord)

      // Keep only last 100 games
      if (this.records.length > 100) {
        this.records = this.records.slice(0, 100)
      }

      this.saveHistory()
    },

    /**
     * Clear all game history
     */
    clearHistory() {
      this.records = []
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch (error) {
          console.error('Error clearing game history:', error)
        }
      }
    }
  }
})
