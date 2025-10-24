<!-- src/components/public/ClassificadosSection.vue -->
<template>
  <section id="classificados" class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">Classificados</h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">Serviços e produtos da comunidade</p>
      </div>

      <!-- Filtros -->
      <div v-if="classificados.length > 0" class="flex flex-wrap gap-2 justify-center mb-8">
        <button
          @click="$emit('filtrar', null)"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors', 
            !filtrarCategoria ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600']"
        >
          Todos
        </button>
        <button
          v-for="categoria in categorias"
          :key="categoria"
          @click="$emit('filtrar', categoria)"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors', 
            filtrarCategoria === categoria ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600']"
        >
          {{ formatarCategoria(categoria) }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-3 text-green-600 dark:text-green-400">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Carregando classificados...
        </div>
      </div>

      <!-- Classificados -->
      <div v-else-if="classificadosComImagens.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="classificado in classificadosComImagens" 
          :key="classificado.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Imagem com useSafeImage (CORRIGIDO) -->
          <div v-if="classificado.imagem_url" class="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <div class="image-wrapper w-full h-full">
              <!-- Imagem carregada com sucesso -->
              <img 
                v-if="!classificado._imageState.loading && !classificado._imageState.error && classificado._imageState.imageUrl"
                :src="classificado._imageState.imageUrl" 
                :alt="safeString(classificado.titulo)"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                :class="{ 'opacity-0': classificado._imageState.loading, 'opacity-100': !classificado._imageState.loading }"
                @load="classificado._imageState.lazyLoad"
                loading="lazy"
              />
              
              <!-- Estado de carregamento -->
              <div v-else-if="classificado._imageState.loading" class="placeholder animate-pulse w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                <div class="text-center">
                  <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Carregando...</span>
                </div>
              </div>
              
              <!-- Estado de erro -->
              <div v-else-if="classificado._imageState.error" class="error-state w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                <div class="text-center">
                  <svg class="w-8 h-8 text-red-400 dark:text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs text-red-500 dark:text-red-400">Falha ao carregar imagem</span>
                </div>
              </div>
              
              <!-- Placeholder padrão -->
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Placeholder quando não há imagem -->
          <div v-else class="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div class="text-center text-gray-400 dark:text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span class="text-sm">Sem imagem</span>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                {{ formatarCategoria(classificado.categoria) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(classificado.created_at) }}
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
              {{ safeString(classificado.titulo) }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ safeString(classificado.descricao) }}
            </p>
            
            <div v-if="classificado.telefone" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
              </svg>
              {{ formatarTelefone(classificado.telefone) }}
            </div>

            <div v-if="classificado.preco" class="text-lg font-bold text-green-600 dark:text-green-400 mb-4">
              R$ {{ formatarPreco(classificado.preco) }}
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="visualizarClassificado(classificado)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Ver Detalhes
              </button>
              
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ classificado.avaliacao_media?.toFixed(1) || '0.0' }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  ({{ classificado.total_avaliacoes || 0 }})
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m0 0V6a2 2 0 002-2H9a2 2 0 00-2 2v3a2 2 0 01-2 2H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-4z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhum classificado encontrado</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Em breve teremos serviços e produtos da nossa comunidade!</p>
          <button 
            @click="$emit('ver-mais', true)"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Tornar-se Associado
          </button>
        </div>
      </div>

      <!-- Ver Mais -->
      <div v-if="classificados.length > 6 && !verMais" class="text-center mt-8">
        <button 
          @click="$emit('ver-mais', true)"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
          Ver mais classificados
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClassificadosStore } from '@/stores/classificados'
import { useUIStore } from '@/stores/ui'
import { useSafeImage } from '@/composables/useSafeImage'

const props = defineProps({
  classificados: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  filtrarCategoria: String,
  verMais: Boolean,
  categorias: {
    type: Array,
    default: () => ['jardinagem', 'limpeza', 'reparos', 'pintura', 'encanamento', 'eletrica', 'construcao', 'moveis', 'automotivacao', 'tecnologia', 'costuras']
  }
})

const emit = defineEmits(['filtrar', 'ver-mais', 'visualizar'])

const classificadosStore = useClassificadosStore()
const uiStore = useUIStore()

// ✅ CORREÇÃO: Computeds para processar classificados com useSafeImage reativamente
const classificadosComImagens = computed(() => {
  return props.classificados.map(classificado => {
    // Cria um estado de imagem para cada classificado
    const imageState = useSafeImage(classificado.imagem_url || '')
    
    return {
      ...classificado,
      // Estados da imagem
      _imageState: {
        loading: imageState.loading.value,
        error: imageState.error.value,
        imageUrl: imageState.imageUrl.value,
        
        // Handlers
        lazyLoad: imageState.lazyLoad,
        reload: imageState.reload,
        reset: imageState.reset
      }
    }
  })
})

// Métodos auxiliares
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

const formatarCategoria = (categoria) => {
  const categoriasFormatadas = {
    jardinagem: 'Jardinagem',
    limpeza: 'Limpeza',
    reparos: 'Reparos',
    pintura: 'Pintura',
    encanamento: 'Encanamento',
    eletrica: 'Elétrica',
    construcao: 'Construção',
    moveis: 'Móveis',
    automotivacao: 'Automotivação',
    tecnologia: 'Tecnologia',
    costuras: 'Costuras'
  }
  return categoriasFormatadas[categoria] || categoria
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data não informada'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const formatarTelefone = (telefone) => {
  if (!telefone) return ''
  const numbers = telefone.replace(/\D/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}

const formatarPreco = (preco) => {
  if (typeof preco === 'number') {
    return preco.toFixed(2).replace('.', ',')
  }
  return preco
}

const visualizarClassificado = (classificado) => {
  emit('visualizar', classificado)
}

// Lifecycle
onMounted(() => {
  console.log('🎯 ClassificadosSection montado')
})
</script>

<style scoped>
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

.image-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  background-color: #f8f9fa;
}

.dark .placeholder {
  background-color: #374151;
}

.error-state {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.dark .error-state {
  background-color: #7f1d1d;
  border: 1px solid #dc2626;
}

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

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Transições suaves */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>