<template>
  <div class="h-full relative flex">
    <!-- Pause button - absolutely positioned based on settings -->
    <button 
      :class="[
        'absolute top-4 z-50 p-2 text-gray-600 hover:text-gray-800 transition-colors pointer-events-auto',
        pauseButtonPosition === 'left' ? 'left-4' : 'right-4'
      ]"
      :aria-label="t('game.ariaLabels.pauseGame')"
      @click="$emit('pause')"
    >
      <Pause :size="24" />
    </button>

    <!-- Timer - absolute positioned at top center -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 text-lg font-semibold px-3 py-1 text-gray-600 pointer-events-none">
      {{ timeRemaining }}s
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
      <div class="bg-white/95 rounded-2xl p-12 shadow-2xl max-w-2xl mx-4 text-center flex flex-col justify-center" style="max-height: 80vh;">
        <div 
          ref="cardTextRef"
          class="font-bold text-primary break-words leading-tight"
          style="white-space: pre-wrap; word-break: break-word;"
        >
          {{ currentCardText }}
        </div>
        <div 
          v-if="currentCardSubtext"
          ref="cardSubtextRef"
          class="font-medium text-primary/70 break-words mt-4 leading-tight"
          style="white-space: pre-wrap; word-break: break-word;"
        >
          {{ currentCardSubtext }}
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
import { Pause } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { useFitty } from '@/composables/useFitty'

interface Props {
  currentCardText: string
  currentCardSubtext?: string
  timeRemaining: number
}

const props = defineProps<Props>()
defineEmits<{
  tap: [action: 'correct' | 'wrong']
  pause: []
}>()

const { t } = useI18n()
const settingsStore = useSettingsStore()
const pauseButtonPosition = computed(() => settingsStore.pauseButtonPosition)

// Refs for text elements
const cardTextRef = ref<HTMLElement | null>(null)
const cardSubtextRef = ref<HTMLElement | null>(null)

// Initialize Fitty for card text with appropriate sizing
const { refresh: refreshCardText } = useFitty(cardTextRef, {
  minSize: 32,
  maxSize: 200,
  multiLine: true,
})

// Initialize Fitty for card subtext
const { refresh: refreshSubtext } = useFitty(cardSubtextRef, {
  minSize: 24,
  maxSize: 120,
  multiLine: true,
})

// Watch for card text changes and refresh Fitty
watch(() => props.currentCardText, () => {
  nextTick(() => {
    refreshCardText()
  })
})

// Watch for subtext changes
watch(() => props.currentCardSubtext, () => {
  nextTick(() => {
    refreshSubtext()
  })
})
</script>
