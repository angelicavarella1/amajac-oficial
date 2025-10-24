<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center transition-colors duration-500"
    :class="isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'"
  >
    <!-- Ícone de erro -->
    <div class="flex items-center justify-center w-24 h-24 bg-red-500 text-white rounded-full mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M5.93 19h12.14a2 2 0 001.78-2.89l-6.07-10.52a2 2 0 00-3.48 0L4.15 16.11A2 2 0 005.93 19z" />
      </svg>
    </div>

    <!-- Título -->
    <h1 class="text-5xl font-extrabold tracking-tight mb-4">404</h1>
    <p class="text-lg text-gray-500 dark:text-gray-400 mb-8 text-center">
      Oops! A página que você procura não foi encontrada.
    </p>

    <!-- Botões -->
    <div class="flex gap-4">
      <router-link
        to="/"
        class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        Voltar à Página Inicial
      </router-link>

      <button
        @click="toggleDark()"
        class="px-5 py-2.5 rounded-lg border border-gray-400 dark:border-gray-600 transition"
      >
        <span v-if="isDark">☀️ Modo Claro</span>
        <span v-else>🌙 Modo Escuro</span>
      </button>
    </div>

    <!-- Rodapé -->
    <footer class="mt-12 text-sm text-gray-500 dark:text-gray-400">
      <p>Associação de Moradores AMAJAC</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

// usa o Pinia store de tema (modo escuro)
const theme = useThemeStore()
const isDark = computed(() => theme.isDark)
const toggleDark = () => theme.toggleDark()
</script>