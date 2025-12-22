import { decks } from '@/data/decks'

export function useGameState(deckId: Ref<string>) {
  // Get global settings
  const settings = useSettings()
  
  // Find the selected deck
  const selectedDeck = computed(() => decks.find(d => d.id === deckId.value))

  // Game state
  const gameStarted = ref(false)
  const gameEnded = ref(false)
  const gamePaused = ref(false)
  const showCountdown = ref(false)
  const countdownValue = ref(3)
  const timeRemaining = ref(settings.timerDuration.value)
  const currentCard = ref('')
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const usedCards = ref<string[]>([])
  const correctCards = ref<string[]>([])
  const skippedCards = ref<string[]>([])
  const availableCards = ref<string[]>([])

  let timerInterval: number | null = null
  let countdownInterval: number | null = null

  // Lock screen orientation to landscape
  async function lockOrientation() {
    try {
      // Check if the Screen Orientation API is supported
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape')
      }
    } catch (error) {
      // Silently fail if orientation lock is not supported or denied
      console.warn('Could not lock screen orientation:', error)
    }
  }

  // Unlock screen orientation
  function unlockOrientation() {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock()
      }
    } catch (error) {
      // Silently fail if orientation unlock is not supported
      console.warn('Could not unlock screen orientation:', error)
    }
  }

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
  function startGame() {
    gameStarted.value = true
    initializeGame()
    lockOrientation() // Lock to landscape when game starts
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
    
    unlockOrientation() // Unlock orientation when game ends
  }

  // Handle tap without double-tap detection
  function handleTap(action: 'correct' | 'wrong') {
    // Ignore taps while game is paused
    if (gamePaused.value) return
    
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
    unlockOrientation() // Unlock orientation when leaving game
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
    unlockOrientation() // Unlock orientation on cleanup
  }

  return {
    // State
    selectedDeck,
    gameStarted,
    gameEnded,
    gamePaused,
    showCountdown,
    countdownValue,
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
