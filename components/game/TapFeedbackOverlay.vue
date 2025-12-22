<template>
  <div 
    v-if="isVisible" 
    :class="[
      'absolute inset-0 flex items-center justify-center z-40 pointer-events-none transition-opacity duration-300',
      action === 'correct' ? 'bg-green-500/80' : 'bg-red-500/80',
      'animate-flash-fade'
    ]"
  >
    <div class="text-center">
      <div 
        class="text-[10rem] md:text-[15rem] font-bold text-white animate-flash-scale leading-none"
      >
        {{ action === 'correct' ? '✓' : '✗' }}
      </div>
      <p class="text-3xl md:text-5xl text-white font-semibold mt-4">
        {{ action === 'correct' ? t('game.feedback.correct') : t('game.feedback.skip') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  action: 'correct' | 'wrong' | null
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style scoped>
@keyframes flash-fade {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes flash-scale {
  0% {
    transform: scale(0.8);
  }
  20% {
    transform: scale(1.1);
  }
  40% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-flash-fade {
  animation: flash-fade 300ms ease-out;
}

.animate-flash-scale {
  animation: flash-scale 300ms ease-out;
}
</style>
