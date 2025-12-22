import { decks } from '@/data/decks'
import { useScreenOrientation } from '@vueuse/core'

export function useGameState(deckId: Ref<string>) {
  // Get global settings
  const settings = useSettings()
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
  const timeRemaining = ref(settings.timerDuration.value)
  const currentCard = ref('')
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const usedCards = ref<string[]>([])
  const correctCards = ref<string[]>([])
  const skippedCards = ref<string[]>([])
  const availableCards = ref<string[]>([])
  
  // Track game start time for history
  let gameStartTime: Date | null = null

  let timerInterval: number | null = null
  let countdownInterval: number | null = null

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
    gameStartTime = new Date() // Record start time
    initializeGame()
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
    
    // Save game to history
    if (gameStartTime && selectedDeck.value) {
      const gameDuration = settings.timerDuration.value - timeRemaining.value
      gameHistory.addGameToHistory({
        deckId: selectedDeck.value.id,
        deckName: selectedDeck.value.name,
        startDateTime: gameStartTime.toISOString(),
        duration: gameDuration,
        correctWords: [...correctCards.value],
        skippedWords: [...skippedCards.value]
      })
    }
    
    // Unlock orientation when game ends
    if (isSupported.value) {
      unlockOrientation()
    }
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
