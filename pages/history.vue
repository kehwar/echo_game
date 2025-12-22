<template>
  <div class="min-h-screen flex flex-col p-4 max-w-7xl mx-auto">
    <header class="my-4">
      <div class="flex items-center justify-between mb-4">
        <NuxtLink to="/">
          <Button variant="outline" size="sm">
            {{ t('game.backToDecks') }}
          </Button>
        </NuxtLink>
        <Button 
          v-if="history.length > 0"
          variant="destructive" 
          size="sm"
          @click="showClearConfirm = true"
        >
          {{ t('history.clearButton') }}
        </Button>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-2 text-foreground">{{ t('history.title') }}</h1>
      <p class="text-lg text-muted-foreground">{{ t('history.subtitle') }}</p>
    </header>

    <main class="flex-1 pb-8">
      <!-- Empty state -->
      <div v-if="history.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="text-6xl mb-4">🎮</div>
        <h2 class="text-2xl font-bold mb-2">{{ t('history.empty.title') }}</h2>
        <p class="text-muted-foreground mb-6">{{ t('history.empty.description') }}</p>
        <NuxtLink to="/">
          <Button size="lg">
            {{ t('history.empty.playButton') }}
          </Button>
        </NuxtLink>
      </div>

      <!-- History list -->
      <div v-else class="space-y-4">
        <Card v-for="entry in history" :key="entry.id" class="overflow-hidden">
          <CardHeader class="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
            <div class="flex justify-between items-start">
              <div>
                <CardTitle class="text-2xl text-primary-foreground">{{ entry.deckName }}</CardTitle>
                <CardDescription class="text-primary-foreground/90 mt-1">
                  {{ formatDateTime(entry.startDateTime) }}
                </CardDescription>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-primary-foreground">{{ entry.accuracy }}%</div>
                <div class="text-sm text-primary-foreground/90">{{ t('history.accuracy') }}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent class="pt-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <!-- Duration -->
              <div class="bg-muted p-4 rounded-lg">
                <div class="text-sm text-muted-foreground mb-1">{{ t('history.duration') }}</div>
                <div class="text-2xl font-bold">{{ formatDuration(entry.duration) }}</div>
              </div>
              
              <!-- Correct words -->
              <div class="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                <div class="text-sm text-green-700 dark:text-green-300 mb-1">{{ t('history.correctWords') }}</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ entry.correctWords.length }}</div>
              </div>
              
              <!-- Skipped words -->
              <div class="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                <div class="text-sm text-red-700 dark:text-red-300 mb-1">{{ t('history.skippedWords') }}</div>
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ entry.skippedWords.length }}</div>
              </div>
            </div>

            <!-- Word lists -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Correct words list -->
              <div v-if="entry.correctWords.length > 0">
                <div class="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                  {{ t('history.correctWordsList') }}:
                </div>
                <div class="max-h-32 overflow-y-auto">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="word in entry.correctWords" 
                      :key="word"
                      class="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm"
                    >
                      {{ word }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Skipped words list -->
              <div v-if="entry.skippedWords.length > 0">
                <div class="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                  {{ t('history.skippedWordsList') }}:
                </div>
                <div class="max-h-32 overflow-y-auto">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="word in entry.skippedWords" 
                      :key="word"
                      class="inline-block bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm"
                    >
                      {{ word }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>

    <!-- Clear confirmation dialog -->
    <div 
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showClearConfirm = false"
    >
      <Card class="max-w-md w-full">
        <CardHeader>
          <CardTitle>{{ t('history.clearConfirm.title') }}</CardTitle>
          <CardDescription>{{ t('history.clearConfirm.description') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex gap-3">
          <Button variant="outline" class="flex-1" @click="showClearConfirm = false">
            {{ t('history.clearConfirm.cancel') }}
          </Button>
          <Button variant="destructive" class="flex-1" @click="confirmClearHistory">
            {{ t('history.clearConfirm.confirm') }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const { t, d } = useI18n()
const gameHistory = useGameHistory()

const history = ref(gameHistory.getHistory())
const showClearConfirm = ref(false)

// Format date and time
function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return d(date, 'long')
}

// Format duration in MM:SS format
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Clear history with confirmation
function confirmClearHistory() {
  gameHistory.clearHistory()
  history.value = []
  showClearConfirm.value = false
}

// Update history when component is mounted (in case it was updated elsewhere)
onMounted(() => {
  history.value = gameHistory.getHistory()
})
</script>
