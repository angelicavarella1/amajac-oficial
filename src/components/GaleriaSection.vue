<template>
  <section v-if="configuracoesStore.sistema?.info_galeria_ativado === 'true'" 
           class="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Nossa Galeria
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Confira os melhores momentos dos nossos eventos e atividades
        </p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="setActiveCategory(category.id)"
          :class="[
            'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300',
            activeCategory === category.id
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="galeriaStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="aspect-w-16 aspect-h-9 overflow-hidden">
            <div class="w-full h-64 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          </div>
          <div class="p-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="image in imagensPaginadas"
          :key="image.id"
          class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-200 dark:border-gray-700"
          @click="openLightbox(image)"
        >
          <!-- Image -->
          <div class="aspect-w-16 aspect-h-9 overflow-hidden">
            <!-- Loading State -->
            <div v-if="image.imageLoading" class="w-full h-64 bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            
            <!-- Image Loaded -->
            <img
              v-else-if="!image.imageError && image.imageUrl"
              :src="image.imageUrl"
              :alt="image.titulo || 'Imagem da galeria'"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              :loading="imagensPaginadas.indexOf(image) < 4 ? 'eager' : 'lazy'"
              @load="image.handleLoad"
              @error="image.handleError"
            />
            
            <!-- Error State -->
            <div v-else class="w-full h-64 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-exclamation-triangle text-red-500 text-lg mb-1"></i>
                <p class="text-red-500 text-xs">Falha ao carregar</p>
              </div>
            </div>
          </div>

          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
            <div class="p-4 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 class="text-white font-semibold text-lg mb-1">{{ safeString(image.titulo || 'Sem título') }}</h3>
              <p class="text-gray-200 text-sm">{{ formatarCategoria(image.categoria) }}</p>
            </div>
          </div>

          <!-- View Icon -->
          <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="bg-white bg-opacity-90 rounded-full p-2">
              <i class="fas fa-expand text-gray-800 text-sm"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && !galeriaStore.loading" class="text-center mt-12">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center mx-auto"
        >
          <span v-if="loadingMore">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Carregando...
          </span>
          <span v-else>
            <i class="fas fa-plus mr-2"></i>
            Carregar Mais
          </span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredImages.length === 0 && !galeriaStore.loading" class="text-center py-12">
        <i class="fas fa-images text-6xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma imagem encontrada
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ activeCategory === 'all' ? 'A galeria está vazia no momento.' : 'Tente selecionar outra categoria' }}
        </p>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="lightboxOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeLightbox"></div>

        <!-- Content -->
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Close Button -->
          <div class="absolute top-4 right-4 z-10">
            <button
              @click="closeLightbox"
              class="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <!-- Navigation -->
          <button
            v-if="hasPrevious"
            @click="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-colors z-10"
          >
            <i class="fas fa-chevron-left text-xl"></i>
          </button>

          <button
            v-if="hasNext"
            @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-colors z-10"
          >
            <i class="fas fa-chevron-right text-xl"></i>
          </button>

          <!-- Image Loading -->
          <div v-if="imagemModalLoading" class="flex items-center justify-center min-h-96">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400">Carregando imagem...</p>
            </div>
          </div>

          <!-- Image -->
          <div v-else class="bg-white dark:bg-gray-800 p-4">
            <img
              :src="imagemModalUrl"
              :alt="currentImage?.titulo || 'Imagem da galeria'"
              class="w-full h-96 object-contain rounded-lg"
              @load="imagemModalLoaded"
              @error="imagemModalErro"
            />
          </div>

          <!-- Info -->
          <div v-if="currentImage && !imagemModalError" class="bg-gray-50 dark:bg-gray-700 px-6 py-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ safeString(currentImage.titulo || 'Sem título') }}
            </h3>
            <p v-if="currentImage.descricao" class="text-gray-600 dark:text-gray-300 mb-4">
              {{ safeString(currentImage.descricao) }}
            </p>
            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{{ formatarData(currentImage.created_at) }}</span>
              <span>{{ formatarCategoria(currentImage.categoria) }}</span>
              <span>{{ currentImageIndex + 1 }} de {{ filteredImages.length }}</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="imagemModalError" class="bg-red-50 dark:bg-red-900/20 px-6 py-8 text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-2"></i>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Erro ao carregar imagem</h3>
            <p class="text-red-600 dark:text-red-400 text-sm">Não foi possível carregar a imagem selecionada.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGaleriaStore } from '@/stores/galeria'
import { useConfiguracoesStore } from '@/stores/configuracoes'
import { useSafeImage } from '@/composables/useSafeImage'

const galeriaStore = useGaleriaStore()
const configuracoesStore = useConfiguracoesStore()

// Estados do componente
const loading = ref(false)
const loadingMore = ref(false)
const lightboxOpen = ref(false)
const activeCategory = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const currentImageIndex = ref(0)
const imagemModalLoading = ref(false)
const imagemModalError = ref(false)
const imagemModalUrl = ref('')

// Categorias baseadas nos dados reais
const categories = ref([
  { id: 'all', name: 'Todas' },
  { id: 'eventos', name: 'Eventos' },
  { id: 'reunioes', name: 'Reuniões' },
  { id: 'workshops', name: 'Workshops' },
  { id: 'comunidade', name: 'Comunidade' }
])

// Computed properties
const imagensComEstado = computed(() => {
  return galeriaStore.imagens.map(imagem => {
    // Se já foi processada, retorna
    if (imagem._processed) return imagem
    
    const imageState = ref({
      loading: true,
      error: false,
      url: imagem.imagem_url || ''
    })

    return {
      ...imagem,
      imageLoading: imageState.value.loading,
      imageError: imageState.value.error,
      imageUrl: imageState.value.url,
      
      handleLoad: () => {
        imageState.value.loading = false
        imageState.value.error = false
      },
      handleError: () => {
        imageState.value.loading = false
        imageState.value.error = true
      },
      
      _processed: true
    }
  })
})

const filteredImages = computed(() => {
  let filtered = imagensComEstado.value

  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(image => 
      image.categoria?.toLowerCase() === activeCategory.value.toLowerCase()
    )
  }

  return filtered
})

const imagensPaginadas = computed(() => {
  return filteredImages.value.slice(0, currentPage.value * itemsPerPage.value)
})

const currentImage = computed(() => {
  return filteredImages.value[currentImageIndex.value]
})

const hasMore = computed(() => {
  return imagensPaginadas.value.length < filteredImages.value.length
})

const hasPrevious = computed(() => currentImageIndex.value > 0)
const hasNext = computed(() => currentImageIndex.value < filteredImages.value.length - 1)

// Métodos
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

const formatarCategoria = (categoria) => {
  if (!categoria) return 'Sem categoria'
  return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()
}

const formatarData = (dataString) => {
  if (!dataString) return ''
  try {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dataString
  }
}

const setActiveCategory = (category) => {
  activeCategory.value = category
  currentPage.value = 1
  currentImageIndex.value = 0
}

const openLightbox = (image) => {
  const index = filteredImages.value.findIndex(img => img.id === image.id)
  if (index !== -1) {
    currentImageIndex.value = index
    lightboxOpen.value = true
    imagemModalUrl.value = image.imagem_url || image.imageUrl || ''
    imagemModalLoading.value = true
    imagemModalError.value = false
    
    document.body.style.overflow = 'hidden'
  }
}

const closeLightbox = () => {
  lightboxOpen.value = false
  imagemModalUrl.value = ''
  imagemModalLoading.value = false
  imagemModalError.value = false
  document.body.style.overflow = 'auto'
}

const imagemModalLoaded = () => {
  imagemModalLoading.value = false
}

const imagemModalErro = () => {
  imagemModalLoading.value = false
  imagemModalError.value = true
}

const nextImage = () => {
  if (hasNext.value) {
    currentImageIndex.value++
    const novaImagem = filteredImages.value[currentImageIndex.value]
    imagemModalUrl.value = novaImagem.imagem_url || novaImagem.imageUrl || ''
    imagemModalLoading.value = true
    imagemModalError.value = false
  }
}

const previousImage = () => {
  if (hasPrevious.value) {
    currentImageIndex.value--
    const novaImagem = filteredImages.value[currentImageIndex.value]
    imagemModalUrl.value = novaImagem.imagem_url || novaImagem.imageUrl || ''
    imagemModalLoading.value = true
    imagemModalError.value = false
  }
}

const loadMore = async () => {
  loadingMore.value = true
  // Simular carregamento para melhor UX
  await new Promise(resolve => setTimeout(resolve, 500))
  currentPage.value++
  loadingMore.value = false
}

// Navegação por teclado no lightbox
const handleKeydown = (event) => {
  if (!lightboxOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      if (hasPrevious.value) {
        event.preventDefault()
        previousImage()
      }
      break
    case 'ArrowRight':
      if (hasNext.value) {
        event.preventDefault()
        nextImage()
      }
      break
  }
}

// Carregar dados
const loadGalleryData = async () => {
  if (galeriaStore.imagens.length === 0) {
    await galeriaStore.fetchImagens()
  }
}

onMounted(() => {
  loadGalleryData()
  document.addEventListener('keydown', handleKeydown)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
}

.aspect-w-16::before {
  content: "";
  display: block;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Transições suaves */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}

/* Melhorar a aparência no dark mode */
.dark .shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.dark .shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
}

/* Responsividade */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1025px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>