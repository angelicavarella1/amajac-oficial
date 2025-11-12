<!-- src/modules/associados/pages/AdminAssociadosPage.vue -->
<template>
  <div class="admin-associados-page min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestão de Associados
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Administre os sócios da AMAJAC conforme o Estatuto Social.
        </p>
      </div>

      <!-- Botão Adicionar -->
      <div class="mb-6 flex justify-between items-center">
        <button
          @click="adicionarAssociado"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <i class="mdi mdi-plus"></i>
          Adicionar Sócio
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
            @click="filtrarPorStatus('ativos')"
            :class="statusButtonClass('ativos')"
          >
            Ativos
          </button>
          <button
            @click="filtrarPorStatus('pendentes')"
            :class="statusButtonClass('pendentes')"
          >
            Pendentes
          </button>
          <button
            @click="filtrarPorStatus('remido')"
            :class="statusButtonClass('remido')"
          >
            Remidos
          </button>
        </div>
      </div>

      <!-- Tabela -->
      <AdminAssociadosTable
        :associados="associadosFiltrados"
        :loading="loading"
        :error="error"
        @edit="editItem"
        @delete="handleDeleteAssociado"
        @aprovar-remido="aprovarRemido"
      />

      <!-- Modal de Edição/Criação -->
      <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <AdminAssociadosForm
          :model-value="associadoEditando"
          :modo="modoModal"
          @submit="salvarAssociado"
          @cancel="fecharModal"
        />
      </div>

      <!-- Modal de Avaliação de Sócio Remido -->
      <div v-if="mostrarModalAvaliacao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <AdminAvaliacaoRemido
          :associado="associadoParaAvaliar"
          @salvar="processarAvaliacaoRemido"
          @cancel="fecharModalAvaliacao"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminAssociados } from '../composables/useAdminAssociados'
import AdminAssociadosTable from '../components/AdminAssociadosTable.vue'
import AdminAssociadosForm from '../components/AdminAssociadosForm.vue'
import AdminAvaliacaoRemido from '../components/AdminAvaliacaoRemido.vue'

const {
  associados,
  loading,
  error,
  getAll, // ✓ CORREÇÃO: substitui fetchAssociadosAdmin por getAll
  updateAssociado,
  deleteAssociado: deleteAssociadoAPI
} = useAdminAssociados()

// Estados do modal
const mostrarModal = ref(false)
const associadoEditando = ref(null)
const modoModal = ref('criar')

const mostrarModalAvaliacao = ref(false)
const associadoParaAvaliar = ref(null)

// Filtros
const filtroStatus = ref('todos')

// Computed para classes dos botões de status
const statusButtonClass = (status) => {
  const baseClass = 'px-3 py-1 rounded-full text-sm transition-colors'
  const activeClass = filtroStatus.value === status
    ? getStatusClass(status)
    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  return baseClass + ' ' + activeClass
}

const getStatusClass = (status) => {
  const classes = {
    todos: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ativos: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pendentes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    remido: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return classes[status] || classes.todos
}

// Associados filtrados
const associadosFiltrados = computed(() => {
  if (filtroStatus.value === 'todos') return associados.value
  if (filtroStatus.value === 'ativos') return associados.value.filter(a => a.status === 'ativo')
  if (filtroStatus.value === 'pendentes') return associados.value.filter(a => a.status === 'pendente')
  if (filtroStatus.value === 'remido') return associados.value.filter(a => a.categoria === 'remido')
  return associados.value
})

// Métodos
const adicionarAssociado = () => {
  associadoEditando.value = null
  modoModal.value = 'criar'
  mostrarModal.value = true
}

const editItem = (associado) => {
  associadoEditando.value = { ...associado }
  modoModal.value = 'editar'
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
  associadoEditando.value = null
}

const salvarAssociado = async (dadosAssociado) => {
  try {
    if (modoModal.value === 'criar') {
      await createAssociado(dadosAssociado)
    } else {
      await updateAssociado(associadoEditando.value.id, dadosAssociado)
    }
    fecharModal()
  } catch (err) {
    console.error('Erro ao salvar associado:', err)
    alert('Erro ao salvar. Verifique os dados e tente novamente.')
  }
}

const handleDeleteAssociado = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este associado?')) return
  try {
    await deleteAssociadoAPI(id)
  } catch (err) {
    console.error('Erro ao deletar associado:', err)
    alert('Erro ao excluir. Tente novamente.')
  }
}

const aprovarRemido = (associado) => {
  associadoParaAvaliar.value = { ...associado }
  mostrarModalAvaliacao.value = true
}

const processarAvaliacaoRemido = async (resultado) => {
  try {
    await updateAssociado(associadoParaAvaliar.value.id, {
      status: resultado.aprovado ? 'ativo' : 'negado',
      categoria: resultado.aprovado ? 'remido' : 'associado',
      motivo_negativa_remido: resultado.motivo_negativa || null,
      observacoes_remido: resultado.observacoes || null
    })
    fecharModalAvaliacao()
  } catch (err) {
    console.error('Erro ao processar avaliação:', err)
    alert('Erro ao salvar avaliação. Tente novamente.')
  }
}

const fecharModalAvaliacao = () => {
  mostrarModalAvaliacao.value = false
  associadoParaAvaliar.value = null
}

const filtrarPorStatus = (status) => {
  filtroStatus.value = status
}

// Carregar dados ao montar a página
onMounted(() => {
  getAll() // ✓ CORREÇÃO: usa getAll() em vez de fetchAssociadosAdmin()
})
</script>

<style scoped>
.admin-associados-page {
  --amajac-green: #2E7D32;
}
</style>