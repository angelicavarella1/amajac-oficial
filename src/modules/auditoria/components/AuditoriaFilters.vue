<template>
  <div class="auditoria-filters mb-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <!-- Data Início -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data Início
          </label>
          <input
            v-model="filters.dataInicio"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Data Fim -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data Fim
          </label>
          <input
            v-model="filters.dataFim"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Ação -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ação
          </label>
          <select
            v-model="filters.acao"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="INSERT">Inserção</option>
            <option value="UPDATE">Atualização</option>
            <option value="DELETE">Exclusão</option>
          </select>
        </div>

        <!-- Tabela -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tabela
          </label>
          <select
            v-model="filters.tabela"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="associados">Associados</option>
            <option value="classificados">Classificados</option>
            <option value="eventos">Eventos</option>
            <option value="noticias">Notícias</option>
            <option value="parceiros">Parceiros</option>
            <option value="mensagens_contato">Mensagens</option>
          </select>
        </div>

        <!-- Admin ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Admin ID
          </label>
          <input
            v-model="filters.adminId"
            type="text"
            placeholder="UUID do admin"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Busca -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ID registro ou IP"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ loading ? 'Aplicando filtros...' : 'Use os filtros para refinar sua busca' }}
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('reset')"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :disabled="loading"
          >
            Limpar
          </button>
          <button
            @click="$emit('search')"
            class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            :disabled="loading"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['search', 'reset'])
</script>