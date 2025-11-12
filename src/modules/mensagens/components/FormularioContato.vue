<!-- 
  Componente: FormularioContato.vue
  Finalidade: Formulário público de contato com validação e envio seguro.
  - Usa composable useEnviarMensagem.js.
  - Validação em tempo real e ao submeter.
  - Mensagens de sucesso e erro com UX clara.
  - Acessível (labels, roles, foco).
  - Segue branding AMAJAC (#2E7D32).
-->

<template>
  <section
    id="contato"
    aria-labelledby="contato-title"
    class="contato-section py-16 px-4 transition-colors duration-300"
  >
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-12">
        <h2
          id="contato-title"
          class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          Fale Conosco
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Envie sua mensagem e entraremos em contato o mais breve possível.
        </p>
      </header>

      <form 
        @submit.prevent="handleSubmit" 
        class="space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        novalidate
      >
        <!-- Alertas -->
        <div v-if="success" 
             class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
             role="alert"
             aria-live="polite">
          <div class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-green-800 dark:text-green-300">
              Mensagem enviada com sucesso!
            </p>
            <p class="text-green-700 dark:text-green-400 text-sm mt-1">
              Entraremos em contato em breve.
            </p>
          </div>
        </div>

        <div v-if="error" 
             class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
             role="alert"
             aria-live="assertive">
          <div class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-red-800 dark:text-red-300">
              Erro ao enviar mensagem
            </p>
            <p class="text-red-700 dark:text-red-400 text-sm mt-1">
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Campos do Formulário -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nome -->
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome *
            </label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              required
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="errors.nome 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900' 
                : 'border-gray-300 dark:border-gray-600 focus:border-amajac-green focus:ring-2 focus:ring-amajac-green/20 dark:focus:ring-amajac-green/40'"
              :aria-invalid="errors.nome ? 'true' : 'false'"
              :aria-describedby="errors.nome ? 'nome-error' : null"
              @blur="validateField('nome')"
            />
            <p v-if="errors.nome" id="nome-error" class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.nome }}
            </p>
          </div>

          <!-- E-mail -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900' 
                : 'border-gray-300 dark:border-gray-600 focus:border-amajac-green focus:ring-2 focus:ring-amajac-green/20 dark:focus:ring-amajac-green/40'"
              :aria-invalid="errors.email ? 'true' : 'false'"
              :aria-describedby="errors.email ? 'email-error' : null"
              @blur="validateField('email')"
            />
            <p v-if="errors.email" id="email-error" class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <!-- Telefone -->
          <div class="md:col-span-2">
            <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone
            </label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="tel"
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-amajac-green focus:ring-2 focus:ring-amajac-green/20 dark:focus:ring-amajac-green/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="(11) 99999-9999"
            />
          </div>

          <!-- Assunto -->
          <div class="md:col-span-2">
            <label for="assunto" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assunto *
            </label>
            <input
              id="assunto"
              v-model="form.assunto"
              type="text"
              required
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="errors.assunto 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900' 
                : 'border-gray-300 dark:border-gray-600 focus:border-amajac-green focus:ring-2 focus:ring-amajac-green/20 dark:focus:ring-amajac-green/40'"
              :aria-invalid="errors.assunto ? 'true' : 'false'"
              :aria-describedby="errors.assunto ? 'assunto-error' : null"
              @blur="validateField('assunto')"
            />
            <p v-if="errors.assunto" id="assunto-error" class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.assunto }}
            </p>
          </div>

          <!-- Mensagem -->
          <div class="md:col-span-2">
            <label for="mensagem" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mensagem *
            </label>
            <textarea
              id="mensagem"
              v-model="form.mensagem"
              rows="6"
              required
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-200 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
              :class="errors.mensagem 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900' 
                : 'border-gray-300 dark:border-gray-600 focus:border-amajac-green focus:ring-2 focus:ring-amajac-green/20 dark:focus:ring-amajac-green/40'"
              :aria-invalid="errors.mensagem ? 'true' : 'false'"
              :aria-describedby="errors.mensagem ? 'mensagem-error' : null"
              @blur="validateField('mensagem')"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <p v-if="errors.mensagem" id="mensagem-error" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.mensagem }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 text-right">
                {{ form.mensagem.length }}/2000
              </p>
            </div>
          </div>
        </div>

        <!-- Botão de Envio -->
        <div class="text-center pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-4 bg-amajac-green text-white font-semibold rounded-lg hover:bg-amajac-green-hover focus:outline-none focus:ring-4 focus:ring-amajac-green/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] flex items-center justify-center gap-2 mx-auto"
            :aria-busy="loading"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-14.142l2.828 2.828m9.9 9.9l2.828 2.828" />
            </svg>
            <span>{{ loading ? 'Enviando...' : 'Enviar Mensagem' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useEnviarMensagem } from '../composables/useEnviarMensagem'

const { loading, error, success, enviar, reset } = useEnviarMensagem()
const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: ''
})
const errors = ref({})

// Validação individual por campo
const validateField = (fieldName) => {
  const newErrors = { ...errors.value }
  
  switch (fieldName) {
    case 'nome':
      if (!form.nome?.trim()) {
        newErrors.nome = 'Nome é obrigatório.'
      } else if (form.nome.trim().length < 2) {
        newErrors.nome = 'Nome deve ter pelo menos 2 caracteres.'
      } else {
        delete newErrors.nome
      }
      break
      
    case 'email':
      if (!form.email?.trim()) {
        newErrors.email = 'E-mail é obrigatório.'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'E-mail inválido.'
      } else {
        delete newErrors.email
      }
      break
      
    case 'assunto':
      if (!form.assunto?.trim()) {
        newErrors.assunto = 'Assunto é obrigatório.'
      } else if (form.assunto.trim().length < 5) {
        newErrors.assunto = 'Assunto deve ter pelo menos 5 caracteres.'
      } else {
        delete newErrors.assunto
      }
      break
      
    case 'mensagem':
      if (!form.mensagem?.trim()) {
        newErrors.mensagem = 'Mensagem é obrigatória.'
      } else if (form.mensagem.trim().length < 10) {
        newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres.'
      } else if (form.mensagem.trim().length > 2000) {
        newErrors.mensagem = 'Mensagem muito longa (máximo 2000 caracteres).'
      } else {
        delete newErrors.mensagem
      }
      break
  }
  
  errors.value = newErrors
}

// Validação completa do formulário
const validate = () => {
  validateField('nome')
  validateField('email')
  validateField('assunto')
  validateField('mensagem')
  return Object.keys(errors.value).length === 0
}

// Limpar formulário após sucesso
const clearForm = () => {
  form.nome = ''
  form.email = ''
  form.telefone = ''
  form.assunto = ''
  form.mensagem = ''
  errors.value = {}
}

// Submissão do formulário
const handleSubmit = async () => {
  if (!validate()) return

  try {
    const result = await enviar(form)
    if (result.success) {
      clearForm()
      // Resetar estados após 5 segundos
      setTimeout(() => {
        reset()
      }, 5000)
    }
  } catch (err) {
    // Erro já tratado no composable
  }
}

// Watch para validação em tempo real (opcional)
watch(() => form.mensagem, (newValue) => {
  if (newValue.length > 2000) {
    validateField('mensagem')
  }
})
</script>

<style scoped>
.contato-section {
  --amajac-green: #2E7D32;
  --amajac-green-hover: #256a2a;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.dark .contato-section {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
}

/* Melhorias de acessibilidade para foco */
.contato-section input:focus,
.contato-section textarea:focus {
  outline: none;
}

/* Suporte para reduzir movimento */
@media (prefers-reduced-motion: reduce) {
  .contato-section * {
    transition: none !important;
    animation: none !important;
  }
}
</style>