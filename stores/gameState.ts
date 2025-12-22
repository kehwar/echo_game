/**
 * Game State Store using Pinia
 * Manages the active game session state
 */
import { defineStore } from 'pinia'
import { useScreenOrientation } from '@vueuse/core'
import { useDecksStore } from './decks'
import { useSettingsStore } from './settings'
import { useGameHistoryStore } from './gameHistory'

export const useGameStateStore = defineStore('gameState', {
  state: () => ({
    // Current game state
    deckId: '' as string,
    gameStarted: false,
    gameEnded: false,
    gamePaused: false,
    showCountdown: false,
    countdownValue: 3,
    showTapFeedback: false,
    tapFeedbackAction: null as 'correct' | 'wrong' | null,
    timeRemaining: 120,
    currentCard: '',
    correctCount: 0,
    wrongCount: 0,
    usedCards: [] as string[],
    correctCards: [] as string[],
    skippedCards: [] as string[],
    availableCards: [] as string[],
    gameStartTime: null as string | null,

    // Timer intervals (stored as numbers for browser)
    timerInterval: null as number | null,
    countdownInterval: null as number | null,
    feedbackTimeout: null as number | null,
  }),

  getters: {
    /**
     * Get the selected deck
     */
    selectedDeck(state) {
      const decksStore = useDecksStore()
      return decksStore.getDeckById(state.deckId)
    },
  },

  actions: {
    /**
     * Set the current deck ID
     */
    setDeckId(deckId: string) {
      this.deckId = deckId
    },

    /**
     * Shuffle array helper
     */
    shuffleArray<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
    },

    /**
     * Get next card
     */
    nextCard() {
      const deck = this.selectedDeck
      if (!deck) return

      if (this.availableCards.length === 0) {
        // Refill with unused cards first, or all cards if all have been used
        const unusedCards = deck.cards.filter(
          card => !this.usedCards.includes(card)
        )

        if (unusedCards.length > 0) {
          this.availableCards = [...unusedCards]
        } else {
          // All cards used, reset and start over
          this.availableCards = [...deck.cards]
          this.usedCards = []
        }
        this.shuffleArray(this.availableCards)
      }

      this.currentCard = this.availableCards.pop() || ''
    },

    /**
     * Initialize game
     */
    initializeGame() {
      const deck = this.selectedDeck
      const settingsStore = useSettingsStore()

      if (!deck) {
        navigateTo('/')
        return
      }

      this.availableCards = [...deck.cards]
      this.shuffleArray(this.availableCards)
      this.usedCards = []
      this.correctCards = []
      this.skippedCards = []
      this.correctCount = 0
      this.wrongCount = 0
      this.timeRemaining = settingsStore.timerDuration
      this.gameEnded = false
      this.nextCard()
    },

    /**
     * Start countdown and then execute callback
     */
    startCountdown(callback: () => void) {
      this.showCountdown = true
      this.countdownValue = 3

      this.countdownInterval = setInterval(() => {
        this.countdownValue--

        if (this.countdownValue < 1) {
          if (this.countdownInterval) {
            clearInterval(this.countdownInterval)
            this.countdownInterval = null
          }
          this.showCountdown = false
          callback()
        }
      }, 1000)
    },

    /**
     * Start/restart the timer
     */
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timeRemaining--

        if (this.timeRemaining <= 0) {
          this.endGame()
        }
      }, 1000)
    },

    /**
     * Start the game
     */
    async startGame() {
      this.gameStarted = true
      this.initializeGame()

      // Record game start time
      this.gameStartTime = new Date().toISOString()

      // Lock to landscape when game starts
      const { isSupported, lockOrientation } = useScreenOrientation()
      if (isSupported.value) {
        try {
          await lockOrientation('landscape')
        } catch (error) {
          // Silently fail if orientation lock is not supported or denied
          console.warn('Could not lock screen orientation:', error)
        }
      }

      this.startCountdown(() => {
        this.startTimer()
      })
    },

    /**
     * End the game
     */
    endGame() {
      this.gameStarted = false
      this.gameEnded = true
      this.gamePaused = false

      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }

      // Save game record to history
      const deck = this.selectedDeck
      const settingsStore = useSettingsStore()
      const gameHistoryStore = useGameHistoryStore()

      if (this.gameStartTime && deck) {
        const duration = settingsStore.timerDuration - this.timeRemaining
        gameHistoryStore.addGameRecord({
          deckId: deck.id,
          deckName: deck.name,
          startDateTime: this.gameStartTime,
          duration,
          correctWords: [...this.correctCards],
          skippedWords: [...this.skippedCards],
        })
      }

      // Unlock orientation when game ends
      const { isSupported, unlockOrientation } = useScreenOrientation()
      if (isSupported.value) {
        unlockOrientation()
      }
    },

    /**
     * Show tap feedback overlay
     */
    showTapFeedbackOverlay(action: 'correct' | 'wrong') {
      // Clear any existing feedback timeout
      if (this.feedbackTimeout) {
        clearTimeout(this.feedbackTimeout)
      }

      // Show the feedback overlay
      this.tapFeedbackAction = action
      this.showTapFeedback = true

      // Hide after 600ms (matches animation duration)
      this.feedbackTimeout = setTimeout(() => {
        this.showTapFeedback = false
        this.tapFeedbackAction = null
        this.feedbackTimeout = null
      }, 600)
    },

    /**
     * Handle tap without double-tap detection
     */
    handleTap(action: 'correct' | 'wrong') {
      // Ignore taps while game is paused
      if (this.gamePaused) return

      // Show feedback overlay
      this.showTapFeedbackOverlay(action)

      if (action === 'correct') {
        this.markCorrect()
      } else {
        this.markWrong()
      }
    },

    /**
     * Mark card as correct
     */
    markCorrect() {
      if (this.gamePaused) return
      this.correctCount++
      if (!this.correctCards.includes(this.currentCard)) {
        this.correctCards.push(this.currentCard)
      }
      this.usedCards.push(this.currentCard)
      this.nextCard()
    },

    /**
     * Mark card as wrong/skip
     */
    markWrong() {
      if (this.gamePaused) return
      this.wrongCount++
      if (!this.skippedCards.includes(this.currentCard)) {
        this.skippedCards.push(this.currentCard)
      }
      this.usedCards.push(this.currentCard)
      this.nextCard()
    },

    /**
     * Pause the game
     */
    pauseGame() {
      if (!this.gameStarted || this.gameEnded) return

      this.gamePaused = true

      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    /**
     * Resume the game
     */
    resumeGame() {
      if (!this.gameStarted || this.gameEnded) return

      this.gamePaused = false
      this.startCountdown(() => {
        this.startTimer()
      })
    },

    /**
     * Play again with same deck
     */
    playAgain() {
      this.gameEnded = false
      this.startGame()
    },

    /**
     * Choose a new deck
     */
    chooseNewDeck() {
      // Unlock orientation when leaving game
      const { isSupported, unlockOrientation } = useScreenOrientation()
      if (isSupported.value) {
        unlockOrientation()
      }
      navigateTo('/')
    },

    /**
     * Cleanup function
     */
    cleanup() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }
      if (this.feedbackTimeout) {
        clearTimeout(this.feedbackTimeout)
        this.feedbackTimeout = null
      }

      // Unlock orientation on cleanup
      const { isSupported, unlockOrientation } = useScreenOrientation()
      if (isSupported.value) {
        unlockOrientation()
      }
    },
  },
})
