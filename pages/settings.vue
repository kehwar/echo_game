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
              v-for="duration in settings.durationOptions"
              :key="duration"
              :class="[
                'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                settings.timerDuration.value === duration
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              ]"
              @click="settings.setTimerDuration(duration)"
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

const { t, locale, locales, setLocale } = useI18n()
const settings = useSettings()

// Get available locales
const availableLocales = computed(() => locales.value)

// Change locale and update settings
function changeLocale(newLocale: string) {
  setLocale(newLocale)
  settings.setLocale(newLocale)
}
</script>
