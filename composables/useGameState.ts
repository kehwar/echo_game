import { decks } from '@/data/decks'

export function useGameState(deckId: Ref<string>) {
  // Find the selected deck
  const selectedDeck = computed(() => decks.find(d => d.id === deckId.value))

  // Game state
  const gameStarted = ref(false)
  const gameEnded = ref(false)
  const gamePaused = ref(false)
  const durationOptions = [60, 90, 120]
  const selectedDuration = ref(120) // Default to 120 seconds
  const timeRemaining = ref(selectedDuration.value)
  const currentCard = ref('')
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const usedCards = ref<string[]>([])
  const correctCards = ref<string[]>([])
  const skippedCards = ref<string[]>([])
  const availableCards = ref<string[]>([])

  let timerInterval: number | null = null

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
    timeRemaining.value = selectedDuration.value
    gameEnded.value = false
    nextCard()
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
    startTimer()
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
    startTimer()
  }

  // Play again with same theme
  function playAgain() {
    gameEnded.value = false
    startGame()
  }

  // Choose a new deck
  function chooseNewDeck() {
    navigateTo('/')
  }

  // Cleanup function
  function cleanup() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  return {
    // State
    selectedDeck,
    gameStarted,
    gameEnded,
    gamePaused,
    durationOptions,
    selectedDuration,
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
