/**
 * Global settings composable for Echo Game
 * Manages user preferences like timer duration and language
 */

const SETTINGS_STORAGE_KEY = 'echo-game-settings'

interface GameSettings {
  timerDuration: number
  locale: string
}

const defaultSettings: GameSettings = {
  timerDuration: 120, // 2 minutes default
  locale: 'en-US'
}

// Global state (shared across all components)
const timerDuration = ref<number>(defaultSettings.timerDuration)
const selectedLocale = ref<string>(defaultSettings.locale)

// Track if settings have been loaded from storage
let settingsInitialized = false

export function useSettings() {
  // Load settings from localStorage on first use
  if (!settingsInitialized && typeof window !== 'undefined') {
    loadSettings()
    settingsInitialized = true
  }

  function loadSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const settings: GameSettings = JSON.parse(stored)
        timerDuration.value = settings.timerDuration ?? defaultSettings.timerDuration
        selectedLocale.value = settings.locale ?? defaultSettings.locale
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
    }
  }

  function saveSettings() {
    try {
      const settings: GameSettings = {
        timerDuration: timerDuration.value,
        locale: selectedLocale.value
      }
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
    }
  }

  function setTimerDuration(duration: number) {
    timerDuration.value = duration
    saveSettings()
  }

  function setLocale(locale: string) {
    selectedLocale.value = locale
    saveSettings()
  }

  function resetToDefaults() {
    timerDuration.value = defaultSettings.timerDuration
    selectedLocale.value = defaultSettings.locale
    saveSettings()
  }

  return {
    // State
    timerDuration: readonly(timerDuration),
    selectedLocale: readonly(selectedLocale),
    durationOptions: [60, 90, 120] as const,
    // Methods
    setTimerDuration,
    setLocale,
    resetToDefaults
  }
}
