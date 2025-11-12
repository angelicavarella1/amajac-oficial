<!-- src/modules/noticias/components/NoticiasSection.vue -->
<template>
  <section
    id="noticias-section"
    aria-labelledby="noticias-title"
    class="noticias-section py-12 px-4 transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto">
      <header class="text-center mb-12">
        <h2
          id="noticias-title"
          class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          Notícias
        </h2>
        <p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Confira as últimas atualizações da AMAJAC.
        </p>
      </header>

      <div v-if="loading" class="text-center py-16">
        <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amajac-green border-t-transparent"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Carregando notícias...</p>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <p class="font-medium text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <div v-else-if="noticias.length === 0" class="text-center py-16">
        <p class="text-gray-600 dark:text-gray-300">Nenhuma notícia disponível no momento.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="noticia in noticias"
          :key="noticia.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="$router.push(`/noticias/${noticia.id}`)"
        >
          <div class="relative">
            <img
              v-if="noticia.imagem_url"
              :src="noticia.imagem_url"
              :alt="noticia.imagem_alt || `Imagem para: ${noticia.titulo}`"
              class="w-full h-48 object-cover"
              loading="lazy"
            />
            <div v-else class="bg-gray-200 dark:bg-gray-700 w-full h-48 flex items-center justify-center">
              <span class="text-gray-500 dark:text-gray-400">Sem imagem</span>
            </div>
            <div v-if="noticia.destaque" class="absolute top-3 left-3 bg-amajac-green text-white text-xs font-bold px-2 py-1 rounded">
              Destaque
            </div>
          </div>
          <div class="p-5 flex flex-col h-full">
            <time v-if="noticia.data_publicacao" class="text-sm text-amajac-green">
              {{ formatDate(noticia.data_publicacao) }}
            </time>
            <h3 class="text-xl font-bold mt-2 mb-2 line-clamp-2 text-gray-900 dark:text-white">
              {{ noticia.titulo }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-grow line-clamp-3">
              {{ noticia.resumo || generatePreview(noticia.conteudo) }}
            </p>
            <footer class="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-600">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Por {{ noticia.autor || 'Equipe AMAJAC' }}
              </span>
              <span v-if="noticia.visualizacoes" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <i class="mdi mdi-eye"></i>
                {{ noticia.visualizacoes }}
              </span>
            </footer>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticias } from '../composables/useNoticias.js'

const router = useRouter()
const { noticias, loading, error, fetchNoticias } = useNoticias()

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const generatePreview = (conteudo) => {
  if (!conteudo) return ''
  return conteudo.substring(0, 150) + (conteudo.length > 150 ? '...' : '')
}

onMounted(() => {
  fetchNoticias()
})
</script>

<style scoped>
.noticias-section {
  background-color: #f9fafb;
}

.dark .noticias-section {
  background-color: #111827;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>