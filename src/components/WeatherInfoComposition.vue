<template>
  <div class="weather-info">
    <slot
      :temperatura="temperatura"
      :condicao="condicao"
      :loading="loading"
      :error="error"
      :weatherIcon="weatherIcon"
      :atualizarClima="atualizarClima"
    >
      <!-- Default slot content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Clima
            </h3>
            <div v-if="!loading && temperatura" class="flex items-center space-x-2">
              <span class="text-2xl font-bold text-gray-800 dark:text-white">
                {{ temperatura }}°C
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ condicao }}
              </span>
            </div>
            <div v-else-if="loading" class="text-gray-500">
              Carregando...
            </div>
            <div v-else class="text-gray-500">
              Indisponível
            </div>
          </div>
          <div class="text-3xl">
            {{ weatherIcon }}
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOpenMeteoWeather } from '@/composables/useOpenMeteoWeather'

const { temperatura, condicao, loading, error, buscarClima } = useOpenMeteoWeather()

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
</script>