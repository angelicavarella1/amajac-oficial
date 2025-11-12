<template>
  <div class="export-auditoria">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Exportar Relatório
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Exporte os logs filtrados para análise externa
          </p>
        </div>
        
        <div class="flex gap-2">
          <button
            @click="exportar('csv')"
            class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            CSV
          </button>
          
          <button
            @click="exportar('json')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            JSON
          </button>
          
          <button
            @click="exportar('pdf')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            PDF
          </button>
        </div>
      </div>
      
      <!-- Resumo do Filtro -->
      <div v-if="temFiltrosAtivos" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p class="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
          Filtros ativos para exportação:
        </p>
        <div class="flex flex-wrap gap-2">
          <span 
            v-if="filters.dataInicio"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          >
            Desde: {{ filters.dataInicio }}
          </span>
          <span 
            v-if="filters.dataFim"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          >
            Até: {{ filters.dataFim }}
          </span>
          <span 
            v-if="filters.acao"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          >
            Ação: {{ getActionLabel(filters.acao) }}
          </span>
          <span 
            v-if="filters.tabela"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          >
            Tabela: {{ formatTableName(filters.tabela) }}
          </span>
          <span 
            v-if="filters.search"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          >
            Busca: {{ filters.search }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  totalLogs: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['export'])

// Verificar se há filtros ativos
const temFiltrosAtivos = computed(() => {
  return Object.values(props.filters).some(value => value !== '')
})

// Obter label para ação
const getActionLabel = (action) => {
  const labels = {
    'INSERT': 'Inserção',
    'UPDATE': 'Atualização',
    'DELETE': 'Exclusão'
  }
  return labels[action] || action
}

// Formatar nome da tabela
const formatTableName = (tableName) => {
  const tables = {
    'associados': 'Associados',
    'classificados': 'Classificados',
    'eventos': 'Eventos',
    'noticias': 'Notícias',
    'parceiros': 'Parceiros',
    'mensagens_contato': 'Mensagens'
  }
  return tables[tableName] || tableName
}

// Exportar
const exportar = (formato) => {
  emit('export', formato)
}
</script>