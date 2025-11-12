<!-- src/modules/mensagens/components/AdminMensagens.vue -->
<template>
  <div class="admin-mensagens p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Mensagens de Contato
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Gerencie as mensagens recebidas através do formulário de contato
      </p>
    </div>

    <!-- Modal do Formulário -->
    <div v-if="showForm && mensagemSelecionada" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <AdminMensagensForm
          :modelValue="mensagemSelecionada"
          @update:modelValue="mensagemSelecionada = $event"
          @cancel="fecharForm"
          @mark-as-read="marcarComoLida"
        />
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="space-y-6">
      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.total }}</p>
            </div>
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Não Lidas</p>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ estatisticas.naoLidas }}</p>
            </div>
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Lidas</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ estatisticas.lidas }}</p>
            </div>
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Este Mês</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ estatisticas.esteMes }}</p>
            </div>
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div class="flex gap-3">
          <button
            @click="carregarMensagens"
            :disabled="loading"
            class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>

          <button
            v-if="estatisticas.naoLidas > 0"
            @click="marcarTodasComoLidas"
            :disabled="loading"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Marcar Todas como Lidas
          </button>
        </div>

        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              v-model="apenasNaoLidas"
              @change="filtrarMensagens"
              class="rounded border-gray-300 text-amajac-green focus:ring-amajac-green"
            />
            Apenas não lidas
          </label>
        </div>
      </div>

      <!-- Tabela de Mensagens -->
      <AdminMensagensTable
        :mensagens="mensagensFiltradas"
        :loading="loading"
        :error="error"
        @edit="editarMensagem"
        @delete="deletarMensagem"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAdminMensagens } from '../composables/useAdminMensagens'
import AdminMensagensTable from './AdminMensagensTable.vue'
import AdminMensagensForm from './AdminMensagensForm.vue'

const { 
  mensagens, 
  loading, 
  error, 
  buscarMensagens,
  excluirMensagem,
  marcarTodasComoLidas: marcarTodasLidas,
  buscarEstatisticas
} = useAdminMensagens()

const mensagemSelecionada = ref(null)
const showForm = ref(false)
const estatisticas = ref({
  total: 0,
  naoLidas: 0,
  lidas: 0,
  esteMes: 0
})
const apenasNaoLidas = ref(false)

// Computed para mensagens filtradas
const mensagensFiltradas = computed(() => {
  if (apenasNaoLidas.value) {
    return mensagens.value.filter(msg => !msg.lida)
  }
  return mensagens.value
})

// Ouvir evento global para abrir mensagem específica
const abrirMensagemHandler = (event) => {
  const mensagemId = event.detail.id
  const mensagem = mensagens.value.find(msg => msg.id === mensagemId)
  if (mensagem) {
    editarMensagem(mensagem)
  }
}

// Buscar mensagens ao montar
onMounted(async () => {
  await carregarMensagens()
  await carregarEstatisticas()
  
  // Registrar listener para eventos globais
  window.addEventListener('abrir-mensagem', abrirMensagemHandler)
})

const carregarMensagens = async () => {
  try {
    console.log('Carregando mensagens...')
    await buscarMensagens({ 
      order: 'created_at', 
      ascending: false 
    })
    console.log('Mensagens carregadas:', mensagens.value)
  } catch (err) {
    console.error('Erro ao carregar mensagens:', err)
  }
}

const carregarEstatisticas = async () => {
  try {
    estatisticas.value = await buscarEstatisticas()
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err)
  }
}

const editarMensagem = (msg) => {
  console.log('Editando mensagem:', msg)
  mensagemSelecionada.value = { ...msg }
  showForm.value = true
}

const deletarMensagem = async (id) => {
  try {
    await excluirMensagem(id)
    await carregarMensagens() // Recarrega a lista
    await carregarEstatisticas() // Atualiza estatísticas
  } catch (err) {
    console.error('Erro ao excluir mensagem:', err)
  }
}

const marcarComoLida = (id) => {
  console.log('Mensagem marcada como lida:', id)
  // Força o recarregamento das mensagens e estatísticas
  carregarMensagens()
  carregarEstatisticas()
}

const marcarTodasComoLidas = async () => {
  try {
    await marcarTodasLidas()
    await carregarMensagens()
    await carregarEstatisticas()
  } catch (err) {
    console.error('Erro ao marcar todas como lidas:', err)
  }
}

const filtrarMensagens = () => {
  console.log('Filtrando mensagens - apenas não lidas:', apenasNaoLidas.value)
}

const fecharForm = () => {
  showForm.value = false
  mensagemSelecionada.value = null
  // Recarrega as mensagens para atualizar os status
  carregarMensagens()
  carregarEstatisticas()
}

// Limpar listener ao desmontar
onUnmounted(() => {
  window.removeEventListener('abrir-mensagem', abrirMensagemHandler)
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>