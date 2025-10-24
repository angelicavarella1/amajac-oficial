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
                  :src="logoImageUrl" 
                  alt="Logo AMAJAC" 
                  class="w-full h-full object-cover"
                  v-if="!logoLoading"
                />
                <div v-else class="w-full h-full bg-gray-300 animate-pulse"></div>
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
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p class="text-gray-600 dark:text-gray-300 mt-4">Carregando notícia...</p>
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="text-center py-16">
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md mx-auto">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h2 class="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Erro ao carregar notícia</h2>
            <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
            <button @click="carregarNoticia" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
              Tentar Novamente
            </button>
          </div>
        </div>

        <!-- Notícia -->
        <article v-else-if="noticia" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <!-- ✅ ATUALIZADO: Imagem Principal com useSafeImage() -->
          <div v-if="noticia.imagem_url" class="h-96 overflow-hidden relative">
            <!-- Loading State -->
            <div v-if="noticiaImageLoading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            
            <!-- Imagem Carregada -->
            <img 
              v-else
              :src="noticiaImageUrl" 
              :alt="safeString(noticia.titulo)"
              class="w-full h-full object-cover"
            />
            
            <!-- Error State -->
            <div v-if="noticiaImageError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <div class="text-center p-4">
                <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
                <p class="text-red-500 text-sm">Falha ao carregar imagem</p>
              </div>
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
                  <i class="fas fa-user mr-2"></i>
                  <span>Por: {{ safeString(noticia.autor) }}</span>
                </div>
                <div v-if="noticia.categoria" class="flex items-center">
                  <i class="fas fa-tag mr-2"></i>
                  <span>{{ safeString(noticia.categoria) }}</span>
                </div>
              </div>
            </div>

            <!-- Resumo -->
            <div v-if="noticia.resumo" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p class="text-lg font-semibold text-green-800 dark:text-green-300">
                {{ safeString(noticia.resumo) }}
              </p>
            </div>

            <!-- Conteúdo da Notícia -->
            <div class="prose prose-lg max-w-none dark:prose-invert">
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {{ safeString(noticia.conteudo) }}
              </div>
            </div>

            <!-- Ações -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <button @click="$router.back()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center">
                <i class="fas fa-arrow-left mr-2"></i>
                Voltar para Notícias
              </button>
              
              <div class="flex items-center space-x-4">
                <!-- Compartilhar -->
                <button @click="compartilharNoticia" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                  <i class="fas fa-share-alt mr-2"></i>
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </article>

        <!-- Notícia Não Encontrada -->
        <div v-else class="text-center py-16">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <i class="fas fa-newspaper text-4xl text-gray-400 mb-4"></i>
            <h2 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Notícia não encontrada</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">A notícia que você está procurando não existe ou não está publicada.</p>
            <router-link to="/" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center">
              <i class="fas fa-arrow-left mr-2"></i>
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
import { useRoute, useRouter } from 'vue-router'
import { usePublicNoticias } from '@/composables/usePublicNoticias'
import { useSafeImage } from '@/composables/useSafeImage'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const route = useRoute()
const router = useRouter()
const { noticiaIndividual, loading, error, buscarNoticiaPorId } = usePublicNoticias()

const noticia = noticiaIndividual
const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

// ✅ ATUALIZADO: useSafeImage() para a imagem da notícia
const { 
  imageUrl: noticiaImageUrl, 
  loading: noticiaImageLoading, 
  error: noticiaImageError,
  setUrl: setNoticiaImageUrl 
} = useSafeImage()

// ✅ ATUALIZADO: useSafeImage() para o logo
const { 
  imageUrl: logoImageUrl, 
  loading: logoLoading,
  setUrl: setLogoUrl 
} = useSafeImage()

// ✅ ATUALIZADO: Watcher para atualizar a imagem quando a notícia carregar
watch(noticia, (newNoticia) => {
  if (newNoticia && newNoticia.imagem_url) {
    setNoticiaImageUrl(newNoticia.imagem_url)
  }
  
  // Definir logo padrão
  setLogoUrl('/placeholder-news.jpg')
}, { immediate: true })

// Funções de segurança
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.trim()
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data não informada'
  try {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
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
        title: noticia.value.titulo,
        text: noticia.value.resumo || noticia.value.titulo,
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
</style>