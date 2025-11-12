<template>
  <div class="admin-auditoria-page bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-amajac-green dark:text-amajac-green-light mb-2">
          Auditoria Completa
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Monitoramento completo de todas as ações administrativas no sistema
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amajac-green mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando auditoria...</p>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else>
        <!-- Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Logs</p>
            <p class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">{{ stats.totalLogs }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Logs Hoje</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.logsHoje }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Inserções</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.inserts }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Atualizações</p>
            <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ stats.updates }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Exclusões</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.deletes }}</p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Data Início -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início</label>
              <input v-model="filters.dataInicio" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <!-- Data Fim -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Fim</label>
              <input v-model="filters.dataFim" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <!-- Ação -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ação</label>
              <select v-model="filters.acao" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white">
                <option value="">Todas</option>
                <option value="INSERT">Inserção</option>
                <option value="UPDATE">Atualização</option>
                <option value="DELETE">Exclusão</option>
              </select>
            </div>

            <!-- Tabela -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tabela</label>
              <select v-model="filters.tabela" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white">
                <option value="">Todas</option>
                <option value="associados">Associados</option>
                <option value="classificados">Classificados</option>
                <option value="eventos">Eventos</option>
                <option value="noticias">Notícias</option>
                <option value="parceiros">Parceiros</option>
                <option value="mensagens_contato">Mensagens</option>
              </select>
            </div>

            <!-- Admin ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin ID</label>
              <input v-model="filters.adminId" type="text" placeholder="UUID do admin" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <!-- Busca -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar</label>
              <input v-model="filters.search" type="text" placeholder="ID registro ou IP" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <!-- Botões de Ação dos Filtros -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ loadingLogs ? 'Aplicando filtros...' : 'Use os filtros para refinar sua busca' }}
            </div>
            <div class="flex gap-2">
              <button @click="resetarFiltros" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Limpar Filtros
              </button>
              <button @click="aplicarFiltros" class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                <svg v-if="loadingLogs" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Tabela de Logs -->
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Logs de Auditoria</h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total: {{ pagination.total }} registros | 
              Página {{ pagination.page }} de {{ Math.ceil(pagination.total / pagination.pageSize) }}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data/Hora</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ação</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tabela</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="loadingLogs">
                  <td colspan="5" class="px-6 py-8 text-center">
                    <div class="flex justify-center items-center">
                      <svg class="w-6 h-6 animate-spin text-amajac-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">Carregando logs...</span>
                    </div>
                  </td>
                </tr>

                <tr v-else-if="logs.length === 0">
                  <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center">
                      <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p>Nenhum log encontrado</p>
                      <p class="text-sm">A tabela admin_logs pode estar vazia</p>
                      <button @click="testarConexao" class="mt-4 px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Testar Conexão
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-else v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatarData(log.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getActionClass(log.action)">
                      {{ getActionLabel(log.action) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ log.table_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                    {{ log.admin_id?.slice(0,8) }}...
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {{ log.ip_address || '-' }}
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
              <button @click="mudarPagina(pagination.page - 1)" :disabled="pagination.page === 1" class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700">
                Anterior
              </button>
              <button @click="mudarPagina(pagination.page + 1)" :disabled="pagination.page * pagination.pageSize >= pagination.total" class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700">
                Próxima
              </button>
            </div>
          </div>
        </div>

        <!-- Exportação -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Exportar Relatório</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Exporte os logs filtrados para análise externa</p>
            </div>
            
            <div class="flex gap-2">
              <button @click="exportarLogs('csv')" class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                CSV
              </button>
              
              <button @click="exportarLogs('json')" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
                JSON
              </button>
            </div>
          </div>
          
          <!-- Resumo do Filtro -->
          <div v-if="temFiltrosAtivos" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
              Filtros ativos para exportação:
            </p>
            <div class="flex flex-wrap gap-2">
              <span v-if="filters.dataInicio" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                Desde: {{ filters.dataInicio }}
              </span>
              <span v-if="filters.dataFim" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                Até: {{ filters.dataFim }}
              </span>
              <span v-if="filters.acao" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                Ação: {{ getActionLabel(filters.acao) }}
              </span>
              <span v-if="filters.tabela" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                Tabela: {{ filters.tabela }}
              </span>
              <span v-if="filters.search" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                Busca: {{ filters.search }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

// Estados
const loading = ref(true)
const loadingLogs = ref(true)
const logs = ref([])

const stats = reactive({
  totalLogs: 0,
  logsHoje: 0,
  inserts: 0,
  updates: 0,
  deletes: 0
})

// Filtros
const filters = reactive({
  dataInicio: '',
  dataFim: '',
  acao: '',
  tabela: '',
  adminId: '',
  search: ''
})

// Paginação
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  sortBy: 'created_at',
  sortOrder: 'desc'
})

// Computed
const temFiltrosAtivos = computed(() => {
  return Object.values(filters).some(value => value !== '')
})

// Carregar estatísticas
const carregarEstatisticas = async () => {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    
    const [total, hojeCount, inserts, updates, deletes] = await Promise.all([
      supabase.from('admin_logs').select('*', { count: 'exact', head: true }),
      supabase.from('admin_logs').select('*', { count: 'exact', head: true }).gte('created_at', hoje),
      supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'INSERT'),
      supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'UPDATE'),
      supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'DELETE')
    ])

    stats.totalLogs = total.count || 0
    stats.logsHoje = hojeCount.count || 0
    stats.inserts = inserts.count || 0
    stats.updates = updates.count || 0
    stats.deletes = deletes.count || 0

  } catch (error) {
    console.error('Erro ao carregar estatisticas:', error)
  }
}

// Carregar logs com filtros
const carregarLogs = async () => {
  try {
    loadingLogs.value = true
    console.log(' Carregando logs...')

    // USAR A ESTRUTURA REAL DA TABELA
    let query = supabase
      .from('admin_logs')
      .select('*', { count: 'exact' })

    // Aplicar filtros
    if (filters.dataInicio) {
      query = query.gte('created_at', filters.dataInicio + 'T00:00:00Z')
    }
    if (filters.dataFim) {
      query = query.lte('created_at', filters.dataFim + 'T23:59:59Z')
    }
    if (filters.acao) {
      query = query.eq('action', filters.acao)
    }
    if (filters.tabela) {
      query = query.eq('table_name', filters.tabela)
    }
    if (filters.adminId) {
      query = query.eq('admin_id', filters.adminId)
    }
    if (filters.search) {
      query = query.or(`row_id.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`)
    }

    // Aplicar ordenação e paginação
    const from = (pagination.page - 1) * pagination.pageSize
    const to = from + pagination.pageSize - 1

    const { data, error, count } = await query
      .order(pagination.sortBy, { ascending: pagination.sortOrder === 'asc' })
      .range(from, to)

    console.log(' Dados carregados:', data)

    if (error) throw error

    logs.value = data || []
    pagination.total = count || 0

  } catch (error) {
    console.error(' Erro ao carregar logs:', error)
    logs.value = []
  } finally {
    loadingLogs.value = false
  }
}

// Aplicar filtros
const aplicarFiltros = () => {
  pagination.page = 1
  carregarLogs()
}

// Resetar filtros
const resetarFiltros = () => {
  Object.assign(filters, {
    dataInicio: '',
    dataFim: '',
    acao: '',
    tabela: '',
    adminId: '',
    search: ''
  })
  pagination.page = 1
  carregarLogs()
}

// Mudar página
const mudarPagina = (page) => {
  pagination.page = page
  carregarLogs()
}

// Exportar logs - IMPLEMENTAÇÃO REAL
const exportarLogs = async (formato) => {
  try {
    console.log(` Exportando ${formato}...`)
    
    // Carregar TODOS os logs (sem paginação) com os mesmos filtros
    let query = supabase
      .from('admin_logs')
      .select('*')

    // Aplicar os mesmos filtros
    if (filters.dataInicio) {
      query = query.gte('created_at', filters.dataInicio + 'T00:00:00Z')
    }
    if (filters.dataFim) {
      query = query.lte('created_at', filters.dataFim + 'T23:59:59Z')
    }
    if (filters.acao) {
      query = query.eq('action', filters.acao)
    }
    if (filters.tabela) {
      query = query.eq('table_name', filters.tabela)
    }
    if (filters.adminId) {
      query = query.eq('admin_id', filters.adminId)
    }
    if (filters.search) {
      query = query.or(`row_id.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`)
    }

    const { data: logsCompletos, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error(' Erro ao carregar dados para exportação:', error)
      alert('Erro ao carregar dados: ' + error.message)
      return
    }

    if (!logsCompletos || logsCompletos.length === 0) {
      alert('Nenhum dado encontrado para exportar com os filtros atuais.')
      return
    }

    console.log(` ${logsCompletos.length} registros carregados para exportação`)

    let blob, filename

    switch (formato) {
      case 'csv':
        // Converter para CSV
        const headers = ['Data/Hora', 'Ação', 'Tabela', 'ID Registro', 'Admin ID', 'IP', 'User Agent']
        const csvRows = logsCompletos.map(log => [
          new Date(log.created_at).toLocaleString('pt-BR'),
          getActionLabel(log.action),
          log.table_name,
          log.row_id || '-',
          log.admin_id,
          log.ip_address || '-',
          log.user_agent || '-'
        ])
        
        const csvContent = [headers, ...csvRows]
          .map(row => row.map(field => `"${field}"`).join(','))
          .join('\n')
        
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        filename = `auditoria_${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'json':
        // Converter para JSON
        const jsonContent = JSON.stringify(logsCompletos, null, 2)
        blob = new Blob([jsonContent], { type: 'application/json' })
        filename = `auditoria_${new Date().toISOString().split('T')[0]}.json`
        break

      default:
        throw new Error('Formato não suportado')
    }

    // Criar link de download
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    alert(` Exportação ${formato.toUpperCase()} concluída! ${logsCompletos.length} registros exportados.`)

  } catch (error) {
    console.error(' Erro ao exportar logs:', error)
    alert('Erro ao exportar logs: ' + error.message)
  }
}

// Testar conexão
const testarConexao = async () => {
  try {
    console.log(' Testando conexão...')
    
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .limit(5)

    console.log('Teste consulta:', data, error)
    
    if (error) {
      alert('Erro na consulta: ' + error.message)
    } else {
      alert(`Conexão OK! Encontrados ${data?.length || 0} registros`)
    }

  } catch (error) {
    console.error(' Erro no teste:', error)
    alert('Erro no teste: ' + error.message)
  }
}

// Helper functions
const formatarData = (dataString) => {
  if (!dataString) return '-'
  try {
    return new Date(dataString).toLocaleString('pt-BR')
  } catch {
    return dataString
  }
}

const getActionClass = (action) => {
  const classes = {
    'INSERT': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'UPDATE': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getActionLabel = (action) => {
  const labels = {
    'INSERT': 'Inserção',
    'UPDATE': 'Atualização',
    'DELETE': 'Exclusão'
  }
  return labels[action] || action
}

// Carregar dados iniciais
const carregarDadosIniciais = async () => {
  try {
    loading.value = true
    await Promise.all([carregarEstatisticas(), carregarLogs()])
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
  } finally {
    loading.value = false
  }
}

// Carregar dados iniciais
onMounted(() => {
  carregarDadosIniciais()
})
</script>

<style scoped>
.admin-auditoria-page {
  font-family: 'Montserrat', sans-serif;
}
</style>