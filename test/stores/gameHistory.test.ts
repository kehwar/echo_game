import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameHistoryStore } from '@/stores/gameHistory'

describe('Game History Store', () => {
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
  })

  it('should initialize with empty records', () => {
    const store = useGameHistoryStore()
    expect(store.records).toEqual([])
  })

  it('should add a game record', () => {
    const store = useGameHistoryStore()
    store.addGameRecord({
      deckId: 'test-deck',
      deckName: 'Test Deck',
      startDateTime: '2024-01-01T00:00:00.000Z',
      duration: 120,
      correctWords: ['WORD1', 'WORD2'],
      skippedWords: ['WORD3'],
    })

    expect(store.records).toHaveLength(1)
    expect(store.records[0].deckId).toBe('test-deck')
    expect(store.records[0].accuracy).toBe(67) // 2 correct out of 3 total = 66.67% rounded to 67%
  })

  it('should calculate accuracy correctly', () => {
    const store = useGameHistoryStore()
    store.addGameRecord({
      deckId: 'test-deck',
      deckName: 'Test Deck',
      startDateTime: '2024-01-01T00:00:00.000Z',
      duration: 120,
      correctWords: ['WORD1', 'WORD2', 'WORD3'],
      skippedWords: ['WORD4'],
    })

    expect(store.records[0].accuracy).toBe(75) // 3 out of 4 = 75%
  })

  it('should filter history by deck', () => {
    const store = useGameHistoryStore()
    store.addGameRecord({
      deckId: 'deck1',
      deckName: 'Deck 1',
      startDateTime: '2024-01-01T00:00:00.000Z',
      duration: 120,
      correctWords: ['WORD1'],
      skippedWords: [],
    })
    store.addGameRecord({
      deckId: 'deck2',
      deckName: 'Deck 2',
      startDateTime: '2024-01-01T00:00:00.000Z',
      duration: 120,
      correctWords: ['WORD2'],
      skippedWords: [],
    })

    const deck1History = store.getHistoryForDeck('deck1')
    expect(deck1History).toHaveLength(1)
    expect(deck1History[0].deckId).toBe('deck1')
  })

  it('should clear all history', () => {
    const store = useGameHistoryStore()
    store.addGameRecord({
      deckId: 'test-deck',
      deckName: 'Test Deck',
      startDateTime: '2024-01-01T00:00:00.000Z',
      duration: 120,
      correctWords: ['WORD1'],
      skippedWords: [],
    })
    
    expect(store.records).toHaveLength(1)
    store.clearHistory()
    expect(store.records).toEqual([])
  })

  it('should limit history to 100 records', () => {
    const store = useGameHistoryStore()
    
    // Add 110 records
    for (let i = 0; i < 110; i++) {
      store.addGameRecord({
        deckId: 'test-deck',
        deckName: 'Test Deck',
        startDateTime: '2024-01-01T00:00:00.000Z',
        duration: 120,
        correctWords: [`WORD${i}`],
        skippedWords: [],
      })
    }

    expect(store.records).toHaveLength(100)
  })

  it('should add most recent records first', () => {
    const store = useGameHistoryStore()
    store.addGameRecord({
      deckId: 'deck1',
      deckName: 'Deck 1',
      startDateTime: '2024-01-01T00:00:00.000Z',
      duration: 120,
      correctWords: ['FIRST'],
      skippedWords: [],
    })
    store.addGameRecord({
      deckId: 'deck2',
      deckName: 'Deck 2',
      startDateTime: '2024-01-02T00:00:00.000Z',
      duration: 120,
      correctWords: ['SECOND'],
      skippedWords: [],
    })

    // Most recent should be first
    expect(store.records[0].correctWords[0]).toBe('SECOND')
    expect(store.records[1].correctWords[0]).toBe('FIRST')
  })
})
