<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Parceiros Comerciais</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie os comércios locais parceiros da associação</p>
      </div>
      <router-link
        to="/admin/parceiros/novo"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
      >
        <i class="fas fa-plus mr-2"></i>
        Novo Parceiro
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>

          <select
            v-model="filters.ramo"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos os Ramos</option>
            <option v-for="ramo in ramosDisponiveis" :key="ramo" :value="ramo">
              {{ ramo }}
            </option>
          </select>

          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="name">Por Nome</option>
          </select>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Buscar parceiros..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-store text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ativos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.ativos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-tags text-yellow-600 dark:text-yellow-400 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ramos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.ramos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-calendar-plus text-purple-600 dark:text-purple-400 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Novos (Mês)</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.novosMes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Parceiros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading && parceiros.length === 0" class="flex justify-center items-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600 dark:text-red-400">
        <i class="fas fa-exclamation-triangle text-2xl mb-4"></i>
        <p class="text-lg font-medium mb-2">Erro ao carregar parceiros</p>
        <p class="text-sm mb-4">{{ error }}</p>
        <button
          @click="carregarParceiros"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fas fa-redo mr-2"></i>Tentar Novamente
        </button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Parceiro
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo/Ramo
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contato
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="parceiro in parceirosPaginados"
              :key="parceiro?.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-lg object-cover"
                      :src="parceiro?.logo_url || '/placeholder-partner.jpg'"
                      :alt="parceiro?.nome || 'Parceiro'"
                      @error="handleImageError"
                    >
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {{ parceiro?.nome || 'Nome não disponível' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ parceiro?.descrição_curta || 'Sem descrição' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ parceiro?.tipo || '-' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ parceiro?.ramo || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  <i class="fas fa-phone mr-2 text-gray-400"></i>{{ parceiro?.telefone || 'Não informado' }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  <i class="fas fa-envelope mr-2 text-gray-400"></i>{{ parceiro?.email_contato || 'Não informado' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="parceiro?.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  <i :class="parceiro?.ativo ? 'fas fa-check-circle mr-1' : 'fas fa-times-circle mr-1'"></i>
                  {{ parceiro?.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <!-- Visualizar -->
                  <a
                    :href="`/parceiros/${parceiro?.id}`"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Visualizar na página pública"
                  >
                    <i class="fas fa-eye"></i>
                  </a>

                  <!-- Editar -->
                  <router-link
                    :to="`/admin/parceiros/editar/${parceiro?.id}`"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>

                  <!-- Ativar/Desativar -->
                  <button
                    @click="toggleStatus(parceiro)"
                    :class="parceiro?.ativo ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                    class="transition-colors p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    :title="parceiro?.ativo ? 'Desativar' : 'Ativar'"
                  >
                    <i :class="parceiro?.ativo ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>

                  <!-- Excluir -->
                  <button
                    @click="confirmarExclusao(parceiro)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Excluir"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && parceirosFiltrados.length === 0" class="text-center py-12">
        <i class="fas fa-store text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum parceiro encontrado</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Comece criando seu primeiro parceiro comercial.</p>
        <router-link
          to="/admin/parceiros/novo"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Criar Parceiro
        </router-link>
      </div>

      <!-- Paginação -->
      <div v-if="parceirosFiltrados.length > itemsPerPage" class="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, parceirosFiltrados.length) }}</span> de
            <span class="font-medium">{{ parceirosFiltrados.length }}</span> resultados
          </div>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage * itemsPerPage >= parceirosFiltrados.length"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="parceiroParaExcluir" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="parceiroParaExcluir = null"></div>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Confirmar Exclusão</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tem certeza que deseja excluir o parceiro <strong>"{{ parceiroParaExcluir?.nome }}"</strong>? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="excluirParceiro"
              :disabled="loadingExclusao"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loadingExclusao" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loadingExclusao ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              @click="parceiroParaExcluir = null"
              :disabled="loadingExclusao"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useColaboradoresStore } from '@/stores/colaboradores'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const colaboradoresStore = useColaboradoresStore()
const uiStore = useUIStore()

// Estados
const loading = ref(false)
const loadingExclusao = ref(false)
const error = ref(null)
const parceiros = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const parceiroParaExcluir = ref(null)

const filters = ref({
  status: '',
  ramo: '',
  sort: 'newest',
  search: ''
})

// Computed
const parceirosFiltrados = computed(() => {
  let result = [...parceiros.value]

  // Filtro por status
  if (filters.value.status) {
    if (filters.value.status === 'ativo') {
      result = result.filter(parceiro => parceiro?.ativo === true)
    } else if (filters.value.status === 'inativo') {
      result = result.filter(parceiro => parceiro?.ativo === false)
    }
  }

  // Filtro por ramo
  if (filters.value.ramo) {
    result = result.filter(parceiro => parceiro?.ramo === filters.value.ramo)
  }

  // Filtro por pesquisa
  if (filters.value.search) {
    const termo = filters.value.search.toLowerCase()
    result = result.filter(parceiro =>
      parceiro?.nome?.toLowerCase().includes(termo) ||
      parceiro?.tipo?.toLowerCase().includes(termo) ||
      parceiro?.ramo?.toLowerCase().includes(termo) ||
      parceiro?.email_contato?.toLowerCase().includes(termo) ||
      (parceiro?.descrição_curta && parceiro.descrição_curta.toLowerCase().includes(termo))
    )
  }

  // Ordenação
  switch (filters.value.sort) {
    case 'oldest':
      result.sort((a, b) => new Date(a?.criado_em || 0) - new Date(b?.criado_em || 0))
      break
    case 'name':
      result.sort((a, b) => (a?.nome || '').localeCompare(b?.nome || ''))
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b?.criado_em || 0) - new Date(a?.criado_em || 0))
  }

  return result
})

const parceirosPaginados = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return parceirosFiltrados.value.slice(startIndex, endIndex)
})

const stats = computed(() => {
  const total = parceiros.value.length
  const ativos = parceiros.value.filter(p => p?.ativo === true).length
  const ramos = new Set(parceiros.value.map(p => p?.ramo).filter(Boolean)).size
  const novosMes = parceiros.value.filter(p => {
    if (!p?.criado_em) return false
    const hoje = new Date()
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    return new Date(p.criado_em) >= primeiroDiaMes
  }).length

  return { total, ativos, ramos, novosMes }
})

const ramosDisponiveis = computed(() => {
  return [...new Set(parceiros.value.map(p => p?.ramo).filter(Boolean))].sort()
})

// Métodos
const carregarParceiros = async () => {
  loading.value = true
  error.value = null
  try {
    await colaboradoresStore.carregarColaboradores(true)
    parceiros.value = colaboradoresStore.parceiros || []
  } catch (err) {
    console.error('Erro ao carregar parceiros:', err)
    error.value = err.message || 'Erro desconhecido ao carregar parceiros'
    parceiros.value = []
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-partner.jpg'
}

const toggleStatus = async (parceiro) => {
  if (!parceiro?.id) return

  try {
    const novoStatus = !parceiro.ativo
    await colaboradoresStore.salvarColaborador(
      { ativo: novoStatus },
      parceiro.id
    )
    
    // Atualiza localmente
    const index = parceiros.value.findIndex(p => p.id === parceiro.id)
    if (index !== -1) {
      parceiros.value[index].ativo = novoStatus
    }
    
    uiStore.showToast(`Parceiro ${novoStatus ? 'ativado' : 'inativado'} com sucesso`, 'success')
  } catch (err) {
    console.error('Erro ao alterar status:', err)
    uiStore.showToast('Erro ao alterar status do parceiro', 'error')
  }
}

const confirmarExclusao = (parceiro) => {
  if (!parceiro?.id) return
  parceiroParaExcluir.value = parceiro
}

const excluirParceiro = async () => {
  if (!parceiroParaExcluir.value?.id) return

  loadingExclusao.value = true
  try {
    await colaboradoresStore.excluirColaborador(parceiroParaExcluir.value.id)
    parceiros.value = parceiros.value.filter(p => p.id !== parceiroParaExcluir.value.id)
    parceiroParaExcluir.value = null
    uiStore.showToast('Parceiro excluído com sucesso', 'success')
  } catch (err) {
    console.error('Erro ao excluir parceiro:', err)
    uiStore.showToast('Erro ao excluir parceiro', 'error')
  } finally {
    loadingExclusao.value = false
  }
}

const nextPage = () => {
  if (currentPage.value * itemsPerPage.value < parceirosFiltrados.value.length) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Lifecycle
onMounted(() => {
  carregarParceiros()
})
</script>