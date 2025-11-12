<!-- src/modules/galeria/components/GaleriaSection.vue -->
<template>
  <section id="galeria-section" class="galeria-section min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Galeria de Fotos
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore nossa coleção de imagens organizadas por categorias
        </p>
      </div>

      <!-- Filtros de Categoria -->
      <div class="flex flex-wrap justify-center gap-3 mb-8" v-if="categorias.length > 0">
        <button
          @click="filtrarPorCategoria('')"
          class="px-4 py-2 rounded-full transition-all duration-200 font-medium"
          :class="[
            categoriaAtiva === '' 
              ? 'bg-amajac-green text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
          ]"
        >
          Todas
        </button>
        
        <button
          v-for="categoria in categorias"
          :key="categoria"
          @click="filtrarPorCategoria(categoria)"
          class="px-4 py-2 rounded-full transition-all duration-200 font-medium"
          :class="[
            categoriaAtiva === categoria 
              ? 'bg-amajac-green text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
          ]"
        >
          {{ formatarCategoria(categoria) }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <svg class="w-12 h-12 mx-auto text-amajac-green animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-14.142l2.828 2.828m9.9 9.9l2.828 2.828" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando galeria...</p>
      </div>

      <!-- Mensagem de Erro -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <svg class="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Erro ao carregar galeria
          </h3>
          <p class="text-red-700 dark:text-red-300">
            {{ error }}
          </p>
          <button
            @click="fetchGaleria"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>

      <!-- Galeria por Categorias -->
      <div v-else-if="imagensFiltradas.length > 0" class="space-y-12">
        <!-- Seção para cada categoria -->
        <section
          v-for="categoria in categoriasParaExibir"
          :key="categoria"
          class="categoria-section"
        >
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ formatarCategoria(categoria) }}
            </h2>
            <div class="w-16 h-1 bg-amajac-green rounded-full"></div>
          </div>

          <!-- Grid de Imagens -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="imagem in imagensPorCategoria[categoria]"
              :key="imagem.id"
              class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              @click="abrirLightbox(imagem)"
            >
              <!-- Container da Imagem - MAIOR ESPAÇO -->
              <div class="h-64 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <img
                  :src="imagem.url"
                  :alt="imagem.alt"
                  class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <!-- Overlay no Hover -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center pointer-events-none">
                <div class="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white text-center">
                  <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0l3-3m-3 3L7 13" />
                  </svg>
                  <p class="text-sm font-medium">Ver detalhes</p>
                </div>
              </div>

              <!-- Informações - ESPAÇO REDUZIDO -->
              <div class="p-3 flex flex-col border-t border-gray-100 dark:border-gray-700">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 text-sm">
                  {{ imagem.titulo }}
                </h3>
                <p 
                  v-if="imagem.descricao"
                  class="text-gray-600 dark:text-gray-300 text-xs line-clamp-1 mb-2"
                >
                  {{ imagem.descricao }}
                </p>
                <div class="flex justify-between items-center mt-auto">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatarData(imagem.data) }}
                  </span>
                  <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full capitalize">
                    {{ formatarCategoria(imagem.categoria) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Mensagem de Nenhuma Imagem -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma imagem encontrada
        </h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {{ categoriaAtiva ? `Nenhuma imagem na categoria "${formatarCategoria(categoriaAtiva)}"` : 'Nenhuma imagem cadastrada na galeria' }}
        </p>
      </div>
    </div>

    <!-- Lightbox Modal - FOTO MAIOR, DESCRIÇÃO COMPACTA -->
    <div
      v-if="imagemSelecionada"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click="fecharLightbox"
    >
      <div class="relative max-w-6xl max-h-full w-full" @click.stop>
        <!-- Botão Fechar -->
        <button
          @click="fecharLightbox"
          class="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-20"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Botão Anterior -->
        <button
          v-if="podeNavegarAnterior"
          @click="imagemAnterior"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-colors z-20"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Botão Próximo -->
        <button
          v-if="podeNavegarProximo"
          @click="proximaImagem"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-colors z-20"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Conteúdo do Lightbox -->
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- Imagem Ampliada - MAIS ESPAÇO -->
          <div class="flex-1 flex items-center justify-center p-6 min-h-0 bg-gray-100 dark:bg-gray-900">
            <img
              :src="imagemSelecionada.url"
              :alt="imagemSelecionada.alt"
              class="max-w-full max-h-full object-contain"
              @click.stop
            />
          </div>

          <!-- Informações da Imagem - ESPAÇO REDUZIDO -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ imagemSelecionada.titulo }}
                </h3>
                <span class="inline-block px-2 py-1 bg-amajac-green text-white text-xs rounded-full">
                  {{ formatarCategoria(imagemSelecionada.categoria) }}
                </span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatarData(imagemSelecionada.data) }}
              </span>
            </div>

            <p 
              v-if="imagemSelecionada.descricao"
              class="text-gray-700 dark:text-gray-300 text-sm line-clamp-2"
            >
              {{ imagemSelecionada.descricao }}
            </p>

            <!-- Indicador de Posição -->
            <div class="flex justify-center items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ indiceImagemAtual + 1 }} de {{ imagensFiltradas.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGaleria } from '../composables/useGaleria'

const { galeria, loading, error, fetchGaleria } = useGaleria()
const categoriaAtiva = ref('')
const imagemSelecionada = ref(null)

// Buscar galeria ao montar
onMounted(async () => {
  await fetchGaleria()
})

// Computed para navegação
const indiceImagemAtual = computed(() => {
  if (!imagemSelecionada.value) return -1
  return imagensFiltradas.value.findIndex(img => img.id === imagemSelecionada.value.id)
})

const podeNavegarAnterior = computed(() => {
  return indiceImagemAtual.value > 0
})

const podeNavegarProximo = computed(() => {
  return indiceImagemAtual.value < imagensFiltradas.value.length - 1
})

// Extrair categorias únicas
const categorias = computed(() => {
  const categoriasUnicas = new Set()
  galeria.value.forEach(imagem => {
    if (imagem.categoria) {
      categoriasUnicas.add(imagem.categoria)
    }
  })
  return Array.from(categoriasUnicas).sort()
})

// Filtrar imagens por categoria
const imagensFiltradas = computed(() => {
  if (!categoriaAtiva.value) {
    return galeria.value
  }
  return galeria.value.filter(imagem => imagem.categoria === categoriaAtiva.value)
})

// Agrupar imagens por categoria para exibição
const imagensPorCategoria = computed(() => {
  const agrupadas = {}
  
  if (categoriaAtiva.value) {
    // Se uma categoria específica está ativa, mostra apenas essa
    agrupadas[categoriaAtiva.value] = imagensFiltradas.value
  } else {
    // Se não há filtro, agrupa por todas as categorias
    categorias.value.forEach(categoria => {
      agrupadas[categoria] = galeria.value.filter(imagem => imagem.categoria === categoria)
    })
  }
  
  return agrupadas
})

// Determinar quais categorias mostrar
const categoriasParaExibir = computed(() => {
  if (categoriaAtiva.value) {
    return [categoriaAtiva.value]
  }
  return categorias.value
})

// funções
const filtrarPorCategoria = (categoria) => {
  categoriaAtiva.value = categoria
}

const formatarCategoria = (categoria) => {
  if (!categoria) return 'Sem Categoria'
  return categoria.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data não informada'
  return new Date(dataString).toLocaleDateString('pt-BR')
}

const abrirLightbox = (imagem) => {
  imagemSelecionada.value = imagem
}

const fecharLightbox = () => {
  imagemSelecionada.value = null
}

const imagemAnterior = () => {
  if (podeNavegarAnterior.value) {
    const novoIndice = indiceImagemAtual.value - 1
    imagemSelecionada.value = imagensFiltradas.value[novoIndice]
  }
}

const proximaImagem = () => {
  if (podeNavegarProximo.value) {
    const novoIndice = indiceImagemAtual.value + 1
    imagemSelecionada.value = imagensFiltradas.value[novoIndice]
  }
}

// Navegação por teclado
const handleKeydown = (event) => {
  if (!imagemSelecionada.value) return

  switch (event.key) {
    case 'Escape':
      fecharLightbox()
      break
    case 'ArrowLeft':
      imagemAnterior()
      break
    case 'ArrowRight':
      proximaImagem()
      break
  }
}

// Adicionar/remover listener de teclado
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

/* Animações suaves para o lightbox */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
  
  .group:hover .group-hover\:scale-105 {
    transform: none;
  }
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .absolute.left-4,
  .absolute.right-4 {
    position: fixed;
    bottom: 20px;
    top: auto;
    transform: none;
  }
  
  .absolute.left-4 {
    left: 20px;
  }
  
  .absolute.right-4 {
    right: 20px;
  }
  
  /* Ajuste da altura das imagens no grid para mobile */
  .h-64 {
    height: 14rem;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 640px) {
  .h-64 {
    height: 12rem;
  }
}
</style>