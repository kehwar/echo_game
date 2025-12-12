<template>
  <div class="container">
    <header class="header">
      <h1>🎭 Echo Game</h1>
      <p class="subtitle">Play charades with your friends!</p>
    </header>

    <main class="main-content">
      <div class="game-modes">
        <NuxtLink to="/create" class="game-mode-card">
          <h2>Create Game</h2>
          <p>Start a new game room and invite your friends</p>
        </NuxtLink>

        <NuxtLink to="/join" class="game-mode-card">
          <h2>Join Game</h2>
          <p>Enter a room code to join an existing game</p>
        </NuxtLink>
      </div>

      <section class="how-to-play">
        <h2>How to Play</h2>
        <ol>
          <li>One player creates a game room and shares the room code</li>
          <li>Other players join using the room code</li>
          <li>Take turns acting out words while others guess</li>
          <li>Score points for correct guesses within the time limit</li>
          <li>The player with the most points wins!</li>
        </ol>
      </section>
    </main>

    <footer class="footer">
      <p>Built with Nuxt 4 | Deployed on GitHub Pages</p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin: 2rem 0;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.25rem;
  color: #7f8c8d;
}

.main-content {
  flex: 1;
}

.game-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.game-mode-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.game-mode-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.game-mode-card p {
  margin: 0;
  opacity: 0.9;
}

.how-to-play {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 1rem;
  margin: 2rem 0;
}

.how-to-play h2 {
  color: #2c3e50;
  margin-top: 0;
}

.how-to-play ol {
  line-height: 1.8;
  color: #34495e;
}

.footer {
  text-align: center;
  padding: 2rem 0;
  color: #7f8c8d;
  border-top: 1px solid #ecf0f1;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .game-modes {
    grid-template-columns: 1fr;
  }
}
</style>
