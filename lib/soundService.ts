/**
 * Sound service for game audio feedback
 * This service provides a wrapper around sound playback that can be used in stores
 */

// Type for sound play function
type PlayFunction = () => void

interface GameSounds {
  playTick: PlayFunction
  playFinish: PlayFunction
  playCorrect: PlayFunction
  playPass: PlayFunction
}

// Global sound service instance
let soundService: GameSounds | null = null

/**
 * Initialize the sound service with play functions
 */
export function initSoundService(sounds: GameSounds) {
  soundService = sounds
}

/**
 * Get the sound service instance
 */
export function getSoundService(): GameSounds | null {
  return soundService
}

/**
 * Play tick sound (for timer)
 */
export function playTickSound() {
  soundService?.playTick()
}

/**
 * Play finish sound (for game end)
 */
export function playFinishSound() {
  soundService?.playFinish()
}

/**
 * Play correct sound (for correct answer)
 */
export function playCorrectSound() {
  soundService?.playCorrect()
}

/**
 * Play pass sound (for skipped card)
 */
export function playPassSound() {
  soundService?.playPass()
}
