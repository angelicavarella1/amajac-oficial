import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // Inicializar tema
  const initializeTheme = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      isDark.value = saved === 'true'
    } else {
      // Detectar preferência do sistema
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // Alternar tema
  const toggleDark = () => {
    isDark.value = !isDark.value
    applyTheme()
    localStorage.setItem('darkMode', isDark.value)
  }

  // Aplicar tema no DOM
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark: computed(() => isDark.value),
    toggleDark,
    initializeTheme
  }
})