<template>
  <section class="py-16 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Últimas Notícias
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Fique por dentro das novidades da nossa comunidade
        </p>
      </div>

      <div v-if="loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <div class="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Imagem</span>
          </div>
          <div class="p-6">
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>{{ formatarData(noticia.created_at) }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2">
              {{ noticia.titulo }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ noticia.resumo || noticia.conteudo }}
            </p>
            <RouterLink
              :to="{ name: 'noticia-detalhes', params: { id: noticia.id } }"
              class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Ler mais
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="text-center mt-12">
        <RouterLink
          to="/noticias"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300"
        >
          Ver todas as notícias
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePublicNoticias } from '@/composables/usePublicNoticias'
import { formatarData } from '@/supabase/helpers'

const { noticias, loading, error, carregarNoticias } = usePublicNoticias()

onMounted(() => {
  carregarNoticias()
})
</script>