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
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '@/supabase'

export default {
  name: 'GaleriaView',
  setup() {
    // Estados principais
    const imagensRaw = ref([])
    const loading = ref(true)
    const debugStatus = ref('Iniciando...')
    
    // ✅ VARIÁVEIS DE PAGINAÇÃO
    const paginaAtual = ref(1)
    const imagensPorPagina = ref(20) // Ajuste conforme necessidade

    // Estados do modal
    const modalAberto = ref(false)
    const imagemSelecionada = ref(null)
    const indiceSelecionado = ref(0)
    const imagemModalLoading = ref(false)
    const imagemModalError = ref(false)
    const imagemModalUrl = ref('')

    // Computed
    const isDevelopment = computed(() => import.meta.env.DEV)

    // ✅ COMPUTED PROPERTIES PARA PAGINAÇÃO
    const totalPaginas = computed(() => {
      return Math.ceil(imagensRaw.value.length / imagensPorPagina.value)
    })

    const imagensPaginadas = computed(() => {
      const startIndex = (paginaAtual.value - 1) * imagensPorPagina.value
      const endIndex = startIndex + imagensPorPagina.value
      return imagens.value.slice(startIndex, endIndex)
    })

    const inicioPagina = computed(() => {
      return (paginaAtual.value - 1) * imagensPorPagina.value + 1
    })

    const fimPagina = computed(() => {
      const end = paginaAtual.value * imagensPorPagina.value
      return end > imagensRaw.value.length ? imagensRaw.value.length : end
    })

    // ✅ MÉTODOS DE PAGINAÇÃO
    const proximaPagina = () => {
      if (paginaAtual.value < totalPaginas.value) {
        paginaAtual.value++
        // Rolagem suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const paginaAnterior = () => {
      if (paginaAtual.value > 1) {
        paginaAtual.value--
        // Rolagem suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // ✅ CORREÇÃO: Processar imagens SEM useSafeImage no computed
    const imagens = computed(() => {
      return imagensRaw.value.map(imagem => {
        // Se já foi processada, retorna
        if (imagem._processed) return imagem
        
        // ✅ CORREÇÃO: Criar estados de imagem simples
        const imageState = ref({
          loading: true,
          error: false,
          url: imagem.imagem_url || ''
        })

        return {
          ...imagem,
          // Estados da imagem
          imageLoading: imageState.value.loading,
          imageError: imageState.value.error,
          imageUrl: imageState.value.url,
          
          // Handlers
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

    const temImagemAnterior = computed(() => indiceSelecionado.value > 0)
    const temProximaImagem = computed(() => indiceSelecionado.value < imagens.value.length - 1)

    // Funções auxiliares
    const safeString = (str) => {
      if (typeof str !== 'string') return ''
      return str.replace(/[<>"']/g, '').trim()
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      try {
        return new Date(dateString).toLocaleDateString('pt-BR')
      } catch {
        return dateString
      }
    }

    // ✅ CORREÇÃO: Funções do Modal melhoradas
    const abrirModalImagem = (imagem) => {
      const index = imagens.value.findIndex(img => img.id === imagem.id)
      if (index !== -1) {
        indiceSelecionado.value = index
        imagemSelecionada.value = imagem
        modalAberto.value = true
        
        // ✅ CORREÇÃO: Usar URL direta com fallback
        imagemModalUrl.value = imagem.imagem_url || imagem.imageUrl || ''
        imagemModalLoading.value = true
        imagemModalError.value = false
        
        document.body.style.overflow = 'hidden'
        
        console.log('🖼️ Modal aberto:', {
          imagem: imagem.titulo,
          url: imagem.imagem_url,
          imageUrl: imagem.imageUrl,
          modalUrl: imagemModalUrl.value,
          indiceGlobal: index,
          total: imagens.value.length
        })
      }
    }

    const imagemModalLoaded = () => {
      imagemModalLoading.value = false
      console.log('✅ Imagem do modal carregada')
    }

    const imagemModalErro = () => {
      imagemModalLoading.value = false
      imagemModalError.value = true
      console.error('❌ Erro ao carregar imagem no modal:', {
        url: imagemModalUrl.value,
        imagem: imagemSelecionada.value
      })
    }

    const imagemAnterior = () => {
      if (temImagemAnterior.value) {
        indiceSelecionado.value--
        const novaImagem = imagens.value[indiceSelecionado.value]
        imagemSelecionada.value = novaImagem
        imagemModalUrl.value = novaImagem.imagem_url || novaImagem.imageUrl || ''
        imagemModalLoading.value = true
        imagemModalError.value = false
        
        console.log('⬅️ Imagem anterior:', novaImagem.titulo, 'Índice:', indiceSelecionado.value)
      }
    }

    const proximaImagem = () => {
      if (temProximaImagem.value) {
        indiceSelecionado.value++
        const novaImagem = imagens.value[indiceSelecionado.value]
        imagemSelecionada.value = novaImagem
        imagemModalUrl.value = novaImagem.imagem_url || novaImagem.imageUrl || ''
        imagemModalLoading.value = true
        imagemModalError.value = false
        
        console.log('➡️ Próxima imagem:', novaImagem.titulo, 'Índice:', indiceSelecionado.value)
      }
    }

    const fecharModal = () => {
      modalAberto.value = false
      imagemSelecionada.value = null
      imagemModalUrl.value = ''
      indiceSelecionado.value = 0
      imagemModalLoading.value = false
      imagemModalError.value = false
      document.body.style.overflow = 'auto'
    }

    // Navegação por teclado
    const handleKeydown = (event) => {
      if (!modalAberto.value) return
      
      switch (event.key) {
        case 'Escape':
          fecharModal()
          break
        case 'ArrowLeft':
          if (temImagemAnterior.value) {
            event.preventDefault()
            imagemAnterior()
          }
          break
        case 'ArrowRight':
          if (temProximaImagem.value) {
            event.preventDefault()
            proximaImagem()
          }
          break
      }
    }

    // ✅ CORREÇÃO: Carregar galeria otimizado
    const loadGallery = async () => {
      loading.value = true
      debugStatus.value = 'Conectando ao banco de dados...'
      
      try {
        console.log('🚀 CARREGANDO GALERIA...')
        
        const { data, error } = await supabase
          .from('galeria')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ ERRO SUPABASE:', error)
          throw error
        }

        console.log('📦 DADOS RECEBIDOS:', data?.length || 0, 'imagens')
        debugStatus.value = `Encontradas ${data?.length || 0} imagens`
        
        // ✅ CORREÇÃO: Atribuir diretamente sem processamento inicial
        imagensRaw.value = data || []

        // Debug das imagens
        if (isDevelopment.value && data && data.length > 0) {
          console.log('🔍 DEBUG IMAGENS:')
          data.forEach((imagem, index) => {
            console.log(`   ${index + 1}. "${imagem.titulo}" - ${imagem.imagem_url}`)
          })
        }

      } catch (error) {
        console.error('💥 ERRO:', error)
        debugStatus.value = `Erro: ${error.message}`
      } finally {
        loading.value = false
      }
    }

    // ✅ CORREÇÃO: Watch para verificar URLs das imagens
    watch(imagensRaw, (novasImagens) => {
      if (novasImagens.length > 0) {
        console.log('👀 Imagens carregadas - verificando URLs:')
        novasImagens.forEach((imagem, index) => {
          if (!imagem.imagem_url) {
            console.warn(`   ⚠️ Imagem ${index + 1} sem URL:`, imagem.titulo)
          }
        })
      }
    }, { immediate: true })

    // ✅ CORREÇÃO: Watch para debug do modal
    watch(modalAberto, (aberto) => {
      if (aberto && imagemSelecionada.value) {
        console.log('🔍 DEBUG MODAL ABERTO:', {
          titulo: imagemSelecionada.value.titulo,
          imagem_url: imagemSelecionada.value.imagem_url,
          imageUrl: imagemSelecionada.value.imageUrl,
          modalUrl: imagemModalUrl.value,
          indice: indiceSelecionado.value,
          total: imagens.value.length
        })
        
        // Testar se a URL é acessível
        if (imagemModalUrl.value) {
          console.log('🌐 Testando acesso à URL...')
          fetch(imagemModalUrl.value, { method: 'HEAD' })
            .then(response => {
              console.log('✅ URL acessível - Status:', response.status)
            })
            .catch(error => {
              console.error('❌ URL não acessível:', error)
            })
        }
      }
    })

    // ✅ CORREÇÃO: Resetar para página 1 quando modal fechar
    watch(modalAberto, (aberto) => {
      if (!aberto) {
        // Opcional: voltar para página 1 quando fechar modal
        // paginaAtual.value = 1
      }
    })

    onMounted(() => {
      console.log('🎯 GALERIA MONTADA')
      loadGallery()
      document.addEventListener('keydown', handleKeydown)

      // ✅ CORREÇÃO: Cleanup
      return () => {
        document.removeEventListener('keydown', handleKeydown)
      }
    })

    return {
      // Estados principais
      imagens,
      loading,
      debugStatus,
      
      // Paginação
      paginaAtual,
      totalPaginas,
      imagensPaginadas,
      inicioPagina,
      fimPagina,
      proximaPagina,
      paginaAnterior,
      
      // Modal
      modalAberto,
      imagemSelecionada,
      imagemModalLoading,
      imagemModalError,
      imagemModalUrl,
      isDevelopment,
      temImagemAnterior,
      temProximaImagem,
      
      // Funções
      safeString,
      formatDate,
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
/* Melhorias visuais */
.fixed {
  backdrop-filter: blur(8px);
}

/* Transições suaves */
* {
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Efeito de hover nos botões */
button:hover {
  transform: scale(1.05);
}

/* Melhorar a aparência das imagens no modal */
img {
  border-radius: 8px;
}

/* Loading animation personalizada */
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

/* Efeito de overlay suave */
.bg-opacity-90 {
  background-color: rgba(0, 0, 0, 0.9);
}

/* Melhorar responsividade do modal */
@media (max-width: 768px) {
  .p-4 {
    padding: 1rem;
  }
  
  .min-h-\[400px\] {
    min-height: 300px;
  }
  
  .max-h-\[70vh\] {
    max-height: 60vh;
  }
}

/* Estilos para paginação */
.pagination-info {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.dark .pagination-info {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

/* Botões de paginação com efeito melhorado */
.pagination-btn {
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-btn:hover:not(:disabled) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* Grid responsivo melhorado */
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