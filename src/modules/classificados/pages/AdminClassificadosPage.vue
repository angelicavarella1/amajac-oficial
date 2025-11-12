<template>
  <div class="admin-classificados-page min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gerenciar Classificados
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gerencie todos os classificados do sistema
        </p>
      </div>

      <!-- Botão Adicionar -->
      <div class="mb-6 flex justify-between items-center">
        <button
          @click="adicionarClassificado"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <i class="mdi mdi-plus"></i>
          Adicionar Classificado
        </button>

        <!-- Filtros Rápidos -->
        <div class="flex gap-2">
          <button
            @click="filtrarPorStatus('todos')"
            :class="statusButtonClass('todos')"
          >
            Todos
          </button>
          <button
            @click="filtrarPorStatus('pendentes')"
            :class="statusButtonClass('pendentes')"
          >
            Pendentes
          </button>
          <button
            @click="filtrarPorStatus('ativos')"
            :class="statusButtonClass('ativos')"
          >
            Ativos
          </button>
        </div>
      </div>

      <!-- Tabela -->
      <AdminClassificadosTable
        :classificados="classificadosFiltrados"
        :loading="loading"
        :error="error"
        @edit="editItem"
        @delete="handleDeleteClassificado"
        @toggle-status="toggleStatus"
        @export-data="exportarDados"
      />

      <!-- Modal de Edição/Criação -->
      <ClassificadoFormModal
        v-if="mostrarModal"
        :classificado="classificadoEditando"
        :modo="modoModal"
        @salvar="salvarClassificado"
        @fechar="fecharModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminClassificados } from '../composables/useAdminClassificados'
import AdminClassificadosTable from '../components/AdminClassificadosTable.vue'
import ClassificadoFormModal from '../components/ClassificadoFormModal.vue'

const { 
  classificados, 
  loading, 
  error, 
  fetchClassificadosAdmin, 
  updateClassificado, 
  deleteClassificado: deleteClassificadoAPI,
  createClassificado 
} = useAdminClassificados()

// Estados do modal
const mostrarModal = ref(false)
const classificadoEditando = ref(null)
const modoModal = ref('criar')

// Filtros
const filtroStatus = ref('todos')

// Computed para classes dos botões de status
const statusButtonClass = (status) => {
  const baseClass = 'px-3 py-1 rounded-full text-sm transition-colors'
  const activeClass = filtroStatus.value === status 
    ? getActiveStatusClass(status)
    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  return baseClass + ' ' + activeClass
}

const getActiveStatusClass = (status) => {
  const classes = {
    todos: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    pendentes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    ativos: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status] || classes.todos
}

// Classificados filtrados
const classificadosFiltrados = computed(() => {
  if (filtroStatus.value === 'todos') return classificados.value
  if (filtroStatus.value === 'pendentes') return classificados.value.filter(c => !c.aprovado && c.ativo)
  if (filtroStatus.value === 'ativos') return classificados.value.filter(c => c.ativo && c.aprovado)
  return classificados.value
})

// Métodos
const adicionarClassificado = () => {
  classificadoEditando.value = null
  modoModal.value = 'criar'
  mostrarModal.value = true
}

const editItem = (classificado) => {
  classificadoEditando.value = { ...classificado }
  modoModal.value = 'editar'
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
  classificadoEditando.value = null
}

const salvarClassificado = async (dadosClassificado) => {
  try {
    if (modoModal.value === 'criar') {
      await createClassificado({
        ...dadosClassificado,
        ativo: true,
        aprovado: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } else {
      await updateClassificado(classificadoEditando.value.id, {
        ...dadosClassificado,
        updated_at: new Date().toISOString()
      })
    }
    
    fecharModal()
  } catch (err) {
    console.error('Erro ao salvar classificado:', err)
    alert('Erro ao salvar classificado. Tente novamente.')
  }
}

const handleDeleteClassificado = async (id) => {
  try {
    await deleteClassificadoAPI(id)
  } catch (err) {
    console.error('Erro ao deletar classificado:', err)
    alert('Erro ao deletar classificado. Tente novamente.')
  }
}

const toggleStatus = async ({ id, campo, valor }) => {
  try {
    const updates = { 
      [campo]: valor,
      updated_at: new Date().toISOString()
    }

    // Se está aprovando, setar data_aprovacao
    if (campo === 'aprovado' && valor) {
      updates.data_aprovacao = new Date().toISOString()
    } else if (campo === 'aprovado' && !valor) {
      updates.data_aprovacao = null
    }

    await updateClassificado(id, updates)
  } catch (err) {
    console.error('Erro ao atualizar status:', err)
    alert('Erro ao atualizar status. Tente novamente.')
  }
}

const filtrarPorStatus = (status) => {
  filtroStatus.value = status
}

const exportarDados = (dados) => {
  // Converter para CSV
  const headers = ['Título', 'Categoria', 'Anunciante', 'Telefone', 'Email', 'Bairro', 'Status', 'Data Criação']
  const csvData = dados.map(c => [
    c.titulo,
    c.categoria,
    c.nome_anunciante,
    c.telefone,
    c.email,
    c.bairro,
    c.ativo ? (c.aprovado ? 'Aprovado' : 'Pendente') : 'Inativo',
    new Date(c.created_at).toLocaleDateString('pt-BR')
  ])

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => '"' + field + '"').join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', 'classificados_' + new Date().toISOString().split('T')[0] + '.csv')
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Carregar dados ao montar a página
onMounted(() => {
  fetchClassificadosAdmin()
})
</script>

<style scoped>
.admin-classificados-page {
  --amajac-green: #2E7D32;
}
</style>