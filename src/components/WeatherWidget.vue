<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        Clima
      </h3>
      <button
        @click="atualizarClima"
        class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        title="Atualizar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-4">
      <LoadingSpinner size="small" />
    </div>

    <div v-else-if="error" class="text-center py-4">
      <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
    </div>

    <div v-else-if="temperatura" class="text-center">
      <div class="flex items-center justify-center mb-2">
        <span class="text-3xl font-bold text-gray-800 dark:text-white mr-2">
          {{ temperatura }}°C
        </span>
        <div class="text-2xl">
          {{ weatherIcon }}
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
        {{ condicao }}
      </p>
      <p class="text-gray-500 dark:text-gray-500 text-xs">
        {{ cidade }}
      </p>
    </div>

    <div v-else class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Dados não disponíveis
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useOpenMeteoWeather } from '@/composables/useOpenMeteoWeather'
import LoadingSpinner from './LoadingSpinner.vue'

const { temperatura, condicao, loading, error, buscarClima } = useOpenMeteoWeather()

const cidade = ref('São Paulo')

const weatherIcon = computed(() => {
  if (!condicao.value) return '🌤️'
  
  const cond = condicao.value.toLowerCase()
  if (cond.includes('chuva')) return '🌧️'
  if (cond.includes('nublado')) return '☁️'
  if (cond.includes('limpo')) return '☀️'
  if (cond.includes('tempestade')) return '⛈️'
  if (cond.includes('nevoeiro')) return '🌫️'
  return '🌤️'
})

const atualizarClima = () => {
  buscarClima()
}

onMounted(() => {
  buscarClima()
})
</script>