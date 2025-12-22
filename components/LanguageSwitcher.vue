<template>
  <div class="flex items-center gap-2">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all text-sm',
        locale === loc.code
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      ]"
      @click="switchLocale(loc.code)"
    >
      {{ loc.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value as Array<{ code: string; name: string; file: string }>
})

async function switchLocale(newLocale: string) {
  await setLocale(newLocale)
}
</script>
