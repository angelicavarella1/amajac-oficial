<!-- src/modules/galeria/components/AdminGaleriaTable.vue -->
<template>
  <div class="admin-galeria-table bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Imagem
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Título
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Descrição
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Categoria
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody v-if="itens && itens.length > 0" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="item in itens" :key="item.id">
            <!-- Coluna da Imagem -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col items-center space-y-2 min-w-[120px]">
                <!-- Container da imagem com proporção mantida -->
                <div class="w-20 h-20 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <img
                    :src="item.imagem_url"
                    :alt="item.imagem_alt || item.titulo || 'Imagem da galeria'"
                    class="max-w-full max-h-full object-contain"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </div>
                <!-- Texto abaixo da imagem -->
                <span class="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Preview
                </span>
              </div>
            </td>
            
            <!-- Coluna do Título -->
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                {{ item.titulo || '—' }}
              </div>
            </td>
            
            <!-- Coluna da Descrição -->
            <td class="px-6 py-4">
              <div v-if="item.descricao" class="text-sm text-gray-600 dark:text-gray-300 max-w-md line-clamp-2">
                {{ item.descricao }}
              </div>
              <div v-else class="text-xs text-gray-400 dark:text-gray-500 italic">
                Sem descrição
              </div>
            </td>
            
            <!-- Coluna da Categoria -->
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="getCategoriaClasses(item.categoria)">
                {{ item.categoria || 'geral' }}
              </span>
            </td>
            
            <!-- Coluna da Data -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(item.created_at) }}
            </td>
            
            <!-- Coluna das Ações -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button
                  @click="$emit('edit', item)"
                  class="inline-flex items-center p-2 text-amajac-green hover:text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title="Editar"
                  aria-label="Editar imagem"
                >
                  <i class="mdi mdi-pencil text-sm"></i>
                </button>
                <button
                  @click="confirmDelete(item.id)"
                  class="inline-flex items-center p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Excluir"
                  aria-label="Excluir imagem"
                >
                  <i class="mdi mdi-delete text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center text-gray-400 dark:text-gray-500">
                <i class="mdi mdi-image-outline text-4xl mb-4"></i>
                <p class="text-lg font-medium mb-2">Nenhuma imagem na galeria</p>
                <p class="text-sm">Adicione a primeira imagem para começar</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center space-x-2 text-amajac-green">
        <i class="mdi mdi-loading mdi-spin text-xl"></i>
        <span>Carregando galeria...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="m-4 p-4 bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 rounded-lg text-sm">
      <div class="flex items-center space-x-2">
        <i class="mdi mdi-alert-circle-outline"></i>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  itens: {
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

const emit = defineEmits(['edit', 'delete'])

const confirmDelete = (id) => {
  if (confirm('Tem certeza que deseja excluir esta imagem?')) {
    emit('delete', id)
  }
}

const handleImageError = (event) => {
  const parent = event.target.parentElement
  parent.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
      <i class="mdi mdi-image-off text-lg mb-1"></i>
      <span class="text-xs">Erro</span>
    </div>
  `
}

const formatDate = (dateString) => {
  if (!dateString) return '–'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const getCategoriaClasses = (categoria) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
  
  const categoriaColors = {
    evento: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    projeto: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    equipe: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    geral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    default: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  }
  
  const colorClass = categoriaColors[categoria] || categoriaColors.default
  return `${baseClasses} ${colorClass}`
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.admin-galeria-table {
  border: 1px solid #e5e7eb;
}

.dark .admin-galeria-table {
  border-color: #374151;
}
</style>