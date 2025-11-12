<template>
  <div class="admin-classificados-table bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <!-- Header com estatísticas -->
    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Classificados
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total: {{ totalClassificados }} | Ativos: {{ classificadosAtivos }} | Aprovados: {{ classificadosAprovados }}
          </p>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <button
            @click="exportarDados"
            class="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            title="Exportar dados"
          >
            <i class="mdi mdi-download"></i>
            Exportar
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
              Categoria
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Anunciante
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
        <tbody v-if="classificados && classificados.length > 0" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr 
            v-for="classificado in classificados" 
            :key="classificado.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="max-w-xs">
                <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ classificado.titulo }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatarData(classificado.created_at) }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 capitalize">
                {{ classificado.categoria || '' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 dark:text-white font-medium">
                {{ classificado.nome_anunciante || '' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ classificado.bairro || 'Bairro não informado' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="space-y-1">
                <div v-if="classificado.telefone" class="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                  <i class="mdi mdi-phone text-gray-400 text-sm"></i>
                  {{ classificado.telefone }}
                </div>
                <div v-if="classificado.email" class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <i class="mdi mdi-email text-gray-400 text-sm"></i>
                  <span class="truncate max-w-xs">{{ classificado.email }}</span>
                </div>
                <div v-if="!classificado.telefone && !classificado.email" class="text-xs text-gray-400">
                  
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col gap-2">
                <div class="flex gap-1">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-semibold rounded-full': true,
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': classificado.ativo,
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !classificado.ativo
                    }"
                  >
                    {{ classificado.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                  
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-semibold rounded-full': true,
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': classificado.aprovado,
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': !classificado.aprovado
                    }"
                  >
                    {{ classificado.aprovado ? 'Aprovado' : 'Pendente' }}
                  </span>
                </div>
                
                <div v-if="classificado.data_aprovacao" class="text-xs text-gray-500 dark:text-gray-400">
                  Aprovado em: {{ formatarData(classificado.data_aprovacao) }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <!-- Editar -->
                <button
                  @click="$emit('edit', classificado)"
                  class="text-amajac-green hover:text-green-700 transition-colors p-1"
                  title="Editar classificado"
                  aria-label="Editar classificado"
                >
                  <i class="mdi mdi-pencil"></i>
                </button>
                
                <!-- Excluir -->
                <button
                  @click="confirmDelete(classificado.id, classificado.titulo)"
                  class="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Excluir classificado"
                  aria-label="Excluir classificado"
                >
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="max-w-sm mx-auto">
                <i class="mdi mdi-bullhorn-outline text-4xl text-gray-400 mb-3"></i>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum classificado cadastrado
                </h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                  Comece criando o primeiro classificado para aparecer aqui.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center gap-3">
        <i class="mdi mdi-loading mdi-spin text-amajac-green text-xl"></i>
        <span class="text-gray-600 dark:text-gray-300">Carregando classificados...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 text-sm rounded-b-xl">
      <div class="flex items-center gap-2">
        <i class="mdi mdi-alert-circle-outline"></i>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  classificados: {
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

const emit = defineEmits(['edit', 'delete', 'toggle-status', 'export-data'])

// Computed properties para estatísticas
const totalClassificados = computed(() => props.classificados.length)
const classificadosAtivos = computed(() => props.classificados.filter(c => c.ativo).length)
const classificadosAprovados = computed(() => props.classificados.filter(c => c.aprovado).length)

// Formatar data
const formatarData = (dataString) => {
  if (!dataString) return ''
  return new Date(dataString).toLocaleDateString('pt-BR')
}

// Confirmar exclusão
const confirmDelete = (id, titulo = 'este classificado') => {
  if (confirm('Tem certeza que deseja excluir "' + titulo + '"? Esta ação não pode ser desfeita.')) {
    emit('delete', id)
  }
}

// Exportar dados
const exportarDados = () => {
  emit('export-data', props.classificados)
}
</script>

<style scoped>
.admin-classificados-table {
  --amajac-green: #2E7D32;
}
</style>