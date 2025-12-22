<template>
  <div 
    v-if="isVisible" 
    class="absolute inset-0 bg-primary/95 flex items-center justify-center z-50 pointer-events-auto"
  >
    <div class="text-center">
      <div 
        :key="count"
        class="text-[20rem] font-bold text-white animate-pulse leading-none"
      >
        {{ count }}
      </div>
      <p class="text-3xl text-white/80 mt-8">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  count: number
  message: string
}

defineProps<Props>()
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 1s ease-in-out;
}
</style>
