<template>
  <div class="error-page">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <NuxtLink to="/" class="home-link">
      🏠 Back to Home
    </NuxtLink>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.error-page h1 {
  font-size: 6rem;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-page h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.error-page p {
  font-size: 1.25rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.home-link {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  transition: transform 0.2s;
}

.home-link:hover {
  transform: translateY(-2px);
}
</style>
