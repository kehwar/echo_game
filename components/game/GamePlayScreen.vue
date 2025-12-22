<template>
  <div class="h-screen flex flex-col">
    <!-- Timer and pause bar -->
    <div class="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground p-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          class="text-2xl font-bold p-2 hover:bg-white/20 rounded-lg transition-colors"
          :aria-label="t('game.ariaLabels.pauseGame')"
          @click="$emit('pause')"
        >
          ⏸️
        </button>
        <div class="text-3xl font-bold">⏱️ {{ timeRemaining }}s</div>
        <button 
          class="text-2xl font-bold p-2 hover:bg-white/20 rounded-lg transition-colors"
          :aria-label="t('game.ariaLabels.pauseGame')"
          @click="$emit('pause')"
        >
          ⏸️
        </button>
      </div>
    </div>

    <!-- Main game area with left/right tap zones -->
    <div class="flex-1 flex relative">
      <!-- Left tap zone (Correct) -->
      <div 
        class="flex-1 cursor-pointer"
        role="button"
        :aria-label="t('game.ariaLabels.markCorrect')"
        @click="$emit('tap', 'correct')"
      />

      <!-- Center word display -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="bg-white/95 rounded-2xl p-12 shadow-2xl max-w-2xl mx-4 text-center">
          <div class="text-6xl md:text-8xl font-bold text-primary break-words">
            {{ currentWord }}
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
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentWord: string
  timeRemaining: number
}

defineProps<Props>()
defineEmits<{
  tap: [action: 'correct' | 'wrong']
  pause: []
}>()

const { t } = useI18n()
</script>
