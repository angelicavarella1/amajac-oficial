<!-- src/views/NoticiaIndividual.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40">
      <div class="container mx-auto px-4">
        <nav class="flex justify-between items-center py-4">
          <!-- Logo e Botão Voltar -->
          <div class="flex items-center space-x-3">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg overflow-hidden">
                <img 
                  v-if="!logoLoading && !logoError"
                  :src="logoImageUrl" 
                  alt="Logo AMAJAC" 
                  class="w-full h-full object-cover"
                />
                <div v-else-if="logoLoading" class="w-full h-full bg-gray-300 animate-pulse"></div>
                <div v-else class="w-full h-full bg-red-100 flex items-center justify-center">
                  <span class="text-red-500 text-xs">Erro</span>
                </div>
              </div>
              <span class="text-green-600 dark:text-green-400 font-bold text-xl">
                AMAJAC
              </span>
            </router-link>
          </div>

          <div class="flex items-center space-x-3">
            <DarkModeToggle />
            <button @click="$router.back()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <i class="fas fa-arrow-left mr-2"></i>
              Voltar
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="pt-32">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Carregando notícia...</p>
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="text-center py-16">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Erro ao carregar notícia</h3>
            <p class="text-red-700 dark:text-red-400 mb-4">{{ error }}</p>
            <button 
              @click="carregarNoticia"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i class="fas fa-redo mr-2"></i>Tentar Novamente
            </button>
          </div>
        </div>

        <!-- Notícia -->
        <article v-else-if="noticia" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <!-- Imagem Principal -->
          <div v-if="noticia.imagem_url" class="h-96 overflow-hidden relative bg-gray-200 dark:bg-gray-700">
            <!-- Loading State -->
            <div v-if="noticiaImageState.loading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            
            <!-- Imagem Carregada -->
            <img 
              v-else-if="!noticiaImageState.error && noticiaImageState.imageUrl"
              :src="noticiaImageState.imageUrl" 
              :alt="safeString(noticia.titulo)"
              class="w-full h-full object-cover transition-opacity duration-300"
              :class="{ 'opacity-0': noticiaImageState.loading, 'opacity-100': !noticiaImageState.loading }"
              @load="noticiaImageState.lazyLoad"
              loading="lazy"
            />
            
            <!-- Error State -->
            <div v-else class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <div class="text-center p-4">
                <svg class="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-red-500 text-sm">Falha ao carregar imagem</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">URL: {{ noticia.imagem_url }}</p>
              </div>
            </div>
          </div>

          <!-- Placeholder quando não há imagem -->
          <div v-else class="h-96 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div class="text-center text-gray-400 dark:text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-sm">Sem imagem</p>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-8">
            <!-- Cabeçalho -->
            <div class="mb-6">
              <div class="text-sm text-green-700 dark:text-green-400 font-semibold mb-2">
                {{ formatarData(noticia.created_at) }}
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                {{ safeString(noticia.titulo) }}
              </h1>
              
              <div v-if="noticia.autor || noticia.categoria" class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div v-if="noticia.autor" class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>Por: {{ safeString(noticia.autor) }}</span>
                </div>
                <div v-if="noticia.categoria" class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  <span>{{ safeString(noticia.categoria) }}</span>
                </div>
              </div>
            </div>

            <!-- Resumo -->
            <div v-if="noticia.resumo" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 dark:border-green-400">
              <p class="text-lg font-semibold text-green-800 dark:text-green-300">
                {{ safeString(noticia.resumo) }}
              </p>
            </div>

            <!-- Conteúdo da Notícia -->
            <div class="prose prose-lg max-w-none dark:prose-invert">
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ safeString(noticia.conteudo) }}
              </div>
            </div>

            <!-- Ações -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <button @click="$router.back()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Voltar para Notícias
              </button>
              
              <div class="flex items-center space-x-4">
                <!-- Compartilhar -->
                <button @click="compartilharNoticia" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </article>

        <!-- Notícia Não Encontrada -->
        <div v-else class="text-center py-16">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m0 0V6a2 2 0 002-2H9a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Notícia não encontrada</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">A notícia que você está procurando não existe ou não está publicada.</p>
            <router-link
              to="/"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Voltar para Home
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast -->
    <div v-if="toast.show" 
      class="fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300"
      :class="{
        'bg-green-600': toast.type === 'success',
        'bg-red-600': toast.type === 'error',
        'bg-blue-600': toast.type === 'info'
      }">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePublicNoticias } from '@/composables/usePublicNoticias'
import { useSafeImage } from '@/composables/useSafeImage'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const route = useRoute()
const { noticiaIndividual: noticia, loading, error, buscarNoticiaPorId } = usePublicNoticias()

// Estados reativos
const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

// ✅ CORREÇÃO: useSafeImage para a imagem da notícia
const noticiaImageState = useSafeImage('')

// ✅ CORREÇÃO: useSafeImage para o logo
const { imageUrl: logoImageUrl, loading: logoLoading, error: logoError } = useSafeImage('/images/logo-amajac.png')

// Watch para atualizar a imagem da notícia quando ela mudar
watch(noticia, (newNoticia) => {
  if (newNoticia && newNoticia.imagem_url) {
    noticiaImageState.setUrl(newNoticia.imagem_url)
  } else {
    // Resetar estado se não houver imagem
    noticiaImageState.reset()
  }
}, { immediate: true })

// Funções de segurança
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data não informada'
  try {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

// Compartilhar
const compartilharNoticia = async () => {
  if (!noticia.value) return

  try {
    if (navigator.share) {
      await navigator.share({
        title: safeString(noticia.value.titulo),
        text: safeString(noticia.value.resumo || noticia.value.titulo),
        url: window.location.href
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      mostrarToast('Link copiado para a área de transferência!', 'success')
    }
  } catch (error) {
    console.log('Compartilhamento cancelado ou não suportado')
  }
}

// Toast
const mostrarToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Carregar notícia
const carregarNoticia = async () => {
  const noticiaId = route.params.id
  
  if (!noticiaId) {
    error.value = 'ID da notícia não fornecido'
    return
  }

  await buscarNoticiaPorId(noticiaId)
}

onMounted(() => {
  carregarNoticia()
})
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.prose p:last-child {
  margin-bottom: 0;
}

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

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>