<!-- src/modules/mensagens/components/AdminMensagensTable.vue -->
<template>
  <div class="admin-mensagens-table bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Remetente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Contato
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Assunto
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody v-if="mensagens && mensagens.length > 0" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr 
            v-for="msg in mensagens" 
            :key="msg.id" 
            :class="{ 
              'bg-blue-50 dark:bg-blue-900/20': !msg.lida,
              'bg-white dark:bg-gray-800': msg.lida 
            }"
          >
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ msg.nome }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              <div v-if="msg.email" class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ msg.email }}
              </div>
              <div v-if="msg.telefone" class="flex items-center gap-1 mt-1">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ formatTelefone(msg.telefone) }}
              </div>
              <span v-if="!msg.email && !msg.telefone" class="text-gray-400">—</span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                {{ msg.assunto || 'Sem assunto' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {{ msg.mensagem }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(msg.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors': true,
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': msg.lida,
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 animate-pulse': !msg.lida
                }"
              >
                <template v-if="msg.lida">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Lida
                </template>
                <template v-else>
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  Nova
                </template>
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="$emit('edit', msg)"
                class="text-amajac-green hover:text-green-700 mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Ver detalhes"
                aria-label="Ver detalhes da mensagem"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(msg.id)"
                class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Excluir"
                aria-label="Excluir mensagem"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Nenhuma mensagem recebida.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="p-4 text-center">
      <svg class="w-6 h-6 mx-auto text-amajac-green animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-14.142l2.828 2.828m9.9 9.9l2.828 2.828" />
      </svg>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Carregando mensagens...</p>
    </div>

    <div v-if="error" class="p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  mensagens: {
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

// Watch para debug - verificar se as mensagens estão chegando com o status correto
watch(() => props.mensagens, (newMensagens) => {
  console.log('Mensagens atualizadas na tabela:', newMensagens)
  if (newMensagens && newMensagens.length > 0) {
    newMensagens.forEach(msg => {
      console.log(`Mensagem ${msg.id}: lida = ${msg.lida}`)
    })
  }
}, { deep: true })

const confirmDelete = (id) => {
  if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
    emit('delete', id)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '–'
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTelefone = (telefone) => {
  if (!telefone) return '—'
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '')
  
  // Formatação básica para telefones brasileiros
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  } else if (numeros.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  }
  
  return telefone
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

@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
  
  .animate-spin {
    animation: none;
  }
}
</style>