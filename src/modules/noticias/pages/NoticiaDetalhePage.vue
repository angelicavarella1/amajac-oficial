<!-- src/modules/noticias/pages/NoticiaDetalhePage.vue -->
<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <router-link to="/" class="hover:text-amajac-green transition-colors">Home</router-link>
          </li>
          <li>
            <i class="mdi mdi-chevron-right"></i>
          </li>
          <li>
            <router-link to="/noticias" class="hover:text-amajac-green transition-colors">Notícias</router-link>
          </li>
          <li>
            <i class="mdi mdi-chevron-right"></i>
          </li>
          <li class="text-gray-900 dark:text-gray-300 truncate">
            {{ noticia?.titulo || 'Carregando...' }}
          </li>
        </ol>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amajac-green border-t-transparent"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Carregando notícia...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <i class="mdi mdi-alert-circle-outline text-red-500 text-3xl mb-4"></i>
          <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Notícia não encontrada</h3>
          <p class="text-red-700 dark:text-red-300 text-sm mb-4">{{ error }}</p>
          <router-link 
            to="/noticias" 
            class="inline-flex items-center px-4 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <i class="mdi mdi-arrow-left mr-2"></i>
            Voltar para Notícias
          </router-link>
        </div>
      </div>

      <!-- Notícia -->
      <article v-else-if="noticia" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <!-- Cabeçalho -->
        <header class="relative">
          <img
            v-if="noticia.imagem_url"
            :src="noticia.imagem_url"
            :alt="noticia.imagem_alt || noticia.titulo"
            class="w-full h-64 md:h-96 object-cover"
          />
          <div v-else class="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400 text-lg">Sem imagem</span>
          </div>
          
          <div class="absolute inset-0 bg-black bg-opacity-40"></div>
          
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <div class="max-w-3xl mx-auto">
              <div class="flex items-center flex-wrap gap-4 mb-4">
                <time class="text-sm bg-amajac-green bg-opacity-90 px-3 py-1 rounded-full">
                  {{ formatDate(noticia.data_publicacao) }}
                </time>
                <span v-if="noticia.destaque" class="text-sm bg-yellow-500 bg-opacity-90 px-3 py-1 rounded-full flex items-center">
                  <i class="mdi mdi-star mr-1"></i>
                  Destaque
                </span>
              </div>
              
              <h1 class="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                {{ noticia.titulo }}
              </h1>
              
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center space-x-4">
                  <span class="text-sm opacity-90">
                    Por <strong>{{ noticia.autor || 'Equipe AMAJAC' }}</strong>
                  </span>
                </div>
                <div class="flex items-center space-x-4 text-sm opacity-90">
                  <span class="flex items-center">
                    <i class="mdi mdi-eye mr-1"></i>
                    {{ noticia.visualizacoes || 0 }} visualizações
                  </span>
                  <span class="flex items-center">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ readingTime }} min de leitura
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Conteúdo -->
        <div class="p-6 md:p-8">
          <div class="max-w-3xl mx-auto">
            <!-- Resumo -->
            <div v-if="noticia.resumo" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-blue-800 dark:text-blue-200 italic">{{ noticia.resumo }}</p>
            </div>

            <!-- Conteúdo -->
            <div class="prose prose-lg max-w-none dark:prose-invert">
              <div class="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ noticia.conteudo }}
              </div>
            </div>

            <!-- Ações -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <router-link 
                to="/noticias" 
                class="inline-flex items-center text-amajac-green hover:text-green-700 transition-colors"
              >
                <i class="mdi mdi-arrow-left mr-2"></i>
                Voltar para Notícias
              </router-link>
              
              <div class="flex space-x-2">
                <button
                  @click="shareNoticia"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Compartilhar"
                >
                  <i class="mdi mdi-share-variant mr-2"></i>
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Notícias Relacionadas -->
      <section v-if="noticiasRelacionadas.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Notícias Relacionadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="relacionada in noticiasRelacionadas"
            :key="relacionada.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            @click="$router.push({ name: 'NoticiaDetalhe', params: { id: relacionada.id } })"
          >
            <img
              v-if="relacionada.imagem_url"
              :src="relacionada.imagem_url"
              :alt="relacionada.imagem_alt || relacionada.titulo"
              class="w-full h-40 object-cover"
            />
            <div v-else class="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span class="text-gray-500 dark:text-gray-400">Sem imagem</span>
            </div>
            <div class="p-4">
              <time class="text-xs text-amajac-green">{{ formatDate(relacionada.data_publicacao) }}</time>
              <h3 class="font-semibold text-gray-900 dark:text-white mt-1 line-clamp-2">
                {{ relacionada.titulo }}
              </h3>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNoticias } from '../composables/useNoticias.js'

const route = useRoute()
const { fetchNoticiaById, fetchNoticiasByCategoria } = useNoticias()

const noticia = ref(null)
const noticiasRelacionadas = ref([])
const error = ref(null)
const loading = ref(true)

const readingTime = computed(() => {
  if (!noticia.value?.conteudo) return 0
  const words = noticia.value.conteudo.split(/\s+/).length
  return Math.ceil(words / 200)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const shareNoticia = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: noticia.value.titulo,
        text: noticia.value.resumo,
        url: window.location.href
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    } catch (err) {
      alert('Não foi possível copiar o link. Copie manualmente.')
    }
  }
}

const loadNoticia = async (id) => {
  loading.value = true
  error.value = null
  try {
    const data = await fetchNoticiaById(id)
    if (!data) {
      error.value = 'Notícia não encontrada'
      return
    }
    noticia.value = data

    // Buscar notícias relacionadas pela mesma categoria
    if (data.categoria) {
      const relacionadas = await fetchNoticiasByCategoria(data.categoria, {
        limit: 4,
        excludeId: id
      })
      noticiasRelacionadas.value = relacionadas.slice(0, 3)
    } else {
      // Sem categoria → não mostra "relacionadas"
      noticiasRelacionadas.value = []
    }
  } catch (err) {
    console.error('Erro ao carregar notícia:', err)
    error.value = 'Erro ao carregar a notícia. Tente novamente.'
  } finally {
    loading.value = false
  }
}

// Carregar ao montar
onMounted(() => {
  if (route.params.id) {
    loadNoticia(route.params.id)
  }
})

// Reagir a navegação entre notícias (mesmo componente)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadNoticia(newId)
    }
  }
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>