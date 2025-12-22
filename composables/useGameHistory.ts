/**
 * Game history composable for Echo Game
 * Manages game history stored in localStorage
 */

const GAME_HISTORY_STORAGE_KEY = 'echo-game-history'
const MAX_HISTORY_ITEMS = 50 // Keep last 50 games

export interface GameHistoryEntry {
  id: string // Unique ID for the entry
  deckId: string // Deck ID
  deckName: string // Deck name for display
  startDateTime: string // ISO datetime string
  duration: number // Duration in seconds
  correctWords: string[] // List of correct words
  skippedWords: string[] // List of skipped words
  accuracy: number // Percentage of correct words (0-100)
}

export function useGameHistory() {
  /**
   * Load game history from localStorage
   */
  function loadHistory(): GameHistoryEntry[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(GAME_HISTORY_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate that it's an array
        if (Array.isArray(parsed)) {
          // Filter out any invalid entries
          const validHistory = parsed.filter((entry: unknown): entry is GameHistoryEntry => {
            if (!entry || typeof entry !== 'object') return false
            const e = entry as Record<string, unknown>
            return (
              typeof e.id === 'string' &&
              typeof e.deckId === 'string' &&
              typeof e.deckName === 'string' &&
              typeof e.startDateTime === 'string' &&
              typeof e.duration === 'number' &&
              Array.isArray(e.correctWords) &&
              Array.isArray(e.skippedWords) &&
              typeof e.accuracy === 'number'
            )
          })
          return validHistory
        }
      }
    } catch (error) {
      console.error('Failed to load game history from localStorage:', error)
    }
    return []
  }

  /**
   * Save game history to localStorage
   */
  function saveHistory(history: GameHistoryEntry[]): void {
    if (typeof window === 'undefined') return
    
    try {
      // Keep only the most recent MAX_HISTORY_ITEMS entries
      const trimmedHistory = history.slice(-MAX_HISTORY_ITEMS)
      localStorage.setItem(GAME_HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory))
    } catch (error) {
      console.error('Failed to save game history to localStorage:', error)
    }
  }

  /**
   * Add a new game entry to history
   */
  function addGameToHistory(entry: Omit<GameHistoryEntry, 'id' | 'accuracy'>): void {
    const history = loadHistory()
    
    // Calculate accuracy
    const totalCards = entry.correctWords.length + entry.skippedWords.length
    const accuracy = totalCards > 0 
      ? Math.round((entry.correctWords.length / totalCards) * 100) 
      : 0
    
    // Create new entry with unique ID and calculated accuracy
    const newEntry: GameHistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      accuracy
    }
    
    // Add to history
    history.push(newEntry)
    
    // Save updated history
    saveHistory(history)
  }

  /**
   * Get all game history entries, sorted by most recent first
   */
  function getHistory(): GameHistoryEntry[] {
    const history = loadHistory()
    // Sort by startDateTime descending (most recent first)
    return history.sort((a, b) => 
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
    )
  }

  /**
   * Clear all game history
   */
  function clearHistory(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(GAME_HISTORY_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear game history from localStorage:', error)
    }
  }

  /**
   * Get history entries for a specific deck
   */
  function getHistoryByDeck(deckId: string): GameHistoryEntry[] {
    const history = getHistory()
    return history.filter(entry => entry.deckId === deckId)
  }

  return {
    addGameToHistory,
    getHistory,
    clearHistory,
    getHistoryByDeck
  }
}
