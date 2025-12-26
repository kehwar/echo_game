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
      <div class="bg-white/95 rounded-2xl p-12 shadow-2xl max-w-2xl mx-4 text-center">
        <div 
          :style="cardTextStyle"
          class="font-bold text-primary break-words"
        >
          {{ currentCardText }}
        </div>
        <div 
          v-if="currentCardSubtext" 
          :style="cardSubtextStyle"
          class="font-medium text-primary/70 break-words mt-4"
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

/**
 * Calculate the font size for card text based on settings
 */
const cardTextStyle = computed(() => {
  const { fontSize, fontFamily, autoScaleFont, scaleFactor } = settingsStore
  
  if (!autoScaleFont) {
    // Use fixed font size
    return {
      fontSize: `${fontSize}rem`,
      fontFamily: fontFamily === 'sans-serif' ? 'inherit' : fontFamily
    }
  }
  
  // Auto-scale based on character count
  const textLength = props.currentCardText.length
  let scale = 1.0
  
  // Scale down for longer text
  if (textLength > 20) {
    scale = 0.7
  } else if (textLength > 15) {
    scale = 0.8
  } else if (textLength > 10) {
    scale = 0.9
  }
  
  // Apply user's scale factor
  scale *= scaleFactor
  
  const calculatedSize = fontSize * scale
  
  return {
    fontSize: `${calculatedSize}rem`,
    fontFamily: fontFamily === 'sans-serif' ? 'inherit' : fontFamily
  }
})

/**
 * Calculate the font size for card subtext
 */
const cardSubtextStyle = computed(() => {
  const { fontFamily, autoScaleFont, scaleFactor } = settingsStore
  
  if (!autoScaleFont) {
    // Use fixed font size (half of main text)
    return {
      fontSize: `${settingsStore.fontSize / 2}rem`,
      fontFamily: fontFamily === 'sans-serif' ? 'inherit' : fontFamily
    }
  }
  
  // Auto-scale based on character count
  const textLength = props.currentCardSubtext?.length || 0
  let scale = 0.5 // Subtext is always smaller
  
  // Scale down for longer text
  if (textLength > 20) {
    scale = 0.35
  } else if (textLength > 15) {
    scale = 0.4
  } else if (textLength > 10) {
    scale = 0.45
  }
  
  // Apply user's scale factor
  scale *= scaleFactor
  
  const calculatedSize = settingsStore.fontSize * scale
  
  return {
    fontSize: `${calculatedSize}rem`,
    fontFamily: fontFamily === 'sans-serif' ? 'inherit' : fontFamily
  }
})
</script>
