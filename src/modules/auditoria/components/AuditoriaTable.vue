<template>
  <div class="auditoria-table mb-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Cabeçalho da Tabela -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Logs de Auditoria
        </h3>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Total: {{ pagination.total }} registros
        </div>
      </div>

      <!-- Tabela -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="ordenar('created_at')"
              >
                <div class="flex items-center gap-1">
                  Data/Hora
                  <SortIcon :field="'created_at'" :current-sort="pagination.sortBy" :order="pagination.sortOrder" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ação
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tabela
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Admin
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                IP
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex justify-center items-center">
                  <svg class="w-6 h-6 animate-spin text-amajac-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">Carregando logs...</span>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="logs.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p>Nenhum log encontrado</p>
                  <p class="text-sm">Tente ajustar os filtros</p>
                </div>
              </td>
            </tr>

            <!-- Logs -->
            <tr 
              v-else 
              v-for="log in logs" 
              :key="log.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatarData(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getActionClass(log.action)"
                >
                  {{ getActionLabel(log.action) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatTableName(log.table_name) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ log.admin_profiles?.nome || log.admin_id?.slice(0,8) + '...' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                {{ log.ip_address }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="mostrarDetalhes(log)"
                  class="text-amajac-green hover:text-green-700 dark:hover:text-green-400 font-medium"
                >
                  Ver detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {{ (pagination.page - 1) * pagination.pageSize + 1 }} a 
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} de 
          {{ pagination.total }} registros
        </div>
        <div class="flex gap-1">
          <button
            @click="mudarPagina(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Anterior
          </button>
          <button
            @click="mudarPagina(pagination.page + 1)"
            :disabled="pagination.page * pagination.pageSize >= pagination.total"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SortIcon from './SortIcon.vue'

const props = defineProps({
  logs: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['page-change', 'sort-change'])

const detalhesVisiveis = ref({})

// Formatar data
const formatarData = (dataString) => {
  if (!dataString) return '-'
  try {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data)
  } catch {
    return dataString
  }
}

// Obter classe CSS para ação
const getActionClass = (action) => {
  const classes = {
    'INSERT': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'UPDATE': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

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
    'mensagens_contato': 'Mensagens',
    'admin_profiles': 'Admin Profiles'
  }
  return tables[tableName] || tableName
}

// Mostrar detalhes
const mostrarDetalhes = (log) => {
  console.log('Detalhes do log:', log)
  alert(`Detalhes do log ${log.id}:\n\nAção: ${getActionLabel(log.action)}\nTabela: ${formatTableName(log.table_name)}\nAdmin: ${log.admin_profiles?.nome || log.admin_id}\nIP: ${log.ip_address}\n\nDados completos disponíveis no console.`)
}

// Mudar página
const mudarPagina = (page) => {
  emit('page-change', page)
}

// Ordenar
const ordenar = (field) => {
  const newOrder = props.pagination.sortBy === field && props.pagination.sortOrder === 'desc' ? 'asc' : 'desc'
  emit('sort-change', field, newOrder)
}
</script>