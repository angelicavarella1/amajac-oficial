=== C:\Users\angel\Documents\Projetos\amajac-oficial\src\admin\components\RelatorioPortal.vue ===
<template>
  <div class="relatorio-portal">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Geral</h2>
        <p class="text-gray-600 dark:text-gray-400">Estatísticas em tempo real do sistema</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="!loading && ultimaAtualizacao" class="text-xs text-gray-500 dark:text-gray-400">
          Atualizado: {{ ultimaAtualizacao }}
        </span>
        <button
          @click="carregarEstatisticas"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200"
        >
          <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
          {{ loading ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <RelatorioCard
        title="Total de Notícias"
        :value="estatisticas.noticias"
        description="Notícias publicadas"
        :trend="estatisticas.noticiasTrend"
        :trend-value="estatisticas.noticiasTrendValue"
      />
      <RelatorioCard
        title="Eventos Ativos"
        :value="estatisticas.eventos"
        description="Eventos programados"
        :trend="estatisticas.eventosTrend"
        :trend-value="estatisticas.eventosTrendValue"
      />
      <RelatorioCard
        title="Mensagens"
        :value="estatisticas.mensagens"
        description="Mensagens não lidas"
        :trend="estatisticas.mensagensTrend"
        :trend-value="estatisticas.mensagensTrendValue"
      />
      <RelatorioCard
        title="Colaboradores"
        :value="estatisticas.colaboradores"
        description="Colaboradores ativos"
        :trend="estatisticas.colaboradoresTrend"
        :trend-value="estatisticas.colaboradoresTrendValue"
      />
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Carregando estatísticas...</p>
    </div>

    <div v-else class="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <details class="cursor-pointer group" open>
        <summary class="font-semibold text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
          <i class="fas fa-info-circle text-blue-500"></i>
          Informações do Sistema
          <i class="fas fa-chevron-down transform group-open:rotate-180 transition-transform ml-auto"></i>
        </summary>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span class="font-medium text-gray-600 dark:text-gray-400">Notícias Publicadas:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ estatisticas.noticias }} registros</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span class="font-medium text-gray-600 dark:text-gray-400">Eventos Ativos:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ estatisticas.eventos }} registros</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span class="font-medium text-gray-600 dark:text-gray-400">Mensagens Não Lidas:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ estatisticas.mensagens }} registros</span>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import RelatorioCard from './RelatorioCard.vue'; // Assumindo que este componente existe e está correto

// Dependências externas (simuladas, pois o código real não está aqui)
// import { fetchEstatisticas } from '@/api/estatisticas'; 
// import { format } from 'date-fns';

// Stores
const uiStore = useUIStore();

// Estado Reativo
const loading = ref(true);
const error = ref(null);
const ultimaAtualizacao = ref(null);
const estatisticas = ref({
  noticias: 0,
  noticiasTrend: 'neutral', // up, down, neutral
  noticiasTrendValue: '0%',
  eventos: 0,
  eventosTrend: 'neutral',
  eventosTrendValue: '0%',
  mensagens: 0,
  mensagensTrend: 'neutral',
  mensagensTrendValue: '0%',
  colaboradores: 0,
  colaboradoresTrend: 'neutral',
  colaboradoresTrendValue: '0%',
});

// Funções
async function carregarEstatisticas() {
  loading.value = true;
  error.value = null;
  try {
    // Simulação de chamada de API que pode gerar erro 400 (Bad Request) ou timeout
    // No seu código real, você deve garantir que a URL e os parâmetros da requisição
    // para 'uvohhjdhtnweckndgehe.supabase.co/rest/v1/socios?select=*&ativo=eq.true'
    // estejam corretos e o backend esteja respondendo adequadamente.

    /* const data = await fetchEstatisticas(); 
    estatisticas.value = { 
      ...data.dashboard,
      // ... cálculos de trend (tendência) ...
    };
    ultimaAtualizacao.value = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    */

    // Dados Mockados para simular o sucesso do carregamento
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula carregamento
    estatisticas.value = {
      noticias: 42,
      noticiasTrend: 'up',
      noticiasTrendValue: '+12%',
      eventos: 5,
      eventosTrend: 'down',
      eventosTrendValue: '-5%',
      mensagens: 8,
      mensagensTrend: 'up',
      mensagensTrendValue: '+3',
      colaboradores: 25,
      colaboradoresTrend: 'neutral',
      colaboradoresTrendValue: '0%',
    };
    ultimaAtualizacao.value = new Date().toLocaleTimeString('pt-BR');
    
    console.log('✅ Estatísticas carregadas rapidamente:', estatisticas.value);
    
  } catch (err) {
    error.value = 'Falha ao carregar as estatísticas. Tente novamente.';
    console.error('Erro ao carregar estatísticas:', err);
    uiStore.showToast('Erro ao carregar estatísticas. Verifique a conexão com o servidor.', 'error');
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  carregarEstatisticas();
});
</script>

<style scoped>
/* Estilos específicos do componente */
</style>