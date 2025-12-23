<template>
  <div class="h-screen flex flex-col p-4 max-w-7xl mx-auto overflow-y-auto">
    <header class="text-center my-8">
      <div class="flex justify-end gap-2 mb-4">
        <NuxtLink to="/decks/manage">
          <Button variant="outline" size="sm">
            📝 {{ t('customDecks.title') }}
          </Button>
        </NuxtLink>
        <NuxtLink to="/history">
          <Button variant="outline" size="sm">
            📊 {{ t('home.historyButton') }}
          </Button>
        </NuxtLink>
        <NuxtLink to="/settings">
          <Button variant="outline" size="sm">
            ⚙️ {{ t('home.settingsButton') }}
          </Button>
        </NuxtLink>
      </div>
      <h1 class="text-5xl md:text-6xl font-bold mb-2 text-foreground">🎭 {{ t('app.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('app.subtitle') }}</p>
    </header>

    <main class="flex-1">
      <Card class="my-8">
        <CardHeader>
          <CardTitle class="text-2xl">{{ t('home.howToPlay.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol class="space-y-3 list-decimal list-inside text-muted-foreground">
            <li>{{ t('home.howToPlay.step1') }}</li>
            <li>{{ t('home.howToPlay.step2') }}</li>
            <li>{{ t('home.howToPlay.step3') }}</li>
            <li>{{ t('home.howToPlay.step4') }}</li>
            <li>{{ t('home.howToPlay.step5') }}</li>
            <li>{{ t('home.howToPlay.step6') }}</li>
          </ol>
        </CardContent>
      </Card>

      <div class="my-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 class="text-3xl font-bold">{{ t('home.chooseDeck') }}</h2>
          <div class="w-full md:w-64">
            <Select v-model="selectedDeckLocale" @update:model-value="changeDeckLocale">
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
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="deck in displayedDecks" 
            :key="deck.id"
            class="relative"
          >
            <NuxtLink :to="`/game/${deck.id}`">
              <Card 
                class="h-full border-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                :class="deck.isUserDeck ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white' : 'bg-gradient-to-br from-primary to-purple-600 text-primary-foreground'"
              >
                <CardHeader>
                  <CardTitle class="text-2xl" :class="deck.isUserDeck ? 'text-white' : 'text-primary-foreground'">
                    {{ deck.name }}
                  </CardTitle>
                  <CardDescription :class="deck.isUserDeck ? 'text-white/90' : 'text-primary-foreground/90'">
                    {{ deck.description }}
                  </CardDescription>
                </CardHeader>
              </Card>
            </NuxtLink>
            <!-- Clone button for system decks -->
            <Button 
              v-if="!deck.isUserDeck"
              variant="secondary"
              size="sm"
              class="absolute bottom-2 right-2"
              @click.prevent="cloneDeck(deck)"
            >
              {{ t('customDecks.cloneButton') }}
            </Button>
          </div>
        </div>
      </div>
    </main>

    <footer class="text-center py-8 text-muted-foreground border-t border-border mt-8">
      <p>{{ t('home.footer') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useDecksStore } from '@/stores/decks'
import { useSettingsStore } from '@/stores/settings'
import { useUserDecksStore } from '@/stores/userDecks'

const { t, locale } = useI18n()
const decksStore = useDecksStore()
const settingsStore = useSettingsStore()
const userDecksStore = useUserDecksStore()
const router = useRouter()

// Load user decks on mount
onMounted(() => {
  userDecksStore.loadDecks()
})

// Selected deck locale from settings
const selectedDeckLocale = ref(settingsStore.deckLocale)

// Sort decks: current locale first, then other locales, and filter out hidden decks
const displayedDecks = computed(() => {
  return decksStore.getDisplayedDecks(locale.value, selectedDeckLocale.value)
})

// Change deck locale and update settings
function changeDeckLocale(newDeckLocale: string) {
  selectedDeckLocale.value = newDeckLocale
  settingsStore.setDeckLocale(newDeckLocale)
}

// Clone a deck to user decks
function cloneDeck(deck: any) {
  const clonedDeck = userDecksStore.cloneDeck(deck)
  alert(t('customDecks.clone.success'))
  router.push('/decks/manage')
}

// Watch for changes in store
watch(() => settingsStore.deckLocale, (newValue) => {
  selectedDeckLocale.value = newValue
})
</script>
