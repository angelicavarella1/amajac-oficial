<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Nossos Parceiros Comerciais</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Conheça os comércios locais que apoiam nossa associação</p>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ totalParceiros }}</div>
          <div class="text-gray-600 dark:text-gray-400">Parceiros</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div class="text-2xl font-bold text-green-600">{{ parceirosAtivos }}</div>
          <div class="text-gray-600 dark:text-gray-400">Ativos</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalRamos }}</div>
          <div class="text-gray-600 dark:text-gray-400">Ramos</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ anosMercado }}+</div>
          <div class="text-gray-600 dark:text-gray-400">Anos no Mercado</div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div class="flex flex-wrap gap-4">
            <select 
              v-model="filters.ramo" 
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os Ramos</option>
              <option v-for="ramo in ramosDisponiveis" :key="ramo" :value="ramo">
                {{ ramo }}
              </option>
            </select>
            
            <select 
              v-model="filters.tipo" 
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os Tipos</option>
              <option value="restaurante">Restaurante</option>
              <option value="loja">Loja</option>
              <option value="servico">Serviço</option>
              <option value="consultorio">Consultório</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div class="relative w-full sm:w-64">
            <input 
              type="text" 
              v-model="filters.pesquisa"
              placeholder="Pesquisar parceiros..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"/>
      </div>

      <!-- Parceiros Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="parceiro in parceirosFiltrados" 
          :key="parceiro.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 dark:border-gray-700"
          @click="abrirDetalhes(parceiro)"
        >
          <!-- Logo/Imagem -->
          <div class="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4 relative overflow-hidden">
            <img 
              v-if="parceiro.logo_url"
              :src="parceiro.logo_url" 
              :alt="parceiro.imagem_alt || parceiro.nome"
              class="max-h-32 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div v-else class="text-center text-gray-400">
              <i class="fas fa-store text-4xl mb-2"/>
              <p class="text-sm">{{ parceiro.nome }}</p>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  parceiro.ativo 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                {{ parceiro.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
          
          <!-- Informações -->
          <div class="p-4">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">{{ parceiro.nome }}</h3>
            <p class="text-primary-600 dark:text-primary-400 font-medium mb-2">{{ parceiro.tipo }}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{{ parceiro.descricao_curta || 'Parceiro da nossa comunidade local.' }}</p>
            
            <!-- Detalhes -->
            <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div v-if="parceiro.ramo" class="flex items-center gap-2">
                <i class="fas fa-tag w-3"/>
                <span class="line-clamp-1">{{ parceiro.ramo }}</span>
              </div>
              <div v-if="parceiro.endereco" class="flex items-center gap-2">
                <i class="fas fa-map-marker-alt w-3"/>
                <span class="line-clamp-1">{{ parceiro.endereco }}</span>
              </div>
              <div v-if="parceiro.telefone" class="flex items-center gap-2">
                <i class="fas fa-phone w-3"/>
                <span>{{ parceiro.telefone }}</span>
              </div>
            </div>
            
            <!-- Etiquetas -->
            <div v-if="parceiro.tags && parceiro.tags.length" class="flex flex-wrap gap-1">
              <span 
                v-for="etiqueta in parceiro.tags.slice(0, 2)" 
                :key="etiqueta"
                class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
              >
                {{ etiqueta }}
              </span>
              <span 
                v-if="parceiro.tags.length > 2"
                class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded"
              >
                +{{ parceiro.tags.length - 2 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && parceirosFiltrados.length === 0" class="text-center py-12">
        <i class="fas fa-store text-6xl text-gray-400 mb-4"/>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nenhum parceiro encontrado</h2>
        <p class="text-gray-600 dark:text-gray-400">Tente ajustar os filtros de pesquisa.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePublicColaboradores } from '@/shared/composables/usePublicColaboradores'

const router = useRouter()
const { parceiros, loading, carregarParceiros, ramosDisponiveis } = usePublicColaboradores()

const filters = ref({
  ramo: '',
  tipo: '',
  pesquisa: ''
})

const parceirosFiltrados = computed(() => {
  let result = parceiros.value

  // Filtro por ramo
  if (filters.value.ramo) {
    result = result.filter(parceiro => 
      parceiro.ramo === filters.value.ramo
    )
  }

  // Filtro por tipo
  if (filters.value.tipo) {
    result = result.filter(parceiro => 
      parceiro.tipo?.toLowerCase().includes(filters.value.tipo.toLowerCase())
    )
  }

  // Filtro por pesquisa
  if (filters.value.pesquisa) {
    const termo = filters.value.pesquisa.toLowerCase()
    result = result.filter(parceiro => 
      parceiro.nome?.toLowerCase().includes(termo) ||
      parceiro.descricao_curta?.toLowerCase().includes(termo) ||
      parceiro.ramo?.toLowerCase().includes(termo) ||
      parceiro.tags?.some(etiqueta => etiqueta.toLowerCase().includes(termo))
    )
  }

  return result
})

const totalParceiros = computed(() => parceiros.value.length)
const parceirosAtivos = computed(() => parceiros.value.filter(p => p.ativo).length)
const totalRamos = computed(() => ramosDisponiveis().length)
const anosMercado = computed(() => {
  const anos = parceiros.value.map(p => {
    if (p.data_inicio) {
      const inicio = new Date(p.data_inicio)
      const hoje = new Date()
      return hoje.getFullYear() - inicio.getFullYear()
    }
    return 0
  })
  return Math.max(...anos, 0)
})

onMounted(async () => {
  await carregarParceiros()
})

function abrirDetalhes(parceiro) {
  router.push(`/parceiros/${parceiro.id}`)
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>