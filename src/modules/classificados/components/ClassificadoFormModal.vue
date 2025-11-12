<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ modo === 'criar' ? 'Adicionar Classificado' : 'Editar Classificado' }}
        </h2>
        <button
          @click="$emit('fechar')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="salvar" class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Título -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <input
              v-model="form.titulo"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Digite o título do classificado"
            >
          </div>

          <!-- Descrição -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              v-model="form.descricao"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Descreva o serviço oferecido"
            ></textarea>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              v-model="form.categoria"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione uma categoria</option>
              <option value="jardinagem">Jardinagem</option>
              <option value="limpeza">Limpeza</option>
              <option value="reparos">Reparos</option>
              <option value="pintura">Pintura</option>
              <option value="encanamento">Encanamento</option>
              <option value="eletrica">Elétrica</option>
              <option value="construcao">Construção</option>
              <option value="informatica">Informática</option>
              <option value="transporte">Transporte</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <!-- Telefone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone *
            </label>
            <input
              v-model="form.telefone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="(11) 99999-9999"
            >
          </div>

          <!-- Nome do Anunciante -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Anunciante *
            </label>
            <input
              v-model="form.nome_anunciante"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nome completo"
            >
          </div>

          <!-- Bairro -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bairro *
            </label>
            <input
              v-model="form.bairro"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Bairro de atuação"
            >
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amajac-green focus:border-amajac-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="email@exemplo.com"
            >
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            class="flex-1 bg-amajac-green hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {{ modo === 'criar' ? 'Criar Classificado' : 'Salvar Alterações' }}
          </button>
          <button
            type="button"
            @click="$emit('fechar')"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  classificado: {
    type: Object,
    default: null
  },
  modo: {
    type: String,
    default: 'criar'
  }
})

const emit = defineEmits(['salvar', 'fechar'])

// Formulário
const form = ref({
  titulo: '',
  descricao: '',
  categoria: '',
  telefone: '',
  nome_anunciante: '',
  bairro: '',
  email: ''
})

// Resetar formulário quando o modal abrir
watch(() => props.mostrar, (novoValor) => {
  if (novoValor) {
    if (props.classificado && props.modo === 'editar') {
      // Preencher formulário com dados existentes
      form.value = { ...props.classificado }
    } else {
      // Resetar formulário para criação
      form.value = {
        titulo: '',
        descricao: '',
        categoria: '',
        telefone: '',
        nome_anunciante: '',
        bairro: '',
        email: ''
      }
    }
  }
})

// Salvar classificado
const salvar = () => {
  emit('salvar', form.value)
}
</script>