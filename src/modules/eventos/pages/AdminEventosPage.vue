<!-- src/modules/eventos/pages/AdminEventosPage.vue -->
<template>
  <div class="admin-eventos-page p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">
          Gerenciar Eventos
        </h1>
        <button
          @click="openForm"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <i class="mdi mdi-plus"></i> Novo Evento
        </button>
      </div>

      <!-- Formulário (embutido no topo quando aberto) -->
      <div v-if="showForm" class="mb-8">
        <AdminEventosForm
          :model-value="editingItem"
          @submit="handleSave"
          @cancel="closeForm"
        />
      </div>

      <!-- Tabela de Eventos -->
      <div v-if="!showForm || eventos.length > 0" class="text-gray-900 dark:text-gray-100">
        <AdminEventosTable
          :eventos="eventos"
          :loading="loading"
          :error="error"
          @edit="editItem"
          @delete="deleteEvento"
        />
      </div>

      <!-- Mensagem quando não há eventos e formulário está fechado -->
      <div 
        v-if="!showForm && !loading && eventos.length === 0" 
        class="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <i class="mdi mdi-calendar-blank text-4xl mb-4"></i>
        <p class="text-lg">Nenhum evento cadastrado</p>
        <p class="text-sm mt-2">Clique em "Novo Evento" para começar</p>
      </div>

      <!-- Loading state -->
      <div 
        v-if="loading && eventos.length === 0" 
        class="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <i class="mdi mdi-loading mdi-spin text-2xl"></i>
        <p class="mt-2">Carregando eventos...</p>
      </div>

      <!-- Error state -->
      <div 
        v-if="error && !loading" 
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
      >
        <p class="font-medium">Erro ao carregar eventos</p>
        <p class="text-sm mt-1">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminEventos } from '@/modules/eventos/composables/useAdminEventos'
import AdminEventosForm from '@/modules/eventos/components/AdminEventosForm.vue'
import AdminEventosTable from '@/modules/eventos/components/AdminEventosTable.vue'

// Estados
const showForm = ref(false)
const editingItem = ref(null)

const { 
  eventos, 
  loading, 
  error, 
  getAll, 
  deleteEvento 
} = useAdminEventos()

// Carregar eventos ao montar
onMounted(() => {
  getAll({ order: 'data_evento' })
})

// Abrir formulário
const openForm = () => {
  editingItem.value = null
  showForm.value = true
}

// Editar item
const editItem = (item) => {
  editingItem.value = { ...item }
  showForm.value = true
}

// Fechar formulário
const closeForm = () => {
  showForm.value = false
  editingItem.value = null
}

// Salvar evento
const handleSave = async (savedItem) => {
  if (savedItem) {
    await getAll({ order: 'data_evento' })
    closeForm()
  }
}
</script>

<style scoped>
/* Estilos já alinhados com AMAJAC */
</style>