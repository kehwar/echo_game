<template>
  <div class="h-[100dvh] flex flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto overflow-x-hidden" :class="{ 'pb-16': !isGamePage }">
      <NuxtPage />
    </div>
    <BottomNav v-if="!isGamePage" />
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useGameStateStore } from '@/stores/gameState'
import BottomNav from '@/components/BottomNav.vue'

// Initialize settings and sync locale
const { setLocale } = useI18n()
const settingsStore = useSettingsStore()
const gameState = useGameStateStore()
const route = useRoute()

// On mount, sync the i18n locale with the saved locale in settings
onMounted(() => {
  if (settingsStore.locale) {
    setLocale(settingsStore.locale)
  }
})

// Determines if bottom nav should be hidden (only during active gameplay)
const isGamePage = computed(() => {
  // Return true to hide bottom nav during active gameplay
  // Bottom nav remains visible on game start and score screens
  if (route.path.startsWith('/game/')) {
    return gameState.gameStarted && !gameState.gameEnded
  }
  return false
})
</script>
