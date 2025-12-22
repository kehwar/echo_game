<template>
  <div class="h-full overflow-y-auto overflow-x-hidden">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Initialize settings and sync locale
const { setLocale } = useI18n()
const settings = useSettings()

// On mount, sync the i18n locale with the saved locale in settings
onMounted(() => {
  if (settings.selectedLocale.value) {
    setLocale(settings.selectedLocale.value)
  }
})
</script>
