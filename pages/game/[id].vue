<template>
  <div class="h-screen bg-background overflow-hidden">
    <!-- Pre-game screen -->
    <GameStartScreen
      v-if="!gameState.gameStarted.value && !gameState.gameEnded.value"
      :theme-id="themeId"
      :duration-options="gameState.durationOptions"
      :selected-duration="gameState.selectedDuration.value"
      @start="gameState.startGame"
      @update:selected-duration="gameState.selectedDuration.value = $event"
    />

    <!-- Active game screen with tap zones -->
    <div v-else-if="gameState.gameStarted.value && !gameState.gameEnded.value" class="h-screen flex flex-col">
      <GamePlayScreen
        :current-word="gameState.currentWord.value"
        :time-remaining="gameState.timeRemaining.value"
        @tap="gameState.handleTap"
        @pause="gameState.pauseGame"
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
      :correct-words="gameState.correctWords.value"
      :skipped-words="gameState.skippedWords.value"
      @play-again="gameState.playAgain"
      @choose-new-theme="gameState.chooseNewTheme"
    />
  </div>
</template>

<script setup lang="ts">
import GameStartScreen from '@/components/game/GameStartScreen.vue'
import GamePlayScreen from '@/components/game/GamePlayScreen.vue'
import PauseModal from '@/components/game/PauseModal.vue'
import GameScoreScreen from '@/components/game/GameScoreScreen.vue'

const route = useRoute()
const themeId = computed(() => route.params.id as string)

// Initialize game state
const gameState = useGameState(themeId)

// Redirect if theme not found
onMounted(() => {
  if (!gameState.selectedTheme.value) {
    navigateTo('/')
  }
})

// Cleanup on unmount
onUnmounted(() => {
  gameState.cleanup()
})
</script>
