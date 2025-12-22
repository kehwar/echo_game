import { themes } from '@/data/themes'

export function useGameState(themeId: Ref<string>) {
  // Find the selected theme
  const selectedTheme = computed(() => themes.find(t => t.id === themeId.value))

  // Game state
  const gameStarted = ref(false)
  const gameEnded = ref(false)
  const gamePaused = ref(false)
  const durationOptions = [60, 90, 120]
  const selectedDuration = ref(120) // Default to 120 seconds
  const timeRemaining = ref(selectedDuration.value)
  const currentWord = ref('')
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const usedWords = ref<string[]>([])
  const correctWords = ref<string[]>([])
  const skippedWords = ref<string[]>([])
  const availableWords = ref<string[]>([])

  let timerInterval: number | null = null

  // Shuffle array helper
  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  // Get next word
  function nextWord() {
    if (availableWords.value.length === 0) {
      // Refill with unused words first, or all words if all have been used
      const unusedWords = selectedTheme.value?.words.filter(
        word => !usedWords.value.includes(word)
      ) || []
      
      if (unusedWords.length > 0) {
        availableWords.value = [...unusedWords]
      } else {
        // All words used, reset and start over
        availableWords.value = [...(selectedTheme.value?.words || [])]
        usedWords.value = []
      }
      shuffleArray(availableWords.value)
    }
    
    currentWord.value = availableWords.value.pop() || ''
  }

  // Initialize game
  function initializeGame() {
    if (!selectedTheme.value) {
      navigateTo('/')
      return
    }
    
    availableWords.value = [...selectedTheme.value.words]
    shuffleArray(availableWords.value)
    usedWords.value = []
    correctWords.value = []
    skippedWords.value = []
    correctCount.value = 0
    wrongCount.value = 0
    timeRemaining.value = selectedDuration.value
    gameEnded.value = false
    nextWord()
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

  // Mark word as correct
  function markCorrect() {
    if (gamePaused.value) return
    correctCount.value++
    if (!correctWords.value.includes(currentWord.value)) {
      correctWords.value.push(currentWord.value)
    }
    usedWords.value.push(currentWord.value)
    nextWord()
  }

  // Mark word as wrong/skip
  function markWrong() {
    if (gamePaused.value) return
    wrongCount.value++
    if (!skippedWords.value.includes(currentWord.value)) {
      skippedWords.value.push(currentWord.value)
    }
    usedWords.value.push(currentWord.value)
    nextWord()
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

  // Choose a new theme
  function chooseNewTheme() {
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
    selectedTheme,
    gameStarted,
    gameEnded,
    gamePaused,
    durationOptions,
    selectedDuration,
    timeRemaining,
    currentWord,
    correctCount,
    wrongCount,
    correctWords,
    skippedWords,
    // Methods
    startGame,
    endGame,
    handleTap,
    pauseGame,
    resumeGame,
    playAgain,
    chooseNewTheme,
    cleanup,
  }
}
