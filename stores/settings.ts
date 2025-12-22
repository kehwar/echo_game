/**
 * Settings Store using Pinia
 * Manages user preferences like timer duration and language
 */
import { defineStore } from 'pinia'

const SETTINGS_STORAGE_KEY = 'echo-game-settings'

interface GameSettings {
  timerDuration: number
  startCountdownDuration: number
  locale: string
  deckLocale: string
}

const defaultSettings: GameSettings = {
  timerDuration: 120, // 2 minutes default
  startCountdownDuration: 2, // 2 seconds default countdown
  locale: 'en-US',
  deckLocale: 'auto' // 'auto' means use UI locale
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    timerDuration: defaultSettings.timerDuration,
    startCountdownDuration: defaultSettings.startCountdownDuration,
    locale: defaultSettings.locale,
    deckLocale: defaultSettings.deckLocale,
    durationOptions: [60, 90, 120] as const,
    countdownOptions: [1, 2, 3] as const,
  }),

  actions: {
    /**
     * Load settings from localStorage
     */
    loadSettings() {
      if (typeof window === 'undefined') return

      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
        if (stored) {
          const settings: GameSettings = JSON.parse(stored)
          this.timerDuration = settings.timerDuration ?? defaultSettings.timerDuration
          this.startCountdownDuration = settings.startCountdownDuration ?? defaultSettings.startCountdownDuration
          this.locale = settings.locale ?? defaultSettings.locale
          this.deckLocale = settings.deckLocale ?? defaultSettings.deckLocale
        }
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error)
      }
    },

    /**
     * Save settings to localStorage
     */
    saveSettings() {
      if (typeof window === 'undefined') return

      try {
        const settings: GameSettings = {
          timerDuration: this.timerDuration,
          startCountdownDuration: this.startCountdownDuration,
          locale: this.locale,
          deckLocale: this.deckLocale
        }
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error)
      }
    },

    /**
     * Set timer duration and save
     */
    setTimerDuration(duration: number) {
      this.timerDuration = duration
      this.saveSettings()
    },

    /**
     * Set start countdown duration and save
     */
    setStartCountdownDuration(duration: number) {
      this.startCountdownDuration = duration
      this.saveSettings()
    },

    /**
     * Set locale and save
     */
    setLocale(locale: string) {
      this.locale = locale
      this.saveSettings()
    },

    /**
     * Set deck locale and save
     */
    setDeckLocale(deckLocale: string) {
      this.deckLocale = deckLocale
      this.saveSettings()
    },

    /**
     * Reset to default settings
     */
    resetToDefaults() {
      this.timerDuration = defaultSettings.timerDuration
      this.startCountdownDuration = defaultSettings.startCountdownDuration
      this.locale = defaultSettings.locale
      this.deckLocale = defaultSettings.deckLocale
      this.saveSettings()
    }
  }
})
