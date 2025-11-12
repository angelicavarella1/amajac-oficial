<!-- src/modules/mensagens/pages/AdminMensagensPage.vue -->
<template>
  <div class="admin-mensagens-page p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
          Mensagens de Contato
        </h1>
        <!-- Botão oculto ou desabilitado, pois não se cria mensagens manualmente -->
        <!-- Pode ser usado futuramente para "resposta interna", se desejar -->
      </div>

      <!-- Botão para recarregar -->
      <div class="mb-6">
        <button 
          @click="recarregarMensagens" 
          :disabled="loading"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading ? 'Carregando...' : 'Recarregar Mensagens' }}
        </button>
      </div>

      <!-- Formulário de visualização (embutido no topo quando aberto) -->
      <div v-if="showForm" class="mb-8">
        <AdminMensagensForm
          :model-value="editingItem"
          @cancel="closeForm"
        />
      </div>

      <!-- Tabela de Mensagens -->
      <div v-if="!showForm || mensagens.length > 0">
        <AdminMensagensTable
          :mensagens="mensagens"
          :loading="loading"
          :error="error"
          @edit="editItem"
          @delete="handleExcluirMensagem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminMensagens } from '@/modules/mensagens/composables/useAdminMensagens'
import AdminMensagensForm from '@/modules/mensagens/components/AdminMensagensForm.vue'
import AdminMensagensTable from '@/modules/mensagens/components/AdminMensagensTable.vue'

// Estados
const showForm = ref(false)
const editingItem = ref(null)

const { 
  mensagens, 
  loading, 
  error, 
  getAll, 
  excluirMensagem 
} = useAdminMensagens()

// Carregar mensagens ao montar
onMounted(() => {
  getAll()
})

// Recarregar mensagens
const recarregarMensagens = async () => {
  await getAll()
}

// Editar item (abrir formulário de detalhes)
const editItem = (item) => {
  editingItem.value = { ...item }
  showForm.value = true
}

// Fechar formulário
const closeForm = () => {
  showForm.value = false
  editingItem.value = null
  // Recarregar mensagens ao fechar para garantir que está atualizado
  getAll()
}

// Excluir mensagem
const handleExcluirMensagem = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
    await excluirMensagem(id)
    await getAll() // Recarrega após exclusão
  }
}
</script>

<style scoped>
/* Estilos já alinhados com AMAJAC */
</style>