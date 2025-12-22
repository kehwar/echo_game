<template>
  <div class="h-screen flex flex-col p-4 max-w-7xl mx-auto overflow-y-auto">
    <header class="text-center my-8">
      <div class="flex justify-between items-center mb-4">
        <NuxtLink to="/">
          <Button variant="outline" size="sm">
            ← {{ t('history.backButton') }}
          </Button>
        </NuxtLink>
        <Button 
          v-if="history.length > 0"
          variant="outline" 
          size="sm" 
          @click="showClearConfirm = true"
        >
          🗑️ {{ t('history.clearButton') }}
        </Button>
      </div>
      <h1 class="text-5xl md:text-6xl font-bold mb-2 text-foreground">📊 {{ t('history.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('history.subtitle') }}</p>
    </header>

    <main class="flex-1 pb-8">
      <!-- Empty state -->
      <div v-if="history.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🎮</div>
        <h2 class="text-2xl font-bold mb-2">{{ t('history.emptyState.title') }}</h2>
        <p class="text-muted-foreground mb-6">{{ t('history.emptyState.description') }}</p>
        <NuxtLink to="/">
          <Button size="lg">
            {{ t('history.emptyState.playButton') }}
          </Button>
        </NuxtLink>
      </div>

      <!-- History list -->
      <div v-else class="space-y-4">
        <Card 
          v-for="record in history" 
          :key="record.id"
          class="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <CardTitle class="text-2xl">{{ record.deckName }}</CardTitle>
                <CardDescription class="mt-1">
                  {{ formatDateTime(record.startDateTime) }}
                </CardDescription>
              </div>
              <div class="flex items-center gap-2">
                <div 
                  :class="[
                    'text-2xl font-bold px-4 py-2 rounded-lg',
                    getAccuracyColorClass(record.accuracy)
                  ]"
                >
                  {{ record.accuracy }}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Duration -->
              <div class="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {{ formatDuration(record.duration) }}
                </div>
                <div class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {{ t('history.duration') }}
                </div>
              </div>

              <!-- Correct words -->
              <div class="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                  {{ record.correctWords.length }}
                </div>
                <div class="text-sm text-green-700 dark:text-green-300 mt-1">
                  {{ t('history.correctWords') }}
                </div>
              </div>

              <!-- Skipped words -->
              <div class="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <div class="text-3xl font-bold text-red-600 dark:text-red-400">
                  {{ record.skippedWords.length }}
                </div>
                <div class="text-sm text-red-700 dark:text-red-300 mt-1">
                  {{ t('history.skippedWords') }}
                </div>
              </div>
            </div>

            <!-- Word lists (expandable) -->
            <div v-if="expandedRecords.has(record.id)" class="mt-4 space-y-3">
              <div v-if="record.correctWords.length > 0">
                <div class="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                  {{ t('history.correctWordsList') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="word in record.correctWords" 
                    :key="word"
                    class="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >
                    {{ word }}
                  </span>
                </div>
              </div>
              
              <div v-if="record.skippedWords.length > 0">
                <div class="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                  {{ t('history.skippedWordsList') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="word in record.skippedWords" 
                    :key="word"
                    class="inline-block bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm"
                  >
                    {{ word }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Toggle details button -->
            <div class="mt-4 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                @click="toggleExpanded(record.id)"
              >
                {{ expandedRecords.has(record.id) ? t('history.hideDetails') : t('history.showDetails') }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>

    <!-- Clear confirmation dialog -->
    <div 
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="showClearConfirm = false"
    >
      <Card 
        class="max-w-md w-full"
        @click.stop
      >
        <CardHeader>
          <CardTitle>{{ t('history.clearConfirm.title') }}</CardTitle>
          <CardDescription>{{ t('history.clearConfirm.description') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex gap-3">
          <Button 
            variant="outline" 
            class="flex-1"
            @click="showClearConfirm = false"
          >
            {{ t('history.clearConfirm.cancel') }}
          </Button>
          <Button 
            variant="destructive" 
            class="flex-1"
            @click="clearAllHistory"
          >
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

const { t } = useI18n()
const gameHistory = useGameHistory()

// Reactive state
const history = ref(gameHistory.getHistory())
const showClearConfirm = ref(false)
const expandedRecords = ref(new Set<string>())

// Update history when component is mounted
onMounted(() => {
  history.value = gameHistory.getHistory()
})

/**
 * Format date and time for display
 */
function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/**
 * Format duration in minutes and seconds
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get color class based on accuracy percentage
 */
function getAccuracyColorClass(accuracy: number): string {
  if (accuracy >= 80) {
    return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  } else if (accuracy >= 60) {
    return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
  } else if (accuracy >= 40) {
    return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
  } else {
    return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
  }
}

/**
 * Toggle expanded state for a record
 */
function toggleExpanded(recordId: string) {
  if (expandedRecords.value.has(recordId)) {
    expandedRecords.value.delete(recordId)
  } else {
    expandedRecords.value.add(recordId)
  }
}

/**
 * Clear all history
 */
function clearAllHistory() {
  gameHistory.clearHistory()
  history.value = []
  showClearConfirm.value = false
}
</script>
