<template>
  <div class="h-screen relative flex">
    <!-- Pause button - absolute positioned at top left -->
    <button 
      class="absolute top-4 left-4 z-50 text-2xl font-bold p-3 bg-primary/80 hover:bg-primary text-primary-foreground rounded-lg transition-colors shadow-lg pointer-events-auto"
      :aria-label="t('game.ariaLabels.pauseGame')"
      @click="$emit('pause')"
    >
      ⏸️
    </button>

    <!-- Timer - absolute positioned at top center -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 text-3xl font-bold px-6 py-3 bg-primary/80 text-primary-foreground rounded-lg shadow-lg pointer-events-none">
      ⏱️ {{ timeRemaining }}s
    </div>

    <!-- Left tap zone (Correct) -->
    <div 
      class="flex-1 cursor-pointer"
      role="button"
      :aria-label="t('game.ariaLabels.markCorrect')"
      @click="$emit('tap', 'correct')"
    />

    <!-- Center card display -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="bg-white/95 rounded-2xl p-12 shadow-2xl max-w-2xl mx-4 text-center">
        <div class="text-6xl md:text-8xl font-bold text-primary break-words">
          {{ currentCard }}
        </div>
      </div>
    </div>

    <!-- Right tap zone (Skip/Wrong) -->
    <div 
      class="flex-1 cursor-pointer"
      role="button"
      :aria-label="t('game.ariaLabels.markSkip')"
      @click="$emit('tap', 'wrong')"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentCard: string
  timeRemaining: number
}

defineProps<Props>()
defineEmits<{
  tap: [action: 'correct' | 'wrong']
  pause: []
}>()

const { t } = useI18n()
</script>
