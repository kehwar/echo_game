<template>
  <div class="h-screen bg-background overflow-hidden">
    <!-- Pre-game screen -->
    <GameStartScreen
      v-if="!gameState.gameStarted.value && !gameState.gameEnded.value"
      :deck-id="deckId"
      :deck-name="gameState.selectedDeck.value?.name || ''"
      :deck-description="gameState.selectedDeck.value?.description || ''"
      :timer-duration="gameState.timerDuration.value"
      @start="gameState.startGame"
    />

    <!-- Active game screen with tap zones -->
    <div v-else-if="gameState.gameStarted.value && !gameState.gameEnded.value" class="h-screen flex flex-col">
      <GamePlayScreen
        :current-card="gameState.currentCard.value"
        :time-remaining="gameState.timeRemaining.value"
        @tap="gameState.handleTap"
        @pause="gameState.pauseGame"
      />

      <!-- Tap feedback overlay -->
      <TapFeedbackOverlay
        :is-visible="gameState.showTapFeedback.value"
        :action="gameState.tapFeedbackAction.value"
      />

      <!-- Countdown overlay -->
      <CountdownOverlay
        :is-visible="gameState.showCountdown.value"
        :count="gameState.countdownValue.value"
        :message="$t('game.countdown.getReady')"
      />

      <!-- Pause overlay -->
      <PauseModal
        :is-visible="gameState.gamePaused.value"
        @resume="gameState.resumeGame"
        @end="gameState.endGame"
      />
    </div>

    <!-- End game screen -->
    <GameScoreScreen
      v-else-if="gameState.gameEnded.value"
      :correct-count="gameState.correctCount.value"
      :wrong-count="gameState.wrongCount.value"
      :correct-cards="gameState.correctCards.value"
      :skipped-cards="gameState.skippedCards.value"
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

const route = useRoute()
const deckId = computed(() => route.params.id as string)

// Initialize game state
const gameState = useGameState(deckId)

// Redirect if deck not found
onMounted(() => {
  if (!gameState.selectedDeck.value) {
    navigateTo('/')
  }
})

// Cleanup on unmount
onUnmounted(() => {
  gameState.cleanup()
})
</script>
