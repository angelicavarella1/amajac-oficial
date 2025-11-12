<template>
  <div class="admin-noticias-table bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <!-- Filtros e Busca -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <!-- Busca -->
        <div class="w-full md:w-auto">
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar notícias..."
              class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @input="handleSearch"
            />
            <i class="mdi mdi-magnify absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Filtros -->
        <div class="flex flex-wrap gap-2">
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativas</option>
            <option value="inativo">Inativas</option>
            <option value="rascunho">Rascunhos</option>
          </select>

          <select
            v-model="filters.destaque"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Em destaque</option>
            <option value="false">Sem destaque</option>
          </select>

          <button
            @click="clearFilters"
            class="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Título
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Destaque
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Visualizações
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody v-if="noticias && noticias.length > 0" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="noticia in noticias" :key="noticia.id">
            <td class="px-6 py-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    v-if="noticia.imagem_url"
                    :src="noticia.imagem_url"
                    :alt="noticia.imagem_alt"
                    class="h-10 w-10 object-cover"
                  />
                  <div v-else class="h-10 w-10 flex items-center justify-center text-gray-400">
                    <i class="mdi mdi-image-off"></i>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {{ noticia.titulo }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Por {{ noticia.autor || 'Equipe AMAJAC' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(noticia.data_publicacao) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="toggleStatus(noticia.id, noticia.ativo)"
                :class="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors': true,
                  'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800': noticia.ativo && !noticia.rascunho,
                  'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800': !noticia.ativo && !noticia.rascunho,
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800': noticia.rascunho
                }"
                :title="noticia.rascunho ? 'Publicar rascunho' : (noticia.ativo ? 'Desativar notícia' : 'Ativar notícia')"
              >
                {{ noticia.rascunho ? 'Rascunho' : (noticia.ativo ? 'Ativo' : 'Inativo') }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="toggleDestaque(noticia.id, noticia.destaque)"
                :class="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors': true,
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800': noticia.destaque,
                  'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600': !noticia.destaque
                }"
                :title="noticia.destaque ? 'Remover destaque' : 'Tornar destaque'"
              >
                <i class="mdi mdi-star mr-1"></i>
                {{ noticia.destaque ? 'Destaque' : 'Normal' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div class="flex items-center gap-1">
                <i class="mdi mdi-eye"></i>
                {{ noticia.visualizacoes || 0 }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end items-center space-x-2">
                <!-- Botão Publicar para rascunhos -->
                <button
                  v-if="noticia.rascunho"
                  @click="publicarRascunho(noticia.id)"
                  class="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Publicar rascunho"
                  aria-label="Publicar rascunho"
                >
                  <i class="mdi mdi-send"></i>
                </button>
                
                <button
                  @click="$emit('edit', noticia)"
                  class="text-amajac-green hover:text-green-700 transition-colors"
                  title="Editar"
                  aria-label="Editar notícia"
                >
                  <i class="mdi mdi-pencil"></i>
                </button>
                
                <button
                  @click="confirmDelete(noticia.id)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                  title="Excluir"
                  aria-label="Excluir notícia"
                >
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <i class="mdi mdi-file-document-outline text-2xl mb-2 block"></i>
              {{ loading ? 'Carregando...' : 'Nenhuma notícia encontrada.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="p-4 text-center">
      <i class="mdi mdi-loading mdi-spin text-amajac-green"></i>
      Carregando notícias...
    </div>

    <div v-if="error" class="p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  noticias: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['edit', 'delete', 'search', 'filter', 'toggle-status', 'toggle-destaque', 'publicar'])

// Filtros
const filters = ref({
  search: '',
  status: '',
  destaque: ''
})

// Timer para busca
let searchTimer = null

const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    emit('search', filters.value.search)
  }, 500)
}

const applyFilters = () => {
  const filterParams = {}
  
  if (filters.value.status) {
    if (filters.value.status === 'rascunho') {
      filterParams.rascunho = true
    } else {
      filterParams.ativo = filters.value.status === 'ativo'
    }
  }
  
  if (filters.value.destaque !== '') {
    filterParams.destaque = filters.value.destaque
  }
  
  emit('filter', filterParams)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    destaque: ''
  }
  emit('search', '')
  emit('filter', {})
}

const toggleStatus = (id, currentStatus) => {
  emit('toggle-status', id, currentStatus)
}

const toggleDestaque = (id, currentDestaque) => {
  emit('toggle-destaque', id, currentDestaque)
}

const publicarRascunho = (id) => {
  if (confirm('Deseja publicar este rascunho?')) {
    emit('publicar', id)
  }
}

const confirmDelete = (id) => {
  if (confirm('Tem certeza que deseja excluir esta notícia?')) {
    emit('delete', id)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '–'
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>