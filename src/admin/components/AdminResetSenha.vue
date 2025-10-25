<!-- src/admin/components/AdminResetSenha.vue - VERSÃO CORRIGIDA -->
<template>
  <div class="reset-password-container">
    <form @submit.prevent="handleResetPassword" class="reset-form">
      <h2>Redefinir Senha</h2>
      
      <div class="form-group">
        <label for="newPassword">Nova Senha</label>
        <input
          id="newPassword"
          v-model="newPassword"
          type="password"
          required
          minlength="6"
          placeholder="Digite sua nova senha"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          minlength="6"
          placeholder="Confirme sua nova senha"
        />
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Atualizando...' : 'Atualizar Senha' }}
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        Credenciais atualizadas com sucesso!
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminAuth } from '/src/admin/composables/useAdminAuth'

const { updatePassword, loading, error } = useAdminAuth()
const newPassword = ref('')
const confirmPassword = ref('')
const success = ref(false)

// Função segura para logging
const safeLogError = (operation, err) => {
  console.error(`Erro na operação ${operation}:`, {
    code: err?.code || 'unknown',
    message: err?.message ? err.message.substring(0, 100) : 'Erro desconhecido'
  })
}

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'As credenciais não coincidem'
    return
  }

  if (newPassword.value.length < 6) {
    error.value = 'A credencial deve ter pelo menos 6 caracteres'
    return
  }

  try {
    const result = await updatePassword(newPassword.value)
    if (result) {
      success.value = true
      newPassword.value = ''
      confirmPassword.value = ''
      error.value = ''
    }
  } catch (err) {
    safeLogError('reset_password_component', err)
    error.value = 'Erro ao atualizar credenciais. Tente novamente.'
  }
}
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.reset-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.success-message {
  color: #155724;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}
</style>