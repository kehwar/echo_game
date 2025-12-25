<template>
  <div class="h-screen flex flex-col p-4 max-w-2xl mx-auto">
    <div class="flex-1 flex flex-col min-h-0">
      <Card class="flex flex-col flex-1 min-h-0">
        <CardContent class="py-6 text-center flex flex-col flex-1 min-h-0">
          <div class="flex-shrink-0">
            <div class="text-5xl mb-2">🎉</div>
            <h2 class="text-3xl font-bold">{{ t('game.results.title') }}</h2>
          </div>
          
          <div class="flex-1 overflow-y-auto my-4 space-y-3 min-h-0">
            <div class="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
              <div class="text-4xl font-bold text-green-600 dark:text-green-400">{{ correctCount }}</div>
              <div class="text-lg text-green-700 dark:text-green-300 mt-1">{{ t('game.results.correctGuesses') }}</div>
              <div v-if="correctCards.length > 0" class="mt-3 text-left max-h-32 overflow-y-auto">
                <div class="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">{{ t('game.results.cardsGuessed') }}</div>
                <div class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="card in correctCards" 
                    :key="card"
                    class="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full text-xs"
                  >
                    {{ card }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg border-2 border-primary">
              <div class="text-4xl font-bold text-primary">{{ accuracy }}%</div>
              <div class="text-lg text-primary mt-1">{{ t('game.results.accuracy') }}</div>
            </div>
            
            <div class="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ wrongCount }}</div>
              <div class="text-base text-red-700 dark:text-red-300 mt-1">{{ t('game.results.skippedCards') }}</div>
              <div v-if="skippedCards.length > 0" class="mt-3 text-left max-h-32 overflow-y-auto">
                <div class="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">{{ t('game.results.cardsSkipped') }}</div>
                <div class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="card in skippedCards" 
                    :key="card"
                    class="inline-block bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full text-xs"
                  >
                    {{ card }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2 flex-shrink-0">
            <Button size="lg" class="w-full" @click="$emit('playAgain')">
              {{ t('game.results.playAgainButton') }}
            </Button>
            <Button variant="outline" size="lg" class="w-full" @click="$emit('chooseNewDeck')">
              {{ t('game.results.chooseDifferentButton') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  correctCount: number
  wrongCount: number
  correctCards: string[]
  skippedCards: string[]
}

const props = defineProps<Props>()
defineEmits<{
  playAgain: []
  chooseNewDeck: []
}>()

const { t } = useI18n()

// Calculate accuracy percentage
// Note: wrongCount represents skipped cards (cards that were skipped/passed)
const accuracy = computed(() => {
  const total = props.correctCount + props.wrongCount
  if (total === 0) return 0
  return Math.round((props.correctCount / total) * 100)
})
</script>
