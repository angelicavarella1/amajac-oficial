<!-- 
  Componente: EventosSection.vue
  Finalidade: Exibir eventos no site público.
  - Usa composable useEventos() com estados reativos.
  - Segue branding AMAJAC (#2E7D32).
  - Dark mode com transições suaves.
  - Acessível e responsivo.
  - Exibe data, horário e local.
-->

<template>
  <section
    id="eventos-section"
    aria-labelledby="eventos-title"
    class="eventos-section py-12 px-4 transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto">
      <header class="text-center mb-12">
        <h2
          id="eventos-title"
          class="text-3xl md:text-4xl font-bold mb-4"
        >
          Próximos Eventos
        </h2>
        <p class="max-w-2xl mx-auto">
          Confira os eventos oficiais da AMAJAC.
        </p>
      </header>

      <div v-if="loading" class="text-center py-16">
        <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amajac-green border-t-transparent"></div>
        <p class="mt-4">Carregando eventos...</p>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="eventos.length === 0" class="text-center py-16">
        <p>Nenhum evento agendado no momento.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="e in eventos"
          :key="e.id"
          class="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="relative">
            <img
              v-if="e.imagem_url"
              :src="e.imagem_url"
              :alt="e.imagem_alt"
              class="w-full h-40 object-cover"
              loading="lazy"
            />
            <div v-else class="bg-gray-200 dark:bg-gray-700 w-full h-40 flex items-center justify-center">
              <span class="text-gray-500 dark:text-gray-400">Sem imagem</span>
            </div>
            <div v-if="e.destaque" class="absolute top-3 left-3 bg-amajac-green text-white text-xs font-bold px-2 py-1 rounded">
              Destaque
            </div>
          </div>
          <div class="p-5 flex flex-col h-full">
            <h3 class="text-xl font-bold mb-2 line-clamp-2">
              {{ e.titulo }}
            </h3>
            <p class="text-sm mb-3 flex-grow line-clamp-3">
              {{ e.descricao }}
            </p>
            <div class="text-sm space-y-1">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amajac-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ e.dataHorario }}</span>
              </div>
              <div class="flex items-center gap-2" v-if="e.local">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ e.local }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEventos } from '../composables/useEventos'

const { eventos, loading, error, fetchEventos } = useEventos()

onMounted(() => {
  fetchEventos()
})
</script>

<style scoped>
.eventos-section {
  --amajac-green: #2E7D32;
  --amajac-green-hover: #256a2a;
  background-color: #f9fafb;
  color: #4b5563;
}

.eventos-section h2,
.eventos-section h3 {
  color: #1f2937;
}

.dark .eventos-section {
  background-color: #111827;
  color: #d1d5db;
}

.dark .eventos-section h2,
.dark .eventos-section h3 {
  color: #f9fafb;
}

.eventos-section .bg-white { background-color: white; }
.eventos-section .text-gray-800 { color: #1f2937; }
.eventos-section .text-gray-600 { color: #4b5563; }

.dark .eventos-section .bg-gray-800 { background-color: #1f2937; }
.dark .eventos-section .text-white { color: #f9fafb; }
.dark .eventos-section .text-gray-400 { color: #9ca3af; }
.dark .eventos-section .text-gray-300 { color: #d1d5db; }

.text-amajac-green { color: var(--amajac-green); }
.border-amajac-green { border-color: var(--amajac-green); }

/* Utilitário para truncar texto */
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