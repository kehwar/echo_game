<template>
  <div class="min-h-screen p-4 max-w-2xl mx-auto">
    <header class="my-8">
      <NuxtLink to="/" class="inline-block mb-4 text-primary hover:underline">
        ← Back to Home
      </NuxtLink>
      <h1 class="text-4xl font-bold text-foreground">Create New Game</h1>
    </header>

    <main>
      <Card>
        <form @submit.prevent="createGame">
          <CardContent class="pt-6 space-y-6">
            <div class="space-y-2">
              <Label for="hostName">Your Name</Label>
              <Input
                id="hostName"
                v-model="hostName"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="roundDuration">Round Duration (seconds)</Label>
              <Input
                id="roundDuration"
                v-model.number="roundDuration"
                type="number"
                min="30"
                max="180"
                step="15"
              />
            </div>

            <div class="space-y-2">
              <Label for="maxRounds">Number of Rounds</Label>
              <Input
                id="maxRounds"
                v-model.number="maxRounds"
                type="number"
                min="1"
                max="20"
              />
            </div>

            <Button type="submit" class="w-full" size="lg">
              Create Game Room
            </Button>
          </CardContent>
        </form>

        <CardContent v-if="roomCode" class="border-t border-border">
          <div class="text-center space-y-4">
            <CardTitle class="text-2xl">Room Created!</CardTitle>
            <div class="text-5xl font-bold text-primary bg-muted p-6 rounded-lg tracking-widest">
              {{ roomCode }}
            </div>
            <p class="text-muted-foreground">Share this code with your friends to join</p>
            <Button class="w-full" size="lg" @click="startGame">
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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
