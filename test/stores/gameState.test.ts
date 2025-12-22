import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStateStore } from '@/stores/gameState'
import { useDecksStore } from '@/stores/decks'

// Mock VueUse
vi.mock('@vueuse/core', () => ({
  useScreenOrientation: () => ({
    isSupported: { value: false },
    lockOrientation: vi.fn(),
    unlockOrientation: vi.fn(),
  })
}))

describe('Game State Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.localStorage = localStorageMock as any
    
    // Mock setInterval and clearInterval
    vi.useFakeTimers()
  })

  it('should initialize with default state', () => {
    const store = useGameStateStore()
    expect(store.gameStarted).toBe(false)
    expect(store.gameEnded).toBe(false)
    expect(store.gamePaused).toBe(false)
    expect(store.correctCount).toBe(0)
    expect(store.wrongCount).toBe(0)
  })

  it('should set deck ID', () => {
    const store = useGameStateStore()
    store.setDeckId('test-deck')
    expect(store.deckId).toBe('test-deck')
  })

  it('should get selected deck', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    // Get first available deck
    const firstDeck = decksStore.decks[0]
    if (firstDeck) {
      store.setDeckId(firstDeck.id)
      expect(store.selectedDeck?.id).toBe(firstDeck.id)
    }
  })

  it('should shuffle array', () => {
    const store = useGameStateStore()
    const array = [1, 2, 3, 4, 5]
    const original = [...array]
    
    store.shuffleArray(array)
    
    // Array should have same length
    expect(array.length).toBe(original.length)
    // Array should contain all original elements
    original.forEach(item => {
      expect(array).toContain(item)
    })
  })

  it('should mark card as correct', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    const firstDeck = decksStore.decks[0]
    if (firstDeck && firstDeck.cards.length > 0) {
      store.setDeckId(firstDeck.id)
      store.initializeGame()
      
      const initialCorrectCount = store.correctCount
      const currentCard = store.currentCard
      
      store.markCorrect()
      
      expect(store.correctCount).toBe(initialCorrectCount + 1)
      expect(store.correctCards).toContain(currentCard)
    }
  })

  it('should mark card as wrong', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    const firstDeck = decksStore.decks[0]
    if (firstDeck && firstDeck.cards.length > 0) {
      store.setDeckId(firstDeck.id)
      store.initializeGame()
      
      const initialWrongCount = store.wrongCount
      const currentCard = store.currentCard
      
      store.markWrong()
      
      expect(store.wrongCount).toBe(initialWrongCount + 1)
      expect(store.skippedCards).toContain(currentCard)
    }
  })

  it('should handle tap with correct action', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    const firstDeck = decksStore.decks[0]
    if (firstDeck && firstDeck.cards.length > 0) {
      store.setDeckId(firstDeck.id)
      store.initializeGame()
      
      const initialCount = store.correctCount
      store.handleTap('correct')
      
      expect(store.correctCount).toBe(initialCount + 1)
    }
  })

  it('should handle tap with wrong action', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    const firstDeck = decksStore.decks[0]
    if (firstDeck && firstDeck.cards.length > 0) {
      store.setDeckId(firstDeck.id)
      store.initializeGame()
      
      const initialCount = store.wrongCount
      store.handleTap('wrong')
      
      expect(store.wrongCount).toBe(initialCount + 1)
    }
  })

  it('should ignore taps when paused', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    const firstDeck = decksStore.decks[0]
    if (firstDeck && firstDeck.cards.length > 0) {
      store.setDeckId(firstDeck.id)
      store.initializeGame()
      store.gamePaused = true
      
      const initialCorrectCount = store.correctCount
      store.handleTap('correct')
      
      // Count should not change when paused
      expect(store.correctCount).toBe(initialCorrectCount)
    }
  })

  it('should show tap feedback overlay for 300ms', () => {
    const store = useGameStateStore()
    
    // Show feedback overlay
    store.showTapFeedbackOverlay('correct')
    
    // Should be visible immediately
    expect(store.showTapFeedback).toBe(true)
    expect(store.tapFeedbackAction).toBe('correct')
    
    // Fast-forward time by 300ms
    vi.advanceTimersByTime(300)
    
    // Should be hidden after 300ms
    expect(store.showTapFeedback).toBe(false)
    expect(store.tapFeedbackAction).toBeNull()
  })

  it('should initialize game with shuffled cards', () => {
    const store = useGameStateStore()
    const decksStore = useDecksStore()
    
    const firstDeck = decksStore.decks[0]
    if (firstDeck && firstDeck.cards.length > 0) {
      store.setDeckId(firstDeck.id)
      store.initializeGame()
      
      expect(store.currentCard).toBeTruthy()
      expect(store.availableCards.length).toBeGreaterThan(0)
      expect(store.correctCount).toBe(0)
      expect(store.wrongCount).toBe(0)
    }
  })

  it('should cleanup intervals', () => {
    const store = useGameStateStore()
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.timerInterval = 123 as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.countdownInterval = 456 as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.feedbackTimeout = 789 as any
    
    store.cleanup()
    
    expect(clearIntervalSpy).toHaveBeenCalledWith(123)
    expect(clearIntervalSpy).toHaveBeenCalledWith(456)
    expect(clearTimeoutSpy).toHaveBeenCalledWith(789)
    expect(store.timerInterval).toBeNull()
    expect(store.countdownInterval).toBeNull()
    expect(store.feedbackTimeout).toBeNull()
  })
})
