<template>
  <div class="h-screen flex flex-col p-4 max-w-7xl mx-auto overflow-y-auto">
    <header class="text-center my-8">
      <div class="flex justify-end mb-4">
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
        <h2 class="text-3xl font-bold mb-6 text-center">{{ t('home.chooseDeck') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="deck in displayedDecks" 
            :key="deck.id" 
            :to="`/game/${deck.id}`"
          >
            <Card class="h-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground border-0 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle class="text-2xl text-primary-foreground">{{ deck.name }}</CardTitle>
                <CardDescription class="text-primary-foreground/90">
                  {{ deck.description }}
                </CardDescription>
              </CardHeader>
            </Card>
          </NuxtLink>
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
import { decks } from '@/data/decks'

const { t, locale } = useI18n()

// Sort decks: current locale first, then other locales
const displayedDecks = computed(() => {
  const currentLocale = locale.value
  
  // Separate decks by locale
  const currentLocaleDecks = decks.filter(d => d.locale === currentLocale)
  const otherLocaleDecks = decks.filter(d => d.locale !== currentLocale)
  
  // Return current locale decks first, followed by other locales
  return [...currentLocaleDecks, ...otherLocaleDecks]
})
</script>
