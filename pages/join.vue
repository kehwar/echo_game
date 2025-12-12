<template>
  <div class="min-h-screen p-4 max-w-2xl mx-auto">
    <header class="my-8">
      <NuxtLink to="/" class="inline-block mb-4 text-primary hover:underline">
        ← Back to Home
      </NuxtLink>
      <h1 class="text-4xl font-bold text-foreground">Join Game</h1>
    </header>

    <main>
      <Card>
        <form @submit.prevent="joinGame">
          <CardContent class="pt-6 space-y-6">
            <div class="space-y-2">
              <Label for="playerName">Your Name</Label>
              <Input
                id="playerName"
                v-model="playerName"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                v-model="roomCode"
                type="text"
                placeholder="Enter 6-character code"
                maxlength="6"
                required
                class="uppercase"
              />
            </div>

            <Button type="submit" class="w-full" size="lg">
              Join Game
            </Button>
          </CardContent>
        </form>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const playerName = ref('')
const roomCode = ref('')

function joinGame() {
  if (playerName.value && roomCode.value) {
    // Navigate to game room with the code
    navigateTo(`/game/${roomCode.value.toUpperCase()}`)
  }
}
</script>
