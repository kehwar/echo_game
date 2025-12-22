<template>
  <div class="h-screen bg-background overflow-hidden">
    <!-- Pre-game screen -->
    <GameStartScreen
      v-if="!gameState.gameStarted && !gameState.gameEnded"
      :deck-id="deckId"
      :deck-name="gameState.selectedDeck?.name || ''"
      :deck-description="gameState.selectedDeck?.description || ''"
      :timer-duration="settingsStore.timerDuration"
      @start="gameState.startGame"
    />

    <!-- Active game screen with tap zones -->
    <div v-else-if="gameState.gameStarted && !gameState.gameEnded" class="h-screen flex flex-col">
      <GamePlayScreen
        :current-card="gameState.currentCard"
        :time-remaining="gameState.timeRemaining"
        @tap="gameState.handleTap"
        @pause="gameState.pauseGame"
      />

      <!-- Tap feedback overlay -->
      <TapFeedbackOverlay
        :is-visible="gameState.showTapFeedback"
        :action="gameState.tapFeedbackAction"
      />

      <!-- Countdown overlay -->
      <CountdownOverlay
        :is-visible="gameState.showCountdown"
        :count="gameState.countdownValue"
        :message="$t('game.countdown.getReady')"
      />

      <!-- Pause overlay -->
      <PauseModal
        :is-visible="gameState.gamePaused"
        @resume="gameState.resumeGame"
        @end="gameState.endGame"
      />
    </div>

    <!-- End game screen -->
    <GameScoreScreen
      v-else-if="gameState.gameEnded"
      :correct-count="gameState.correctCount"
      :wrong-count="gameState.wrongCount"
      :correct-cards="gameState.correctCards"
      :skipped-cards="gameState.skippedCards"
      @play-again="gameState.playAgain"
      @choose-new-deck="gameState.chooseNewDeck"
    />
  </div>
</template>

<script setup lang="ts">
import GameStartScreen from '@/components/game/GameStartScreen.vue'
import GamePlayScreen from '@/components/game/GamePlayScreen.vue'
import TapFeedbackOverlay from '@/components/game/TapFeedbackOverlay.vue'
import CountdownOverlay from '@/components/game/CountdownOverlay.vue'
import PauseModal from '@/components/game/PauseModal.vue'
import GameScoreScreen from '@/components/game/GameScoreScreen.vue'
import { useGameStateStore } from '@/stores/gameState'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const deckId = computed(() => route.params.id as string)

// Initialize stores
const gameState = useGameStateStore()
const settingsStore = useSettingsStore()

// Set the deck ID when component mounts
onMounted(() => {
  gameState.setDeckId(deckId.value)
  
  // Redirect if deck not found
  if (!gameState.selectedDeck) {
    navigateTo('/')
  }
})

// Cleanup on unmount
onUnmounted(() => {
  gameState.cleanup()
})
</script>
