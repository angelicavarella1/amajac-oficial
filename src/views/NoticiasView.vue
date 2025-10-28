<!-- src/views/NoticiasView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40 transition-colors duration-200">
      <div class="container mx-auto px-4">
        <nav class="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-1">
            <router-link to="/" class="text-green-600 dark:text-green-400 font-bold text-xl">AMAJAC</router-link>
          </div>
          
          <div class="hidden md:flex space-x-6">
            <router-link to="/" class="text-green-600 dark:text-green-400 font-semibold transition duration-200">Início</router-link>
            <router-link to="/noticias" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition duration-200">Notícias</router-link>
            <router-link to="/eventos" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition duration-200">Eventos</router-link>
            <router-link to="/galeria" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition duration-200">Galeria</router-link>
            <router-link to="/colaboradores" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition duration-200">Colaboradores</router-link>
            <router-link to="/contato" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition duration-200">Contato</router-link>
          </div>

          <div class="flex items-center space-x-3">
            <DarkModeToggle />
            <button @click="uiStore.toggleMobileMenu" class="md:hidden text-gray-700 dark:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </nav>

        <div v-if="uiStore.mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-3">
            <router-link to="/" class="text-green-600 dark:text-green-400 font-semibold" @click="uiStore.closeMobileMenu">Início</router-link>
            <router-link to="/noticias" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400" @click="uiStore.closeMobileMenu">Notícias</router-link>
            <router-link to="/eventos" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400" @click="uiStore.closeMobileMenu">Eventos</router-link>
            <router-link to="/galeria" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400" @click="uiStore.closeMobileMenu">Galeria</router-link>
            <router-link to="/colaboradores" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400" @click="uiStore.closeMobileMenu">Colaboradores</router-link>
            <router-link to="/contato" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400" @click="uiStore.closeMobileMenu">Contato</router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="pt-40 pb-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Notícias</h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Fique por dentro das últimas novidades e acontecimentos da nossa comunidade
          </p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="loader mx-auto mb-4"/>
          <p class="text-gray-600 dark:text-gray-400">Carregando notícias...</p>
        </div>

        <div v-else-if="error" class="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div class="text-red-600 dark:text-red-400 mb-4">
            <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-lg font-semibold mb-2">Erro ao carregar notícias</h3>
            <p>{{ error }}</p>
          </div>
          <button
            @click="noticiasStore.carregarNoticias(true)"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Tentar novamente
          </button>
        </div>

        <div v-else-if="noticias.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="noticia in noticias"
            :key="noticia.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <!-- Container da Imagem - ESTRUTURA CONDICIONAL CORRIGIDA -->
            <div class="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              <!-- ✅ CORREÇÃO: Estrutura condicional linear e conectada -->
              
              <!-- 1. Estado de Loading -->
              <div 
                v-if="getImageState(noticia.id).loading" 
                class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center"
              >
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- 2. Imagem Carregada com Sucesso -->
              <img
                v-else-if="!getImageState(noticia.id).error && getImageState(noticia.id).imageUrl"
                :src="getImageState(noticia.id).imageUrl"
                :alt="safeString(noticia.titulo)"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                @load="handleImageLoad(noticia.id)"
                @error="handleImageError(noticia.id)"
                loading="lazy"
              />
              
              <!-- 3. Estado de Erro -->
              <div 
                v-else-if="getImageState(noticia.id).error" 
                class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
              >
                <div class="text-center p-2">
                  <i class="fas fa-exclamation-triangle text-red-500 text-lg mb-1"/>
                  <p class="text-red-500 text-xs">Falha ao carregar imagem</p>
                  <button 
                    @click="reloadImage(noticia.id)" 
                    class="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
              
              <!-- 4. Placeholder Padrão (sem imagem ou URL inválida) -->
              <div 
                v-else 
                class="absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center"
              >
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- Data da Notícia -->
              <div class="absolute top-4 left-4 bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-sm">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ formatarData(noticia.data_publicacao) }}</span>
              </div>
            </div>

            <div class="p-6">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-tight line-clamp-2">
                {{ safeString(noticia.titulo) }}
              </h2>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                {{ safeString(noticia.resumo || noticia.conteudo) }}
              </p>
              
              <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Por: {{ safeString(noticia.autor || 'AMAJAC') }}
                </span>
                <router-link
                  :to="`/noticias/${noticia.id}`"
                  class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm flex items-center group"
                >
                  Ler mais
                  <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="text-center py-16">
          <div class="max-w-md mx-auto">
            <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0 0h6m-6 0h6"/>
            </svg>
            <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Nenhuma notícia encontrada</h3>
            <p class="text-gray-500 dark:text-gray-500">Aguardem novas publicações em breve!</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 dark:bg-gray-900 text-white py-8 transition-colors duration-200">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2024 AMAJAC. Todos os direitos reservados.</p>
        <p class="text-gray-400 text-sm mt-2">
          Desenvolvido com ❤️ por Angelica Varella - Front-end Developer & UI/UX Designer
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useNoticiasStore } from '@/modules/noticias/stores/noticias'
import { useUIStore } from '@/shared/stores/ui'
// CORREÇÃO: Importação atualizada para o caminho correto
import DarkModeToggle from '@/shared/components/DarkModeToggle.vue'

const noticiasStore = useNoticiasStore()
const uiStore = useUIStore()
const { noticias, loading, error } = storeToRefs(noticiasStore)

// ✅ CORREÇÃO: Gerenciamento de estado das imagens
const imageStates = reactive({})

// Inicializa o estado para cada notícia
const initializeImageStates = () => {
  noticias.value.forEach(noticia => {
    if (!imageStates[noticia.id]) {
      imageStates[noticia.id] = {
        loading: !!noticia.imagem_url,
        error: false,
        imageUrl: noticia.imagem_url || null
      }
    }
  })
}

// Getter para estado da imagem
const getImageState = (noticiaId) => {
  if (!imageStates[noticiaId]) {
    imageStates[noticiaId] = {
      loading: false,
      error: false,
      imageUrl: null
    }
  }
  return imageStates[noticiaId]
}

// Handlers de imagem
const handleImageLoad = (noticiaId) => {
  if (imageStates[noticiaId]) {
    imageStates[noticiaId].loading = false
    imageStates[noticiaId].error = false
  }
}

const handleImageError = (noticiaId) => {
  if (imageStates[noticiaId]) {
    imageStates[noticiaId].loading = false
    imageStates[noticiaId].error = true
    imageStates[noticiaId].imageUrl = null
  }
}

const reloadImage = (noticiaId) => {
  const noticia = noticias.value.find(n => n.id === noticiaId)
  if (noticia && noticia.imagem_url) {
    if (imageStates[noticiaId]) {
      imageStates[noticiaId].loading = true
      imageStates[noticiaId].error = false
      imageStates[noticiaId].imageUrl = noticia.imagem_url
    }
  }
}

// ✅ CORREÇÃO: Funções de segurança
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data não informada'
  try {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

// Watcher para inicializar estados quando noticias carregam
import { watch } from 'vue'
watch(noticias, (newNoticias) => {
  if (newNoticias.length > 0) {
    initializeImageStates()
  }
})

onMounted(() => {
  uiStore.initializeDarkMode()
  noticiasStore.carregarNoticias()
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

.pt-40 {
  padding-top: 10rem;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #10B981;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transições suaves */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>