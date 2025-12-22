<template>
  <div class="h-full overflow-y-auto overflow-x-hidden">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

// Initialize settings and sync locale
const { setLocale } = useI18n()
const settingsStore = useSettingsStore()

// On mount, sync the i18n locale with the saved locale in settings
onMounted(() => {
  if (settingsStore.locale) {
    setLocale(settingsStore.locale)
  }
})
</script>
