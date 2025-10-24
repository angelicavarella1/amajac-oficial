<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        {{ isEdit ? 'Editar Classificado' : 'Novo Classificado' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ isEdit ? 'Atualize as informações do classificado' : 'Adicione um novo classificado à comunidade' }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form @submit.prevent="salvar" class="space-y-6">
        <div>
          <label for="titulo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título *
          </label>
          <input
            id="titulo"
            v-model="form.titulo"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Título do classificado"
          >
        </div>

        <div>
          <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição *
          </label>
          <textarea
            id="descricao"
            v-model="form.descricao"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descrição detalhada do classificado..."
          ></textarea>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label for="categoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              id="categoria"
              v-model="form.categoria"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione uma categoria</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="servicos">Serviços</option>
              <option value="emprego">Emprego</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label for="preco" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preço (R$)
            </label>
            <input
              id="preco"
              v-model="form.preco"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="0,00"
            >
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label for="anunciante" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Anunciante *
            </label>
            <input
              id="anunciante"
              v-model="form.anunciante"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nome do anunciante"
            >
          </div>

          <div>
            <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone *
            </label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="(11) 99999-9999"
            >
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="email@exemplo.com"
          >
        </div>

        <div v-if="isEdit" class="flex items-center">
          <input
            id="aprovado"
            v-model="form.aprovado"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
          >
          <label for="aprovado" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Classificado aprovado
          </label>
        </div>

        <div v-if="error" class="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-md">
          <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        </div>

        <div v-if="success" class="p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-md">
          <p class="text-green-800 dark:text-green-200">
            Classificado {{ isEdit ? 'atualizado' : 'criado' }} com sucesso!
          </p>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <RouterLink
            to="/admin/classificados"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancelar
          </RouterLink>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
            <span v-else>
              {{ isEdit ? 'Atualizar' : 'Criar' }} Classificado
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
  </template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// REMOVIDO: import AdminLayout from '../components/AdminLayout.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref(null)
const success = ref(false)

const isEdit = computed(() => route.name === 'AdminClassificadoEditar') // Corrigido para 'AdminClassificadoEditar' conforme seu router/index.js

const form = reactive({
  titulo: '',
  descricao: '',
  categoria: '',
  preco: null,
  anunciante: '',
  telefone: '',
  email: '',
  aprovado: false
})

// Carregar dados do classificado se for edição
onMounted(() => {
  if (isEdit.value && route.params.id) {
    carregarClassificado()
  }
})

const carregarClassificado = async () => {
  loading.value = true
  try {
    // Simular carregamento de dados
    setTimeout(() => {
      // Em uma implementação real, buscaria do Supabase
      Object.assign(form, {
        titulo: 'Classificado de Exemplo',
        descricao: 'Descrição do classificado...',
        categoria: 'venda',
        preco: 100.00,
        anunciante: 'João Silva',
        telefone: '(11) 99999-9999',
        email: 'joao@email.com',
        aprovado: true
      })
      loading.value = false
    }, 1000)
  } catch (err) {
    error.value = 'Erro ao carregar classificado'
    loading.value = false
  }
}

const salvar = async () => {
  loading.value = true
  error.value = null
  success.value = false

  try {
    // Simular salvamento
    setTimeout(() => {
      success.value = true
      loading.value = false
      
      // Redirecionar após sucesso
      setTimeout(() => {
        router.push('/admin/classificados')
      }, 1500)
    }, 1000)
  } catch (err) {
    error.value = 'Erro ao salvar classificado'
    loading.value = false
  }
}
</script>