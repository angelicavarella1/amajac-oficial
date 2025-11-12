<template>
  <div class="admin-mensagens-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-amajac-green dark:text-amajac-green-light flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Detalhes da Mensagem
      </h2>
      <button
        @click="$emit('cancel')"
        class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Fechar detalhes"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Status da Mensagem -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
        <div class="flex items-center gap-3">
          <div 
            class="w-3 h-3 rounded-full"
            :class="{
              'bg-green-500': mensagem.lida,
              'bg-blue-500 animate-pulse': !mensagem.lida
            }"
          ></div>
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ mensagem.lida ? '✓ Mensagem lida' : '📝 Nova mensagem' }}
          </span>
        </div>
        <button
          @click="alternarStatus"
          :disabled="alternandoStatus"
          class="px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200': mensagem.lida,
            'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200': !mensagem.lida
          }"
        >
          <svg v-if="alternandoStatus" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-14.142l2.828 2.828m9.9 9.9l2.828 2.828" />
          </svg>
          {{ mensagem.lida ? 'Marcar como não lida' : 'Marcar como lida' }}
        </button>
      </div>

      <!-- Informações do Remetente -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Nome</label>
          <p class="text-gray-900 dark:text-white font-medium text-lg">{{ mensagem.nome || '—' }}</p>
        </div>
        
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">E-mail</label>
          <a 
            :href="`mailto:${mensagem.email}`"
            class="text-amajac-green dark:text-amajac-green-light font-medium break-words hover:underline"
          >
            {{ mensagem.email || '—' }}
          </a>
        </div>
        
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</label>
          <div class="flex items-center gap-2">
            <a 
              v-if="mensagem.telefone"
              :href="`tel:${mensagem.telefone}`"
              class="text-gray-900 dark:text-white hover:text-amajac-green dark:hover:text-amajac-green-light transition-colors"
            >
              {{ formatTelefone(mensagem.telefone) }}
            </a>
            <span v-else class="text-gray-500 dark:text-gray-400">—</span>
          </div>
        </div>
        
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Assunto</label>
          <p class="text-gray-900 dark:text-white font-medium">{{ mensagem.assunto || 'Sem assunto' }}</p>
        </div>
      </div>

      <!-- Metadados -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Data de Envio</label>
          <p class="text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(mensagem.created_at) }}
          </p>
        </div>
        
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">ID da Mensagem</label>
          <p class="text-gray-500 dark:text-gray-400 text-sm font-mono">{{ mensagem.id }}</p>
        </div>
      </div>

      <!-- Conteúdo da Mensagem -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Mensagem</label>
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {{ mensagem.mensagem || 'Nenhuma mensagem fornecida.' }}
          </p>
        </div>
        
        <!-- Contador de caracteres -->
        <div class="text-right">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ mensagem.mensagem?.length || 0 }} caracteres
          </span>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="excluirMensagem"
          :disabled="excluindo"
          class="px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 order-2 sm:order-1"
        >
          <svg v-if="excluindo" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-14.142l2.828 2.828m9.9 9.9l2.828 2.828" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ excluindo ? 'Excluindo...' : 'Excluir Mensagem' }}
        </button>
        
        <button
          @click="$emit('cancel')"
          class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors order-1 sm:order-2"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAdminMensagens } from '../composables/useAdminMensagens'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'mark-as-read'])

const mensagem = ref({ ...props.modelValue })
const alternandoStatus = ref(false)
const excluindo = ref(false)

const { alternarStatusLida, excluirMensagem: excluirMensagemLogica } = useAdminMensagens()

// Watch para debug
watch(() => props.modelValue, (newValue) => {
  console.log('Mensagem recebida no form:', newValue)
  mensagem.value = { ...newValue }
}, { deep: true })

const alternarStatus = async () => {
  alternandoStatus.value = true
  try {
    console.log('Alternando status da mensagem:', mensagem.value.id, 'de', mensagem.value.lida, 'para', !mensagem.value.lida)
    
    const resultado = await alternarStatusLida(mensagem.value.id)
    
    if (resultado) {
      console.log('Status alternado com sucesso:', resultado)
      
      // Atualiza o estado local com os dados retornados do banco
      mensagem.value.lida = resultado.lida
      
      // Emite os eventos
      emit('update:modelValue', { ...mensagem.value })
      emit('mark-as-read', mensagem.value.id)
    }
  } catch (error) {
    console.error('Erro ao alternar status:', error)
    alert('Erro ao alterar status da mensagem: ' + error.message)
  } finally {
    alternandoStatus.value = false
  }
}

const excluirMensagem = async () => {
  if (!confirm('Tem certeza que deseja excluir esta mensagem?\n\nEsta ação não pode ser desfeita.')) {
    return
  }

  excluindo.value = true
  try {
    const sucesso = await excluirMensagemLogica(mensagem.value.id)
    if (sucesso) {
      emit('cancel')
    }
  } catch (error) {
    console.error('Erro ao excluir mensagem:', error)
    alert('Erro ao excluir mensagem. Tente novamente.')
  } finally {
    excluindo.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
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

// Marcar como lida automaticamente se for uma mensagem nova
onMounted(() => {
  console.log('Form montado com mensagem:', mensagem.value)
  if (!mensagem.value.lida) {
    console.log('Mensagem não lida, emitindo mark-as-read')
    emit('mark-as-read', mensagem.value.id)
  }
})
</script>

<style scoped>
.admin-mensagens-form {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Melhorias de acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .admin-mensagens-form {
    animation: none;
  }
  
  .animate-pulse {
    animation: none;
  }
  
  .animate-spin {
    animation: none;
  }
}
</style>