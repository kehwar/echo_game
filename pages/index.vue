<template>
  <div class="h-full flex flex-col">
    <header class="text-center pt-6 pb-4 px-4">
      <h1 class="text-4xl md:text-5xl font-bold mb-2 text-foreground">🎭 {{ t('app.title') }}</h1>
      <p class="text-lg text-muted-foreground">{{ t('app.subtitle') }}</p>
    </header>

    <main class="flex-1 overflow-y-auto px-4 pb-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col gap-3 mb-4">
          <Select v-model="selectedDeckType" class="w-full" @update:model-value="changeDeckType">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">
                {{ t('home.deckType.both') }}
              </SelectItem>
              <SelectItem value="system">
                {{ t('home.deckType.system') }}
              </SelectItem>
              <SelectItem value="user">
                {{ t('home.deckType.user') }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="selectedDeckLocale" class="w-full" @update:model-value="changeDeckLocale">
            <SelectTrigger>
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
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink 
            v-for="deck in displayedDecks" 
            :key="deck.id"
            :to="`/game/${deck.id}`"
          >
            <Card 
              class="h-full border-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              :class="deck.isUserDeck ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white' : 'bg-gradient-to-br from-primary to-purple-600 text-primary-foreground'"
            >
              <CardHeader>
                <CardTitle class="text-xl" :class="deck.isUserDeck ? 'text-white' : 'text-primary-foreground'">
                  {{ deck.name }}
                </CardTitle>
                <CardDescription :class="deck.isUserDeck ? 'text-white/90' : 'text-primary-foreground/90'">
                  {{ deck.description }}
                </CardDescription>
              </CardHeader>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useDecksStore } from '@/stores/decks'
import { useSettingsStore } from '@/stores/settings'
import { useUserDecksStore } from '@/stores/userDecks'

const { t, locale } = useI18n()
const decksStore = useDecksStore()
const settingsStore = useSettingsStore()
const userDecksStore = useUserDecksStore()

// Load user decks on mount
onMounted(() => {
  userDecksStore.loadDecks()
})

// Selected deck locale from settings
const selectedDeckLocale = ref(settingsStore.deckLocale)

// Selected deck type (both, system, user)
const selectedDeckType = ref<'both' | 'system' | 'user'>('both')

// Sort decks: current locale first, then other locales, and filter out hidden decks
const displayedDecks = computed(() => {
  let decks = decksStore.getDisplayedDecks(locale.value, selectedDeckLocale.value)
  
  // Filter by deck type
  if (selectedDeckType.value === 'system') {
    decks = decks.filter(d => !d.isUserDeck)
  } else if (selectedDeckType.value === 'user') {
    decks = decks.filter(d => d.isUserDeck)
  }
  
  return decks
})

// Change deck locale and update settings
function changeDeckLocale(newDeckLocale: string) {
  selectedDeckLocale.value = newDeckLocale
  settingsStore.setDeckLocale(newDeckLocale)
}

// Change deck type filter
function changeDeckType(newDeckType: 'both' | 'system' | 'user') {
  selectedDeckType.value = newDeckType
}

// Watch for changes in store
watch(() => settingsStore.deckLocale, (newValue) => {
  selectedDeckLocale.value = newValue
})
</script>
