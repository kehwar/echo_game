/**
 * Composable for managing game sound effects
 * Uses @vueuse/sound for sound playback
 */
import { useSound } from '@vueuse/sound'

export function useGameSounds() {
  // Initialize all sound effects
  const { play: playTick } = useSound('/sounds/tick.wav', {
    volume: 0.5,
  })

  const { play: playFinish } = useSound('/sounds/finish.wav', {
    volume: 0.6,
  })

  const { play: playCorrect } = useSound('/sounds/correct.wav', {
    volume: 0.5,
  })

  const { play: playPass } = useSound('/sounds/pass.wav', {
    volume: 0.4,
  })

  return {
    playTick,
    playFinish,
    playCorrect,
    playPass,
  }
}
