// src/admin/composables/useAdminAuth.js - VERSÃO CORRIGIDA
import { ref } from 'vue'
import { supabase } from '/src/config/supabaseClient'
import { useUIStore } from '/src/stores/uiStore'

export function useAdminAuth() {
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // Função auxiliar para logging seguro
  const safeLogError = (operation, err) => {
    console.error(`Erro na operação ${operation}:`, {
      code: err?.code || 'unknown',
      message: err?.message ? err.message.substring(0, 100) : 'Erro desconhecido',
      name: err?.name || 'Error'
    })
  }

  const adminLogin = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        safeLogError('login', authError)
        error.value = 'Credenciais inválidas ou usuário não encontrado'
        uiStore.showToast('Falha no login. Verifique suas credenciais.', 'error')
        return null
      }

      uiStore.showToast('Login realizado com sucesso!', 'success')
      return data

    } catch (err) {
      safeLogError('login', err)
      error.value = 'Erro inesperado no sistema'
      uiStore.showToast('Erro temporário no sistema. Tente novamente.', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const adminSignUp = async (email, password, userData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (authError) {
        safeLogError('cadastro', authError)
        error.value = 'Erro ao criar conta'
        uiStore.showToast('Falha no cadastro. Tente novamente.', 'error')
        return null
      }

      uiStore.showToast('Conta criada com sucesso! Verifique seu email.', 'success')
      return data

    } catch (err) {
      safeLogError('cadastro', err)
      error.value = 'Erro inesperado no sistema'
      uiStore.showToast('Erro temporário no sistema. Tente novamente.', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const adminResetPassword = async (email) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (authError) {
        safeLogError('solicitacao_reset', authError)
        error.value = 'Erro ao solicitar recuperação'
        uiStore.showToast('Falha na solicitação. Verifique o email.', 'error')
        return false
      }

      uiStore.showToast('Email de recuperação enviado com sucesso!', 'success')
      return true

    } catch (err) {
      safeLogError('solicitacao_reset', err)
      error.value = 'Erro inesperado no sistema'
      uiStore.showToast('Erro temporário no sistema. Tente novamente.', 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) {
        safeLogError('atualizacao_credenciais', authError)
        error.value = 'Erro ao atualizar credenciais'
        uiStore.showToast('Falha na atualização. Tente novamente.', 'error')
        return false
      }

      uiStore.showToast('Credenciais atualizadas com sucesso!', 'success')
      return true

    } catch (err) {
      safeLogError('atualizacao_credenciais', err)
      error.value = 'Erro inesperado no sistema'
      uiStore.showToast('Erro temporário no sistema. Tente novamente.', 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        safeLogError('logout', error)
      }
    } catch (err) {
      safeLogError('logout', err)
    }
  }

  return {
    loading,
    error,
    adminLogin,
    adminSignUp,
    adminResetPassword,
    updatePassword,
    logout
  }
}