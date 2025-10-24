import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

export function useDarkMode() {
  const uiStore = useUIStore()
  const { isDark, darkMode } = storeToRefs(uiStore)
  const { toggleDarkMode, initializeDarkMode } = uiStore

  return {
    isDark,
    darkMode,
    toggleDarkMode,
    initializeDarkMode
  }
}