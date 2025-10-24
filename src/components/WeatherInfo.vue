<template>
  <div class="weather-info-compact-horizontal bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-2 text-gray-500 text-xs">
      <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
      <span>Clima...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center gap-2 text-red-500 text-xs">
      <i class="fas fa-exclamation-triangle"></i>
      <span>Erro</span>
    </div>

    <!-- Weather Data Horizontal Compact -->
    <div v-else-if="temperatura" class="flex items-center justify-between gap-3">
      <!-- Lado Esquerdo: Ícone Principal e Temperatura -->
      <div class="flex items-center gap-2">
        <!-- Ícone do clima com possibilidade de useSafeImage -->
        <div class="image-wrapper text-xl">
          <img 
            v-if="useDynamicIcons && !weatherIconState.loading && !weatherIconState.error"
            :src="weatherIconState.imageUrl" 
            :alt="descricao"
            class="w-6 h-6 object-contain transition-opacity duration-300"
            :class="{ 'opacity-0': weatherIconState.loading, 'opacity-100': !weatherIconState.loading }"
            @load="weatherIconState.lazyLoad"
          />
          <div v-else-if="useDynamicIcons && weatherIconState.loading" class="placeholder animate-pulse w-6 h-6 flex items-center justify-center">
            <span class="text-sm">🌤️</span>
          </div>
          <div v-else-if="useDynamicIcons && weatherIconState.error" class="error-state w-6 h-6 flex items-center justify-center">
            <span class="text-sm">❓</span>
          </div>
          <span v-else class="weather-emoji">
            {{ getWeatherIcon(weatherCode) }}
          </span>
        </div>
        <div class="flex flex-col">
          <div class="text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight">
            {{ temperatura }}°C
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">
            {{ descricao }}
          </div>
        </div>
      </div>

      <!-- Lado Direito: Métricas Detalhadas -->
      <div class="flex items-center gap-3">
        <!-- Umidade -->
        <div class="flex items-center gap-1 text-xs">
          <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i class="fas fa-tint text-blue-600 dark:text-blue-400 text-xs"></i>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ umidade || '--' }}%</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">Umid</span>
          </div>
        </div>

        <!-- Vento -->
        <div class="flex items-center gap-1 text-xs">
          <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <i class="fas fa-wind text-green-600 dark:text-green-400 text-xs"></i>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ vento || '--' }}km/h</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">Vento</span>
          </div>
        </div>

        <!-- Sensação Térmica -->
        <div class="flex items-center gap-1 text-xs">
          <div class="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <i class="fas fa-thermometer-half text-orange-600 dark:text-orange-400 text-xs"></i>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ sensacaoTermica || '--' }}°C</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">Sens</span>
          </div>
        </div>

        <!-- Botão Atualizar -->
        <button
          @click="refreshWeather"
          class="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          title="Atualizar clima"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt text-xs" :class="{ 'animate-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="flex items-center justify-center gap-2 text-gray-400 text-xs">
      <i class="fas fa-cloud"></i>
      <span>Sem dados</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useOpenMeteoWeather } from '@/composables/useOpenMeteoWeather'
import { useSafeImage } from '@/composables/useSafeImage'

const { 
  temperatura, 
  descricao, 
  umidade, 
  vento, 
  sensacaoTermica,
  loading, 
  error, 
  buscarClima 
} = useOpenMeteoWeather()

// Configuração opcional para ícones dinâmicos
const useDynamicIcons = ref(false) // Padrão: false (usa emojis)

// Estado para ícones dinâmicos (se necessário no futuro)
const weatherIconState = ref(useSafeImage(''))

const weatherCode = computed(() => {
  return descricao.value ? descricao.value.toLowerCase() : ''
})

// Função para obter URL de ícone dinâmico (exemplo futuro)
const getWeatherIconUrl = (code) => {
  if (!code) return ''
  const lowerCode = code.toLowerCase()
  
  // Exemplo de como poderia ser implementado com URLs dinâmicas
  if (lowerCode.includes('chuva') || lowerCode.includes('garoa') || lowerCode.includes('pancadas')) 
    return '/icons/weather/rain.png'
  if (lowerCode.includes('nublado') || lowerCode.includes('neblina') || lowerCode.includes('nevoeiro')) 
    return '/icons/weather/cloudy.png'
  if (lowerCode.includes('limpo') || lowerCode.includes('céu limpo')) 
    return '/icons/weather/sunny.png'
  if (lowerCode.includes('tempestade') || lowerCode.includes('trovoada')) 
    return '/icons/weather/storm.png'
  if (lowerCode.includes('nevasca') || lowerCode.includes('neve')) 
    return '/icons/weather/snow.png'
  
  return '/icons/weather/partly-cloudy.png'
}

// Função original para emojis (mantida como fallback)
const getWeatherIcon = (code) => {
  if (!code) return '🌤️'
  const lowerCode = code.toLowerCase()
  if (lowerCode.includes('chuva') || lowerCode.includes('garoa') || lowerCode.includes('pancadas')) return '🌧️'
  if (lowerCode.includes('nublado') || lowerCode.includes('neblina') || lowerCode.includes('nevoeiro')) return '☁️'
  if (lowerCode.includes('limpo') || lowerCode.includes('céu limpo')) return '☀️'
  if (lowerCode.includes('tempestade') || lowerCode.includes('trovoada')) return '⛈️'
  if (lowerCode.includes('nevasca') || lowerCode.includes('neve')) return '❄️'
  return '🌤️'
}

// Watch para atualizar ícone dinâmico quando a descrição mudar
watch(descricao, (newDescricao) => {
  if (useDynamicIcons.value && newDescricao) {
    const iconUrl = getWeatherIconUrl(newDescricao.toLowerCase())
    if (weatherIconState.value && typeof weatherIconState.value.setUrl === 'function') {
      weatherIconState.value.setUrl(iconUrl)
    }
  }
})

const refreshWeather = () => {
  buscarClima()
}

onMounted(() => {
  buscarClima()
  
  // Inicializa ícone dinâmico se configurado
  if (useDynamicIcons.value && descricao.value) {
    const iconUrl = getWeatherIconUrl(descricao.value.toLowerCase())
    if (weatherIconState.value && typeof weatherIconState.value.setUrl === 'function') {
      weatherIconState.value.setUrl(iconUrl)
    }
  }
})
</script>

<style scoped>
.weather-info-compact-horizontal {
  min-width: 380px;
  max-width: 420px;
  height: 50px;
}

.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-emoji {
  display: inline-block;
  font-size: 1.25rem;
  line-height: 1;
}

.placeholder {
  background-color: #f3f4f6;
  border-radius: 4px;
}

.dark .placeholder {
  background-color: #4b5563;
}

.error-state {
  background-color: #fef2f2;
  border-radius: 4px;
}

.dark .error-state {
  background-color: #7f1d1d;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

/* Responsividade */
@media (max-width: 1024px) {
  .weather-info-compact-horizontal {
    min-width: 350px;
    max-width: 380px;
  }
}

@media (max-width: 768px) {
  .weather-info-compact-horizontal {
    min-width: 320px;
    max-width: 350px;
    height: 45px;
  }
  
  .weather-emoji {
    font-size: 1.125rem;
  }
}

@media (max-width: 640px) {
  .weather-info-compact-horizontal {
    min-width: 280px;
    max-width: 320px;
    height: 40px;
    padding: 0.5rem;
  }
  
  .weather-emoji {
    font-size: 1rem;
  }
}
</style>