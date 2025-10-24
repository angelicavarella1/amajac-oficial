<!-- src/views/GaleriaView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
    <div class="container mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200">Galeria de Fotos</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">Confira os momentos especiais</p>
      </div>

      <!-- Debug Info -->
      <div v-if="isDevelopment" class="mb-6 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-bold text-blue-800 dark:text-blue-300 mb-2">DEBUG INFO:</h3>
        <p class="text-sm text-blue-700 dark:text-blue-300">Status: {{ debugStatus }}</p>
        <p class="text-sm text-blue-700 dark:text-blue-300">Total de imagens: {{ imagens.length }}</p>
        <p class="text-sm text-blue-700 dark:text-blue-300">Página: {{ paginaAtual }} de {{ totalPaginas }}</p>
        <p class="text-sm text-blue-700 dark:text-blue-300">Mostrando: {{ imagensPaginadas.length }} de {{ imagens.length }} imagens</p>
        <div v-if="imagens.length > 0" class="mt-2">
          <p class="text-sm font-semibold">Primeiras 3 URLs:</p>
          <div v-for="(imagem, index) in imagens.slice(0, 3)" :key="imagem.id" class="text-xs mt-1">
            {{ index + 1 }}. {{ imagem.imagem_url || 'URL NÃO ENCONTRADA' }}
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-200">Carregando galeria...</p>
      </div>

      <!-- Galeria com Paginação -->
      <div v-else-if="imagens.length > 0">
        <!-- Grid de Imagens -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="imagem in imagensPaginadas"
            :key="imagem.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            @click="abrirModalImagem(imagem)"
          >
            <!-- Imagem -->
            <div class="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
              <!-- Loading State -->
              <div v-if="imagem.imageLoading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- Imagem Carregada -->
              <img
                v-else-if="!imagem.imageError && imagem.imageUrl"
                :src="imagem.imageUrl"
                :alt="imagem.titulo || 'Imagem da galeria'"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                :loading="imagensPaginadas.indexOf(imagem) < 4 ? 'eager' : 'lazy'"
                @load="imagem.handleLoad"
                @error="imagem.handleError"
              />
              
              <!-- Error State -->
              <div v-else class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <div class="text-center p-2">
                  <i class="fas fa-exclamation-triangle text-red-500 text-lg mb-1"></i>
                  <p class="text-red-500 text-xs">Falha ao carregar</p>
                </div>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 dark:text-white text-sm mb-1 transition-colors duration-200">
                {{ safeString(imagem.titulo || 'Sem título') }}
              </h3>
              <p v-if="imagem.descricao" class="text-gray-600 dark:text-gray-300 text-xs mb-2 transition-colors duration-200">
                {{ safeString(imagem.descricao) }}
              </p>
              <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <span>{{ formatDate(imagem.created_at) }}</span>
                <span v-if="imagem.categoria" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">
                  {{ safeString(imagem.categoria) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="totalPaginas > 1" class="flex justify-center items-center gap-4 mt-8">
          <button 
            @click="paginaAnterior"
            :disabled="paginaAtual === 1"
            class="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <i class="fas fa-chevron-left"></i>
            Anterior
          </button>
          
          <span class="text-gray-700 dark:text-gray-300 font-medium">
            Página {{ paginaAtual }} de {{ totalPaginas }}
          </span>
          
          <button 
            @click="proximaPagina"
            :disabled="paginaAtual === totalPaginas"
            class="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Próxima
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Informações de Paginação -->
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {{ inicioPagina }}-{{ fimPagina }} de {{ imagens.length }} imagens
          </p>
        </div>
      </div>

      <!-- Vazio -->
      <div v-else class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <i class="fas fa-images text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Galeria vazia</h3>
          <p class="text-gray-500 dark:text-gray-400 transition-colors duration-200">Nenhuma imagem encontrada na galeria.</p>
        </div>
      </div>

      <!-- Modal para visualização de imagem -->
      <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div class="relative max-w-4xl max-h-full w-full">
          <!-- Botão Fechar -->
          <button 
            @click="fecharModal"
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
          
          <!-- Botões Navegação -->
          <button 
            v-if="temImagemAnterior"
            @click="imagemAnterior"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
          >
            <i class="fas fa-chevron-left text-xl"></i>
          </button>
          
          <button 
            v-if="temProximaImagem"
            @click="proximaImagem"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
          >
            <i class="fas fa-chevron-right text-xl"></i>
          </button>
          
          <!-- Conteúdo do Modal -->
          <div class="bg-gray-900 rounded-lg overflow-hidden">
            <!-- Imagem do Modal -->
            <div class="flex items-center justify-center min-h-[400px] max-h-[70vh] p-4">
              <!-- Loading -->
              <div v-if="imagemModalLoading" class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p class="text-white text-sm">Carregando imagem...</p>
              </div>
              
              <!-- Imagem -->
              <img
                v-else-if="!imagemModalError && imagemModalUrl"
                :src="imagemModalUrl"
                :alt="imagemSelecionada?.titulo || 'Imagem da galeria'"
                class="max-w-full max-h-full object-contain"
                @load="imagemModalLoaded"
                @error="imagemModalErro"
              />
              
              <!-- Error -->
              <div v-else class="text-center text-white">
                <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-2"></i>
                <p class="text-red-400">Falha ao carregar imagem</p>
                <p class="text-gray-400 text-sm mt-2">URL: {{ imagemSelecionada?.imagem_url }}</p>
              </div>
            </div>
            
            <!-- Informações da Imagem -->
            <div v-if="imagemSelecionada && !imagemModalError" class="p-6 bg-gray-800">
              <h3 class="text-xl font-semibold text-white mb-2">{{ safeString(imagemSelecionada.titulo || 'Sem título') }}</h3>
              <p v-if="imagemSelecionada.descricao" class="text-gray-300 text-sm mb-3">
                {{ safeString(imagemSelecionada.descricao) }}
              </p>
              <div class="flex justify-between items-center text-xs text-gray-400">
                <span>{{ formatDate(imagemSelecionada.created_at) }}</span>
                <span v-if="imagemSelecionada.categoria" class="bg-gray-700 px-3 py-1 rounded">
                  {{ safeString(imagemSelecionada.categoria) }}
                </span>
                <span class="text-gray-500">
                  {{ indiceSelecionado + 1 }} de {{ imagens.length }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useGaleriaStore } from '@/stores/galeria'
import { useUIStore } from '@/stores/ui'
import { useSafeImage } from '@/composables/useSafeImage'

export default {
  name: 'GaleriaView',
  setup() {
    const galeriaStore = useGaleriaStore()
    const uiStore = useUIStore()

    // Estados principais
    const loading = ref(false)
    const debugStatus = ref('Iniciando...')
    
    // Estados do modal
    const modalAberto = ref(false)
    const imagemSelecionada = ref(null)
    const indiceSelecionado = ref(0)
    const imagemModalLoading = ref(false)
    const imagemModalError = ref(false)
    const imagemModalUrl = ref('')

    // Estados de paginação
    const paginaAtual = ref(1)
    const itensPorPagina = ref(12)

    // Computed
    const isDevelopment = computed(() => import.meta.env.DEV)

    // ✅ COMPUTED CORRIGIDA: Processa as imagens com useSafeImage reativamente
    const imagens = computed(() => {
      return galeriaStore.imagens.map(imagem => {
        // Cria um estado de imagem para cada item
        const imageState = useSafeImage(imagem.imagem_url || '')
        
        return {
          ...imagem,
          // Estados da imagem
          imageLoading: imageState.loading.value,
          imageError: imageState.error.value,
          imageUrl: imageState.imageUrl.value,
          
          // Handlers
          handleLoad: imageState.lazyLoad,
          handleError: imageState.lazyLoad // Mesmo handler para erro
        }
      })
    })

    // Paginação
    const totalPaginas = computed(() => {
      return Math.ceil(imagens.value.length / itensPorPagina.value)
    })

    const imagensPaginadas = computed(() => {
      const startIndex = (paginaAtual.value - 1) * itensPorPagina.value
      const endIndex = startIndex + itensPorPagina.value
      return imagens.value.slice(startIndex, endIndex)
    })

    const inicioPagina = computed(() => {
      return (paginaAtual.value - 1) * itensPorPagina.value + 1
    })

    const fimPagina = computed(() => {
      const end = paginaAtual.value * itensPorPagina.value
      return end > imagens.value.length ? imagens.value.length : end
    })

    // Modal
    const temImagemAnterior = computed(() => {
      return indiceSelecionado.value > 0
    })

    const temProximaImagem = computed(() => {
      return indiceSelecionado.value < imagens.value.length - 1
    })

    // Funções auxiliares
    const safeString = (str) => {
      if (typeof str !== 'string') return ''
      return str.replace(/[<>"']/g, '').trim()
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'Data não informada'
      try {
        return new Date(dateString).toLocaleDateString('pt-BR')
      } catch {
        return dateString
      }
    }

    // Métodos de paginação
    const proximaPagina = () => {
      if (paginaAtual.value < totalPaginas.value) {
        paginaAtual.value++
      }
    }

    const paginaAnterior = () => {
      if (paginaAtual.value > 1) {
        paginaAtual.value--
      }
    }

    // Métodos do modal
    const abrirModalImagem = (imagem) => {
      const index = imagens.value.findIndex(i => i.id === imagem.id)
      if (index !== -1) {
        indiceSelecionado.value = index
        imagemSelecionada.value = imagens.value[index]
        imagemModalUrl.value = imagens.value[index].imageUrl
        imagemModalLoading.value = true
        imagemModalError.value = false
        modalAberto.value = true
        document.body.style.overflow = 'hidden'
      }
    }

    const fecharModal = () => {
      modalAberto.value = false
      imagemSelecionada.value = null
      imagemModalUrl.value = ''
      indiceSelecionado.value = 0
      document.body.style.overflow = 'auto'
    }

    const imagemAnterior = () => {
      if (temImagemAnterior.value) {
        indiceSelecionado.value--
        const novaImagem = imagens.value[indiceSelecionado.value]
        imagemSelecionada.value = novaImagem
        imagemModalUrl.value = novaImagem.imageUrl
        imagemModalLoading.value = true
        imagemModalError.value = false
      }
    }

    const proximaImagem = () => {
      if (temProximaImagem.value) {
        indiceSelecionado.value++
        const novaImagem = imagens.value[indiceSelecionado.value]
        imagemSelecionada.value = novaImagem
        imagemModalUrl.value = novaImagem.imageUrl
        imagemModalLoading.value = true
        imagemModalError.value = false
      }
    }

    const imagemModalLoaded = () => {
      imagemModalLoading.value = false
    }

    const imagemModalErro = () => {
      imagemModalLoading.value = false
      imagemModalError.value = true
    }

    // Lifecycle
    const carregarGaleria = async () => {
      loading.value = true
      debugStatus.value = 'Carregando...'
      
      try {
        await galeriaStore.fetchImagens()
        debugStatus.value = `Carregadas ${galeriaStore.imagens.length} imagens`
      } catch (err) {
        console.error('❌ Erro ao carregar galeria:', err)
        debugStatus.value = `Erro: ${err.message}`
        uiStore.showToast('Erro ao carregar galeria', 'error')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      carregarGaleria()
    })

    // Watch para atualizar URL da imagem no modal quando a imagem selecionada mudar
    watch(imagemSelecionada, (novaImagem) => {
      if (novaImagem) {
        imagemModalUrl.value = novaImagem.imageUrl
      }
    })

    return {
      // Estados
      loading,
      debugStatus,
      modalAberto,
      imagemSelecionada,
      indiceSelecionado,
      imagemModalLoading,
      imagemModalError,
      imagemModalUrl,
      paginaAtual,
      itensPorPagina,
      isDevelopment,
      
      // Computed
      imagens,
      totalPaginas,
      imagensPaginadas,
      inicioPagina,
      fimPagina,
      temImagemAnterior,
      temProximaImagem,
      
      // Funções auxiliares
      safeString,
      formatDate,
      
      // Métodos
      carregarGaleria,
      proximaPagina,
      paginaAnterior,
      abrirModalImagem,
      fecharModal,
      imagemAnterior,
      proximaImagem,
      imagemModalLoaded,
      imagemModalErro
    }
  }
}
</script>

<style scoped>
/* Transições suaves */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Loading animation */
.animate-spin {
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

/* Pulse animation for loading states */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Modal overlay */
.bg-opacity-90 {
  background-color: rgba(0, 0, 0, 0.9);
}

/* Responsive grid */
.grid {
  display: grid;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
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