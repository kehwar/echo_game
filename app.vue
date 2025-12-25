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
import BottomNav from '@/components/BottomNav.vue'

// Initialize settings and sync locale
const { setLocale } = useI18n()
const settingsStore = useSettingsStore()
const route = useRoute()

// On mount, sync the i18n locale with the saved locale in settings
onMounted(() => {
  if (settingsStore.locale) {
    setLocale(settingsStore.locale)
  }
})

// Hide bottom nav on all game screens (start, active, and score)
const isGamePage = computed(() => {
  return route.path.startsWith('/game/')
})
</script>
