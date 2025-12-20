<template>
  <div class="h-screen flex flex-col p-4 max-w-7xl mx-auto overflow-y-auto">
    <header class="text-center my-8">
      <h1 class="text-5xl md:text-6xl font-bold mb-2 text-foreground">🎭 Echo Game</h1>
      <p class="text-xl text-muted-foreground">The phone-on-forehead charades game!</p>
    </header>

    <main class="flex-1">
      <Card class="my-8">
        <CardHeader>
          <CardTitle class="text-2xl">How to Play</CardTitle>
        </CardHeader>
        <CardContent>
          <ol class="space-y-3 list-decimal list-inside text-muted-foreground">
            <li>Choose a theme below</li>
            <li>Place your phone on your forehead facing others</li>
            <li>Your friends give you clues about the word on the screen</li>
            <li>Tap the left side of the screen when you guess correctly</li>
            <li>Tap the right side to skip a word</li>
            <li>You have 2 minutes to guess as many words as possible!</li>
          </ol>
        </CardContent>
      </Card>

      <div class="my-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Choose a Theme</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="theme in themes" 
            :key="theme.id" 
            :to="`/game/${theme.id}`"
          >
            <Card class="h-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle class="text-2xl text-primary-foreground">{{ theme.name }}</CardTitle>
                <CardDescription class="text-primary-foreground/90">
                  {{ theme.description }}
                </CardDescription>
              </CardHeader>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </main>

    <footer class="text-center py-8 text-muted-foreground border-t border-border mt-8">
      <p>Built with Nuxt 4 | Deployed on GitHub Pages</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { themes } from '@/data/themes'
</script>
