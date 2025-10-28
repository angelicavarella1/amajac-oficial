<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUIStore } from '@/shared/stores/ui' // <-- Corrigido
import { useAuthStore } from '@/modules/auth/stores/auth' // <-- Corrigido

const uiStore = useUIStore()
const authStore = useAuthStore()

onMounted(async () => {
  // Inicializar dark mode
  uiStore.initializeDarkMode()
  
  // Inicializar autenticação
  try {
    await authStore.checkAuth()
    console.log('Autenticação inicializada com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar autenticação:', error)
  }
})
</script>

<style>
/* Estilos globais */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Transições suaves para modo escuro */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Loading states */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Transições para elementos interativos */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Utilitários para imagens */
.image-placeholder {
  background: linear-gradient(45deg, #f3f4f6 25%, transparent 25%), 
              linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f3f4f6 75%), 
              linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.dark .image-placeholder {
  background: linear-gradient(45deg, #374151 25%, transparent 25%), 
              linear-gradient(-45deg, #374151 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #374151 75%), 
              linear-gradient(-45deg, transparent 75%, #374151 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* Focus states para acessibilidade */
.focus-ring:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Animações de entrada */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .break-inside-avoid {
    break-inside: avoid;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gray-50 {
    background-color: white;
  }
  
  .dark .bg-gray-900 {
    background-color: black;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>