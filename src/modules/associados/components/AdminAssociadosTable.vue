<!-- src/modules/associados/components/AdminAssociadosTable.vue -->
<template>
  <div class="admin-associados-table bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              CPF
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Contato
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Categoria
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody v-if="associados && associados.length > 0" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="assoc in associados" :key="assoc.id">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {{ assoc.nome }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              {{ formatCPF(assoc.cpf) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              <div v-if="assoc.email" class="flex items-center gap-1">
                <i class="mdi mdi-email text-gray-400"></i>
                {{ assoc.email }}
              </div>
              <div v-if="assoc.telefone" class="flex items-center gap-1 mt-1">
                <i class="mdi mdi-phone text-gray-400"></i>
                {{ assoc.telefone }}
              </div>
              <span v-if="!assoc.email && !assoc.telefone" class="text-gray-400"></span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span v-if="assoc.categoria === 'benemerito'" class="text-green-700 dark:text-green-300 font-medium">Benemérito</span>
              <span v-else-if="assoc.categoria === 'remido'" class="text-blue-700 dark:text-blue-300 font-medium">Remido</span>
              <span v-else-if="assoc.categoria === 'fundador'" class="text-purple-700 dark:text-purple-300 font-medium">Fundador</span>
              <span v-else class="text-gray-500"></span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': assoc.status === 'ativo',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': assoc.status === 'pendente',
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': assoc.status === 'inativo'
                }"
              >
                {{ getStatusLabel(assoc.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="handleEdit(assoc)"
                class="text-amajac-green hover:text-green-700 mr-3"
                title="Editar"
                aria-label="Editar sócio"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="confirmDelete(assoc.id)"
                class="text-red-500 hover:text-red-700"
                title="Excluir"
                aria-label="Excluir sócio"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <i class="mdi mdi-account-multiple-outline text-2xl mb-2 block"></i>
              Nenhum sócio cadastrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="p-4 text-center">
      <i class="mdi mdi-loading mdi-spin text-amajac-green"></i>
      Carregando sócios...
    </div>

    <div v-if="error" class="p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  associados: {
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

const emit = defineEmits(['edit', 'delete', 'avaliarRemido'])

const confirmDelete = (id) => {
  if (confirm('Tem certeza que deseja excluir este sócio?')) {
    emit('delete', id)
  }
}

const handleEdit = (assoc) => {
  if (assoc.categoria === 'remido' && assoc.status === 'pendente') {
    emit('avaliarRemido', assoc)
  } else {
    emit('edit', assoc)
  }
}

const formatCPF = (cpf) => {
  if (!cpf) return ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const getStatusLabel = (status) => {
  const labels = {
    ativo: 'Ativo',
    pendente: 'Pendente',
    inativo: 'Inativo'
  }
  return labels[status] || status
}
</script>