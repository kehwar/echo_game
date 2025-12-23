<template>
  <div class="h-screen flex flex-col p-4 max-w-2xl mx-auto justify-center overflow-y-auto">
    <header class="text-center mb-8">
      <NuxtLink to="/" class="inline-block mb-4 text-primary hover:underline">
        {{ t('game.backToDecks') }}
      </NuxtLink>
      <h1 class="text-4xl font-bold text-foreground mb-4">{{ deckName }}</h1>
      <p class="text-xl text-muted-foreground">{{ deckDescription }}</p>
    </header>

    <Card class="mb-8">
      <CardContent class="py-12 text-center space-y-6">
        <div class="text-6xl mb-4">📱</div>
        <h2 class="text-2xl font-bold">{{ t('game.preGame.readyToPlay') }}</h2>
        <div class="text-left max-w-md mx-auto space-y-3 text-muted-foreground">
          <p>{{ t('game.preGame.step1') }}</p>
          <p>{{ t('game.preGame.step2') }}</p>
          <p>{{ t('game.preGame.step3') }}</p>
          <p>{{ t('game.preGame.step4') }}</p>
          <p>{{ t('game.preGame.step5') }}</p>
          <p>{{ t('game.preGame.step6', { duration: timerDuration }) }}</p>
        </div>
        
        <div class="flex flex-col gap-3 w-full max-w-md mx-auto mt-8">
          <Button size="lg" class="w-full" @click="$emit('start')">
            {{ t('game.preGame.startButton') }}
          </Button>
          
          <!-- Clone button for system decks -->
          <Button 
            v-if="!isUserDeck"
            variant="outline" 
            size="lg" 
            class="w-full"
            @click="handleClone"
          >
            {{ t('customDecks.cloneButton') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserDecksStore } from '@/stores/userDecks'
import { useDecksStore } from '@/stores/decks'

interface Props {
  deckId: string
  deckName: string
  deckDescription: string
  timerDuration: number
}

const props = defineProps<Props>()
defineEmits<{
  start: []
}>()

const { t } = useI18n()
const router = useRouter()
const userDecksStore = useUserDecksStore()
const decksStore = useDecksStore()

// Check if this is a user deck
const isUserDeck = computed(() => {
  const deck = decksStore.getDeckById(props.deckId)
  return deck?.isUserDeck || false
})

// Handle cloning the deck
function handleClone() {
  const deck = decksStore.getDeckById(props.deckId)
  if (deck) {
    userDecksStore.cloneDeck(deck)
    alert(t('customDecks.clone.success'))
    router.push('/decks/manage')
  }
}
</script>
