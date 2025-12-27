<template>
  <div class="h-full flex flex-col">
    <header class="text-center pt-6 pb-4 px-4">
      <h1 class="text-4xl font-bold mb-2 text-foreground">⚙️ {{ t('settings.title') }}</h1>
      <p class="text-lg text-muted-foreground">{{ t('settings.subtitle') }}</p>
    </header>

    <main class="flex-1 overflow-y-auto px-4 pb-4">
      <div class="max-w-2xl mx-auto space-y-6">
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

        <!-- Start Countdown Setting -->
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.startCountdown.title') }}</CardTitle>
            <CardDescription>{{ t('settings.startCountdown.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                v-for="countdown in settingsStore.countdownOptions"
                :key="countdown"
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  settingsStore.startCountdownDuration === countdown
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setStartCountdownDuration(countdown)"
              >
                {{ countdown }}s
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- Sound Effects Setting -->
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.soundEffects.title') }}</CardTitle>
            <CardDescription>{{ t('settings.soundEffects.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  settingsStore.soundEnabled
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setSoundEnabled(true)"
              >
                🔊 {{ t('settings.soundEffects.enabled') }}
              </button>
              <button
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  !settingsStore.soundEnabled
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setSoundEnabled(false)"
              >
                🔇 {{ t('settings.soundEffects.disabled') }}
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- Pause Button Position Setting -->
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.pauseButton.title') }}</CardTitle>
            <CardDescription>{{ t('settings.pauseButton.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg flex items-center gap-2 justify-center',
                  settingsStore.pauseButtonPosition === 'left'
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setPauseButtonPosition('left')"
              >
                <Pause :size="20" /> {{ t('settings.pauseButton.left') }}
              </button>
              <button
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg flex items-center gap-2 justify-center',
                  settingsStore.pauseButtonPosition === 'right'
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setPauseButtonPosition('right')"
              >
                <Pause :size="20" /> {{ t('settings.pauseButton.right') }}
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

        <!-- Font Size Setting -->
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.fontSize.title') }}</CardTitle>
            <CardDescription>{{ t('settings.fontSize.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                v-for="size in settingsStore.fontSizeOptions"
                :key="size"
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  settingsStore.fontSize === size
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setFontSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- Font Family Setting -->
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.fontFamily.title') }}</CardTitle>
            <CardDescription>{{ t('settings.fontFamily.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select v-model="selectedFontFamily" @update:model-value="changeFontFamily">
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="t('settings.fontFamily.sans-serif')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="font in settingsStore.fontFamilyOptions"
                  :key="font.value"
                  :value="font.value"
                >
                  {{ t(`settings.fontFamily.${font.value}`) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <!-- Auto Scale Font Setting -->
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.autoScaleFont.title') }}</CardTitle>
            <CardDescription>{{ t('settings.autoScaleFont.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  settingsStore.autoScaleFont
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setAutoScaleFont(true)"
              >
                {{ t('settings.autoScaleFont.enabled') }}
              </button>
              <button
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  !settingsStore.autoScaleFont
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setAutoScaleFont(false)"
              >
                {{ t('settings.autoScaleFont.disabled') }}
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- Scale Factor Setting (only shown when auto-scale is enabled) -->
        <Card v-if="settingsStore.autoScaleFont">
          <CardHeader>
            <CardTitle class="text-2xl">{{ t('settings.scaleFactor.title') }}</CardTitle>
            <CardDescription>{{ t('settings.scaleFactor.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                v-for="factor in settingsStore.scaleFactorOptions"
                :key="factor"
                :class="[
                  'px-8 py-4 rounded-lg font-medium transition-all text-lg',
                  settingsStore.scaleFactor === factor
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                ]"
                @click="settingsStore.setScaleFactor(factor)"
              >
                {{ factor }}x
              </button>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Pause } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useSettingsStore } from '@/stores/settings'

const { t, locale, locales, setLocale } = useI18n()
const settingsStore = useSettingsStore()

// Get available locales
const availableLocales = computed(() => locales.value)

// Selected deck locale
const selectedDeckLocale = ref(settingsStore.deckLocale)

// Selected font family
const selectedFontFamily = ref(settingsStore.fontFamily)

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

// Change font family and update settings
function changeFontFamily(newFontFamily: string) {
  selectedFontFamily.value = newFontFamily
  settingsStore.setFontFamily(newFontFamily)
}

// Watch for changes in store
watch(() => settingsStore.deckLocale, (newValue) => {
  selectedDeckLocale.value = newValue
})

watch(() => settingsStore.fontFamily, (newValue) => {
  selectedFontFamily.value = newValue
})
</script>
