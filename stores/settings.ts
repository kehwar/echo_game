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
  soundEnabled: boolean
  pauseButtonPosition: 'left' | 'right'
  fontSize: number
  fontFamily: string
  autoScaleFont: boolean
  scaleFactor: number
}

const defaultSettings: GameSettings = {
  timerDuration: 120, // 2 minutes default
  startCountdownDuration: 2, // 2 seconds default countdown
  locale: 'en-US',
  deckLocale: 'auto', // 'auto' means use UI locale
  soundEnabled: true, // Sound effects enabled by default
  pauseButtonPosition: 'left', // Default pause button position
  fontSize: 6, // Default font size in rem (6rem = text-6xl)
  fontFamily: 'sans-serif', // Default font family
  autoScaleFont: true, // Auto-scale font based on character count
  scaleFactor: 1.0 // Scale factor for auto-scaling (1.0 = default)
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    timerDuration: defaultSettings.timerDuration,
    startCountdownDuration: defaultSettings.startCountdownDuration,
    locale: defaultSettings.locale,
    deckLocale: defaultSettings.deckLocale,
    soundEnabled: defaultSettings.soundEnabled,
    pauseButtonPosition: defaultSettings.pauseButtonPosition,
    fontSize: defaultSettings.fontSize,
    fontFamily: defaultSettings.fontFamily,
    autoScaleFont: defaultSettings.autoScaleFont,
    scaleFactor: defaultSettings.scaleFactor,
    durationOptions: [60, 90, 120] as const,
    countdownOptions: [1, 2, 3] as const,
    pausePositionOptions: ['left', 'right'] as const,
    fontSizeOptions: [4, 5, 6, 7, 8] as const, // rem values
    fontFamilyOptions: [
      { value: 'sans-serif', label: 'Sans Serif' },
      { value: 'monospace', label: 'Monospace' },
      { value: 'courier', label: 'Courier' },
      { value: 'monaco', label: 'Monaco' },
      { value: 'consolas', label: 'Consolas' }
    ] as const,
    scaleFactorOptions: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3] as const,
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
          this.soundEnabled = settings.soundEnabled ?? defaultSettings.soundEnabled
          this.pauseButtonPosition = settings.pauseButtonPosition ?? defaultSettings.pauseButtonPosition
          this.fontSize = settings.fontSize ?? defaultSettings.fontSize
          this.fontFamily = settings.fontFamily ?? defaultSettings.fontFamily
          this.autoScaleFont = settings.autoScaleFont ?? defaultSettings.autoScaleFont
          this.scaleFactor = settings.scaleFactor ?? defaultSettings.scaleFactor
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
          deckLocale: this.deckLocale,
          soundEnabled: this.soundEnabled,
          pauseButtonPosition: this.pauseButtonPosition,
          fontSize: this.fontSize,
          fontFamily: this.fontFamily,
          autoScaleFont: this.autoScaleFont,
          scaleFactor: this.scaleFactor
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
     * Set sound enabled and save
     */
    setSoundEnabled(enabled: boolean) {
      this.soundEnabled = enabled
      this.saveSettings()
    },

    /**
     * Set pause button position and save
     */
    setPauseButtonPosition(position: 'left' | 'right') {
      this.pauseButtonPosition = position
      this.saveSettings()
    },

    /**
     * Set font size and save
     */
    setFontSize(size: number) {
      this.fontSize = size
      this.saveSettings()
    },

    /**
     * Set font family and save
     */
    setFontFamily(family: string) {
      this.fontFamily = family
      this.saveSettings()
    },

    /**
     * Set auto-scale font and save
     */
    setAutoScaleFont(enabled: boolean) {
      this.autoScaleFont = enabled
      this.saveSettings()
    },

    /**
     * Set scale factor and save
     */
    setScaleFactor(factor: number) {
      this.scaleFactor = factor
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
      this.soundEnabled = defaultSettings.soundEnabled
      this.pauseButtonPosition = defaultSettings.pauseButtonPosition
      this.fontSize = defaultSettings.fontSize
      this.fontFamily = defaultSettings.fontFamily
      this.autoScaleFont = defaultSettings.autoScaleFont
      this.scaleFactor = defaultSettings.scaleFactor
      this.saveSettings()
    }
  }
})
