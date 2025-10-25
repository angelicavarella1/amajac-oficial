<!-- src/admin/views/AdminEsqueciSenha.vue - VERSÃO CORRIGIDA -->
<template>
  <div class="forgot-password-page">
    <div class="container">
      <div class="card">
        <h1>Recuperar Senha</h1>
        <p>Digite seu email para receber o link de recuperação</p>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="seu@email.com"
            />
          </div>

          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Enviando...' : 'Enviar Link' }}
          </button>

          <div v-if="error" class="alert error">
            {{ error }}
          </div>

          <div v-if="success" class="alert success">
            Email enviado com sucesso! Verifique sua caixa de entrada.
          </div>
        </form>

        <div class="links">
          <router-link to="/admin/login" class="link">
            ← Voltar para o Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminAuth } from '/src/admin/composables/useAdminAuth'

const { adminResetPassword, loading, error } = useAdminAuth()
const email = ref('')
const success = ref(false)

// Função segura para logging
const safeLogError = (operation, err) => {
  console.error(`Erro na operação ${operation}:`, {
    code: err?.code || 'unknown',
    message: err?.message ? err.message.substring(0, 100) : 'Erro desconhecido'
  })
}

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Por favor, digite seu email'
    return
  }

  try {
    const result = await adminResetPassword(email.value)
    if (result) {
      success.value = true
      error.value = ''
    }
  } catch (err) {
    safeLogError('forgot_password', err)
    error.value = 'Erro ao enviar email. Tente novamente.'
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>