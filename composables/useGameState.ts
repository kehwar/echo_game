import { decks } from '@/data/decks'
import { useScreenOrientation } from '@vueuse/core'

export function useGameState(deckId: Ref<string>) {
  // Get global settings
  const settings = useSettings()
  
  // Get game history composable
  const gameHistory = useGameHistory()
  
  // Find the selected deck
  const selectedDeck = computed(() => decks.find(d => d.id === deckId.value))

  // Screen orientation control using VueUse
  const { isSupported, lockOrientation, unlockOrientation } = useScreenOrientation()

  // Game state
  const gameStarted = ref(false)
  const gameEnded = ref(false)
  const gamePaused = ref(false)
  const showCountdown = ref(false)
  const countdownValue = ref(3)
  const showTapFeedback = ref(false)
  const tapFeedbackAction = ref<'correct' | 'wrong' | null>(null)
  const timeRemaining = ref(settings.timerDuration.value)
  const currentCard = ref('')
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const usedCards = ref<string[]>([])
  const correctCards = ref<string[]>([])
  const skippedCards = ref<string[]>([])
  const availableCards = ref<string[]>([])
  const gameStartTime = ref<string | null>(null)

  let timerInterval: number | null = null
  let countdownInterval: number | null = null
  let feedbackTimeout: number | null = null

  // Shuffle array helper
  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  // Get next card
  function nextCard() {
    if (availableCards.value.length === 0) {
      // Refill with unused cards first, or all cards if all have been used
      const unusedCards = selectedDeck.value?.cards.filter(
        card => !usedCards.value.includes(card)
      ) || []
      
      if (unusedCards.length > 0) {
        availableCards.value = [...unusedCards]
      } else {
        // All cards used, reset and start over
        availableCards.value = [...(selectedDeck.value?.cards || [])]
        usedCards.value = []
      }
      shuffleArray(availableCards.value)
    }
    
    currentCard.value = availableCards.value.pop() || ''
  }

  // Initialize game
  function initializeGame() {
    if (!selectedDeck.value) {
      navigateTo('/')
      return
    }
    
    availableCards.value = [...selectedDeck.value.cards]
    shuffleArray(availableCards.value)
    usedCards.value = []
    correctCards.value = []
    skippedCards.value = []
    correctCount.value = 0
    wrongCount.value = 0
    timeRemaining.value = settings.timerDuration.value
    gameEnded.value = false
    nextCard()
  }

  // Start countdown and then execute callback
  function startCountdown(callback: () => void) {
    showCountdown.value = true
    countdownValue.value = 3
    
    countdownInterval = setInterval(() => {
      countdownValue.value--
      
      if (countdownValue.value < 1) {
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
        showCountdown.value = false
        callback()
      }
    }, 1000)
  }

  // Start/restart the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      timeRemaining.value--
      
      if (timeRemaining.value <= 0) {
        endGame()
      }
    }, 1000)
  }

  // Start the game
  async function startGame() {
    gameStarted.value = true
    initializeGame()
    // Record game start time
    gameStartTime.value = new Date().toISOString()
    // Lock to landscape when game starts
    if (isSupported.value) {
      try {
        await lockOrientation('landscape')
      } catch (error) {
        // Silently fail if orientation lock is not supported or denied
        console.warn('Could not lock screen orientation:', error)
      }
    }
    startCountdown(() => {
      startTimer()
    })
  }

  // End the game
  function endGame() {
    gameStarted.value = false
    gameEnded.value = true
    gamePaused.value = false
    
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    
    // Save game record to history
    if (gameStartTime.value && selectedDeck.value) {
      const duration = settings.timerDuration.value - timeRemaining.value
      gameHistory.addGameRecord({
        deckId: selectedDeck.value.id,
        deckName: selectedDeck.value.name,
        startDateTime: gameStartTime.value,
        duration,
        correctWords: [...correctCards.value],
        skippedWords: [...skippedCards.value],
      })
    }
    
    // Unlock orientation when game ends
    if (isSupported.value) {
      unlockOrientation()
    }
  }

  // Show tap feedback overlay
  function showTapFeedbackOverlay(action: 'correct' | 'wrong') {
    // Clear any existing feedback timeout
    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout)
    }
    
    // Show the feedback overlay
    tapFeedbackAction.value = action
    showTapFeedback.value = true
    
    // Hide after 600ms (matches animation duration)
    feedbackTimeout = setTimeout(() => {
      showTapFeedback.value = false
      tapFeedbackAction.value = null
      feedbackTimeout = null
    }, 600)
  }

  // Handle tap without double-tap detection
  function handleTap(action: 'correct' | 'wrong') {
    // Ignore taps while game is paused
    if (gamePaused.value) return
    
    // Show feedback overlay
    showTapFeedbackOverlay(action)
    
    if (action === 'correct') {
      markCorrect()
    } else {
      markWrong()
    }
  }

  // Mark card as correct
  function markCorrect() {
    if (gamePaused.value) return
    correctCount.value++
    if (!correctCards.value.includes(currentCard.value)) {
      correctCards.value.push(currentCard.value)
    }
    usedCards.value.push(currentCard.value)
    nextCard()
  }

  // Mark card as wrong/skip
  function markWrong() {
    if (gamePaused.value) return
    wrongCount.value++
    if (!skippedCards.value.includes(currentCard.value)) {
      skippedCards.value.push(currentCard.value)
    }
    usedCards.value.push(currentCard.value)
    nextCard()
  }

  // Pause the game
  function pauseGame() {
    if (!gameStarted.value || gameEnded.value) return
    
    gamePaused.value = true
    
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  // Resume the game
  function resumeGame() {
    if (!gameStarted.value || gameEnded.value) return
    
    gamePaused.value = false
    startCountdown(() => {
      startTimer()
    })
  }

  // Play again with same deck
  function playAgain() {
    gameEnded.value = false
    startGame()
  }

  // Choose a new deck
  function chooseNewDeck() {
    // Unlock orientation when leaving game
    if (isSupported.value) {
      unlockOrientation()
    }
    navigateTo('/')
  }

  // Cleanup function
  function cleanup() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout)
      feedbackTimeout = null
    }
    // Unlock orientation on cleanup
    if (isSupported.value) {
      unlockOrientation()
    }
  }

  return {
    // State
    selectedDeck,
    gameStarted,
    gameEnded,
    gamePaused,
    showCountdown,
    countdownValue,
    showTapFeedback,
    tapFeedbackAction,
    timerDuration: settings.timerDuration,
    timeRemaining,
    currentCard,
    correctCount,
    wrongCount,
    correctCards,
    skippedCards,
    // Methods
    startGame,
    endGame,
    handleTap,
    pauseGame,
    resumeGame,
    playAgain,
    chooseNewDeck,
    cleanup,
  }
}
