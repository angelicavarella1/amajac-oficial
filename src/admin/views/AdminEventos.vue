<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Eventos</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Crie e gerencie os eventos da AMAJAC</p>
      </div>
      <router-link
        to="/admin/eventos/novo"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
      >
        <i class="fas fa-plus mr-2"/>
        Novo Evento
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
            v-model="filters.destaque"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos</option>
            <option value="true">Em Destaque</option>
            <option value="false">Sem Destaque</option>
          </select>

          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="upcoming">Próximos Eventos</option>
          </select>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Buscar eventos..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-calendar text-blue-600 dark:text-blue-400 text-xl"/>
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
              <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"/>
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
              <i class="fas fa-star text-yellow-600 dark:text-yellow-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Destaque</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.destaque }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-clock text-purple-600 dark:text-purple-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Futuros</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.futuros }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Eventos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading && eventos.length === 0" class="flex justify-center items-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4"/>
        <p class="text-gray-600 dark:text-gray-400">Carregando eventos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600 dark:text-red-400">
        <i class="fas fa-exclamation-triangle text-2xl mb-4"/>
        <p class="text-lg font-medium mb-2">Erro ao carregar eventos</p>
        <p class="text-sm mb-4">{{ error }}</p>
        <button
          @click="carregarEventos"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fas fa-redo mr-2"/>Tentar Novamente
        </button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Evento
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Destaque
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data do Evento
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="evento in eventosPaginados"
              :key="evento?.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-lg object-cover bg-gray-200 dark:bg-gray-700"
                      :src="evento?.imagem_url || '/images/logo-amajac.png'"
                      :alt="evento?.titulo || 'Evento'"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {{ evento?.titulo || 'Título não disponível' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ evento?.local || 'Local não informado' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="evento?.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  <i :class="evento?.ativo ? 'fas fa-check-circle mr-1' : 'fas fa-times-circle mr-1'"/>
                  {{ evento?.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="evento?.destaque ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  <i class="fas fa-star mr-1 text-xs"/>
                  {{ evento?.destaque ? 'Sim' : 'Não' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex items-center">
                  <i class="fas fa-calendar mr-2 text-gray-400"/>
                  {{ formatDate(evento?.data_hora_evento) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <i class="fas fa-clock mr-1"/>
                  {{ formatTime(evento?.data_hora_evento) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <!-- Visualizar -->
                  <button
                    @click="visualizarEvento(evento)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Visualizar"
                  >
                    <i class="fas fa-eye"/>
                  </button>

                  <!-- Editar -->
                  <router-link
                    :to="`/admin/eventos/editar/${evento?.id}`"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Editar"
                  >
                    <i class="fas fa-edit"/>
                  </router-link>

                  <!-- Ativar/Desativar -->
                  <button
                    @click="toggleStatus(evento)"
                    :class="evento?.ativo ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                    class="transition-colors p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    :title="evento?.ativo ? 'Desativar' : 'Ativar'"
                  >
                    <i :class="evento?.ativo ? 'fas fa-eye-slash' : 'fas fa-eye'"/>
                  </button>

                  <!-- Destaque -->
                  <button
                    @click="alternarDestaque(evento)"
                    :class="evento?.destaque ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300' : 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'"
                    class="transition-colors p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    :title="evento?.destaque ? 'Remover Destaque' : 'Colocar em Destaque'"
                  >
                    <i class="fas fa-star"/>
                  </button>

                  <!-- Excluir -->
                  <button
                    @click="confirmarExclusao(evento)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Excluir"
                  >
                    <i class="fas fa-trash"/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && eventosFiltrados.length === 0" class="text-center py-12">
        <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"/>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum evento encontrado</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Comece criando seu primeiro evento.</p>
        <router-link
          to="/admin/eventos/novo"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"/>
          Criar Evento
        </router-link>
      </div>

      <!-- Paginação -->
      <div v-if="eventosFiltrados.length > itemsPerPage" class="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, eventosFiltrados.length) }}</span> de
            <span class="font-medium">{{ eventosFiltrados.length }}</span> resultados
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
              :disabled="currentPage * itemsPerPage >= eventosFiltrados.length"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="eventoParaExcluir" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="eventoParaExcluir = null"/>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"/>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Confirmar Exclusão</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tem certeza que deseja excluir o evento <strong>"{{ eventoParaExcluir?.titulo }}"</strong>? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="excluirEvento"
              :disabled="loadingExclusao"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loadingExclusao" class="fas fa-spinner fa-spin mr-2"/>
              {{ loadingExclusao ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              @click="eventoParaExcluir = null"
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
import { useEventosStore } from '@/modules/eventos/stores/eventos'
import { useUIStore } from '@/shared/stores/ui'

const router = useRouter()
const eventosStore = useEventosStore()
const uiStore = useUIStore()

// Estados
const loading = ref(false)
const loadingExclusao = ref(false)
const error = ref(null)
const eventos = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const eventoParaExcluir = ref(null)

const filters = ref({
  status: '',
  destaque: '',
  sort: 'newest',
  search: ''
})

// Computed
const eventosFiltrados = computed(() => {
  let result = [...eventos.value]

  // Filtro por status
  if (filters.value.status) {
    if (filters.value.status === 'ativo') {
      result = result.filter(evento => evento?.ativo === true)
    } else if (filters.value.status === 'inativo') {
      result = result.filter(evento => evento?.ativo === false)
    }
  }

  // Filtro por destaque
  if (filters.value.destaque) {
    const destaque = filters.value.destaque === 'true'
    result = result.filter(evento => evento?.destaque === destaque)
  }

  // Filtro por pesquisa
  if (filters.value.search) {
    const termo = filters.value.search.toLowerCase()
    result = result.filter(evento =>
      evento?.titulo?.toLowerCase().includes(termo) ||
      (evento?.descricao && evento.descricao.toLowerCase().includes(termo)) ||
      (evento?.local && evento.local.toLowerCase().includes(termo))
    )
  }

  // Ordenação
  switch (filters.value.sort) {
    case 'oldest':
      result.sort((a, b) => new Date(a?.data_hora_evento || 0) - new Date(b?.data_hora_evento || 0))
      break
    case 'upcoming':
      result.sort((a, b) => new Date(a?.data_hora_evento || 0) - new Date(b?.data_hora_evento || 0))
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b?.data_hora_evento || 0) - new Date(a?.data_hora_evento || 0))
  }

  return result
})

const eventosPaginados = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return eventosFiltrados.value.slice(startIndex, endIndex)
})

const stats = computed(() => {
  const total = eventos.value.length
  const ativos = eventos.value.filter(e => e?.ativo === true).length
  const destaque = eventos.value.filter(e => e?.destaque === true).length
  const futuros = eventos.value.filter(e => new Date(e?.data_hora_evento) > new Date()).length

  return { total, ativos, destaque, futuros }
})

// Métodos
const carregarEventos = async () => {
  loading.value = true
  error.value = null
  try {
    console.log('🔄 Carregando eventos...')
    await eventosStore.carregarEventos()
    eventos.value = eventosStore.todos || []
    console.log(`✅ ${eventos.value.length} eventos carregados`)
  } catch (err) {
    console.error('❌ Erro ao carregar eventos:', err)
    error.value = err.message || 'Erro desconhecido ao carregar eventos'
    eventos.value = []
    uiStore.showToast('Erro ao carregar eventos', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data não informada'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch (e) {
    return dateString
  }
}

const formatTime = (dateString) => {
  if (!dateString) return 'Horário não informado'
  try {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch (e) {
    return dateString
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/logo-amajac.png'
  event.target.onerror = null
}

const visualizarEvento = (evento) => {
  if (!evento?.id) return
  window.open(`/eventos/${evento.id}`, '_blank')
}

const toggleStatus = async (evento) => {
  if (!evento?.id) return

  try {
    const novoStatus = !evento.ativo
    console.log(`🔄 Alterando status do evento ${evento.id} para ${novoStatus ? 'ativo' : 'inativo'}`)
    
    // Atualiza localmente por enquanto
    const index = eventos.value.findIndex(e => e.id === evento.id)
    if (index !== -1) {
      eventos.value[index].ativo = novoStatus
    }
    
    uiStore.showToast(`Evento ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`, 'success')
  } catch (err) {
    console.error('❌ Erro ao alterar status:', err)
    uiStore.showToast('Erro ao alterar status do evento', 'error')
  }
}

const alternarDestaque = async (evento) => {
  if (!evento?.id) return

  try {
    console.log(`⭐ Alternando destaque do evento ${evento.id}`)
    
    // Atualiza localmente
    const index = eventos.value.findIndex(e => e.id === evento.id)
    if (index !== -1) {
      eventos.value[index].destaque = !evento.destaque
    }
    
    uiStore.showToast('Status de destaque atualizado!', 'success')
  } catch (err) {
    console.error('❌ Erro ao alterar destaque:', err)
    uiStore.showToast('Erro ao atualizar destaque.', 'error')
  }
}

const confirmarExclusao = (evento) => {
  if (!evento?.id) return
  eventoParaExcluir.value = evento
}

const excluirEvento = async () => {
  if (!eventoParaExcluir.value?.id) return

  loadingExclusao.value = true
  try {
    console.log(`🗑️ Excluindo evento ${eventoParaExcluir.value.id}`)
    await eventosStore.excluirEvento(eventoParaExcluir.value.id)
    eventos.value = eventos.value.filter(e => e.id !== eventoParaExcluir.value.id)
    eventoParaExcluir.value = null
    uiStore.showToast('Evento excluído com sucesso!', 'success')
  } catch (err) {
    console.error('❌ Erro ao excluir evento:', err)
    uiStore.showToast('Erro ao excluir evento.', 'error')
  } finally {
    loadingExclusao.value = false
  }
}

const nextPage = () => {
  if (currentPage.value * itemsPerPage.value < eventosFiltrados.value.length) {
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
  carregarEventos()
})
</script>

<style scoped>
/* Estilos específicos do componente */
.transition-colors {
  transition: all 0.2s ease-in-out;
}

.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 0.8);
}

.dark .hover\:bg-gray-700:hover {
  background-color: rgba(55, 65, 81, 0.8);
}

/* Melhorias de acessibilidade */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Animações suaves */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>