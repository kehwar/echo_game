/**
 * Pinia plugin to initialize stores with localStorage data
 */
export default defineNuxtPlugin(({ $pinia }) => {
  // Auto-load settings on app initialization
  const settingsStore = useSettingsStore($pinia as any)
  settingsStore.loadSettings()

  // Auto-load game history on app initialization
  const gameHistoryStore = useGameHistoryStore($pinia as any)
  gameHistoryStore.loadHistory()
})
