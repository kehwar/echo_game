<template>
  <div class="min-h-screen p-4 max-w-7xl mx-auto">
    <header class="mb-8">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <h1 class="text-3xl font-bold text-foreground">Room: {{ roomCode }}</h1>
        <Button variant="secondary" @click="leaveGame">
          Leave Game
        </Button>
      </div>
    </header>

    <main class="space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card class="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0">
          <CardContent class="p-6 text-center">
            <h3 class="text-lg font-semibold">Round {{ currentRound }} / {{ maxRounds }}</h3>
          </CardContent>
        </Card>
        <Card class="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0">
          <CardContent class="p-6 text-center">
            <h3 class="text-lg font-semibold">Time: {{ timeRemaining }}s</h3>
          </CardContent>
        </Card>
        <Card class="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0">
          <CardContent class="p-6 text-center">
            <h3 class="text-lg font-semibold">Score: {{ score }}</h3>
          </CardContent>
        </Card>
      </div>

      <Card v-if="!gameStarted" class="bg-muted">
        <CardContent class="py-12 text-center">
          <h2 class="text-2xl font-bold mb-4">Waiting for game to start...</h2>
          <p class="text-muted-foreground mb-2">
            Room Code: <strong class="text-foreground">{{ roomCode }}</strong>
          </p>
          <p class="text-muted-foreground">Share this code with your friends!</p>
        </CardContent>
      </Card>

      <Card v-else>
        <CardContent class="py-8">
          <div class="text-center space-y-8">
            <div>
              <h2 v-if="isActing" class="text-2xl font-bold mb-4">Your word:</h2>
              <h2 v-else class="text-2xl font-bold mb-4">Guess the word!</h2>
              <div v-if="isActing" class="text-5xl md:text-6xl font-bold text-primary bg-muted p-8 rounded-lg">
                {{ currentWord }}
              </div>
              <div v-else class="text-5xl md:text-6xl bg-muted p-8 rounded-lg">
                ***
              </div>
            </div>

            <div class="flex justify-center gap-4">
              <Button v-if="isActing" variant="outline" size="lg" @click="skipWord">
                Skip Word
              </Button>
              <Button v-else size="lg" @click="guessCorrect">
                Correct Guess!
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2">
            <li
              v-for="player in players"
              :key="player"
              :class="cn(
                'p-3 rounded-md transition-colors',
                player === currentActor
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted'
              )"
            >
              {{ player }} {{ player === currentActor ? '(Acting)' : '' }}
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const route = useRoute()
const roomCode = computed(() => route.params.id as string)

const gameStarted = ref(false)
const currentRound = ref(1)
const maxRounds = ref(5)
const timeRemaining = ref(60)
const score = ref(0)
const currentWord = ref('ELEPHANT')
const isActing = ref(true)
const currentActor = ref('Player 1')
const players = ref(['Player 1', 'Player 2', 'Player 3'])

// Sample words for charades
const words = [
  'ELEPHANT', 'PIZZA', 'SUPERHERO', 'DANCING', 'GUITAR',
  'BASKETBALL', 'RAINBOW', 'ASTRONAUT', 'KARATE', 'PHOTOGRAPHY'
]

function leaveGame() {
  navigateTo('/')
}

function skipWord() {
  currentWord.value = words[Math.floor(Math.random() * words.length)]
}

function guessCorrect() {
  score.value += 10
  currentWord.value = words[Math.floor(Math.random() * words.length)]
}

// Auto-start game for demo purposes
onMounted(() => {
  setTimeout(() => {
    gameStarted.value = true
  }, 2000)
})
</script>
