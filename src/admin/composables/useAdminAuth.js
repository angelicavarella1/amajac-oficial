import { ref } from 'vue'
import { supabase } from '@/supabase/client' // Ajuste caso seu client esteja em outro path
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'

export function useAdminAuth() {
  const user = ref(null)
  const isAdmin = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()
  const router = useRouter()

  // 🔐 INICIALIZAR AUTH
  const inicializarAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
      
      if (user.value) {
        isAdmin.value = await verificarSeEhAdmin(user.value.id)
      }
      
      return { user: user.value, isAdmin: isAdmin.value }
    } catch (err) {
      console.error('❌ Erro ao inicializar auth:', err)
      error.value = err.message
      return { user: null, isAdmin: false }
    }
  }

  // 🔐 LOGIN
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      user.value = data.user
      isAdmin.value = await verificarSeEhAdmin(user.value.id)

      if (!isAdmin.value) {
        await logout()
        throw new Error('Acesso permitido apenas para administradores')
      }

      uiStore.showToast('Login realizado com sucesso!')
      return { success: true, user: data.user }
    } catch (err) {
      console.error('❌ Erro no login:', err)
      error.value = err.message
      uiStore.showToast(err.message, 'error')
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 🔐 LOGOUT
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      isAdmin.value = false

      uiStore.showToast('Logout realizado com sucesso!')
      router.push('/admin/login')
    } catch (err) {
      console.error('❌ Erro no logout:', err)
      error.value = err.message
      uiStore.showToast('Erro ao fazer logout', 'error')
    }
  }

  // 🔐 RECUPERAR SENHA
  const recuperarSenha = async (email) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      })

      if (authError) throw authError

      uiStore.showToast('Email de recuperação enviado!')
      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao recuperar senha:', err)
      error.value = err.message
      uiStore.showToast('Erro ao enviar email de recuperação', 'error')
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 🔐 ALTERAR SENHA
  const alterarSenha = async (newPassword) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) throw authError

      uiStore.showToast('Senha alterada com sucesso!')
      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao alterar senha:', err)
      error.value = err.message
      uiStore.showToast('Erro ao alterar senha', 'error')
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 🔐 VERIFICAR ACESSO ADMIN
  const verificarAcessoAdmin = async () => {
    if (!user.value) {
      await inicializarAuth()
    }
    
    if (!isAdmin.value) {
      router.push('/admin/login')
      return false
    }
    
    return true
  }

  // ✅ FUNÇÃO AUXILIAR: verifica na tabela admin_profiles
  const verificarSeEhAdmin = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao verificar admin:', error)
        return false
      }
      return !!data
    } catch (err) {
      console.error('Erro ao verificar admin:', err)
      return false
    }
  }

  return {
    user,
    isAdmin,
    loading,
    error,
    inicializarAuth,
    login,
    logout,
    recuperarSenha,
    alterarSenha,
    verificarAcessoAdmin
  }
}
