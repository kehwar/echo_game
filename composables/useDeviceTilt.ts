/**
 * Composable for detecting device tilt gestures
 * Uses @vueuse/core's useDeviceOrientation for tilt detection
 * 
 * When phone is in landscape mode on forehead (screen facing away):
 * - Gamma (y-axis rotation) controls up/down tilt
 * - Screen orientation determines how to interpret gamma values
 * - Gamma range: -90° to +90° (jumps when phone is vertical)
 * 
 * Landscape-primary: home button on right
 * - Tilt up (away from face): gamma increases toward +90°
 * - Tilt down (toward chest): gamma decreases toward -90°
 * 
 * Landscape-secondary: home button on left  
 * - Tilt up (away from face): gamma decreases toward -90°
 * - Tilt down (toward chest): gamma increases toward +90°
 */
import { useDeviceOrientation } from '@vueuse/core'
import { ref, watch, computed } from 'vue'

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
  const TILT_THRESHOLD = 30 // Degrees of tilt required to trigger action
  
  /**
   * Get the current screen orientation
   * Returns 'landscape-primary' or 'landscape-secondary'
   */
  const getScreenOrientation = (): string => {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      // Fallback: assume landscape-primary
      return 'landscape-primary'
    }
    return window.screen.orientation.type
  }
  
  /**
   * Check if screen orientation is landscape-secondary (home button on left)
   */
  const isLandscapeSecondary = computed(() => {
    return getScreenOrientation().includes('landscape-secondary')
  })
  
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
   * Takes screen orientation into account to properly interpret gamma
   */
  const isTiltedUp = computed(() => {
    if (gamma.value === null || baselineGamma.value === null) return false
    const delta = gamma.value - baselineGamma.value
    
    // In landscape-secondary, movement is inverted
    if (isLandscapeSecondary.value) {
      return delta < -TILT_THRESHOLD
    }
    
    // In landscape-primary, tilting up increases gamma
    return delta > TILT_THRESHOLD
  })
  
  /**
   * Check if device is tilted down (for pass/skip action)
   * Takes screen orientation into account to properly interpret gamma
   */
  const isTiltedDown = computed(() => {
    if (gamma.value === null || baselineGamma.value === null) return false
    const delta = gamma.value - baselineGamma.value
    
    // In landscape-secondary, movement is inverted
    if (isLandscapeSecondary.value) {
      return delta > TILT_THRESHOLD
    }
    
    // In landscape-primary, tilting down decreases gamma
    return delta < -TILT_THRESHOLD
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
