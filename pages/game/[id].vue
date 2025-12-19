<template>
  <div class="min-h-screen bg-background">
    <!-- Pre-game screen -->
    <div v-if="!gameStarted && !gameEnded" class="min-h-screen flex flex-col p-4 max-w-2xl mx-auto justify-center">
      <header class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-4 text-primary hover:underline">
          ← Back to Theme Selection
        </NuxtLink>
        <h1 class="text-4xl font-bold text-foreground mb-4">{{ selectedTheme?.name }}</h1>
        <p class="text-xl text-muted-foreground">{{ selectedTheme?.description }}</p>
      </header>

      <Card class="mb-8">
        <CardContent class="py-12 text-center space-y-6">
          <div class="text-6xl mb-4">📱</div>
          <h2 class="text-2xl font-bold">Ready to Play?</h2>
          <div class="text-left max-w-md mx-auto space-y-3 text-muted-foreground">
            <p>1. Press START below</p>
            <p>2. Place your phone on your forehead facing others</p>
            <p>3. Tap LEFT side = Correct guess ✓</p>
            <p>4. Tap RIGHT side = Skip word ✗</p>
            <p>5. You have 2 minutes!</p>
          </div>
          <Button size="lg" class="w-full max-w-md mt-8" @click="startGame">
            START GAME
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Active game screen with tap zones -->
    <div v-else-if="gameStarted && !gameEnded" class="min-h-screen flex flex-col">
      <!-- Timer and score bar -->
      <div class="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="text-2xl font-bold">⏱️ {{ timeRemaining }}s</div>
          <div class="text-2xl font-bold">✓ {{ correctCount }} | ✗ {{ wrongCount }}</div>
        </div>
      </div>

      <!-- Main game area with left/right tap zones -->
      <div class="flex-1 flex">
        <!-- Left tap zone (Correct) -->
        <div 
          class="flex-1 cursor-pointer"
          role="button"
          aria-label="Mark answer as correct"
          @click="markCorrect"
        />

        <!-- Center word display -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="bg-white/95 rounded-2xl p-12 shadow-2xl max-w-2xl mx-4 text-center">
            <div class="text-6xl md:text-8xl font-bold text-primary break-words">
              {{ currentWord }}
            </div>
          </div>
        </div>

        <!-- Right tap zone (Skip/Wrong) -->
        <div 
          class="flex-1 cursor-pointer"
          role="button"
          aria-label="Skip or mark answer as wrong"
          @click="markWrong"
        />
      </div>
    </div>

    <!-- End game screen -->
    <div v-else-if="gameEnded" class="min-h-screen flex flex-col p-4 max-w-2xl mx-auto justify-center">
      <Card>
        <CardContent class="py-12 text-center space-y-6">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-4xl font-bold">Time's Up!</h2>
          
          <div class="my-8 space-y-4">
            <div class="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg">
              <div class="text-5xl font-bold text-green-600 dark:text-green-400">{{ correctCount }}</div>
              <div class="text-xl text-green-700 dark:text-green-300 mt-2">Correct Guesses ✓</div>
            </div>
            
            <div class="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
              <div class="text-3xl font-bold text-red-600 dark:text-red-400">{{ wrongCount }}</div>
              <div class="text-lg text-red-700 dark:text-red-300 mt-2">Skipped Words ✗</div>
            </div>
          </div>

          <div class="space-y-3">
            <Button size="lg" class="w-full" @click="playAgain">
              Play Again
            </Button>
            <Button variant="outline" size="lg" class="w-full" @click="chooseNewTheme">
              Choose Different Theme
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { themes } from '@/data/themes'

const route = useRoute()
const themeId = computed(() => route.params.id as string)

// Find the selected theme
const selectedTheme = computed(() => themes.find(t => t.id === themeId.value))

// Game state
const gameStarted = ref(false)
const gameEnded = ref(false)
const timeRemaining = ref(120) // 2 minutes in seconds
const currentWord = ref('')
const correctCount = ref(0)
const wrongCount = ref(0)
const usedWords = ref<string[]>([])
const availableWords = ref<string[]>([])

let timerInterval: number | null = null

// Initialize game
function initializeGame() {
  if (!selectedTheme.value) {
    navigateTo('/')
    return
  }
  
  availableWords.value = [...selectedTheme.value.words]
  shuffleArray(availableWords.value)
  usedWords.value = []
  correctCount.value = 0
  wrongCount.value = 0
  timeRemaining.value = 120
  gameEnded.value = false
  nextWord()
}

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

// Start the game
function startGame() {
  gameStarted.value = true
  initializeGame()
  
  // Start timer
  timerInterval = setInterval(() => {
    timeRemaining.value--
    
    if (timeRemaining.value <= 0) {
      endGame()
    }
  }, 1000)
}

// End the game
function endGame() {
  gameStarted.value = false
  gameEnded.value = true
  
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Mark word as correct
function markCorrect() {
  correctCount.value++
  usedWords.value.push(currentWord.value)
  nextWord()
}

// Mark word as wrong/skip
function markWrong() {
  wrongCount.value++
  usedWords.value.push(currentWord.value)
  nextWord()
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

// Cleanup on unmount
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

// Redirect if theme not found
onMounted(() => {
  if (!selectedTheme.value) {
    navigateTo('/')
  }
})
</script>
