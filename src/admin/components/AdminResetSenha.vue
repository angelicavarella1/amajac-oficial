<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-2xl">A</span>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Nova Senha
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Digite sua nova senha
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetSenha">
        <div>
          <label for="password" class="sr-only">Nova Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
            placeholder="Nova senha"
          >
        </div>

        <div>
          <label for="confirmPassword" class="sr-only">Confirmar Senha</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
            placeholder="Confirmar senha"
          >
        </div>

        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                Senha alterada!
              </h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Sua senha foi alterada com sucesso.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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

        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Alterando...
            </span>
            <span v-else>Alterar Senha</span>
          </button>

          <RouterLink
            to="/admin/login"
            class="flex-1 flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
          >
            Voltar
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const password = ref('')
const confirmPassword = ref('')
const success = ref(false)

const handleResetSenha = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = false

    if (!password.value) {
      error.value = 'Por favor, digite a nova senha'
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'As senhas não coincidem'
      return
    }

    if (password.value.length < 6) {
      error.value = 'A senha deve ter pelo menos 6 caracteres'
      return
    }

    console.log('🔐 Alterando senha...')

    const { error: authError } = await supabase.auth.updateUser({
      password: password.value
    })

    if (authError) {
      console.error('❌ Erro ao alterar senha:', authError)
      throw authError
    }

    console.log('✅ Senha alterada com sucesso')
    success.value = true
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/admin/login')
    }, 2000)
    
  } catch (err) {
    console.error('❌ Erro completo:', err)
    error.value = err.message || 'Erro ao alterar senha'
  } finally {
    loading.value = false
  }
}
</script>