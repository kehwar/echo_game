/**
 * Game State Store using Pinia
 * Manages the active game session state
 */
import { defineStore } from 'pinia'
import { useScreenOrientation } from '@vueuse/core'
import { useDecksStore } from './decks'
import { useSettingsStore } from './settings'
import { useGameHistoryStore } from './gameHistory'
import { playTickSound, playFinishSound, playCorrectSound, playPassSound } from '@/lib/soundService'
import { useFullscreen } from '@/composables/useFullscreen'

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
      // Reset game state when selecting a new deck to prevent
      // showing old scores from previous games
      this.gameStarted = false
      this.gameEnded = false
      this.gamePaused = false
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
     * Reset score state
     */
    resetScoreState() {
      this.correctCount = 0
      this.wrongCount = 0
      this.correctCards = []
      this.skippedCards = []
      this.usedCards = []
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
      this.resetScoreState()
      this.timeRemaining = settingsStore.timerDuration
      this.gameEnded = false
      this.nextCard()
    },

    /**
     * Start countdown and then execute callback
     */
    startCountdown(callback: () => void) {
      const settingsStore = useSettingsStore()
      
      this.showCountdown = true
      this.countdownValue = settingsStore.startCountdownDuration

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

        // Play tick sound during last 10 seconds
        if (this.timeRemaining <= 10 && this.timeRemaining > 0) {
          playTickSound()
        }

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

      // Request fullscreen mode for mobile devices
      try {
        const { requestFullscreen } = useFullscreen()
        await requestFullscreen()
      } catch (error) {
        // Silently fail if fullscreen is not supported or denied
        console.warn('Could not enter fullscreen mode:', error)
      }

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

      // Play finish sound when round ends
      playFinishSound()

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

      // Exit fullscreen and unlock orientation when game ends
      const { exitFullscreen } = useFullscreen()
      exitFullscreen()

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

      // Hide after 150ms (matches animation duration)
      this.feedbackTimeout = setTimeout(() => {
        this.showTapFeedback = false
        this.tapFeedbackAction = null
        this.feedbackTimeout = null
      }, 150)
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
      
      // Play correct sound
      playCorrectSound()
      
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
      
      // Play pass sound
      playPassSound()
      
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
      // Reset score state before changing gameEnded flag to prevent
      // old score data from being visible during transition
      this.resetScoreState()
      
      this.gameEnded = false
      this.startGame()
    },

    /**
     * Choose a new deck
     */
    chooseNewDeck() {
      // Reset game state before navigating to prevent old score data
      // from appearing when selecting a new deck
      this.resetScoreState()
      this.gameEnded = false
      this.gameStarted = false
      
      // Exit fullscreen and unlock orientation when leaving game
      const { exitFullscreen } = useFullscreen()
      exitFullscreen()

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

      // Exit fullscreen and unlock orientation on cleanup
      const { exitFullscreen } = useFullscreen()
      exitFullscreen()

      const { isSupported, unlockOrientation } = useScreenOrientation()
      if (isSupported.value) {
        unlockOrientation()
      }
    },
  },
})
