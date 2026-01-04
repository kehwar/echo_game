/**
 * Composable for detecting device tilt gestures
 * Uses @vueuse/core's useDeviceOrientation for tilt detection
 * 
 * When phone is in landscape mode on forehead (screen facing away):
 * - Gamma (y-axis rotation) controls up/down tilt
 * - Tilt upwards (gamma increases) -> Correct
 * - Tilt downwards (gamma decreases) -> Pass/Skip
 */
import { useDeviceOrientation } from '@vueuse/core'
import { ref, watch } from 'vue'

export interface TiltEvent {
  action: 'correct' | 'wrong'
}

export function useDeviceTilt() {
  const { beta, gamma, isSupported } = useDeviceOrientation()
  
  // Track if we're currently in a cooldown period after a tilt action
  const isInCooldown = ref(false)
  const cooldownDuration = 500 // ms - prevents multiple triggers
  
  // Track baseline orientation when starting
  const baselineGamma = ref<number | null>(null)
  
  // Thresholds for tilt detection (in degrees from baseline)
  // In landscape mode with screen facing away, gamma controls up/down tilt
  const TILT_UP_THRESHOLD = 30 // Tilt upwards (phone moves away from face, gamma increases)
  const TILT_DOWN_THRESHOLD = -30 // Tilt downwards (phone moves toward chest, gamma decreases)
  
  /**
   * Initialize baseline orientation
   * Call this when the game starts to set the initial phone orientation
   */
  const initializeBaseline = () => {
    if (gamma.value !== null) {
      baselineGamma.value = gamma.value
    }
  }
  
  /**
   * Reset the baseline orientation
   */
  const resetBaseline = () => {
    baselineGamma.value = null
  }
  
  /**
   * Check if device is tilted up (for correct action)
   * In landscape mode, tilting up increases gamma
   */
  const isTiltedUp = computed(() => {
    if (gamma.value === null || baselineGamma.value === null) return false
    const delta = gamma.value - baselineGamma.value
    return delta > TILT_UP_THRESHOLD
  })
  
  /**
   * Check if device is tilted down (for pass/skip action)
   * In landscape mode, tilting down decreases gamma
   */
  const isTiltedDown = computed(() => {
    if (gamma.value === null || baselineGamma.value === null) return false
    const delta = gamma.value - baselineGamma.value
    return delta < TILT_DOWN_THRESHOLD
  })
  
  /**
   * Setup tilt detection with callback
   * Returns cleanup function
   */
  const onTilt = (callback: (event: TiltEvent) => void) => {
    // Initialize baseline when starting to watch
    if (gamma.value !== null && baselineGamma.value === null) {
      initializeBaseline()
    }
    
    const stopWatch = watch([isTiltedUp, isTiltedDown], ([up, down]) => {
      // Don't trigger during cooldown
      if (isInCooldown.value) return
      
      // Ensure we have a baseline
      if (baselineGamma.value === null && gamma.value !== null) {
        baselineGamma.value = gamma.value
        return
      }
      
      let action: 'correct' | 'wrong' | null = null
      
      if (up) {
        action = 'correct'
      } else if (down) {
        action = 'wrong'
      }
      
      if (action) {
        // Trigger the callback
        callback({ action })
        
        // Start cooldown period
        isInCooldown.value = true
        setTimeout(() => {
          isInCooldown.value = false
          // Reset baseline after cooldown to allow continuous play
          if (gamma.value !== null) {
            baselineGamma.value = gamma.value
          }
        }, cooldownDuration)
      }
    })
    
    // Return cleanup function
    return () => {
      stopWatch()
      resetBaseline()
    }
  }
  
  return {
    isSupported,
    beta,
    gamma,
    isTiltedUp,
    isTiltedDown,
    initializeBaseline,
    resetBaseline,
    onTilt,
    baselineGamma,
  }
}
