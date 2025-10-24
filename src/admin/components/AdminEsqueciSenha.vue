<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-4">
          <div class="h-16 w-16 flex items-center justify-center rounded-full bg-primary-600 text-white text-2xl font-bold shadow-md">
            A
          </div>
        </div>

        <h1 class="text-3xl font-extrabold text-primary-600 dark:text-primary-400">AMAJAC</h1>
        <h2 class="mt-2 text-center text-xl font-semibold text-gray-900 dark:text-white">
          Recuperar Senha
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Digite seu email para receber o link de recuperação
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRecuperarSenha">
        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-check-circle text-green-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                Email enviado!
              </h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Verifique sua caixa de entrada para o link de recuperação.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Erro
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
            placeholder="Seu email administrativo"
          >
        </div>

        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Enviando...
            </span>
            <span v-else>
              <i class="fas fa-paper-plane mr-2"></i>
              Enviar Link
            </span>
          </button>

          <router-link
            to="/admin/login"
            class="flex-1 flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Voltar
          </router-link>
        </div>
      </form>

      <div class="text-center">
        <router-link
          to="/"
          class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <i class="fas fa-home mr-1"></i>
          Voltar para o site
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/client'

const loading = ref(false)
const error = ref('')
const email = ref('')
const success = ref(false)

const handleRecuperarSenha = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = false

    if (!email.value) {
      error.value = 'Por favor, digite seu email'
      return
    }

    console.log('📧 Enviando email de recuperação para:', email.value)

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: `${window.location.origin}/admin/reset-password`
      }
    )

    if (authError) {
      console.error('❌ Erro ao enviar email:', authError)
      throw authError
    }

    console.log('✅ Email de recuperação enviado com sucesso')
    success.value = true
    
  } catch (err) {
    console.error('❌ Erro completo:', err)
    error.value = err.message || 'Erro ao enviar email de recuperação. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>