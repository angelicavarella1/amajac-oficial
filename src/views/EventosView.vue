<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Eventos
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
          Confira nossa agenda de eventos e participe das atividades da comunidade
        </p>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">Carregando eventos...</p>
        </div>
      </div>

      <div v-else>
        <div class="mb-8">
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              @click="filtroStatus = null"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                !filtroStatus
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm'
              ]"
            >
              Todos
            </button>

            <button
              @click="filtroStatus = 'futuros'"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                filtroStatus === 'futuros'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm'
              ]"
            >
              Próximos
            </button>

            <button
              @click="filtroStatus = 'passados'"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                filtroStatus === 'passados'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm'
              ]"
            >
              Realizados
            </button>
          </div>
        </div>

        <div v-if="eventosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="evento in eventosFiltrados"
            :key="evento.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <!-- ✅ ATUALIZADO: Imagem com useSafeImage() -->
            <div class="relative aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <!-- Loading State -->
              <div v-if="evento.imageLoading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- Imagem Carregada -->
              <img
                v-else-if="evento.imagem_url"
                :src="evento.imageUrl"
                :alt="evento.imagem_alt || evento.titulo"
                class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                :ref="el => evento.imageRef = el"
                loading="lazy"
              />
              
              <!-- Fallback para Sem Imagem -->
              <div v-else class="w-full h-48 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <svg class="w-12 h-12 text-green-300 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- Error State -->
              <div v-if="evento.imageError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <span class="text-red-500 text-xs">Falha ao carregar imagem</span>
              </div>

              <div class="absolute top-3 left-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-300',
                    isEventoFuturo(evento)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  ]"
                >
                  {{ isEventoFuturo(evento) ? 'Em breve' : 'Realizado' }}
                </span>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full transition-colors duration-300">
                  {{ evento.categoria || 'Evento' }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
                  {{ formatarData(evento.data_hora_evento || evento.data_evento) }}
                </span>
              </div>

              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 transition-colors duration-300">
                {{ evento.titulo }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 transition-colors duration-300">
                {{ evento.descricao }}
              </p>

              <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="truncate">{{ evento.local || 'Local a definir' }}</span>
                </div>

                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ evento.horario || 'Horário a definir' }}</span>
                </div>

                <div v-if="evento.preco" class="flex items-center">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                  <span>{{ formatarPreco(evento.preco) }}</span>
                </div>
              </div>

              <router-link
                :to="`/eventos/${evento.id}`"
                class="block w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-center py-2 px-4 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                @click="incrementarVisualizacoes(evento.id)"
              >
                Ver Detalhes
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-8 max-w-md mx-auto border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">
              {{ filtroStatus ? 'Nenhum evento encontrado' : 'Nenhum evento programado' }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {{ 
                filtroStatus === 'futuros' 
                  ? 'Não há eventos futuros no momento. Fique atento!' 
                  : filtroStatus === 'passados'
                  ? 'Não há eventos realizados para exibir.'
                  : 'Não há eventos programados no momento. Volte em breve!'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useEventosStore } from '@/stores/eventos';
import { storeToRefs } from 'pinia';
import { useSafeImage } from '@/composables/useSafeImage';

export default {
  name: 'EventosView',
  setup() {
    const eventosStore = useEventosStore();
    const { todos: eventos, loading } = storeToRefs(eventosStore); 
    const { eventosFuturos, eventosPassados } = storeToRefs(eventosStore);

    const filtroStatus = ref(null);

    // ✅ ATUALIZADO: Eventos com useSafeImage() para cada imagem
    const eventosComImagens = computed(() => {
      const todosEventos = eventos.value?.filter(Boolean) || [];

      return todosEventos.map(evento => {
        // ✅ NOVO: Criar useSafeImage para cada evento no loop
        const { 
          imageUrl, 
          loading: imageLoading, 
          error: imageError,
          setUrl,
          lazyLoad 
        } = useSafeImage()

        // ✅ NOVO: Inicializar a imagem do evento
        if (evento.imagem_url) {
          setUrl(evento.imagem_url)
        }

        return {
          ...evento,
          imageUrl,
          imageLoading,
          imageError,
          imageRef: null,
          setImageUrl: setUrl,
          lazyLoadImage: lazyLoad
        }
      })
    })

    const eventosFiltrados = computed(() => {
      const todosEventos = eventosComImagens.value || [];

      if (filtroStatus.value === 'futuros') {
        const futurosIds = Array.isArray(eventosFuturos.value) 
          ? eventosFuturos.value.map(e => e.id) 
          : [];
        return todosEventos.filter(evento => futurosIds.includes(evento.id));
      }
      
      if (filtroStatus.value === 'passados') {
        const passadosIds = Array.isArray(eventosPassados.value) 
          ? eventosPassados.value.map(e => e.id) 
          : [];
        return todosEventos.filter(evento => passadosIds.includes(evento.id));
      }

      return todosEventos;
    });

    const formatarData = (dataString) => {
      if (!dataString) return 'Data a definir';
      const data = new Date(dataString); 
      if (isNaN(data.getTime())) return 'Data inválida';
      return data.toLocaleDateString('pt-BR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).replace(',', '');
    };

    const formatarPreco = (preco) => {
      if (preco === null || preco === undefined || preco === '') return 'Valor a definir';
      if (preco === 0 || preco === '0') return 'Gratuito';
      const precoNumerico = typeof preco === 'string' ? parseFloat(preco.replace(',', '.')) : preco;
      if (!isNaN(precoNumerico)) return `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`;
      return preco;
    };

    const isEventoFuturo = (evento) => {
      const futuros = Array.isArray(eventosFuturos.value) ? eventosFuturos.value : [];
      return futuros.some(e => e.id === evento.id);
    };

    const incrementarVisualizacoes = async (eventoId) => {
      try {
        if (eventosStore.incrementarVisualizacoes) {
          await eventosStore.incrementarVisualizacoes(eventoId);
        }
      } catch (e) {
        console.error('Erro ao incrementar visualizações:', e);
      }
    };

    onUnmounted(() => {
      // Limpeza de recursos se necessário
    });

    onMounted(async () => {
      try {
        if (eventosStore.carregarEventos) {
          await eventosStore.carregarEventos();
        }
      } catch (e) {
        console.error('Erro ao carregar eventos:', e);
      }
    });

    return {
      eventos: eventosComImagens,
      loading,
      filtroStatus,
      eventosFiltrados,
      formatarData,
      formatarPreco,
      isEventoFuturo,
      incrementarVisualizacoes,
    };
  },
};
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

.aspect-w-16 {
  position: relative;
}

.aspect-w-16::before {
  content: '';
  display: block;
  padding-bottom: 56.25%;
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Transições suaves para todos os elementos */
* {
  transition-property: color, background-color, border-color, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>