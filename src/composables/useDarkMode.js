import { ref, watch, onMounted } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('amajac-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('amajac-theme', 'light')
    }
  }

  const initDarkMode = () => {
    const savedTheme = localStorage.getItem('amajac-theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  }

  onMounted(() => {
    initDarkMode()
    
    // Ouvir mudanças no sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('amajac-theme')) {
        if (e.matches) {
          isDark.value = true
          document.documentElement.classList.add('dark')
        } else {
          isDark.value = false
          document.documentElement.classList.remove('dark')
        }
      }
    })
  })

  return {
    isDark,
    toggleDarkMode
  }
}