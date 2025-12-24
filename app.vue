<template>
  <div class="h-[100dvh] flex flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto overflow-x-hidden pb-16">
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

// Hide bottom nav only during active gameplay (not on pre/post game screens)
const isGamePage = computed(() => {
  // Only hide navbar during active gameplay
  if (route.path.startsWith('/game/')) {
    return gameState.gameStarted && !gameState.gameEnded
  }
  return false
})
</script>
