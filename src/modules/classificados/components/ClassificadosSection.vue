<template>
  <section 
    id="classificados-section"
    class="py-12 bg-gray-50 dark:bg-gray-900"
  >
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Classificados de Serviços
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Encontre os melhores prestadores de serviço da região. Entre em contato diretamente via WhatsApp.
        </p>
        <!-- ✅ Call-to-Action para Associação -->
        <div class="bg-amajac-green/10 border border-amajac-green/30 rounded-xl py-4 px-6 max-w-2xl mx-auto">
          <p class="text-amajac-green font-medium">
            📢 <strong>Você também presta serviço no bairro?</strong><br />
            Associe-se à AMAJAC e anuncie gratuitamente!
          </p>
          <router-link 
            to="/associacao" 
            class="mt-2 inline-block text-sm bg-amajac-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Quero me associar
          </router-link>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          v-for="categoria in categorias"
          :key="categoria.value"
          @click="mudarCategoria(categoria.value)"
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all duration-300',
            categoriaFiltro === categoria.value
              ? 'bg-amajac-green text-white shadow-md'
              : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
          ]"
        >
          <i :class="categoria.icon" class="mr-2"></i>
          {{ categoria.label }}
        </button>
      </div>

      <!-- Carregamento e erros -->
      <div v-if="loading && classificados.length === 0" class="text-center py-12">
        <i class="mdi mdi-loading mdi-spin text-amajac-green text-4xl mb-4"></i>
        <p class="text-gray-600 dark:text-gray-300">Carregando classificados...</p>
      </div>
      <div v-else-if="error" class="text-center py-12">
        <i class="mdi mdi-alert-circle-outline text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          @click="recarregar"
          class="mt-4 px-6 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
      <div v-else-if="classificados.length === 0" class="text-center py-12">
        <i class="mdi mdi-bullhorn-outline text-gray-400 text-4xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum classificado encontrado
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{ categoriaFiltro ? 'Nenhum serviço encontrado na categoria.' : 'Ainda não há classificados cadastrados.' }}
        </p>
      </div>

      <!-- ✅ USANDO ClassificadoCard.vue (agora com funcionalidade completa) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ClassificadoCard
          v-for="classificado in classificados"
          :key="classificado.id"
          :classificado="{
            ...classificado,
            anunciante: classificado.nome_anunciante,
            telefone: classificado.telefone,
            descricao: classificado.descricao,
            data: new Date(classificado.created_at).toLocaleDateString('pt-BR')
          }"
          @ver-detalhes="abrirDetalhes"
          @filtrar-categoria="mudarCategoria"
        />
      </div>

      <!-- Botão Carregar Mais -->
      <div v-if="hasMore && !loading" class="text-center mt-12">
        <button
          @click="carregarMais"
          class="px-8 py-3 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Carregar Mais Classificados
        </button>
      </div>
      <div v-if="loading && classificados.length > 0" class="text-center mt-8">
        <i class="mdi mdi-loading mdi-spin text-amajac-green text-2xl"></i>
      </div>

      <!-- Modal de Detalhes -->
      <ClassificadoDetalhes
        :mostrar="mostrarModalDetalhes"
        :classificado-id="classificadoSelecionadoId"
        @fechar="fecharModalDetalhes"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClassificados } from '../composables/useClassificados'
import ClassificadoCard from './ClassificadoCard.vue'
import ClassificadoDetalhes from './ClassificadoDetalhes.vue'

const { 
  classificados, 
  loading, 
  error, 
  hasMore, 
  fetchClassificados,
  resetPagination 
} = useClassificados()

const categoriaFiltro = ref(null)
const mostrarModalDetalhes = ref(false)
const classificadoSelecionadoId = ref(null)

const categorias = [
  { value: null, label: 'Todos', icon: 'mdi mdi-view-grid' },
  { value: 'jardinagem', label: 'Jardinagem', icon: 'mdi mdi-leaf' },
  { value: 'limpeza', label: 'Limpeza', icon: 'mdi mdi-broom' },
  { value: 'reparos', label: 'Reparos', icon: 'mdi mdi-tools' },
  { value: 'pintura', label: 'Pintura', icon: 'mdi mdi-format-paint' },
  { value: 'encanamento', label: 'Encanamento', icon: 'mdi mdi-pipe' },
  { value: 'eletrica', label: 'Elétrica', icon: 'mdi mdi-flash' },
  { value: 'construcao', label: 'Construção', icon: 'mdi mdi-hard-hat' },
  { value: 'informatica', label: 'Informática', icon: 'mdi mdi-laptop' },
  { value: 'transporte', label: 'Transporte', icon: 'mdi mdi-truck' },
  { value: 'outros', label: 'Outros', icon: 'mdi mdi-hammer-wrench' }
]

const mudarCategoria = (categoria) => {
  categoriaFiltro.value = categoria
  resetPagination()
  fetchClassificados(categoria, true)
}

const carregarMais = () => {
  fetchClassificados(categoriaFiltro.value)
}

const recarregar = () => {
  resetPagination()
  fetchClassificados(categoriaFiltro.value, true)
}

const abrirDetalhes = (id) => {
  classificadoSelecionadoId.value = id
  mostrarModalDetalhes.value = true
}

const fecharModalDetalhes = () => {
  mostrarModalDetalhes.value = false
  classificadoSelecionadoId.value = null
}

onMounted(() => {
  fetchClassificados(null, true)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>