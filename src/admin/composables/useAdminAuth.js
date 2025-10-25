// src/admin/composables/useAdminAuth.js - VERSÃO CORRIGIDA
import { ref } from 'vue'
import { supabase } from '../../../supabase/client.js'
import { useUIStore } from '../../stores/uiStore.js'

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
      // Verificar se o Supabase está disponível
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado')
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        safeLogError('login', authError)
        
        // Mensagens de erro mais específicas
        if (authError.message.includes('Invalid login credentials')) {
          error.value = 'Credenciais inválidas'
          uiStore.showToast('Email ou senha incorretos.', 'error')
        } else if (authError.message.includes('Email not confirmed')) {
          error.value = 'Email não confirmado'
          uiStore.showToast('Confirme seu email antes de fazer login.', 'warning')
        } else {
          error.value = 'Credenciais inválidas ou usuário não encontrado'
          uiStore.showToast('Falha no login. Verifique suas credenciais.', 'error')
        }
        return null
      }

      // Verificar se o usuário tem permissão de admin
      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.warn('Erro ao buscar perfil do usuário:', profileError)
        }

        if (!profile || profile.role !== 'admin') {
          error.value = 'Sem permissão de administrador'
          uiStore.showToast('Acesso restrito a administradores.', 'error')
          await supabase.auth.signOut()
          return null
        }
      }

      uiStore.showToast('Login realizado com sucesso!', 'success')
      return data

    } catch (err) {
      safeLogError('login', err)
      error.value = err.message || 'Erro inesperado no sistema'
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
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado')
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            ...userData,
            role: 'admin'
          }
        }
      })

      if (authError) {
        safeLogError('cadastro', authError)
        
        if (authError.message.includes('User already registered')) {
          error.value = 'Usuário já cadastrado'
          uiStore.showToast('Este email já está em uso.', 'error')
        } else {
          error.value = 'Erro ao criar conta'
          uiStore.showToast('Falha no cadastro. Tente novamente.', 'error')
        }
        return null
      }

      uiStore.showToast('Conta criada com sucesso! Verifique seu email para confirmação.', 'success')
      return data

    } catch (err) {
      safeLogError('cadastro', err)
      error.value = err.message || 'Erro inesperado no sistema'
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
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado')
      }

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
      error.value = err.message || 'Erro inesperado no sistema'
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
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado')
      }

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
      error.value = err.message || 'Erro inesperado no sistema'
      uiStore.showToast('Erro temporário no sistema. Tente novamente.', 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (!supabase) {
        console.error('Supabase não disponível para logout')
        return
      }
      
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