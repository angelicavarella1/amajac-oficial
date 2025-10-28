<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Classificados de Serviços</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie os serviços anunciados pelos associados</p>
      </div>
      <router-link
        to="/admin/classificados/novo"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <i class="fas fa-plus mr-2"/>
        Novo Classificado
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todos os Status</option>
            <option value="aprovado">Aprovados</option>
            <option value="pendente">Pendentes</option>
            <option value="reprovado">Reprovados</option>
            <option value="expirado">Expirados</option>
          </select>

          <select
            v-model="filters.categoria"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todas as Categorias</option>
            <optgroup v-for="grupo in categoriasAgrupadas" :key="grupo.grupo" :label="grupo.grupo">
              <option v-for="categoria in grupo.categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nome }}
              </option>
            </optgroup>
          </select>

          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="avaliacao">Melhor Avaliados</option>
            <option value="expiracao">Próximos a Expirar</option>
          </select>

          <select
            v-model="itemsPerPage"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
            <option value="100">100 por página</option>
          </select>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Buscar serviços ou associados..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-tools text-blue-600 dark:text-blue-400 text-xl"/>
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
              <i class="fas fa-clock text-yellow-600 dark:text-yellow-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.pendentes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-times-circle text-red-600 dark:text-red-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Expirados</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.expirados }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-star text-purple-600 dark:text-purple-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avaliações</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalAvaliacoes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Classificados -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading && classificados.length === 0" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"/>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Serviço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Associado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avaliação
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status / Validade
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="classificado in classificadosPaginados"
              :key="classificado.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
                      <i :class="getCategoriaIcon(classificado.categoria_id)" class="text-green-600 dark:text-green-400 text-lg"/>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {{ classificado.titulo }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ getCategoriaNome(classificado.categoria_id) }}
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs">
                      {{ truncarTexto(classificado.descricao, 80) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ classificado.associado_nome }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <i class="fas fa-phone mr-1 text-gray-400"/>{{ classificado.telefone }}
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500 truncate max-w-xs">
                  {{ classificado.email }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"/>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ classificado.avaliacao_media || '0.0' }}
                    </span>
                  </div>
                  <div class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({{ classificado.total_avaliacoes || 0 }})
                  </div>
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ classificado.servicos_realizados || 0 }} serviços
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span :class="getStatusBadgeClass(classificado.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit">
                    <i :class="getStatusIcon(classificado.status)" class="mr-1"/>
                    {{ getStatusText(classificado.status) }}
                  </span>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    <i class="fas fa-calendar mr-1"/>
                    {{ formatDate(classificado.validade) }}
                    <span v-if="isExpirado(classificado.validade) && classificado.status === 'aprovado'" class="text-red-500 ml-1">
                      (Expirado)
                    </span>
                    <span v-else-if="diasParaExpirar(classificado.validade) <= 7" class="text-yellow-500 ml-1">
                      ({{ diasParaExpirar(classificado.validade) }} dias)
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <!-- Aprovar -->
                  <button
                    v-if="classificado.status === 'pendente'"
                    @click="aprovarClassificado(classificado)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    title="Aprovar classificado"
                  >
                    <i class="fas fa-check"/>
                  </button>

                  <!-- Reprovar -->
                  <button
                    v-if="classificado.status === 'pendente'"
                    @click="reprovarClassificado(classificado)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    title="Reprovar classificado"
                  >
                    <i class="fas fa-times"/>
                  </button>

                  <!-- Renovar -->
                  <button
                    v-if="isExpirado(classificado.validade) && classificado.status === 'aprovado'"
                    @click="renovarClassificado(classificado)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Renovar classificado"
                  >
                    <i class="fas fa-sync-alt"/>
                  </button>

                  <!-- Visualizar -->
                  <button
                    @click="visualizarClassificado(classificado)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Visualizar classificado"
                  >
                    <i class="fas fa-eye"/>
                  </button>

                  <!-- Editar -->
                  <router-link
                    :to="`/admin/classificados/editar/${classificado.id}`"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    title="Editar classificado"
                  >
                    <i class="fas fa-edit"/>
                  </router-link>

                  <!-- Excluir -->
                  <button
                    @click="iniciarExclusao(classificado)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    title="Excluir classificado"
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
      <div v-if="!loading && classificadosFiltrados.length === 0" class="text-center py-12">
        <i class="fas fa-tools text-4xl text-gray-400 mb-4"/>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum classificado encontrado</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Não há classificados que correspondam aos filtros selecionados.</p>
        <button
          @click="limparFiltros"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <i class="fas fa-times mr-2"/>
          Limpar Filtros
        </button>
      </div>

      <!-- Paginação -->
      <div v-if="classificadosFiltrados.length > itemsPerPage" class="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, classificadosFiltrados.length) }}</span> de
            <span class="font-medium">{{ classificadosFiltrados.length }}</span> classificados
          </div>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage * itemsPerPage >= classificadosFiltrados.length"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClassificadosStore } from '@/modules/classificados/stores/classificados'

const router = useRouter()
const classificadosStore = useClassificadosStore()

// Estados
const classificados = ref([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Categorias organizadas por grupos
const categoriasAgrupadas = ref([
  {
    grupo: 'Saúde e Bem-Estar',
    categorias: [
      { id: 1, nome: 'Cuidados Domiciliares', icon: 'fas fa-home-heart' },
      { id: 2, nome: 'Cuidador de Pessoas', icon: 'fas fa-user-nurse' },
      { id: 3, nome: 'Atendimento Terapêutico', icon: 'fas fa-hand-holding-heart' },
      { id: 4, nome: 'Beleza e Estética', icon: 'fas fa-spa' },
      { id: 5, nome: 'Coleta de Exames Laboratoriais', icon: 'fas fa-vial' }
    ]
  },
  {
    grupo: 'Manutenção e Reparos',
    categorias: [
      { id: 6, nome: 'Manutenção Elétrica', icon: 'fas fa-bolt' },
      { id: 7, nome: 'Manutenção Hidráulica', icon: 'fas fa-faucet' },
      { id: 8, nome: 'Reparos Gerais', icon: 'fas fa-tools' },
      { id: 9, nome: 'Jardinagem', icon: 'fas fa-leaf' }
    ]
  },
  {
    grupo: 'Limpeza e Conservação',
    categorias: [
      { id: 10, nome: 'Faxina Completa', icon: 'fas fa-broom' },
      { id: 11, nome: 'Limpeza Pós-Obra', icon: 'fas fa-hard-hat' },
      { id: 12, nome: 'Limpeza de Estofados e Tapetes', icon: 'fas fa-couch' },
      { id: 13, nome: 'Limpeza de Vidros', icon: 'fas fa-window-restore' },
      { id: 14, nome: 'Limpeza Diária ou Semanal', icon: 'fas fa-calendar-week' }
    ]
  },
  {
    grupo: 'Serviços Gerais e Entrega',
    categorias: [
      { id: 15, nome: 'Entregas', icon: 'fas fa-shipping-fast' },
      { id: 16, nome: 'Lavanderia', icon: 'fas fa-tshirt' },
      { id: 17, nome: 'Cozinheira ou Chef Particular', icon: 'fas fa-utensils' },
      { id: 18, nome: 'Assistência Técnica', icon: 'fas fa-headset' }
    ]
  }
])

const filters = ref({
  status: '',
  categoria: '',
  sort: 'newest',
  search: ''
})

// Watchers para resetar página quando filtros mudam
watch([() => filters.value.status, () => filters.value.categoria, () => filters.value.search], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Computed
const todasCategorias = computed(() => {
  return categoriasAgrupadas.value.flatMap(grupo => grupo.categorias)
})

const classificadosFiltrados = computed(() => {
  let result = [...classificados.value]

  // Filtro por status
  if (filters.value.status) {
    if (filters.value.status === 'expirado') {
      result = result.filter(c => isExpirado(c.validade) && c.status === 'aprovado')
    } else {
      result = result.filter(c => c.status === filters.value.status)
    }
  }

  // Filtro por categoria
  if (filters.value.categoria) {
    result = result.filter(c => c.categoria_id === parseInt(filters.value.categoria))
  }

  // Filtro por pesquisa
  if (filters.value.search) {
    const termo = filters.value.search.toLowerCase()
    result = result.filter(c =>
      c.titulo.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo) ||
      c.associado_nome.toLowerCase().includes(termo) ||
      getCategoriaNome(c.categoria_id).toLowerCase().includes(termo)
    )
  }

  // Ordenação
  switch (filters.value.sort) {
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'avaliacao':
      result.sort((a, b) => (b.avaliacao_media || 0) - (a.avaliacao_media || 0))
      break
    case 'expiracao':
      result.sort((a, b) => new Date(a.validade) - new Date(b.validade))
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return result
})

const classificadosPaginados = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return classificadosFiltrados.value.slice(startIndex, endIndex)
})

const stats = computed(() => {
  const total = classificados.value.length
  const ativos = classificados.value.filter(c => c.status === 'aprovado' && !isExpirado(c.validade)).length
  const pendentes = classificados.value.filter(c => c.status === 'pendente').length
  const expirados = classificados.value.filter(c => c.status === 'aprovado' && isExpirado(c.validade)).length
  const totalAvaliacoes = classificados.value.reduce((sum, c) => sum + (c.total_avaliacoes || 0), 0)

  return { total, ativos, pendentes, expirados, totalAvaliacoes }
})

// Métodos
async function carregarClassificados() {
  try {
    loading.value = true
    // Usa o store para carregar classificados
    await classificadosStore.fetchClassificados()
    // Agora os dados vêm do store, não do mock local
    classificados.value = classificadosStore.classificados
    console.log('📋 Classificados carregados:', classificados.value.length)
  } catch (err) {
    console.error('Erro ao carregar classificados:', err)
    // Em caso de erro, ainda usa os dados do store (que tem os mocks)
    classificados.value = classificadosStore.classificados
  } finally {
    loading.value = false
  }
}

function getCategoriaIcon(categoriaId) {
  const categoria = todasCategorias.value.find(c => c.id === categoriaId)
  return categoria ? categoria.icon : 'fas fa-tools'
}

function getCategoriaNome(categoriaId) {
  const categoria = todasCategorias.value.find(c => c.id === categoriaId)
  return categoria ? categoria.nome : 'Outros'
}

function truncarTexto(texto, limite = 100) {
  if (!texto || texto.length <= limite) return texto
  return texto.substring(0, limite) + '...'
}

function formatDate(dateString) {
  if (!dateString) return 'Data não informada'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch (e) {
    return dateString
  }
}

function isExpirado(validade) {
  return new Date(validade) < new Date()
}

function diasParaExpirar(validade) {
  const diff = new Date(validade) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatusBadgeClass(status) {
  const classes = {
    aprovado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    reprovado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function getStatusIcon(status) {
  const icons = {
    aprovado: 'fas fa-check-circle',
    pendente: 'fas fa-clock',
    reprovado: 'fas fa-times-circle'
  }
  return icons[status] || 'fas fa-question-circle'
}

function getStatusText(status) {
  const texts = {
    aprovado: 'Aprovado',
    pendente: 'Pendente',
    reprovado: 'Reprovado'
  }
  return texts[status] || 'Desconhecido'
}

function aprovarClassificado(classificado) {
  if (confirm(`Deseja aprovar o classificado "${classificado.titulo}" do associado ${classificado.associado_nome}?`)) {
    classificado.status = 'aprovado'
    classificado.validade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
  }
}

function reprovarClassificado(classificado) {
  const motivo = prompt(`Digite o motivo da reprovação para "${classificado.titulo}":`)
  if (motivo) {
    classificado.status = 'reprovado'
    classificado.motivo_reprovacao = motivo
  }
}

function renovarClassificado(classificado) {
  if (confirm(`Deseja renovar o classificado "${classificado.titulo}" por mais 30 dias?`)) {
    classificado.validade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}

function visualizarClassificado(classificado) {
  alert(`Visualizando: ${classificado.titulo}\nAssociado: ${classificado.associado_nome}\nCategoria: ${getCategoriaNome(classificado.categoria_id)}`)
}

function iniciarExclusao(classificado) {
  if (confirm(`Deseja excluir permanentemente o classificado "${classificado.titulo}"?`)) {
    const index = classificados.value.findIndex(c => c.id === classificado.id)
    if (index !== -1) {
      classificados.value.splice(index, 1)
    }
  }
}

function limparFiltros() {
  filters.value = {
    status: '',
    categoria: '',
    sort: 'newest',
    search: ''
  }
  itemsPerPage.value = 10
  currentPage.value = 1
}

// Paginação
function nextPage() {
  if (currentPage.value < Math.ceil(classificadosFiltrados.value.length / itemsPerPage.value)) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Lifecycle
onMounted(() => {
  carregarClassificados()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.transition-transform {
  transition: transform 0.3s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>