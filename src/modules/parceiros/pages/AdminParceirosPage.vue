<!-- src/modules/admin/pages/AdminParceirosPage.vue -->
<template>
  <div class="admin-parceiros-page p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">
          Gerenciar Parceiros Comerciais
        </h1>
        <button
          @click="openForm"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <i class="mdi mdi-plus"></i> Novo Parceiro
        </button>
      </div>

      <!-- Formulário (embutido no topo quando aberto) -->
      <div v-if="showForm" class="mb-8">
        <AdminParceirosForm
          :model-value="editingItem"
          @submit="handleSave"
          @cancel="closeForm"
        />
      </div>

      <!-- Tabela de Parceiros -->
      <div v-if="!showForm || parceiros.length > 0">
        <AdminParceirosTable
          :parceiros="parceiros"
          :loading="loading"
          :error="error"
          @edit="editItem"
          @delete="deleteParceiro"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminParceiros } from '@/modules/parceiros/composables/useAdminParceiros'
import AdminParceirosForm from '@/modules/parceiros/components/AdminParceirosForm.vue'
import AdminParceirosTable from '@/modules/parceiros/components/AdminParceirosTable.vue'

// Estados
const showForm = ref(false)
const editingItem = ref(null)

const { 
  parceiros, 
  loading, 
  error, 
  getAll, 
  deleteParceiro 
} = useAdminParceiros()

// Carregar parceiros ao montar
onMounted(() => {
  getAll({ order: 'nome' })
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

// Salvar parceiro
const handleSave = async (savedItem) => {
  if (savedItem) {
    await getAll({ order: 'nome' })
    closeForm()
  }
}
</script>

<style scoped>
/* Estilos já alinhados com AMAJAC */
</style>