<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Próximos Eventos
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Participe dos eventos da nossa comunidade
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
          v-for="evento in eventos.slice(0, 3)"
          :key="evento.id"
          class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Imagem do Evento</span>
          </div>
          <div class="p-6">
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatarData(evento.data_evento) }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {{ evento.titulo }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              <strong>Local:</strong> {{ evento.local }}
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {{ evento.descricao }}
            </p>
            <RouterLink
              :to="{ name: 'evento-detalhes', params: { id: evento.id } }"
              class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver detalhes
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </article>
      </div>

      <div v-if="eventos.length === 0 && !loading" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Nenhum evento programado no momento.
        </p>
      </div>

      <div class="text-center mt-12">
        <RouterLink
          to="/eventos"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300"
        >
          Ver todos os eventos
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePublicEventos } from '@/composables/usePublicEventos'
import { formatarData } from '@/supabase/helpers'

const { eventos, loading, error, carregarEventos } = usePublicEventos()

onMounted(() => {
  carregarEventos()
})
</script>