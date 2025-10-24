<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Clima
        </h3>
        <div v-if="!loading && temperatura" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-gray-800 dark:text-gray-200">
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
        🌤️
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOpenMeteoWeather } from '@/composables/useOpenMeteoWeather'

const { temperatura, condicao, loading, error, buscarClima } = useOpenMeteoWeather()

onMounted(() => {
  buscarClima()
})
</script>