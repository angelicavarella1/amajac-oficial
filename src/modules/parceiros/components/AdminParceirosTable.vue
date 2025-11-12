<!-- src/modules/parceiros/components/AdminParceirosTable.vue -->
<template>
  <div class="admin-parceiros-table bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tipo
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
        <tbody v-if="parceiros && parceiros.length > 0" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="parceiro in parceiros" :key="parceiro.id">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {{ parceiro.nome }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 capitalize">
              {{ parceiro.tipo || '—' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              <div v-if="parceiro.telefone" class="flex items-center gap-1">
                <i class="mdi mdi-phone text-gray-400"></i>
                {{ parceiro.telefone }}
              </div>
              <div v-if="parceiro.email_contato" class="flex items-center gap-1">
                <i class="mdi mdi-email text-gray-400"></i>
                {{ parceiro.email_contato }}
              </div>
              <span v-if="!parceiro.telefone && !parceiro.email_contato" class="text-gray-400">—</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': parceiro.ativo,
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !parceiro.ativo
                }"
              >
                {{ parceiro.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="$emit('edit', parceiro)"
                class="text-amajac-green hover:text-green-700 mr-3"
                title="Editar"
                aria-label="Editar parceiro"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="confirmDelete(parceiro.id)"
                class="text-red-500 hover:text-red-700"
                title="Excluir"
                aria-label="Excluir parceiro"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <i class="mdi mdi-store-outline text-2xl mb-2 block"></i>
              Nenhum parceiro comercial cadastrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="p-4 text-center">
      <i class="mdi mdi-loading mdi-spin text-amajac-green"></i>
      Carregando parceiros...
    </div>

    <div v-if="error" class="p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  parceiros: {
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
  if (confirm('Tem certeza que deseja excluir este parceiro comercial?')) {
    emit('delete', id)
  }
}
</script>

<style scoped>
/* Estilos já alinhados com AMAJAC */
</style>