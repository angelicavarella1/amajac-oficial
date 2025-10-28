<!-- src/admin/components/RelatorioGeral.vue -->
<template>
  <div class="relatorio-geral">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Relatório Geral do Sistema</h2>
        <p class="text-gray-600 dark:text-gray-400">Visão completa de todos os dados do sistema</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="!loading && relatorio?.data?.geradoEm" class="text-xs text-gray-500 dark:text-gray-400">
          Gerado em: {{ formatarData(relatorio.data.geradoEm) }}
        </span>
        <button 
          @click="gerarRelatorio"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200"
        >
          <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'"/>
          {{ loading ? 'Gerando...' : 'Gerar Relatório' }}
        </button>
        
        <button 
          @click="exportarRelatorio"
          :disabled="loading || !relatorio?.success"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200"
        >
          <i class="fas fa-download"/>
          Exportar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"/>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Gerando relatório completo...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
      <div class="flex items-start">
        <div class="text-red-600 dark:text-red-400 text-xl mr-3 mt-1">❌</div>
        <div>
          <p class="text-red-800 dark:text-red-200 font-semibold">Erro ao gerar relatório</p>
          <p class="text-red-700 dark:text-red-300 text-sm mt-2">{{ error }}</p>
          <button 
            @click="gerarRelatorio"
            class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200"
          >
            <i class="fas fa-sync-alt mr-2"/>
            Tentar novamente
          </button>
        </div>
      </div>
    </div>

    <!-- Conteúdo do Relatório -->
    <div v-else-if="relatorio?.success" class="space-y-6">
      <!-- Cartões de Resumo -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RelatorioCard
          title="Total de Registros"
          :value="relatorio.data.totalRegistros"
          description="Todos os registros do sistema"
          trend="up"
          trend-value="12"
        />
        <RelatorioCard
          title="Notícias"
          :value="relatorio.data.noticias"
          description="Notícias publicadas"
          trend="neutral"
          trend-value="0"
        />
        <RelatorioCard
          title="Eventos"
          :value="relatorio.data.eventos"
          description="Eventos programados"
          trend="up"
          trend-value="5"
        />
        <RelatorioCard
          title="Mensagens"
          :value="relatorio.data.mensagens"
          description="Total de mensagens"
          trend="up"
          trend-value="8"
        />
      </div>

      <!-- Detalhamento por Módulo -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-chart-bar text-blue-500"/>
          Detalhamento por Módulo
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <span class="font-medium text-gray-600 dark:text-gray-400">Notícias Publicadas:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ relatorio.data.noticias }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <span class="font-medium text-gray-600 dark:text-gray-400">Eventos Ativos:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ relatorio.data.eventos }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <span class="font-medium text-gray-600 dark:text-gray-400">Mensagens Não Lidas:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ relatorio.data.mensagensNaoLidas }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <span class="font-medium text-gray-600 dark:text-gray-400">Colaboradores Ativos:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ relatorio.data.colaboradoresAtivos }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <span class="font-medium text-gray-600 dark:text-gray-400">Classificados:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ relatorio.data.classificados }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <span class="font-medium text-gray-600 dark:text-gray-400">Avaliações:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">{{ relatorio.data.avaliacoes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-10">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
        <i class="fas fa-chart-pie text-4xl text-gray-300 dark:text-gray-600 mb-4"/>
        <p class="text-lg font-medium text-gray-900 dark:text-white">Nenhum relatório gerado</p>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Clique no botão acima para gerar o primeiro relatório do sistema.</p>
        <button 
          @click="gerarRelatorio"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          <i class="fas fa-play mr-2"/>
          Gerar Primeiro Relatório
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRelatorio } from '@/admin/composables/useRelatorio'
import RelatorioCard from './RelatorioCard.vue'

const { loading, error, gerarRelatorio: gerarRelatorioComposable } = useRelatorio()
const relatorio = ref(null)

const gerarRelatorio = async () => {
  const resultado = await gerarRelatorioComposable()
  relatorio.value = resultado
}

const formatarData = (dataISO) => {
  return new Date(dataISO).toLocaleString('pt-BR')
}

const exportarRelatorio = () => {
  if (!relatorio.value?.success) return
  
  const blob = new Blob([JSON.stringify(relatorio.value.data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `relatorio-geral-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  gerarRelatorio()
})
</script>

<style scoped>
.relatorio-geral {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .relatorio-geral {
    padding: 0.5rem;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>