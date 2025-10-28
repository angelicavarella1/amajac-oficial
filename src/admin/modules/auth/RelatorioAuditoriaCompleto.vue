<!-- src/admin/components/RelatorioAuditoriaCompleto.vue - VERSÃO CORRIGIDA -->
<template>
  <div class="relatorio-auditoria">
    <!-- Header com Título e Controles -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Auditoria Completa do Sistema
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Registro de TODOS os movimentos do banco de dados em tempo real
        </p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <!-- Filtro por Data -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Período:</label>
          <select 
            v-model="filtroPeriodo"
            @change="aplicarFiltros"
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="all">Todo Período</option>
          </select>
        </div>

        <!-- Filtro por Ação -->
        <select 
          v-model="filtroAcao"
          @change="aplicarFiltros"
          class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todas Ações</option>
          <option value="INSERT">Inserções</option>
          <option value="UPDATE">Atualizações</option>
          <option value="DELETE">Exclusões</option>
        </select>

        <!-- Botão Atualizar -->
        <button 
          @click="carregarAuditoria"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200"
        >
          <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'"/>
          {{ loading ? 'Atualizando...' : 'Atualizar' }}
        </button>

        <!-- Botão Exportar CSV -->
        <button 
          @click="exportarRelatorioCSV"
          :disabled="logs.length === 0 || loading"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200"
        >
          <i class="fas fa-file-csv"/>
          Exportar CSV
        </button>
      </div>
    </div>

    <!-- Cartões de Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ estatisticas.totalAcoes.toLocaleString() }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total de Ações</div>
          </div>
          <i class="fas fa-chart-bar text-blue-500 text-xl"/>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ estatisticas.statsAcoes.INSERT.toLocaleString() }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Inserções</div>
          </div>
          <i class="fas fa-plus-circle text-green-500 text-xl"/>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ estatisticas.statsAcoes.UPDATE.toLocaleString() }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Atualizações</div>
          </div>
          <i class="fas fa-edit text-yellow-500 text-xl"/>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ estatisticas.statsAcoes.DELETE.toLocaleString() }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Exclusões</div>
          </div>
          <i class="fas fa-trash-alt text-red-500 text-xl"/>
        </div>
      </div>
    </div>

    <!-- Filtros Avançados -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">Tabela:</label>
          <select 
            v-model="filtroTabela"
            @change="aplicarFiltros"
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas Tabelas</option>
            <option 
              v-for="tabela in tabelasDisponiveis" 
              :key="tabela"
              :value="tabela"
            >
              {{ formatarNomeTabela(tabela) }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">Admin:</label>
          <select 
            v-model="filtroAdmin"
            @change="aplicarFiltros"
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos Admins</option>
            <option 
              v-for="admin in adminsDisponiveis" 
              :key="admin.id"
              :value="admin.id"
            >
              {{ admin.nome }}
            </option>
          </select>
        </div>

        <!-- Busca por ID de Registro -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">ID Registro:</label>
          <input
            v-model="filtroIdRegistro"
            @input="aplicarFiltros"
            placeholder="Buscar por ID..."
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Limpar Filtros -->
        <button 
          @click="limparFiltros"
          class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm flex items-center gap-1 transition-colors"
        >
          <i class="fas fa-times"/>
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"/>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Carregando registros de auditoria...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
      <div class="flex items-start">
        <div class="text-red-600 dark:text-red-400 text-xl mr-3 mt-1">❌</div>
        <div>
          <p class="text-red-800 dark:text-red-200 font-semibold">Erro ao carregar dados</p>
          <p class="text-red-700 dark:text-red-300 text-sm mt-2">{{ error }}</p>
          <button 
            @click="carregarAuditoria"
            class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200"
          >
            <i class="fas fa-sync-alt mr-2"/>
            Tentar novamente
          </button>
        </div>
      </div>
    </div>

    <!-- Tabela de Logs -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <!-- Header da Tabela com Contador -->
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {{ logsFiltrados.length }} de {{ totalLogs }} registros
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Última atualização: {{ ultimaAtualizacao }}
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="ordenarPor('created_at')">
                Data/Hora
                <i class="fas fa-sort ml-1" :class="ordenacao.campo === 'created_at' ? (ordenacao.direcao === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''"/>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Administrador</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="ordenarPor('table_name')">
                Tabela
                <i class="fas fa-sort ml-1" :class="ordenacao.campo === 'table_name' ? (ordenacao.direcao === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''"/>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="ordenarPor('action')">
                Ação
                <i class="fas fa-sort ml-1" :class="ordenacao.campo === 'action' ? (ordenacao.direcao === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''"/>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID Registro</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detalhes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="log in logsPaginados" 
              :key="log.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                <div class="font-medium">{{ formatarData(log.created_at) }}</div>
                <div class="text-xs text-gray-500">{{ formatarTempoRelativo(log.created_at) }}</div>
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {{ getInicialAdmin(log.admin_id) }}
                  </div>
                  <div>
                    <div class="text-gray-900 dark:text-gray-100">{{ getNomeAdmin(log.admin_id) }}</div>
                    <div class="text-xs text-gray-500">ID: {{ log.admin_id || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <i class="fas fa-table mr-1"/>
                  {{ formatarNomeTabela(log.table_name) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <span :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getClasseAcao(log.action)
                ]">
                  <i :class="getIconeAcao(log.action)" class="mr-1"/>
                  {{ log.action }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-900 dark:text-gray-100 font-mono bg-gray-50 dark:bg-gray-600 rounded">
                {{ log.row_id || 'N/A' }}
              </td>
              <td class="px-4 py-3 text-sm">
                <button 
                  @click="verDetalhes(log)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
                >
                  <i class="fas fa-search"/>
                  Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="totalPaginas > 1" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Página {{ paginaAtual }} de {{ totalPaginas }}
        </div>
        <div class="flex gap-1">
          <button
            @click="paginaAnterior"
            :disabled="paginaAtual === 1"
            class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Anterior
          </button>
          <button
            @click="proximaPagina"
            :disabled="paginaAtual === totalPaginas"
            class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="logsFiltrados.length === 0 && !loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
        <i class="fas fa-search text-4xl mb-3 opacity-50"/>
        <p class="text-lg font-medium">Nenhum registro encontrado</p>
        <p class="text-sm mt-1">Tente ajustar os filtros ou verificar se há registros no período selecionado.</p>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <ModalDetalhesAuditoria 
      v-if="logSelecionado"
      :log="logSelecionado"
      @fechar="logSelecionado = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuditoriaCompleta } from '@/admin/composables/useAuditoriaCompleta'
import ModalDetalhesAuditoria from './ModalDetalhesAuditoria.vue'

// Composables
const { loading, error, obterLogsAuditoria, obterEstatisticasAuditoria } = useAuditoriaCompleta()

// Estado Reativo
const logs = ref([])
const totalLogs = ref(0)
const ultimaAtualizacao = ref('')

// Filtros
const filtroPeriodo = ref('week')
const filtroAcao = ref('all')
const filtroTabela = ref('all')
const filtroAdmin = ref('all')
const filtroIdRegistro = ref('')

// Ordenação
const ordenacao = reactive({
  campo: 'created_at',
  direcao: 'desc'
})

// Paginação
const paginaAtual = ref(1)
const itensPorPagina = 50

// Estatísticas
const estatisticas = reactive({
  totalAcoes: 0,
  statsAcoes: { INSERT: 0, UPDATE: 0, DELETE: 0 },
  statsTabelas: {}
})

// Dados para Filtros
const tabelasDisponiveis = ref([])
const adminsDisponiveis = ref([])
const logSelecionado = ref(null)

// Computed
const logsFiltrados = computed(() => {
  let filtrados = logs.value

  // Aplicar filtros no cliente (apenas para filtros que não são enviados ao servidor)
  if (filtroAcao.value !== 'all') {
    filtrados = filtrados.filter(log => log.action === filtroAcao.value)
  }

  // NOTA: O filtro de tabela é aplicado no servidor, não precisa aplicar aqui
  // if (filtroTabela.value !== 'all') {
  //   filtrados = filtrados.filter(log => log.table_name === filtroTabela.value)
  // }

  if (filtroAdmin.value !== 'all') {
    filtrados = filtrados.filter(log => log.admin_id === filtroAdmin.value)
  }

  if (filtroIdRegistro.value) {
    filtrados = filtrados.filter(log => 
      log.row_id && log.row_id.toString().includes(filtroIdRegistro.value)
    )
  }

  // Aplicar ordenação
  filtrados.sort((a, b) => {
    const aVal = a[ordenacao.campo]
    const bVal = b[ordenacao.campo]

    if (ordenacao.direcao === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtrados
})

const logsPaginados = computed(() => {
  const startIndex = (paginaAtual.value - 1) * itensPorPagina
  return logsFiltrados.value.slice(startIndex, startIndex + itensPorPagina)
})

const totalPaginas = computed(() => {
  return Math.ceil(logsFiltrados.value.length / itensPorPagina)
})

// Métodos
const formatarData = (dataString) => {
  if (!dataString) return 'N/A'
  return new Date(dataString).toLocaleString('pt-BR')
}

const formatarTempoRelativo = (dataString) => {
  if (!dataString) return 'N/A'
  
  const agora = new Date()
  const data = new Date(dataString)
  const diffMs = agora - data
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora mesmo'
  if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays === 1) return 'Ontem'
  return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
}

const formatarNomeTabela = (tabela) => {
  const nomes = {
    'admin_logs': 'Logs Admin',
    'admin_profiles': 'Perfis Admin',
    'avaliacoes_classificados': 'Avaliações',
    'classificados': 'Classificados',
    'colaboradores': 'Colaboradores',
    'configuracoes': 'Configurações',
    'eventos': 'Eventos',
    'galeria': 'Galeria',
    'mensagens_contato': 'Mensagens Contato',
    'noticias': 'Notícias',
    'socios': 'Sócios',
    'view_medias_avaliacoes': 'View Médias'
  }
  return nomes[tabela] || tabela
}

const getClasseAcao = (acao) => {
  const classes = {
    'INSERT': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'UPDATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[acao] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getIconeAcao = (acao) => {
  const icones = {
    'INSERT': 'fa-plus-circle',
    'UPDATE': 'fa-edit',
    'DELETE': 'fa-trash-alt'
  }
  return icones[acao] || 'fa-question-circle'
}

const getInicialAdmin = (adminId) => {
  if (!adminId) return 'S'
  const admin = adminsDisponiveis.value.find(a => a.id === adminId)
  return admin?.nome?.charAt(0) || 'A'
}

const getNomeAdmin = (adminId) => {
  if (!adminId) return 'Sistema'
  const admin = adminsDisponiveis.value.find(a => a.id === adminId)
  return admin?.nome || `Admin ${adminId.substring(0, 8)}`
}

const ordenarPor = (campo) => {
  if (ordenacao.campo === campo) {
    ordenacao.direcao = ordenacao.direcao === 'asc' ? 'desc' : 'asc'
  } else {
    ordenacao.campo = campo
    ordenacao.direcao = 'desc'
  }
}

const verDetalhes = (log) => {
  logSelecionado.value = log
}

const aplicarFiltros = () => {
  paginaAtual.value = 1
  carregarAuditoria()
}

const limparFiltros = () => {
  filtroPeriodo.value = 'week'
  filtroAcao.value = 'all'
  filtroTabela.value = 'all'
  filtroAdmin.value = 'all'
  filtroIdRegistro.value = ''
  paginaAtual.value = 1
  carregarAuditoria()
}

const proximaPagina = () => {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value++
  }
}

const paginaAnterior = () => {
  if (paginaAtual.value > 1) {
    paginaAtual.value--
  }
}

const exportarRelatorioCSV = () => {
  if (logsFiltrados.value.length === 0) return
  
  try {
    // Preparar dados para CSV usando os nomes REAIS das colunas
    const dadosExportacao = logsFiltrados.value.map(log => ({
      'Data/Hora': formatarData(log.created_at),
      'Administrador': getNomeAdmin(log.admin_id),
      'Tabela': formatarNomeTabela(log.table_name),
      'Ação': log.action,
      'ID Registro': log.row_id || 'N/A',
      'Endereço IP': log.ip_address || 'N/A',
      'User Agent': log.user_agent || 'N/A',
      'Detalhes': log.details ? JSON.stringify(log.details) : '',
      'Dados Antigos': log.dados_antigos ? JSON.stringify(log.dados_antigos) : '',
      'Dados Novos': log.dados_novos ? JSON.stringify(log.dados_novos) : ''
    }))

    // Cabeçalhos
    const headers = Object.keys(dadosExportacao[0])
    const csvHeaders = headers.join(';')
    
    // Linhas de dados
    const csvRows = dadosExportacao.map(row => {
      return headers.map(header => {
        let value = row[header]
        
        if (value === null || value === undefined) {
          return ''
        }
        
        // Escapar caracteres especiais para CSV
        value = String(value).replace(/"/g, '""')
        return `"${value}"`
      }).join(';')
    })
    
    // Combinar cabeçalhos e dados
    const csvContent = [csvHeaders, ...csvRows].join('\n')
    
    // Criar e baixar arquivo CSV
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `auditoria_sistema_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('✅ CSV exportado com sucesso')
    
  } catch (error) {
    console.error('❌ Erro ao exportar:', error)
    alert('Erro ao exportar os dados.')
  }
}

const carregarAuditoria = async () => {
  try {
    console.log('🔄 Iniciando carregamento da auditoria...')
    
    const filtros = {
      periodo: filtroPeriodo.value,
      acao: filtroAcao.value !== 'all' ? filtroAcao.value : undefined,
      tabela: filtroTabela.value !== 'all' ? filtroTabela.value : undefined, // ENVIAR filtro de tabela para o servidor
      adminId: filtroAdmin.value !== 'all' ? filtroAdmin.value : undefined,
      idRegistro: filtroIdRegistro.value || undefined
    }

    console.log('🎯 Filtros aplicados para API:', filtros)

    const resultado = await obterLogsAuditoria(filtros)
    logs.value = resultado.logs || []
    totalLogs.value = resultado.total || 0

    console.log('📊 Dados recebidos da API:', {
      totalLogs: totalLogs.value,
      logsRecebidos: logs.value.length,
      primeirosLogs: logs.value.slice(0, 3),
      todasTabelasRecebidas: [...new Set(logs.value.map(log => log.table_name))]
    })

    // Carregar estatísticas
    const stats = await obterEstatisticasAuditoria(filtros)
    Object.assign(estatisticas, stats)

    // Extrair dados para filtros - APENAS das tabelas que existem nos logs recebidos
    const todasTabelas = [...new Set(logs.value.map(log => log.table_name).filter(Boolean))]
    tabelasDisponiveis.value = todasTabelas.sort()
    
    console.log('📋 Tabelas disponíveis para filtro:', tabelasDisponiveis.value)

    // Extrair admins disponíveis
    adminsDisponiveis.value = [...new Set(logs.value
      .filter(log => log.admin_id)
      .map(log => ({
        id: log.admin_id,
        nome: `Admin ${log.admin_id.substring(0, 8)}`
      }))
    )]

    ultimaAtualizacao.value = new Date().toLocaleString('pt-BR')

    console.log('✅ Auditoria carregada com sucesso:', {
      logsRecebidos: logs.value.length,
      logsFiltrados: logsFiltrados.value.length,
      filtroTabelaAtual: filtroTabela.value,
      estatisticas,
      tabelasDisponiveis: tabelasDisponiveis.value.length,
      adminsDisponiveis: adminsDisponiveis.value.length
    })

  } catch (err) {
    console.error('❌ Erro ao carregar auditoria:', err)
    error.value = err.message || 'Erro desconhecido ao carregar auditoria'
  }
}

// Watchers
watch(paginaAtual, () => {
  // Scroll para o topo da tabela ao mudar de página
  const tabela = document.querySelector('.relatorio-auditoria')
  if (tabela) {
    tabela.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

// Lifecycle
onMounted(() => {
  console.log('🚀 Componente RelatorioAuditoriaCompleto montado')
  carregarAuditoria()
})
</script>

<style scoped>
.relatorio-auditoria {
  font-family: 'Inter', sans-serif;
}

/* Animações suaves para transições */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Melhorar a aparência dos selects */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Dark mode para selects */
.dark select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}
</style>