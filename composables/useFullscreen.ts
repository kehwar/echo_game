/**
 * Composable for managing fullscreen mode on mobile devices
 * Handles cross-browser fullscreen API compatibility
 */

// Extended Document and Element interfaces to support vendor-prefixed fullscreen APIs
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element
  webkitExitFullscreen?: () => Promise<void> | void
  mozFullScreenElement?: Element
  mozCancelFullScreen?: () => Promise<void> | void
  msFullscreenElement?: Element
  msExitFullscreen?: () => Promise<void> | void
}

interface ElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void
  mozRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

export function useFullscreen() {
  const isFullscreen = ref(false)

  /**
   * Request fullscreen mode
   * Supports standard and webkit (iOS Safari) APIs
   */
  const requestFullscreen = async (): Promise<boolean> => {
    try {
      const elem = document.documentElement as ElementWithFullscreen

      // Try standard fullscreen API
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
        isFullscreen.value = true
        return true
      }
      // Try webkit fullscreen API (iOS Safari)
      else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen()
        isFullscreen.value = true
        return true
      }
      // Fallback for older browsers
      else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen()
        isFullscreen.value = true
        return true
      }
      else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen()
        isFullscreen.value = true
        return true
      }
    } catch (error) {
      console.warn('Failed to enter fullscreen mode:', error)
      return false
    }
    
    return false
  }

  /**
   * Exit fullscreen mode
   */
  const exitFullscreen = async (): Promise<void> => {
    try {
      const doc = document as DocumentWithFullscreen
      
      if (doc.exitFullscreen) {
        await doc.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen()
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen()
      }
      isFullscreen.value = false
    } catch (error) {
      console.warn('Failed to exit fullscreen mode:', error)
    }
  }

  /**
   * Check if fullscreen is currently active
   */
  const checkFullscreenStatus = (): boolean => {
    const doc = document as DocumentWithFullscreen
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    )
  }

  /**
   * Listen for fullscreen changes (e.g., user presses ESC)
   */
  const setupFullscreenListeners = (callback?: (isActive: boolean) => void) => {
    const handleFullscreenChange = () => {
      isFullscreen.value = checkFullscreenStatus()
      if (callback) {
        callback(isFullscreen.value)
      }
    }

    // Add listeners for all browser variants
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    // Return cleanup function
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }

  return {
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    checkFullscreenStatus,
    setupFullscreenListeners,
  }
}
