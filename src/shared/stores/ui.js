import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const darkMode = ref(false)
  const mobileMenuOpen = ref(false)
  const activeSection = ref('')
  
  // Sistema de Toast
  const toast = ref({
    show: false,
    message: '',
    type: 'info' // 'success', 'error', 'warning', 'info'
  })

  // Dark Mode
  const initializeDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    darkMode.value = saved ? JSON.parse(saved) : prefersDark
    applyDarkMode()
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
    applyDarkMode()
  }

  const applyDarkMode = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Mobile Menu
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }

  // Active Section
  const setActiveSection = (section) => {
    activeSection.value = section
  }

  // Toast Functions
  const showToast = (message, type = 'info') => {
    toast.value = {
      show: true,
      message,
      type
    }
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      hideToast()
    }, 5000)
  }

  const hideToast = () => {
    toast.value.show = false
  }

  return {
    // States
    darkMode,
    mobileMenuOpen,
    activeSection,
    toast,
    
    // Actions
    initializeDarkMode,
    toggleDarkMode,
    toggleMobileMenu,
    closeMobileMenu,
    setActiveSection,
    showToast,
    hideToast
  }
})