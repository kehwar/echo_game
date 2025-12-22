<template>
  <div class="h-screen flex flex-col p-4 max-w-2xl mx-auto justify-center overflow-y-auto">
    <header class="text-center mb-8">
      <NuxtLink to="/" class="inline-block mb-4 text-primary hover:underline">
        {{ t('game.backToThemes') }}
      </NuxtLink>
      <h1 class="text-4xl font-bold text-foreground mb-4">{{ t(`themes.${themeId}.name`) }}</h1>
      <p class="text-xl text-muted-foreground">{{ t(`themes.${themeId}.description`) }}</p>
    </header>

    <Card class="mb-8">
      <CardContent class="py-12 text-center space-y-6">
        <div class="text-6xl mb-4">📱</div>
        <h2 class="text-2xl font-bold">{{ t('game.preGame.readyToPlay') }}</h2>
        <div class="text-left max-w-md mx-auto space-y-3 text-muted-foreground">
          <p>{{ t('game.preGame.step1') }}</p>
          <p>{{ t('game.preGame.step2') }}</p>
          <p>{{ t('game.preGame.step3') }}</p>
          <p>{{ t('game.preGame.step4') }}</p>
          <p>{{ t('game.preGame.step5') }}</p>
          <p>{{ t('game.preGame.step6', { duration: selectedDuration }) }}</p>
        </div>
        
        <div class="max-w-md mx-auto mt-6">
          <label class="block text-sm font-medium mb-3">{{ t('game.preGame.durationLabel') }}</label>
          <div class="flex gap-3 justify-center">
            <button
              v-for="duration in durationOptions"
              :key="duration"
              :class="[
                'px-6 py-3 rounded-lg font-medium transition-all',
                selectedDuration === duration
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              ]"
              @click="updateDuration(duration)"
            >
              {{ duration }}s
            </button>
          </div>
        </div>
        
        <Button size="lg" class="w-full max-w-md mt-8" @click="$emit('start')">
          {{ t('game.preGame.startButton') }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  themeId: string
  durationOptions: number[]
  selectedDuration: number
}

defineProps<Props>()
const emit = defineEmits<{
  start: []
  'update:selectedDuration': [value: number]
}>()

const { t } = useI18n()

const updateDuration = (value: number) => {
  emit('update:selectedDuration', value)
}
</script>
