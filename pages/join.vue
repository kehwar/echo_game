<template>
  <div class="container">
    <header class="header">
      <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
      <h1>Join Game</h1>
    </header>

    <main class="main-content">
      <div class="form-card">
        <form @submit.prevent="joinGame">
          <div class="form-group">
            <label for="playerName">Your Name</label>
            <input
              id="playerName"
              v-model="playerName"
              type="text"
              placeholder="Enter your name"
              required
            >
          </div>

          <div class="form-group">
            <label for="roomCode">Room Code</label>
            <input
              id="roomCode"
              v-model="roomCode"
              type="text"
              placeholder="Enter 6-character code"
              maxlength="6"
              required
            >
          </div>

          <button type="submit" class="btn-primary">
            Join Game
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const playerName = ref('')
const roomCode = ref('')

function joinGame() {
  if (playerName.value && roomCode.value) {
    // Navigate to game room with the code
    navigateTo(`/game/${roomCode.value.toUpperCase()}`)
  }
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
</style>
