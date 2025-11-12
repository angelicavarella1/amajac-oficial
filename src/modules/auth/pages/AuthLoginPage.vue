<!-- 
 Página de Login Administrativo
 - Autenticação com Supabase Auth
 - Redirecionamento para dashboard após login
 - Proteção contra acesso direto quando já autenticado
-->
<template>
  <div class="auth-login-page flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="mx-auto bg-amajac-green w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Área Administrativa</h1>
        <p class="text-gray-600 dark:text-gray-400">AMAJAC — Associação de Moradores e Amigos de Itaipuaçu</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Erro -->
          <div v-if="error" class="p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- E-mail -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autofocus
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amajac-green focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <!-- Botão -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-amajac-green hover:bg-amajac-green-hover text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amajac-green focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 transition-colors"
          >
            <span v-if="loading">
              <svg class="inline h-5 w-5 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
            <span v-else>Entrar</span>
          </button>
        </form>

        <!-- Link para site público -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <a
            href="/"
            class="text-sm text-amajac-green hover:text-amajac-green-hover font-medium"
          >
            ← Voltar ao site institucional
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/core/utils/supabaseClient.js'

const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

// Verifica se já está logado ao montar
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession() 
  if (session) {
    // ✓ CORREÇÃO: nome da rota como string válida
    await router.push({ name: 'admin-dashboard' })
  }
})

const handleLogin = async () => {
  if (!form.email || !form.password) {
    error.value = 'Preencha todos os campos.'
    return
  }

  loading.value = true
  error.value = null

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        error.value = 'E-mail ou senha incorretos.'
      } else {
        error.value = 'Erro ao fazer login. Tente novamente.'
      }
      return
    }

    // Redireciona após login
    const redirect = route.query.redirect || '/admin/dashboard'
    await router.push(redirect)
  } catch (err) {
    console.error('[AuthLoginPage] Erro:', err)
    error.value = 'Erro inesperado. Tente novamente mais tarde.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-login-page {
  --amajac-green: #2E7D32;
  --amajac-green-hover: #256a2a;
}

.text-amajac-green { color: var(--amajac-green); }
.bg-amajac-green { background-color: var(--amajac-green); }
.bg-amajac-green-hover:hover { background-color: var(--amajac-green-hover); }
.focus:ring-amajac-green:focus {
  --tw-ring-color: var(--amajac-green);
}
</style>