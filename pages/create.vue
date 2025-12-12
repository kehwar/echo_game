<template>
  <div class="container">
    <header class="header">
      <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
      <h1>Create New Game</h1>
    </header>

    <main class="main-content">
      <div class="form-card">
        <form @submit.prevent="createGame">
          <div class="form-group">
            <label for="hostName">Your Name</label>
            <input
              id="hostName"
              v-model="hostName"
              type="text"
              placeholder="Enter your name"
              required
            >
          </div>

          <div class="form-group">
            <label for="roundDuration">Round Duration (seconds)</label>
            <input
              id="roundDuration"
              v-model.number="roundDuration"
              type="number"
              min="30"
              max="180"
              step="15"
            >
          </div>

          <div class="form-group">
            <label for="maxRounds">Number of Rounds</label>
            <input
              id="maxRounds"
              v-model.number="maxRounds"
              type="number"
              min="1"
              max="20"
            >
          </div>

          <button type="submit" class="btn-primary">
            Create Game Room
          </button>
        </form>

        <div v-if="roomCode" class="room-code-display">
          <h2>Room Created!</h2>
          <div class="room-code">{{ roomCode }}</div>
          <p>Share this code with your friends to join</p>
          <button class="btn-primary" @click="startGame">
            Start Game
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const hostName = ref('')
const roundDuration = ref(60)
const maxRounds = ref(5)
const roomCode = ref('')

function createGame() {
  // Generate a random 6-character room code
  roomCode.value = Math.random().toString(36).substring(2, 8).toUpperCase()
}

function startGame() {
  // Navigate to game room with the code
  navigateTo(`/game/${roomCode.value}`)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  margin: 2rem 0;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #667eea;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.room-code-display {
  margin-top: 2rem;
  text-align: center;
}

.room-code-display h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.room-code {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  letter-spacing: 0.2em;
  margin: 1rem 0;
}
</style>
