<!-- 
  Componente: ContatoSection.vue
  Propósito: Formulário público de contato da AMAJAC
  Envia dados para a tabela `mensagens_contato` no Supabase
  Estilo: AMAJAC (verde #2E7D32), dark mode, acessível, validação
-->
<template>
  <section
    id="contato"
    aria-labelledby="contato-title"
    class="contato-section py-12 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-12">
        <h2
          id="contato-title"
          class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Fale Conosco
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Entre em contato com a AMAJAC. Responderemos o mais breve possível.
        </p>
      </header>

      <form @submit.prevent="handleSubmit" class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <!-- Estado de sucesso -->
        <div v-if="success" class="p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg text-center">
          ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
        </div>

        <!-- Estado de erro -->
        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
          {{ error }}
        </div>

        <!-- Nome -->
        <div>
          <label for="nome" class="block text-gray-700 dark:text-gray-300 mb-2">Nome *</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
            :disabled="loading"
            aria-required="true"
          />
        </div>

        <!-- E-mail -->
        <div>
          <label for="email" class="block text-gray-700 dark:text-gray-300 mb-2">E-mail *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
            :disabled="loading"
            aria-required="true"
          />
        </div>

        <!-- Telefone -->
        <div>
          <label for="telefone" class="block text-gray-700 dark:text-gray-300 mb-2">Telefone (opcional)</label>
          <input
            id="telefone"
            v-model="form.telefone"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
            :disabled="loading"
          />
        </div>

        <!-- Assunto -->
        <div>
          <label for="assunto" class="block text-gray-700 dark:text-gray-300 mb-2">Assunto *</label>
          <input
            id="assunto"
            v-model="form.assunto"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
            :disabled="loading"
            aria-required="true"
          />
        </div>

        <!-- Mensagem -->
        <div>
          <label for="mensagem" class="block text-gray-700 dark:text-gray-300 mb-2">Mensagem *</label>
          <textarea
            id="mensagem"
            v-model="form.mensagem"
            required
            rows="5"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
            :disabled="loading"
            aria-required="true"
          ></textarea>
        </div>

        <!-- Botão -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-amajac-green hover:bg-amajac-green-hover text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amajac-green focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-70"
          aria-label="Enviar mensagem"
        >
          <span v-if="loading">
            <svg class="inline h-5 w-5 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
          <span v-else>Enviar Mensagem</span>
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useContato } from '../composables/useContato'

const { loading, error, success, enviar } = useContato()

const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: ''
})

const handleSubmit = async () => {
  try {
    await enviar(form)
  } catch (err) {
    // Erro já tratado no composable
  }
}
</script>

<style scoped>
.contato-section {
  --amajac-green: #2E7D32;
  --amajac-green-hover: #256a2a;
}
.bg-amajac-green { background-color: var(--amajac-green); }
.bg-amajac-green-hover:hover { background-color: var(--amajac-green-hover); }
.focus:ring-amajac-green:focus { 
  --tw-ring-color: var(--amajac-green);
}
</style>