<!-- src/admin/components/RelatorioPortal.vue -->
<template>
  <div class="relatorio-portal">
    <!-- Header -->
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

    <!-- Grid de Cards -->
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Carregando estatísticas...</p>
    </div>

    <!-- Detalhes do Sistema -->
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
          <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span class="font-medium text-gray-600 dark:text-gray-400">Colaboradores Ativos:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ estatisticas.colaboradores }} registros</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span class="font-medium text-gray-600 dark:text-gray-400">Total de Registros:</span>
            <span class="font-bold text-green-600 dark:text-green-400">{{ estatisticas.totalRegistros }} registros</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span class="font-medium text-gray-600 dark:text-gray-400">Status Geral:</span>
            <span :class="[
              'font-bold',
              estatisticas.tendenciaGeral === 'up' ? 'text-green-600 dark:text-green-400' :
              estatisticas.tendenciaGeral === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-yellow-600 dark:text-yellow-400'
            ]">
              {{ estatisticas.tendenciaGeral === 'up' ? 'Positivo' : estatisticas.tendenciaGeral === 'down' ? 'Negativo' : 'Neutro' }}
            </span>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Última atualização: {{ ultimaAtualizacao }}
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import RelatorioCard from './RelatorioCard.vue'
import { useDashboardStats } from '@/admin/composables/useDashboardStats'

// Usando o composable CORRIGIDO
const { loading, error, obterEstatisticasDashboard } = useDashboardStats()

// Estado reativo
const estatisticas = reactive({
  noticias: 0,
  eventos: 0,
  mensagens: 0,
  colaboradores: 0,
  noticiasTrend: 'neutral',
  noticiasTrendValue: '0',
  eventosTrend: 'neutral',
  eventosTrendValue: '0',
  mensagensTrend: 'neutral',
  mensagensTrendValue: '0',
  colaboradoresTrend: 'neutral',
  colaboradoresTrendValue: '0',
  totalRegistros: 0,
  tendenciaGeral: 'neutral'
})

const ultimaAtualizacao = ref('')

// Métodos
const carregarEstatisticas = async () => {
  try {
    const dados = await obterEstatisticasDashboard()
    Object.assign(estatisticas, dados)
    ultimaAtualizacao.value = new Date().toLocaleString('pt-BR')
    console.log('✅ Dashboard atualizado com dados REAIS')
  } catch (err) {
    console.error('❌ Erro ao carregar estatísticas:', err)
  }
}

// Lifecycle
onMounted(() => {
  carregarEstatisticas()
  
  // Atualização automática a cada 2 minutos para dados SEMPRE atualizados
  const intervalo = setInterval(carregarEstatisticas, 2 * 60 * 1000)
  
  // Cleanup
  onUnmounted(() => clearInterval(intervalo))
})
</script>

<style scoped>
/* Estilos mantidos do anterior */
</style>