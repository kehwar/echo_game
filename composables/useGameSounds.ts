/**
 * Composable for managing game sound effects
 * Uses @vueuse/sound for sound playback
 */
import { useSound } from '@vueuse/sound'

export function useGameSounds() {
  // Get the base URL from runtime config to ensure sounds work with GitHub Pages deployment
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  
  // Helper function to construct sound path with baseURL
  const getSoundPath = (filename: string) => {
    // Normalize baseURL by removing trailing slash, then add sound path
    const base = baseURL.replace(/\/$/, '')
    return `${base}/sounds/${filename}`
  }

  // Initialize all sound effects with proper paths
  const { play: playTick } = useSound(getSoundPath('tick.wav'), {
    volume: 0.5,
  })

  const { play: playFinish } = useSound(getSoundPath('finish.wav'), {
    volume: 0.6,
  })

  const { play: playCorrect } = useSound(getSoundPath('correct.wav'), {
    volume: 0.5,
  })

  const { play: playPass } = useSound(getSoundPath('pass.wav'), {
    volume: 0.4,
  })

  return {
    playTick,
    playFinish,
    playCorrect,
    playPass,
  }
}
