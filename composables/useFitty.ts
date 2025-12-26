/**
 * Composable for using Fitty to auto-size text to fit container
 * Ensures text fits within its container without overflow
 */
import { onMounted, onUnmounted, type Ref } from 'vue'
import fitty from 'fitty'

interface FittyOptions {
  minSize?: number
  maxSize?: number
  multiLine?: boolean
  observeMutations?: boolean | MutationObserverInit
}

/**
 * Auto-sizes text element to fit its container
 * @param elementRef - Vue ref to the text element
 * @param options - Fitty configuration options
 */
export function useFitty(elementRef: Ref<HTMLElement | null>, options: FittyOptions = {}) {
  let fittyInstance: ReturnType<typeof fitty> | null = null

  const defaultOptions = {
    minSize: 16,
    maxSize: 200,
    multiLine: true,
    observeMutations: false,
    ...options,
  }

  const init = () => {
    if (elementRef.value) {
      // Clean up any existing instance
      cleanup()
      
      // Initialize fitty on the element
      fittyInstance = fitty(elementRef.value, defaultOptions)
    }
  }

  const cleanup = () => {
    if (fittyInstance) {
      // Fitty returns an array, so we need to unsubscribe each instance
      if (Array.isArray(fittyInstance)) {
        fittyInstance.forEach(instance => instance.unsubscribe())
      } else {
        fittyInstance.unsubscribe()
      }
      fittyInstance = null
    }
  }

  const refresh = () => {
    if (fittyInstance) {
      if (Array.isArray(fittyInstance)) {
        fittyInstance.forEach(instance => instance.fit())
      } else {
        fittyInstance.fit()
      }
    }
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    refresh,
    cleanup,
    init,
  }
}
