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
    expect(store.durationOptions).toEqual([60, 90, 120])
    expect(store.countdownOptions).toEqual([1, 2, 3])
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
    store.resetToDefaults()
    expect(store.timerDuration).toBe(120)
    expect(store.startCountdownDuration).toBe(2)
    expect(store.locale).toBe('en-US')
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
      locale: 'es-ES'
    })
    vi.mocked(localStorage.getItem).mockReturnValue(mockSettings)

    const store = useSettingsStore()
    store.loadSettings()
    
    expect(store.timerDuration).toBe(60)
    expect(store.startCountdownDuration).toBe(1)
    expect(store.locale).toBe('es-ES')
  })
})
