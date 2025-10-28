<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Solicitações de Sócios</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie as solicitações de novos sócios</p>
      </div>
      <div class="flex space-x-2">
        <div class="relative">
          <button 
            @click="openExportMenu = !openExportMenu"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center"
          >
            <i class="fas fa-download mr-2"/>
            Exportar
            <i class="fas fa-chevron-down ml-2 text-xs"/>
          </button>
          
          <div 
            v-show="openExportMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="py-1">
              <button 
                @click="exportarCSV"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <i class="fas fa-file-csv text-green-600 mr-3"/>
                Exportar como CSV
              </button>
              <button 
                @click="exportarExcel"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <i class="fas fa-file-excel text-green-600 mr-3"/>
                Exportar como Excel
              </button>
              <button 
                @click="exportarPDF"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <i class="fas fa-file-pdf text-red-600 mr-3"/>
                Exportar como PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
            <i class="fas fa-clock text-blue-600 dark:text-blue-300"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.pendentes }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
            <i class="fas fa-check text-green-600 dark:text-green-300"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Aprovadas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.aprovadas }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-red-100 dark:bg-red-900 mr-3">
            <i class="fas fa-times text-red-600 dark:text-red-300"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Rejeitadas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.rejeitadas }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
            <i class="fas fa-users text-gray-600 dark:text-gray-300"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.total }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar</label>
          <input 
            v-model="filtros.busca"
            type="text" 
            placeholder="Nome, CPF ou email..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select 
            v-model="filtros.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="aprovado">Aprovados</option>
            <option value="rejeitado">Rejeitados</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordenação</label>
          <select 
            v-model="filtros.ordenacao"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="recente">Mais recentes</option>
            <option value="antigo">Mais antigos</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="limparFiltros"
            class="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                CPF
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data Solicitação
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="solicitacao in solicitacoesFiltradas" :key="solicitacao.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ solicitacao.nome }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ solicitacao.cpf }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ solicitacao.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[STATUS_BASE_CLASSES, getClasseStatus(solicitacao.status)]">
                  {{ formatarStatus(solicitacao.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatarDataCompleta(solicitacao.data_solicitacao) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="visualizarDetalhes(solicitacao)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  <i class="fas fa-eye"/>
                </button>
                <button 
                  v-if="solicitacao.status === 'pendente'"
                  @click="aprovarSolicitacao(solicitacao)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  <i class="fas fa-check"/>
                </button>
                <button 
                  v-if="solicitacao.status === 'pendente'"
                  @click="rejeitarSolicitacao(solicitacao)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <i class="fas fa-times"/>
                </button>
              </td>
            </tr>
            
            <tr v-if="solicitacoesFiltradas.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <i class="fas fa-inbox text-3xl mb-2 text-gray-300 dark:text-gray-600"/>
                <p>Nenhuma solicitação encontrada</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="paginacao.totalPaginas > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {{ Math.min(solicitacoesFiltradas.length, paginacao.itensPorPagina) }} de {{ solicitacoesFiltradas.length }} registros
          </div>
          <div class="flex space-x-1">
            <button 
              @click="paginaAnterior"
              :disabled="paginacao.paginaAtual === 1"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <button 
              v-for="pagina in paginacao.paginasVisiveis"
              :key="pagina"
              @click="irParaPagina(pagina)"
              :class="[
                'px-3 py-1 text-sm border rounded',
                pagina === paginacao.paginaAtual 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ pagina }}
            </button>
            
            <button 
              @click="paginaProxima"
              :disabled="paginacao.paginaAtual === paginacao.totalPaginas"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Detalhes -->
  <div v-if="solicitacaoSelecionada" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Detalhes da Solicitação
          </h3>
          <button 
            @click="fecharModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"/>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Nome Completo</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.nome }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">CPF</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.cpf }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Telefone</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.telefone }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Data de Nascimento</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatarData(solicitacaoSelecionada.data_nascimento) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Profissão</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.profissao || 'Não informado' }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Empresa</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.empresa || 'Não informado' }}</p>
          </div>
          
          <div v-if="solicitacaoSelecionada.observacoes">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Observações</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ solicitacaoSelecionada.observacoes }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
              <p class="mt-1">
                <span :class="[STATUS_BASE_CLASSES, getClasseStatus(solicitacaoSelecionada.status)]">
                  {{ formatarStatus(solicitacaoSelecionada.status) }}
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Data da Solicitação</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatarDataCompleta(solicitacaoSelecionada.data_solicitacao) }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            v-if="solicitacaoSelecionada.status === 'pendente'"
            @click="aprovarSolicitacao(solicitacaoSelecionada)"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            <i class="fas fa-check mr-2"/>
            Aprovar
          </button>
          <button 
            v-if="solicitacaoSelecionada.status === 'pendente'"
            @click="rejeitarSolicitacao(solicitacaoSelecionada)"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            <i class="fas fa-times mr-2"/>
            Rejeitar
          </button>
          <button 
            @click="fecharModal"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação -->
  <div v-if="mostrarModalConfirmacao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ modalConfirmacao.titulo }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ modalConfirmacao.mensagem }}
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="cancelarAcao"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button 
            @click="confirmarAcao"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

// CONSTANTE ADICIONADA: Para simplificar o binding de classes de status
const STATUS_BASE_CLASSES = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

// Estados
const carregando = ref(false)
const solicitacaoSelecionada = ref(null)
const mostrarModalConfirmacao = ref(false)
const acaoPendente = ref(null)
const openExportMenu = ref(false)
const exportando = ref(false)

// Dados de exemplo
const solicitacoes = ref([
  {
    id: 1,
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    data_nascimento: '1985-05-15',
    profissao: 'Engenheiro de Software',
    empresa: 'Tech Solutions Ltda',
    observacoes: 'Interessado em participar dos eventos técnicos da associação.',
    status: 'pendente',
    data_solicitacao: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 88888-8888',
    data_nascimento: '1990-08-22',
    profissao: 'Arquiteta',
    empresa: 'Studio Arquitetura',
    observacoes: null,
    status: 'aprovado',
    data_solicitacao: new Date(Date.now() - 86400000).toISOString()
  }
])

// Filtros
const filtros = reactive({
  busca: '',
  status: '',
  ordenacao: 'recente'
})

// Paginação
const paginacao = reactive({
  paginaAtual: 1,
  itensPorPagina: 10,
  totalPaginas: computed(() => Math.ceil(solicitacoesFiltradas.value.length / paginacao.itensPorPagina)),
  paginasVisiveis: computed(() => {
    const total = paginacao.totalPaginas
    const atual = paginacao.paginaAtual
    const paginas = []
    
    for (let i = Math.max(1, atual - 2); i <= Math.min(total, atual + 2); i++) {
      paginas.push(i)
    }
    
    return paginas
  })
})

// Modal de confirmação
const modalConfirmacao = reactive({
  titulo: '',
  mensagem: ''
})

// Estatísticas
const estatisticas = computed(() => {
  const pendentes = solicitacoes.value.filter(s => s.status === 'pendente').length
  const aprovadas = solicitacoes.value.filter(s => s.status === 'aprovado').length
  const rejeitadas = solicitacoes.value.filter(s => s.status === 'rejeitado').length
  
  return {
    pendentes,
    aprovadas,
    rejeitadas,
    total: solicitacoes.value.length
  }
})

// Solicitações filtradas
const solicitacoesFiltradas = computed(() => {
  let filtradas = solicitacoes.value.filter(solicitacao => {
    const correspondeBusca = 
      !filtros.busca ||
      solicitacao.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      solicitacao.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      solicitacao.cpf.includes(filtros.busca)
    
    const correspondeStatus = !filtros.status || solicitacao.status === filtros.status
    
    return correspondeBusca && correspondeStatus
  })
  
  if (filtros.ordenacao === 'recente') {
    filtradas.sort((a, b) => new Date(b.data_solicitacao) - new Date(a.data_solicitacao))
  } else {
    filtradas.sort((a, b) => new Date(a.data_solicitacao) - new Date(b.data_solicitacao))
  }
  
  const inicio = (paginacao.paginaAtual - 1) * paginacao.itensPorPagina
  const fim = inicio + paginacao.itensPorPagina
  
  return filtradas.slice(inicio, fim)
})

// MÉTODOS DE EXPORTAÇÃO
const exportarCSV = async () => {
  try {
    exportando.value = true
    openExportMenu.value = false

    const dados = solicitacoesFiltradas.value.map(solicitacao => ({
      'Nome': solicitacao.nome,
      'CPF': solicitacao.cpf,
      'Email': solicitacao.email,
      'Telefone': solicitacao.telefone,
      'Data Nascimento': formatarData(solicitacao.data_nascimento),
      'Profissão': solicitacao.profissao || 'Não informado',
      'Empresa': solicitacao.empresa || 'Não informado',
      'Status': formatarStatus(solicitacao.status),
      'Data Solicitação': formatarDataCompleta(solicitacao.data_solicitacao),
      'Observações': solicitacao.observacoes || 'Nenhuma'
    }))

    // Converter para CSV
    const headers = Object.keys(dados[0] || {})
    const csvRows = []
    
    // Adicionar cabeçalhos
    csvRows.push(headers.join(','))
    
    // Adicionar dados
    dados.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        // Escapar vírgulas e aspas
        const escaped = String(value).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    })
    
    const csvOutput = csvRows.join('\n')
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' })
    
    // Usar file-saver para download
    saveAs(blob, `solicitacoes_socios_${new Date().toISOString().split('T')[0]}.csv`)
    
    mostrarNotificacao('CSV exportado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao exportar CSV:', error)
    mostrarNotificacao('Erro ao exportar CSV', 'error')
  } finally {
    exportando.value = false
  }
}

const exportarExcel = async () => {
  try {
    exportando.value = true
    openExportMenu.value = false

    const dados = solicitacoesFiltradas.value.map(solicitacao => ({
      'Nome': solicitacao.nome,
      'CPF': solicitacao.cpf,
      'Email': solicitacao.email,
      'Telefone': solicitacao.telefone,
      'Data Nascimento': formatarData(solicitacao.data_nascimento),
      'Profissão': solicitacao.profissao || 'Não informado',
      'Empresa': solicitacao.empresa || 'Não informado',
      'Status': formatarStatus(solicitacao.status),
      'Data Solicitação': formatarDataCompleta(solicitacao.data_solicitacao),
      'Observações': solicitacao.observacoes || 'Nenhuma'
    }))

    // CÓDIGO USANDO EXCELJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Solicitações');

    // Adiciona cabeçalhos
    if (dados.length > 0) {
      const headers = Object.keys(dados[0])
      worksheet.addRow(headers);
      
      // Estilizar cabeçalhos
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' } // Lavender
      };
    }

    // Adiciona linhas de dados
    dados.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Ajustar largura das colunas automaticamente
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Gera o buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Cria o blob e salva usando file-saver
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `solicitacoes_socios_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    mostrarNotificacao('Excel exportado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
    mostrarNotificacao('Erro ao exportar Excel', 'error')
  } finally {
    exportando.value = false
  }
}

const exportarPDF = async () => {
  try {
    exportando.value = true
    openExportMenu.value = false

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Cabeçalho
    pdf.setFontSize(20)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Solicitações de Sócios', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 5
    pdf.text(`Total de registros: ${solicitacoesFiltradas.value.length}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Cabeçalho da tabela
    const colunas = ['Nome', 'CPF', 'Email', 'Status']
    const larguras = [50, 40, 60, 30]
    let xPosition = 10

    pdf.setFillColor(240, 240, 240)
    pdf.rect(xPosition, yPosition, pageWidth - 20, 10, 'F')
    pdf.setFontSize(8)
    pdf.setTextColor(0, 0, 0)

    colunas.forEach((coluna, index) => {
      pdf.text(coluna, xPosition + 2, yPosition + 7)
      xPosition += larguras[index]
    })

    yPosition += 10

    // Dados
    pdf.setFontSize(7)
    solicitacoesFiltradas.value.forEach((solicitacao, index) => {
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }

      xPosition = 10
      const valores = [
        solicitacao.nome.substring(0, 30),
        solicitacao.cpf,
        solicitacao.email.substring(0, 35),
        formatarStatus(solicitacao.status)
      ]

      valores.forEach((valor, colIndex) => {
        pdf.text(valor, xPosition + 2, yPosition + 4)
        xPosition += larguras[colIndex]
      })

      yPosition += 8
    })

    // Usar file-saver para PDF também
    const pdfBlob = pdf.output('blob')
    saveAs(pdfBlob, `solicitacoes_socios_${new Date().toISOString().split('T')[0]}.pdf`)
    
    mostrarNotificacao('PDF exportado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    mostrarNotificacao('Erro ao exportar PDF', 'error')
  } finally {
    exportando.value = false
  }
}

// Métodos auxiliares
function formatarData(dataString) {
  if (!dataString) return 'Não informado'
  return new Date(dataString).toLocaleDateString('pt-BR')
}

function formatarDataCompleta(dataString) {
  if (!dataString) return 'Não informado'
  return new Date(dataString).toLocaleString('pt-BR')
}

function formatarStatus(status) {
  const statusMap = {
    'pendente': 'Pendente',
    'aprovado': 'Aprovado',
    'rejeitado': 'Rejeitado'
  }
  return statusMap[status] || status
}

function getClasseStatus(status) {
  const classes = {
    'pendente': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'aprovado': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'rejeitado': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

function limparFiltros() {
  filtros.busca = ''
  filtros.status = ''
  filtros.ordenacao = 'recente'
  paginacao.paginaAtual = 1
}

function visualizarDetalhes(solicitacao) {
  solicitacaoSelecionada.value = solicitacao
}

function fecharModal() {
  solicitacaoSelecionada.value = null
}

function aprovarSolicitacao(solicitacao) {
  modalConfirmacao.titulo = 'Aprovar Solicitação'
  modalConfirmacao.mensagem = `Deseja aprovar a solicitação de ${solicitacao.nome}?`
  acaoPendente.value = { tipo: 'aprovar', solicitacao }
  mostrarModalConfirmacao.value = true
}

function rejeitarSolicitacao(solicitacao) {
  modalConfirmacao.titulo = 'Rejeitar Solicitação'
  modalConfirmacao.mensagem = `Deseja rejeitar a solicitação de ${solicitacao.nome}?`
  acaoPendente.value = { tipo: 'rejeitar', solicitacao }
  mostrarModalConfirmacao.value = true
}

function confirmarAcao() {
  if (acaoPendente.value) {
    const { tipo, solicitacao } = acaoPendente.value
    
    if (tipo === 'aprovar') {
      solicitacao.status = 'aprovado'
    } else if (tipo === 'rejeitar') {
      solicitacao.status = 'rejeitado'
    }
    
    console.log(`Solicitação ${tipo === 'aprovar' ? 'aprovada' : 'rejeitada'}:`, solicitacao)
  }
  
  mostrarModalConfirmacao.value = false
  acaoPendente.value = null
  
  if (solicitacaoSelecionada.value) {
    fecharModal()
  }
}

function cancelarAcao() {
  mostrarModalConfirmacao.value = false
  acaoPendente.value = null
}

function mostrarNotificacao(mensagem, tipo = 'info') {
  // Simulação de notificação
  alert(`${tipo === 'success' ? '✅' : '❌'} ${mensagem}`)
}

function paginaAnterior() {
  if (paginacao.paginaAtual > 1) {
    paginacao.paginaAtual--
  }
}

function paginaProxima() {
  if (paginacao.paginaAtual < paginacao.totalPaginas) {
    paginacao.paginaAtual++
  }
}

function irParaPagina(pagina) {
  paginacao.paginaAtual = pagina
}

const handleDocumentClick = (e) => {
  if (!e.target.closest('.relative')) {
    openExportMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  console.log('SolicitacoesSociosView carregada')
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>