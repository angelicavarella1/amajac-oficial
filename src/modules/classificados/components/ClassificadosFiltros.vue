<!-- ClassificadosFiltros.vue - CORRIGIDO -->
<template>
  <div class="classificados-filtros mb-8">
    <!-- Filtro de Categorias -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Filtrar por:
        </label>
        <select
          :value="categoriaSelecionada"
          @change="mudarCategoria"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option 
            v-for="categoria in categoriasDisponiveis" 
            :key="categoria.value" 
            :value="categoria.value"
          >
            {{ categoria.label }}
          </option>
        </select>
      </div>

      <!-- Contador de resultados -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ classificados.length }} de {{ totalClassificados }} resultados
        <span v-if="categoriaSelecionada !== 'todas'">
          em {{ formatarCategoria(categoriaSelecionada) }}
        </span>
      </div>
    </div>

    <!-- Paginação -->
    <div v-if="mostrarPaginacao" class="flex justify-center items-center gap-2 mt-6">
      <!-- Botão Anterior -->
      <button
        @click="paginaAnterior"
        :disabled="paginaAtual === 1"
        class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i class="mdi mdi-chevron-left"></i>
      </button>

      <!-- Números das páginas -->
      <div class="flex gap-1">
        <button
          v-for="pagina in paginasParaExibir"
          :key="pagina"
          @click="irParaPagina(pagina)"
          :class="{
            'px-3 py-2 rounded-lg font-medium transition-colors': true,
            'bg-amajac-green text-white': pagina === paginaAtual,
            'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700': pagina !== paginaAtual
          }"
        >
          {{ pagina }}
        </button>
        
        <!-- Elipses se necessário -->
        <span 
          v-if="paginasParaExibir[paginasParaExibir.length - 1] < totalPaginas - 1"
          class="px-3 py-2 text-gray-500"
        >
          ...
        </span>
      </div>

      <!-- Botão Próximo -->
      <button
        @click="proximaPagina"
        :disabled="paginaAtual === totalPaginas"
        class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i class="mdi mdi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categoriasDisponiveis: {
    type: Array,
    default: () => []
  },
  categoriaSelecionada: {
    type: String,
    default: 'todas'
  },
  classificados: {
    type: Array,
    default: () => []
  },
  totalClassificados: {
    type: Number,
    default: 0
  },
  paginaAtual: {
    type: Number,
    default: 1
  },
  totalPaginas: {
    type: Number,
    default: 1
  },
  mostrarPaginacao: {
    type: Boolean,
    default: false
  },
  paginasParaExibir: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['mudar-categoria', 'ir-pagina', 'proxima-pagina', 'pagina-anterior'])

const mudarCategoria = (event) => {
  emit('mudar-categoria', event.target.value)
}

const irParaPagina = (pagina) => {
  emit('ir-pagina', pagina)
}

const proximaPagina = () => {
  emit('proxima-pagina')
}

const paginaAnterior = () => {
  emit('pagina-anterior')
}

const formatarCategoria = (categoria) => {
  const categoriasFormatadas = {
    jardinagem: 'Jardinagem',
    limpeza: 'Limpeza',
    reparos: 'Reparos Gerais',
    pintura: 'Pintura',
    encanamento: 'Encanamento',
    eletrica: 'Serviços Elétricos',
    construcao: 'Construção e Reforma',
    informatica: 'Informática e Internet',
    transporte: 'Transporte e Mudanças',
    outros: 'Outros',
    todas: 'Todas as Categorias'
  }
  return categoriasFormatadas[categoria] || categoria
}
</script>