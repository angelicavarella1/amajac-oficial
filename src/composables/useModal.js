// src/composables/useModal.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useModal() {
  const isOpen = ref(false)

  const open = () => {
    console.log('🔘 MODAL ABRINDO...')
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    console.log('🔴 MODAL FECHANDO...')
    isOpen.value = false
    document.body.style.overflow = ''
  }

  const toggle = () => {
    isOpen.value ? close() : open()
  }

  // Fechar modal com ESC
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  })

  return {
    isOpen,
    open,
    close,
    toggle
  }
}