<template>
  <div class="container">
    <header class="header">
      <div class="room-info">
        <h1>Room: {{ roomCode }}</h1>
        <button class="btn-secondary" @click="leaveGame">Leave Game</button>
      </div>
    </header>

    <main class="game-area">
      <div class="game-status">
        <div class="status-card">
          <h3>Round {{ currentRound }} / {{ maxRounds }}</h3>
        </div>
        <div class="status-card">
          <h3>Time: {{ timeRemaining }}s</h3>
        </div>
        <div class="status-card">
          <h3>Score: {{ score }}</h3>
        </div>
      </div>

      <div v-if="!gameStarted" class="waiting-area">
        <h2>Waiting for game to start...</h2>
        <p>Room Code: <strong>{{ roomCode }}</strong></p>
        <p>Share this code with your friends!</p>
      </div>

      <div v-else class="game-play-area">
        <div class="word-display">
          <h2 v-if="isActing">Your word:</h2>
          <h2 v-else>Guess the word!</h2>
          <div v-if="isActing" class="word">{{ currentWord }}</div>
          <div v-else class="word-hidden">***</div>
        </div>

        <div class="action-buttons">
          <button v-if="isActing" class="btn-warning" @click="skipWord">
            Skip Word
          </button>
          <button v-else class="btn-success" @click="guessCorrect">
            Correct Guess!
          </button>
        </div>
      </div>

      <div class="players-list">
        <h3>Players</h3>
        <ul>
          <li v-for="player in players" :key="player" :class="{ active: player === currentActor }">
            {{ player }} {{ player === currentActor ? '(Acting)' : '' }}
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
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

<style scoped>
.container {
  min-height: 100vh;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.room-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.room-info h1 {
  margin: 0;
  color: #2c3e50;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.game-area {
  display: grid;
  gap: 2rem;
}

.game-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
}

.status-card h3 {
  margin: 0;
  font-size: 1.25rem;
}

.waiting-area {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 1rem;
}

.waiting-area h2 {
  color: #2c3e50;
}

.game-play-area {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.word-display {
  text-align: center;
  margin-bottom: 2rem;
}

.word-display h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.word {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 1rem;
}

.word-hidden {
  font-size: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-warning {
  padding: 1rem 2rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-success {
  padding: 1rem 2rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
}

.players-list {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.players-list h3 {
  margin-top: 0;
  color: #2c3e50;
}

.players-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.players-list li {
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.players-list li.active {
  background: #667eea;
  color: white;
  font-weight: 600;
}

@media (max-width: 768px) {
  .word {
    font-size: 2rem;
  }
}
</style>
