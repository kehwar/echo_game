<template>
  <div class="min-h-screen flex flex-col p-4 max-w-7xl mx-auto">
    <header class="text-center my-8">
      <h1 class="text-5xl md:text-6xl font-bold mb-2 text-foreground">🎭 Echo Game</h1>
      <p class="text-xl text-muted-foreground">Play charades with your friends!</p>
    </header>

    <main class="flex-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        <NuxtLink to="/create">
          <Card class="h-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle class="text-2xl text-primary-foreground">Create Game</CardTitle>
              <CardDescription class="text-primary-foreground/90">
                Start a new game room and invite your friends
              </CardDescription>
            </CardHeader>
          </Card>
        </NuxtLink>

        <NuxtLink to="/join">
          <Card class="h-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle class="text-2xl text-primary-foreground">Join Game</CardTitle>
              <CardDescription class="text-primary-foreground/90">
                Enter a room code to join an existing game
              </CardDescription>
            </CardHeader>
          </Card>
        </NuxtLink>
      </div>

      <Card class="my-8">
        <CardHeader>
          <CardTitle class="text-2xl">How to Play</CardTitle>
        </CardHeader>
        <CardContent>
          <ol class="space-y-3 list-decimal list-inside text-muted-foreground">
            <li>One player creates a game room and shares the room code</li>
            <li>Other players join using the room code</li>
            <li>Take turns acting out words while others guess</li>
            <li>Score points for correct guesses within the time limit</li>
            <li>The player with the most points wins!</li>
          </ol>
        </CardContent>
      </Card>
    </main>

    <footer class="text-center py-8 text-muted-foreground border-t border-border mt-8">
      <p>Built with Nuxt 4 | Deployed on GitHub Pages</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
</script>
