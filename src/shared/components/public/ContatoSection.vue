<template>
  <section class="py-16 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Entre em Contato
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Estamos aqui para ajudar nossa comunidade
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Informacoes de Contato -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Informacoes de Contato
          </h3>
          
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-800 dark:text-white">Endereco</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  Rua Exemplo, 123<br/>
                  Bairro Centro<br/>
                  Cidade - Estado, CEP 12345-678
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-800 dark:text-white">Telefone</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  (11) 9999-9999
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-800 dark:text-white">Email</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  contato@amajac.org.br
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de Contato -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Envie uma Mensagem
          </h3>

          <form @submit.prevent="enviar" class="space-y-4">
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Completo *
              </label>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefone
              </label>
              <input
                id="telefone"
                v-model="form.telefone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label for="mensagem" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mensagem *
              </label>
              <textarea
                id="mensagem"
                v-model="form.mensagem"
                rows="5"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div v-if="success" class="p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-md">
              <p class="text-green-800 dark:text-green-200">
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </p>
            </div>

            <div v-if="error" class="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-md">
              <p class="text-red-800 dark:text-red-200">
                {{ error }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <span v-if="loading">Enviando...</span>
              <span v-else>Enviar Mensagem</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { usePublicContato } from '@/shared/composables/usePublicContato'

const { loading, error, success, enviarMensagem } = usePublicContato()

const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  mensagem: ''
})

const enviar = async () => {
  await enviarMensagem(form)
  if (success.value) {
    // Limpar formulario apos envio bem-sucedido
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
  }
}
</script>