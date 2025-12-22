<template>
  <div class="h-screen flex flex-col p-4 max-w-2xl mx-auto justify-center overflow-y-auto">
    <Card>
      <CardContent class="py-12 text-center space-y-6">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-4xl font-bold">{{ t('game.results.title') }}</h2>
        
        <div class="my-8 space-y-4">
          <div class="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg">
            <div class="text-5xl font-bold text-green-600 dark:text-green-400">{{ correctCount }}</div>
            <div class="text-xl text-green-700 dark:text-green-300 mt-2">{{ t('game.results.correctGuesses') }}</div>
            <div v-if="correctWords.length > 0" class="mt-4 text-left max-h-48 overflow-y-auto">
              <div class="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">{{ t('game.results.wordsGuessed') }}</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="word in correctWords" 
                  :key="word"
                  class="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                >
                  {{ word }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
            <div class="text-3xl font-bold text-red-600 dark:text-red-400">{{ wrongCount }}</div>
            <div class="text-lg text-red-700 dark:text-red-300 mt-2">{{ t('game.results.skippedWords') }}</div>
            <div v-if="skippedWords.length > 0" class="mt-4 text-left max-h-48 overflow-y-auto">
              <div class="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">{{ t('game.results.wordsSkipped') }}</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="word in skippedWords" 
                  :key="word"
                  class="inline-block bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm"
                >
                  {{ word }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <Button size="lg" class="w-full" @click="$emit('playAgain')">
            {{ t('game.results.playAgainButton') }}
          </Button>
          <Button variant="outline" size="lg" class="w-full" @click="$emit('chooseNewTheme')">
            {{ t('game.results.chooseDifferentButton') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  correctCount: number
  wrongCount: number
  correctWords: string[]
  skippedWords: string[]
}

defineProps<Props>()
defineEmits<{
  playAgain: []
  chooseNewTheme: []
}>()

const { t } = useI18n()
</script>

