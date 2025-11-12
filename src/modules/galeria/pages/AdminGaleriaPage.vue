<!-- src/modules/galeria/pages/AdminGaleriaPage.vue -->
<template>
  <div class="admin-galeria-page p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">
            Gerenciar Galeria de Imagens
          </h1>
          <button
            @click="openForm"
            class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <i class="mdi mdi-plus"></i> Nova Imagem
          </button>
        </div>
        
        <!-- Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-amajac-green/10 border border-amajac-green/20 rounded-lg p-4">
            <div class="text-2xl font-bold text-amajac-green">{{ stats.total }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total de Imagens</div>
          </div>
          <div class="bg-blue-100 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.categorias }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Categorias</div>
          </div>
          <div class="bg-orange-100 border border-orange-200 rounded-lg p-4 dark:bg-orange-900/20 dark:border-orange-800">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.ultima }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Última Adição</div>
          </div>
        </div>
      </div>

      <!-- Formulário -->
      <div v-if="showForm" class="mb-8">
        <AdminGaleriaForm
          :model-value="editingItem"
          @submit="handleSave"
          @cancel="closeForm"
        />
      </div>

      <!-- Tabela -->
      <AdminGaleriaTable
        :itens="itens"
        :loading="loading"
        :error="error"
        @edit="editItem"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminGaleria } from '../composables/useAdminGaleria'
import AdminGaleriaForm from '../components/AdminGaleriaForm.vue'
import AdminGaleriaTable from '../components/AdminGaleriaTable.vue'

// Estados
const showForm = ref(false)
const editingItem = ref(null)

const { 
  itens, 
  loading, 
  error, 
  getAll, 
  deleteItem 
} = useAdminGaleria()

// Estatísticas
const stats = computed(() => {
  const total = itens.value.length
  const categorias = [...new Set(itens.value.map(item => item.categoria))].length
  const ultima = itens.value[0] 
    ? new Date(itens.value[0].created_at).toLocaleDateString('pt-BR')
    : 'Nenhuma'
  
  return { total, categorias, ultima }
})

// Carregar itens
onMounted(() => {
  getAll({ order: 'created_at', ascending: false })
})

// Ações do formulário
const openForm = () => {
  editingItem.value = null
  showForm.value = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingItem.value = null
}

const handleSave = async (savedItem) => {
  if (savedItem) {
    await getAll({ order: 'created_at', ascending: false })
    closeForm()
  }
}

// Ações da tabela
const handleDelete = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta imagem da galeria?')) {
    await deleteItem(id)
    await getAll({ order: 'created_at', ascending: false })
  }
}
</script>