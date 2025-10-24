<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
    <div class="container mx-auto px-4 max-w-4xl">
      
      <!-- Breadcrumb CORRIGIDO -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <router-link to="/" class="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Início
            </router-link>
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </li>
          <li class="text-green-600 dark:text-green-400 font-medium">
            {{ safeString(noticia?.titulo || 'Carregando...') }}
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-3 text-green-700 dark:text-green-400">
          <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          </svg>
          <span class="text-lg">Carregando notícia...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Notícia não encontrada</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">{{ safeString(error) }}</p>
          <router-link
            to="/"
            class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar para Home
          </router-link>
        </div>
      </div>

      <!-- Notícia Content -->
      <article v-else-if="noticia" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        
        <!-- Imagem Principal -->
        <div class="relative h-80 md:h-96 bg-gray-200 dark:bg-gray-700">
          <img 
            v-if="noticia.imagem_url && isValidUrl(noticia.imagem_url)"
            :src="safeUrl(noticia.imagem_url)" 
            :alt="safeString(noticia.titulo)"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          
          <!-- Badge -->
          <div class="absolute top-4 left-4">
            <span class="bg-green-600 text-white text-sm px-3 py-1 rounded-full font-medium">
              Notícia
            </span>
          </div>
        </div>

        <!-- Conteúdo -->
        <div class="p-6 md:p-8">
          
          <!-- Cabeçalho -->
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              {{ safeString(noticia.titulo) }}
            </h1>
            
            <!-- Metadados -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ formatarData(noticia.data_publicacao) }}
              </span>
              
              <span v-if="noticia.autor" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Por {{ safeString(noticia.autor) }}
              </span>
            </div>

            <!-- Resumo -->
            <div v-if="noticia.resumo" class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r">
              <p class="text-blue-800 dark:text-blue-200 font-medium italic">
                {{ safeString(noticia.resumo) }}
              </p>
            </div>
          </header>

          <!-- Conteúdo Principal -->
          <div class="prose prose-lg dark:prose-invert max-w-none mb-8">
            <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {{ safeString(noticia.conteudo) }}
            </div>
          </div>

          <!-- Informações Adicionais -->
          <div v-if="noticia.informacoes_adicionais" class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Informações Adicionais</h3>
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ safeString(noticia.informacoes_adicionais) }}
              </p>
            </div>
          </div>

          <!-- Ações CORRIGIDAS -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="compartilharNoticia"
                class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Compartilhar
              </button>

              <router-link
                to="/"
                class="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Voltar para Home
              </router-link>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNoticiasStore } from '@/stores/noticias'

const route = useRoute()
const noticiasStore = useNoticiasStore()

// Refs
const noticia = ref(null)
const loading = ref(false)
const error = ref(null)

// Funções de segurança
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

const safeUrl = (url) => {
  if (typeof url !== 'string') return ''
  try {
    new URL(url)
    return url
  } catch {
    return url.startsWith('/') || url.startsWith('./') ? url : ''
  }
}

const isValidUrl = (url) => {
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return url.startsWith('/') || url.startsWith('./')
  }
}

// Função segura para manipulação de imagens
const handleImageError = (event) => {
  const target = event.target
  if (target && target.style) {
    target.style.display = 'none'
  }
  
  const parent = target.parentElement
  if (parent && parent.classList) {
    parent.classList.add('bg-gray-200', 'dark:bg-gray-700')
  }
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data não informada'
  try {
    const data = new Date(dataString)
    if (isNaN(data.getTime())) return 'Data inválida'
    
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

const compartilharNoticia = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: safeString(noticia.value?.titulo),
        text: safeString(noticia.value?.resumo || noticia.value?.conteudo?.substring(0, 100) + '...'),
        url: window.location.href
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    // Fallback para copiar URL
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('URL da notícia copiada para a área de transferência!')
    } catch (err) {
      console.log('Erro ao copiar URL:', err)
    }
  }
}

// Função corrigida para carregar notícia
const loadNoticia = async () => {
  const id = route.params.id
  if (!id) {
    error.value = 'ID da notícia não fornecido'
    return
  }

  loading.value = true
  error.value = null

  try {
    console.log('🆔 Buscando notícia com ID:', id)
    
    // Usa a função correta da store que retorna a notícia diretamente
    noticia.value = await noticiasStore.carregarNoticia(id)
    
    if (!noticia.value) {
      error.value = 'Notícia não encontrada'
    } else {
      console.log('✅ Notícia carregada:', noticia.value.titulo)
    }
  } catch (err) {
    console.error('❌ Erro ao carregar notícia:', err)
    error.value = 'Erro ao carregar a notícia. Tente novamente.'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadNoticia()
})

watch(() => route.params.id, () => {
  loadNoticia()
})
</script>

<style scoped>
.prose {
  line-height: 1.8;
}

.prose-lg {
  font-size: 1.125rem;
  line-height: 1.8;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose-invert {
  color: #d1d5db; /* gray-300 */
}

.prose-invert p {
  color: #d1d5db;
}
</style>
