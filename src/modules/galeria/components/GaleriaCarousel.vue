<!-- src/modules/galeria/components/GaleriaCarousel.vue -->
<template>
  <section v-if="galeria.length > 0" class="galeria-carousel relative bg-gray-50 dark:bg-gray-800 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Nossa Galeria
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Conheça mais sobre nosso trabalho e atividades
        </p>
      </div>

      <!-- Carrossel -->
      <div class="relative">
        <!-- Container do Carrossel -->
        <div class="carousel-container overflow-hidden rounded-xl shadow-lg">
          <div 
            class="carousel-track flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div
              v-for="(imagem, index) in galeria.slice(0, 8)"
              :key="imagem.id"
              class="carousel-slide flex-shrink-0 w-full"
            >
              <div class="relative h-96 md:h-[500px] lg:h-[600px]">
                <img
                  :src="imagem.url"
                  :alt="imagem.alt"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <!-- Overlay com informações -->
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div class="p-6 text-white">
                    <h3 class="text-2xl font-bold mb-2">
                      {{ imagem.titulo }}
                    </h3>
                    <p class="text-lg opacity-90" v-if="imagem.descricao">
                      {{ imagem.descricao }}
                    </p>
                    <span 
                      v-if="imagem.categoria"
                      class="inline-block mt-2 px-3 py-1 bg-amajac-green text-white text-sm rounded-full"
                    >
                      {{ formatarCategoria(imagem.categoria) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles de Navegação -->
        <button
          @click="prevSlide"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 z-10"
          aria-label="Imagem anterior"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          @click="nextSlide"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 z-10"
          aria-label="Próxima imagem"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Indicadores -->
        <div class="flex justify-center mt-6 space-x-2">
          <button
            v-for="(imagem, index) in galeria.slice(0, 8)"
            :key="`indicator-${imagem.id}`"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full transition-all duration-200"
            :class="[
              index === currentIndex 
                ? 'bg-amajac-green w-8' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            ]"
            :aria-label="`Ir para imagem ${index + 1}`"
          />
        </div>
      </div>

      <!-- Controles Adicionais -->
      <div class="flex justify-center mt-6 space-x-4">
        <button
          @click="toggleAutoplay"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="autoplay" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m5-12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
          {{ autoplay ? 'Pausar' : 'Reproduzir' }}
        </button>

        <router-link
          to="/galeria"
          class="px-4 py-2 border border-amajac-green text-amajac-green rounded-lg hover:bg-amajac-green hover:text-white transition-colors"
        >
          Ver Galeria Completa
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGaleria } from '../composables/useGaleria'

const { galeria, loading, error, fetchGaleria } = useGaleria()
const currentIndex = ref(0)
const autoplay = ref(true)
const autoplayInterval = ref(null)

// Buscar galeria ao montar
onMounted(async () => {
  await fetchGaleria()
  startAutoplay()
})

// Navegação
const nextSlide = () => {
  const totalSlides = Math.min(galeria.value.length, 8)
  currentIndex.value = (currentIndex.value + 1) % totalSlides
}

const prevSlide = () => {
  const totalSlides = Math.min(galeria.value.length, 8)
  currentIndex.value = (currentIndex.value - 1 + totalSlides) % totalSlides
}

const goToSlide = (index) => {
  currentIndex.value = index
}

// Formatar categoria
const formatarCategoria = (categoria) => {
  if (!categoria) return 'Sem Categoria'
  return categoria.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Autoplay
const startAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  
  autoplayInterval.value = setInterval(() => {
    if (autoplay.value && galeria.value.length > 0) {
      nextSlide()
    }
  }, 5000) // Muda a cada 5 segundos
}

const toggleAutoplay = () => {
  autoplay.value = !autoplay.value
  if (autoplay.value) {
    startAutoplay()
  } else if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
}

// Limpar intervalo ao desmontar
onUnmounted(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
})
</script>

<style scoped>
.galeria-carousel {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.dark .galeria-carousel {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
}

.carousel-container {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.carousel-track {
  will-change: transform;
}

.carousel-slide {
  transition: opacity 0.5s ease-in-out;
}

.carousel-track {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: none;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 768px) {
  .carousel-slide .relative {
    height: 300px;
  }
}
</style>