/**
 * Composable for managing game history in localStorage
 */

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

export function useGameHistory() {
  /**
   * Load game history from localStorage
   */
  function loadHistory(): GameRecord[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const history = JSON.parse(stored)
      return Array.isArray(history) ? history : []
    } catch (error) {
      console.error('Error loading game history:', error)
      return []
    }
  }

  /**
   * Save game history to localStorage
   */
  function saveHistory(history: GameRecord[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving game history:', error)
    }
  }

  /**
   * Add a new game record to history
   */
  function addGameRecord(record: Omit<GameRecord, 'id' | 'accuracy'>): void {
    const history = loadHistory()
    
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
    history.unshift(completeRecord)
    
    // Keep only last 100 games
    const trimmedHistory = history.slice(0, 100)
    
    saveHistory(trimmedHistory)
  }

  /**
   * Get all game records
   */
  function getHistory(): GameRecord[] {
    return loadHistory()
  }

  /**
   * Clear all game history
   */
  function clearHistory(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing game history:', error)
    }
  }

  /**
   * Get history for a specific deck
   */
  function getHistoryForDeck(deckId: string): GameRecord[] {
    return loadHistory().filter(record => record.deckId === deckId)
  }

  return {
    addGameRecord,
    getHistory,
    clearHistory,
    getHistoryForDeck,
  }
}
