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
            <p>5. You have {{ selectedDuration }} seconds!</p>
          </div>
          
          <div class="max-w-md mx-auto mt-6">
            <label class="block text-sm font-medium mb-3">Round Duration</label>
            <div class="flex gap-3 justify-center">
              <button
                v-for="duration in durationOptions"
                :key="duration"
                :class="[
                  'px-6 py-3 rounded-lg font-medium transition-all',
                  selectedDuration === duration
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="selectedDuration = duration"
              >
                {{ duration }}s
              </button>
            </div>
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
      <div class="flex-1 flex relative">
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

        <!-- End Game Button -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <Button 
            variant="outline" 
            size="lg" 
            class="pointer-events-auto bg-white/95 hover:bg-white shadow-lg"
            @click="endGame"
          >
            End Game
          </Button>
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
              <div v-if="correctWords.length > 0" class="mt-4 text-left max-h-48 overflow-y-auto">
                <div class="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">Words guessed:</div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="word in correctWords" 
                    :key="word"
                    class="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >
                    {{ word }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
              <div class="text-3xl font-bold text-red-600 dark:text-red-400">{{ wrongCount }}</div>
              <div class="text-lg text-red-700 dark:text-red-300 mt-2">Skipped Words ✗</div>
              <div v-if="skippedWords.length > 0" class="mt-4 text-left max-h-48 overflow-y-auto">
                <div class="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">Words skipped:</div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="word in skippedWords" 
                    :key="word"
                    class="inline-block bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm"
                  >
                    {{ word }}
                  </span>
                </div>
              </div>
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
  if (!correctWords.value.includes(currentWord.value)) {
    correctWords.value.push(currentWord.value)
  }
  usedWords.value.push(currentWord.value)
  nextWord()
}

// Mark word as wrong/skip
function markWrong() {
  wrongCount.value++
  if (!skippedWords.value.includes(currentWord.value)) {
    skippedWords.value.push(currentWord.value)
  }
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
