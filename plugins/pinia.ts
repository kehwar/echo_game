/**
 * Pinia plugin to initialize stores with localStorage data
 */
export default defineNuxtPlugin(({ $pinia }) => {
  // Auto-load settings on app initialization
  const settingsStore = useSettingsStore($pinia)
  settingsStore.loadSettings()

  // Auto-load game history on app initialization
  const gameHistoryStore = useGameHistoryStore($pinia)
  gameHistoryStore.loadHistory()
})
