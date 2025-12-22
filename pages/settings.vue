<template>
  <div class="h-screen flex flex-col p-4 max-w-2xl mx-auto overflow-y-auto">
    <header class="text-center my-8">
      <NuxtLink to="/" class="inline-block mb-4 text-primary hover:underline">
        {{ t('settings.backToHome') }}
      </NuxtLink>
      <h1 class="text-5xl font-bold mb-2 text-foreground">⚙️ {{ t('settings.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('settings.subtitle') }}</p>
    </header>

    <main class="flex-1 space-y-6">
      <!-- Timer Duration Setting -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">{{ t('settings.timerDuration.title') }}</CardTitle>
          <CardDescription>{{ t('settings.timerDuration.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-3 justify-center flex-wrap">
            <button
              v-for="duration in settingsStore.durationOptions"
              :key="duration"
              :class="[
                'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                settingsStore.timerDuration === duration
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              ]"
              @click="settingsStore.setTimerDuration(duration)"
            >
              {{ duration }}s
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Language Setting -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">{{ t('settings.language.title') }}</CardTitle>
          <CardDescription>{{ t('settings.language.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-3 justify-center flex-wrap">
            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              :class="[
                'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                locale === loc.code
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              ]"
              @click="changeLocale(loc.code)"
            >
              {{ loc.name }}
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Deck Locale Setting -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">{{ t('settings.deckLocale.title') }}</CardTitle>
          <CardDescription>{{ t('settings.deckLocale.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select v-model="selectedDeckLocale" @update:model-value="changeDeckLocale">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('settings.deckLocale.auto')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                {{ t('settings.deckLocale.auto') }}
              </SelectItem>
              <SelectItem value="en-US">
                {{ t('settings.deckLocale.en-US') }}
              </SelectItem>
              <SelectItem value="es-ES">
                {{ t('settings.deckLocale.es-ES') }}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <!-- Info Card -->
      <Card class="border-primary/20">
        <CardContent class="py-6">
          <div class="text-center text-muted-foreground space-y-2">
            <p>💡 {{ t('settings.info.line1') }}</p>
            <p>{{ t('settings.info.line2') }}</p>
          </div>
        </CardContent>
      </Card>
    </main>

    <footer class="text-center py-8 text-muted-foreground border-t border-border mt-8">
      <Button variant="outline" @click="navigateTo('/')">
        {{ t('settings.backButton') }}
      </Button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useSettingsStore } from '@/stores/settings'

const { t, locale, locales, setLocale } = useI18n()
const settingsStore = useSettingsStore()

// Get available locales
const availableLocales = computed(() => locales.value)

// Selected deck locale
const selectedDeckLocale = ref(settingsStore.deckLocale)

// Change locale and update settings
function changeLocale(newLocale: string) {
  setLocale(newLocale)
  settingsStore.setLocale(newLocale)
}

// Change deck locale and update settings
function changeDeckLocale(newDeckLocale: string) {
  selectedDeckLocale.value = newDeckLocale
  settingsStore.setDeckLocale(newDeckLocale)
}

// Watch for changes in store
watch(() => settingsStore.deckLocale, (newValue) => {
  selectedDeckLocale.value = newValue
})
</script>
