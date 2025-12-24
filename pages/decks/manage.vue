<template>
  <div class="h-full flex flex-col">
    <header class="pt-6 pb-4 px-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('customDecks.title') }}</h1>
        <Button size="sm" @click="showCreateDialog = true">
          {{ t('customDecks.createButton') }}
        </Button>
      </div>
      <p class="text-lg text-muted-foreground">{{ t('customDecks.subtitle') }}</p>
    </header>

    <main class="flex-1 overflow-y-auto px-4 pb-4">
      <div class="max-w-7xl mx-auto">
        <!-- Empty state -->
        <div v-if="userDecksStore.decks.length === 0" class="flex flex-col items-center justify-center py-16">
          <Card class="max-w-md">
            <CardHeader>
              <CardTitle>{{ t('customDecks.emptyState.title') }}</CardTitle>
              <CardDescription>{{ t('customDecks.emptyState.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button class="w-full" @click="showCreateDialog = true">
                {{ t('customDecks.emptyState.createButton') }}
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- User decks list -->
        <div v-else class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">{{ t('customDecks.userDecksTitle') }}</h2>
            <Button variant="outline" size="sm" @click="showImportDialog = true">
              {{ t('customDecks.importButton') }}
            </Button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="deck in userDecksStore.decks" :key="deck.id" class="relative">
              <CardHeader>
                <CardTitle>{{ deck.name }}</CardTitle>
                <CardDescription>{{ deck.description }}</CardDescription>
                <div class="text-sm text-muted-foreground mt-2">
                  {{ deck.cards.length }} cards • {{ deck.locale }}
                </div>
              </CardHeader>
              <CardContent>
                <div class="flex gap-2 flex-wrap">
                  <NuxtLink :to="`/game/${deck.id}`">
                    <Button size="sm" variant="default">
                      {{ t('customDecks.playButton') }}
                    </Button>
                  </NuxtLink>
                  <Button size="sm" variant="outline" @click="editDeck(deck)">
                    {{ t('customDecks.editButton') }}
                  </Button>
                  <Button size="sm" variant="outline" @click="exportDeck(deck.id)">
                    {{ t('customDecks.exportButton') }}
                  </Button>
                  <Button size="sm" variant="destructive" @click="confirmDelete(deck.id)">
                    {{ t('customDecks.deleteButton') }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Dialog -->
    <div v-if="showCreateDialog || showEditDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{{ editingDeck ? t('customDecks.form.editTitle') : t('customDecks.form.createTitle') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="saveDeck">
            <div>
              <Label for="deck-name">{{ t('customDecks.form.nameLabel') }}</Label>
              <Input
                id="deck-name"
                v-model="formData.name"
                :placeholder="t('customDecks.form.namePlaceholder')"
                required
              />
            </div>

            <div>
              <Label for="deck-description">{{ t('customDecks.form.descriptionLabel') }}</Label>
              <Textarea
                id="deck-description"
                v-model="formData.description"
                :placeholder="t('customDecks.form.descriptionPlaceholder')"
                rows="2"
              />
            </div>

            <div>
              <Label for="deck-locale">{{ t('customDecks.form.localeLabel') }}</Label>
              <Select v-model="formData.locale">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label for="deck-cards">{{ t('customDecks.form.cardsLabel') }}</Label>
              <Textarea
                id="deck-cards"
                v-model="formData.cardsText"
                :placeholder="t('customDecks.form.cardsPlaceholder')"
                rows="10"
                class="font-mono"
                required
              />
              <p class="text-sm text-muted-foreground mt-1">{{ t('customDecks.form.cardsHelp') }}</p>
              <p class="text-sm text-muted-foreground mt-1">
                {{ parsedCardsCount }} cards
              </p>
            </div>

            <div class="flex gap-2 justify-end">
              <Button type="button" variant="outline" @click="closeDialogs">
                {{ t('customDecks.form.cancelButton') }}
              </Button>
              <Button type="submit">
                {{ t('customDecks.form.saveButton') }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Import Dialog -->
    <div v-if="showImportDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{{ t('customDecks.import.title') }}</CardTitle>
          <CardDescription>{{ t('customDecks.import.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="importDeck">
            <Textarea
              v-model="importYaml"
              :placeholder="t('customDecks.import.yamlPlaceholder')"
              rows="15"
              class="font-mono"
              required
            />
            <div class="flex gap-2 justify-end">
              <Button type="button" variant="outline" @click="closeDialogs">
                {{ t('customDecks.import.cancelButton') }}
              </Button>
              <Button type="submit">
                {{ t('customDecks.import.importButton') }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>{{ t('customDecks.delete.title') }}</CardTitle>
          <CardDescription>{{ t('customDecks.delete.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-2 justify-end">
            <Button variant="outline" @click="closeDialogs">
              {{ t('customDecks.delete.cancelButton') }}
            </Button>
            <Button variant="destructive" @click="deleteDeck">
              {{ t('customDecks.delete.confirmButton') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useUserDecksStore, parseCards, formatCardsToText } from '@/stores/userDecks'
import type { UserDeck } from '@/stores/userDecks'

const { t, locale } = useI18n()
const userDecksStore = useUserDecksStore()

// Load user decks on mount
onMounted(() => {
  userDecksStore.loadDecks()
})

// Dialog states
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showImportDialog = ref(false)
const showDeleteDialog = ref(false)

// Form data
const formData = ref({
  name: '',
  description: '',
  locale: locale.value,
  cardsText: '',
})

const editingDeck = ref<UserDeck | null>(null)
const deletingDeckId = ref<string | null>(null)
const importYaml = ref('')

// Computed parsed cards count
const parsedCardsCount = computed(() => {
  return parseCards(formData.value.cardsText).length
})

// Edit deck
function editDeck(deck: UserDeck) {
  editingDeck.value = deck
  formData.value = {
    name: deck.name,
    description: deck.description,
    locale: deck.locale,
    cardsText: formatCardsToText(deck.cards),
  }
  showEditDialog.value = true
}

// Save deck (create or update)
function saveDeck() {
  const cards = parseCards(formData.value.cardsText)
  
  if (cards.length < 5) {
    alert(t('customDecks.validation.cardsMinimum'))
    return
  }

  if (editingDeck.value) {
    userDecksStore.updateDeck(editingDeck.value.id, formData.value)
  } else {
    userDecksStore.createDeck(formData.value)
  }

  closeDialogs()
}

// Export deck to clipboard
async function exportDeck(deckId: string) {
  const yaml = userDecksStore.exportDeck(deckId)
  if (!yaml) {
    alert(t('customDecks.export.error'))
    return
  }

  try {
    await navigator.clipboard.writeText(yaml)
    alert(t('customDecks.export.success'))
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    alert(t('customDecks.export.error'))
  }
}

// Import deck from YAML
function importDeck() {
  const deck = userDecksStore.importDeck(importYaml.value)
  if (deck) {
    alert(t('customDecks.import.success'))
    closeDialogs()
  } else {
    alert(t('customDecks.import.error'))
  }
}

// Confirm delete
function confirmDelete(deckId: string) {
  deletingDeckId.value = deckId
  showDeleteDialog.value = true
}

// Delete deck
function deleteDeck() {
  if (deletingDeckId.value) {
    userDecksStore.deleteDeck(deletingDeckId.value)
    closeDialogs()
  }
}

// Close all dialogs
function closeDialogs() {
  showCreateDialog.value = false
  showEditDialog.value = false
  showImportDialog.value = false
  showDeleteDialog.value = false
  editingDeck.value = null
  deletingDeckId.value = null
  importYaml.value = ''
  formData.value = {
    name: '',
    description: '',
    locale: locale.value,
    cardsText: '',
  }
}
</script>
