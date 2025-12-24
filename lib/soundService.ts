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

// Settings store getter function
let getSoundEnabled: (() => boolean) | null = null

/**
 * Initialize the sound service with play functions and settings getter
 */
export function initSoundService(sounds: GameSounds, soundEnabledGetter: () => boolean) {
  soundService = sounds
  getSoundEnabled = soundEnabledGetter
}

/**
 * Get the sound service instance
 */
export function getSoundService(): GameSounds | null {
  return soundService
}

/**
 * Check if sound is enabled
 */
function isSoundEnabled(): boolean {
  return getSoundEnabled?.() ?? true
}

/**
 * Play tick sound (for timer)
 */
export function playTickSound() {
  if (isSoundEnabled()) {
    soundService?.playTick()
  }
}

/**
 * Play finish sound (for game end)
 */
export function playFinishSound() {
  if (isSoundEnabled()) {
    soundService?.playFinish()
  }
}

/**
 * Play correct sound (for correct answer)
 */
export function playCorrectSound() {
  if (isSoundEnabled()) {
    soundService?.playCorrect()
  }
}

/**
 * Play pass sound (for skipped card)
 */
export function playPassSound() {
  if (isSoundEnabled()) {
    soundService?.playPass()
  }
}
