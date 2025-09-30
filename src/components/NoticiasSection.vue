<template>
  <section id="noticias" class="py-20 bg-gray-50" aria-labelledby="noticias-title">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h2 id="noticias-title" class="text-4xl md:text-5xl font-bold text-amajac-800 mb-4">
          Notícias e Informes
        </h2>
        <div class="w-24 h-1 bg-amajac-500 mx-auto mb-6" aria-hidden="true"></div>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto">
          Fique por dentro das últimas notícias, comunicados e informes da nossa associação
        </p>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-live="polite" aria-label="Carregando notícias">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-6 space-y-4">
            <div class="h-6 bg-gray-200 rounded"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12" role="alert" aria-live="assertive">
        <div class="text-red-600 mb-4" aria-hidden="true">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar notícias</h3>
        <p class="text-gray-700 mb-4">{{ error }}</p>
        <button 
          @click="carregarNoticias"
          class="bg-amajac-500 text-white px-6 py-3 rounded-lg hover:bg-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
          aria-label="Tentar carregar notícias novamente"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Grid de Notícias -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-live="polite">
        <article 
          v-for="noticia in noticias" 
          :key="noticia.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 focus-within:ring-2 focus-within:ring-amajac-500 focus-within:ring-offset-2"
          tabindex="0"
          role="article"
          :aria-labelledby="'noticia-titulo-' + noticia.id"
        >
          <!-- Imagem da Notícia -->
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img 
              v-if="noticia.imagem_url" 
              :src="noticia.imagem_url" 
              :alt="noticia.titulo"
              @error="substituirPorPlaceholder"
              loading="lazy"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full bg-amajac-100 flex items-center justify-center" aria-hidden="true">
              <svg class="w-12 h-12 text-amajac-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-6">
            <h3 :id="'noticia-titulo-' + noticia.id" class="text-xl font-semibold text-amajac-800 mb-3 line-clamp-2">
              {{ noticia.titulo }}
            </h3>
            
            <p class="text-gray-700 mb-4 line-clamp-3">
              {{ noticia.resumo || noticia.conteudo }}
            </p>
            
            <div class="flex items-center justify-between text-sm text-gray-600">
              <time :datetime="noticia.data_publicacao">{{ formatDate(noticia.data_publicacao) }}</time>
              <button 
                @click="abrirNoticia(noticia)"
                @keydown.enter="abrirNoticia(noticia)"
                @keydown.space="abrirNoticia(noticia)"
                class="text-amajac-500 hover:text-amajac-600 font-medium flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 focus-visible:rounded"
                :aria-label="'Ler mais sobre: ' + noticia.titulo"
              >
                Ler mais
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && noticias.length === 0" class="text-center py-12" aria-live="polite">
        <div class="text-gray-500 mb-4" aria-hidden="true">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Nenhuma notícia publicada</h3>
        <p class="text-gray-700">Aguardem novidades em breve!</p>
      </div>

      <!-- Modal de Notícia -->
      <div v-if="noticiaSelecionada" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" :aria-labelledby="'modal-titulo-' + noticiaSelecionada.id">
        <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Header do Modal -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h2 :id="'modal-titulo-' + noticiaSelecionada.id" class="text-2xl font-bold text-amajac-800 pr-8">
                  {{ noticiaSelecionada.titulo }}
                </h2>
                <p class="text-gray-600 mt-2">
                  Publicado em <time :datetime="noticiaSelecionada.data_publicacao">{{ formatDate(noticiaSelecionada.data_publicacao) }}</time>
                </p>
              </div>
              <button 
                @click="fecharNoticia"
                @keydown.enter="fecharNoticia"
                @keydown.space="fecharNoticia"
                class="text-gray-500 hover:text-gray-700 transition flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 focus-visible:rounded"
                aria-label="Fechar notícia"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Imagem -->
            <div v-if="noticiaSelecionada.imagem_url" class="mb-6">
              <img 
                :src="noticiaSelecionada.imagem_url" 
                :alt="noticiaSelecionada.titulo"
                @error="substituirPorPlaceholderModal"
                loading="eager"
                class="w-full h-64 object-cover rounded-lg"
              >
            </div>

            <!-- Conteúdo -->
            <div class="prose max-w-none text-gray-800">
              <p class="whitespace-pre-line">{{ noticiaSelecionada.conteudo }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SupabaseService } from '../services/supabaseService'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default {
  name: 'NoticiasSection',
  data() {
    return {
      noticias: [],
      loading: true,
      error: null,
      noticiaSelecionada: null
    }
  },
  async mounted() {
    await this.carregarNoticias()
  },
  methods: {
    async carregarNoticias() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await SupabaseService.getNoticias()
        if (error) throw error
        this.noticias = data || []
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    },
    abrirNoticia(noticia) {
      this.noticiaSelecionada = noticia
      this.$nextTick(() => {
        const modal = document.querySelector('[role="dialog"]')
        if (modal) {
          modal.focus()
        }
      })
    },
    fecharNoticia() {
      this.noticiaSelecionada = null
    },
    substituirPorPlaceholder(event) {
      event.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f9f0"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%233a9a3a" text-anchor="middle" dy=".3em">AMAJAC</text></svg>`
      event.target.onerror = null
    },
    substituirPorPlaceholderModal(event) {
      event.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%23f0f9f0"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%233a9a3a" text-anchor="middle" dy=".3em">AMAJAC</text></svg>`
      event.target.onerror = null
    }
  }
}
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
</style>