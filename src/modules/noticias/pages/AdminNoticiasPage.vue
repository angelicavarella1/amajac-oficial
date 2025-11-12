<template>
  <div class="admin-noticias-page p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">
            Gestão de Notícias
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie as notícias e artigos do site
          </p>
        </div>
        <button
          @click="openForm"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <i class="mdi mdi-plus"></i> Nova Notícia
        </button>
      </div>

      <!-- Formulário -->
      <div v-if="showForm" class="mb-8">
        <AdminNoticiasForm
          :model-value="editingItem"
          @submit="handleSave"
          @cancel="closeForm"
        />
      </div>

      <!-- Tabela de Notícias -->
      <AdminNoticiasTable
        :noticias="noticias"
        :loading="loading"
        :error="error"
        @edit="editItem"
        @delete="confirmDelete"
        @search="handleSearch"
        @filter="handleFilter"
        @toggle-status="toggleStatus"
        @toggle-destaque="toggleDestaque"
        @publicar="publicarRascunho"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminNoticias } from '../composables/useAdminNoticias.js'
import AdminNoticiasForm from '../components/AdminNoticiasForm.vue'
import AdminNoticiasTable from '../components/AdminNoticiasTable.vue'

// Estados
const showForm = ref(false)
const editingItem = ref(null)
const currentFilters = ref({})

const { 
  noticias, 
  loading, 
  error, 
  getAll, 
  deleteNoticia,
  toggleStatus: toggleStatusApi,
  toggleDestaque: toggleDestaqueApi,
  publicarRascunho: publicarRascunhoApi
} = useAdminNoticias()

// Carregar notícias ao montar
onMounted(() => {
  loadNoticias()
})

// Carregar notícias com filtros
const loadNoticias = async (filters = {}) => {
  await getAll(filters)
}

// Handlers de eventos
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
    await loadNoticias(currentFilters.value)
    closeForm()
  }
}

const confirmDelete = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta notícia?')) {
    const success = await deleteNoticia(id)
    if (success) {
      await loadNoticias(currentFilters.value)
    }
  }
}

const toggleStatus = async (id, currentStatus) => {
  const success = await toggleStatusApi(id, currentStatus)
  if (success) {
    await loadNoticias(currentFilters.value)
  }
}

const toggleDestaque = async (id, currentDestaque) => {
  const success = await toggleDestaqueApi(id, currentDestaque)
  if (success) {
    await loadNoticias(currentFilters.value)
  }
}

const publicarRascunho = async (id) => {
  const success = await publicarRascunhoApi(id)
  if (success) {
    await loadNoticias(currentFilters.value)
  }
}

const handleSearch = (searchTerm) => {
  currentFilters.value.search = searchTerm
  loadNoticias(currentFilters.value)
}

const handleFilter = (filterParams) => {
  currentFilters.value = { ...currentFilters.value, ...filterParams }
  loadNoticias(currentFilters.value)
}
</script>