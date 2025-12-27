import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.localStorage = localStorageMock as any
    // Mock window to make it defined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window = {} as any
  })

  it('should initialize with default settings', () => {
    const store = useSettingsStore()
    expect(store.timerDuration).toBe(120)
    expect(store.startCountdownDuration).toBe(2)
    expect(store.locale).toBe('en-US')
    expect(store.fontSize).toBe(6)
    expect(store.fontFamily).toBe('sans-serif')
    expect(store.autoScaleFont).toBe(true)
    expect(store.scaleFactor).toBe(1.0)
    expect(store.durationOptions).toEqual([60, 90, 120])
    expect(store.countdownOptions).toEqual([1, 2, 3])
    expect(store.fontSizeOptions).toEqual([4, 5, 6, 7, 8])
    expect(store.scaleFactorOptions).toEqual([0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3])
  })

  it('should set timer duration', () => {
    const store = useSettingsStore()
    store.setTimerDuration(90)
    expect(store.timerDuration).toBe(90)
  })

  it('should set start countdown duration', () => {
    const store = useSettingsStore()
    store.setStartCountdownDuration(1)
    expect(store.startCountdownDuration).toBe(1)
  })

  it('should set locale', () => {
    const store = useSettingsStore()
    store.setLocale('es-ES')
    expect(store.locale).toBe('es-ES')
  })

  it('should reset to defaults', () => {
    const store = useSettingsStore()
    store.setTimerDuration(90)
    store.setStartCountdownDuration(3)
    store.setLocale('es-ES')
    store.setFontSize(8)
    store.setFontFamily('monospace')
    store.setAutoScaleFont(false)
    store.setScaleFactor(1.2)
    store.resetToDefaults()
    expect(store.timerDuration).toBe(120)
    expect(store.startCountdownDuration).toBe(2)
    expect(store.locale).toBe('en-US')
    expect(store.fontSize).toBe(6)
    expect(store.fontFamily).toBe('sans-serif')
    expect(store.autoScaleFont).toBe(true)
    expect(store.scaleFactor).toBe(1.0)
  })

  it('should save settings to localStorage', () => {
    const store = useSettingsStore()
    store.setTimerDuration(90)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'echo-game-settings',
      expect.stringContaining('"timerDuration":90')
    )
  })

  it('should save start countdown duration to localStorage', () => {
    const store = useSettingsStore()
    store.setStartCountdownDuration(3)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'echo-game-settings',
      expect.stringContaining('"startCountdownDuration":3')
    )
  })

  it('should load settings from localStorage', () => {
    const mockSettings = JSON.stringify({
      timerDuration: 60,
      startCountdownDuration: 1,
      locale: 'es-ES',
      fontSize: 8,
      fontFamily: 'monospace',
      autoScaleFont: false,
      scaleFactor: 1.2
    })
    vi.mocked(localStorage.getItem).mockReturnValue(mockSettings)

    const store = useSettingsStore()
    store.loadSettings()
    
    expect(store.timerDuration).toBe(60)
    expect(store.startCountdownDuration).toBe(1)
    expect(store.locale).toBe('es-ES')
    expect(store.fontSize).toBe(8)
    expect(store.fontFamily).toBe('monospace')
    expect(store.autoScaleFont).toBe(false)
    expect(store.scaleFactor).toBe(1.2)
  })

  it('should set font size', () => {
    const store = useSettingsStore()
    store.setFontSize(8)
    expect(store.fontSize).toBe(8)
  })

  it('should set font family', () => {
    const store = useSettingsStore()
    store.setFontFamily('monospace')
    expect(store.fontFamily).toBe('monospace')
  })

  it('should set auto-scale font', () => {
    const store = useSettingsStore()
    store.setAutoScaleFont(false)
    expect(store.autoScaleFont).toBe(false)
  })

  it('should set scale factor', () => {
    const store = useSettingsStore()
    store.setScaleFactor(1.2)
    expect(store.scaleFactor).toBe(1.2)
  })
})
