<!-- src/components/public/NoticiasSection.vue -->
<template>
  <section class="py-16 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Ultimas Noticias
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Fique por dentro das novidades da nossa comunidade
        </p>
      </div>

      <div v-if="loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"/>
      </div>

      <div v-else-if="error" class="text-center text-red-600 dark:text-red-400">
        {{ error }}
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="noticia in noticias.slice(0, 3)"
          :key="noticia.id"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Imagem -->
          <div class="h-48 overflow-hidden bg-gray-300 dark:bg-gray-700">
            <img 
              v-if="noticia.imagem_url"
              :src="getSafeImageUrl(noticia.imagem_url)" 
              :alt="safeString(noticia.titulo)"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <i class="fas fa-newspaper text-4xl"/>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>{{ formatarData(noticia.created_at) }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2">
              {{ safeString(noticia.titulo) }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ safeString(noticia.resumo || noticia.conteudo) }}
            </p>
            <router-link
              :to="`/noticias/${noticia.id}`"
              class="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              Ler mais
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </article>
      </div>

      <div v-if="!loading && !error && noticias.length === 0" class="text-center py-12">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <i class="fas fa-newspaper text-4xl text-gray-400 mb-4"/>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhuma noticia publicada</h3>
          <p class="text-gray-500 dark:text-gray-400">Em breve teremos novidades para compartilhar!</p>
        </div>
      </div>

      <div class="text-center mt-12">
        <router-link
          to="/noticias"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
        >
          Ver todas as noticias
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePublicNoticias } from '@/shared/composables/usePublicNoticias'

const { noticias, loading, error, carregarNoticias } = usePublicNoticias()

// Funcoes de seguranca
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.trim()
}

const getSafeImageUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '' || url === 'null') {
    return '/placeholder-news.jpg'
  }
  return url
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-news.jpg'
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data nao informada'
  try {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Data invalida'
  }
}

onMounted(() => {
  carregarNoticias()
})
</script>