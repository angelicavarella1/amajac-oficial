import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    // ✅ CORREÇÃO: Permite 'admin' E 'super'
    isAdmin: (state) => state.user?.nivel === 'admin' || state.user?.nivel === 'super'
  },

  actions: {
    async signIn(email, password) {
      this.loading = true
      this.error = null
      
      // 🚨 Robustez: Validação inicial para evitar requisição vazia
      if (!email || !password) {
          throw new Error('Credenciais obrigatórias.');
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          // 💡 Melhoria: Remover espaços em branco no e-mail
          email: email.trim(), 
          password
        })

        if (error) {
            // 🚨 Tratamento de Erro Amigável (400 Bad Request/Credenciais Inválidas)
            if (error.message.includes('Invalid login credentials')) {
                throw new Error("Credenciais inválidas.");
            }
            // 🚨 Tratamento de E-mail Não Confirmado (Se aplicável)
            if (error.message.includes('Email not confirmed')) {
                throw new Error("E-mail não confirmado. Verifique sua caixa de entrada.");
            }
            throw error // Lança o erro original para outros problemas
        }

        // ----------------------------------------------------
        // Etapa 2: Checagem de Perfil e Permissão de Admin
        // ----------------------------------------------------

        // Define a lista de níveis permitidos
        const allowedLevels = ['admin', 'super']; 
        
        // Buscar o perfil na tabela admin_profiles
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('nivel')
          .eq('id', data.user.id)
          .single()

        // 🚨 Segurança: Se houver erro na busca do perfil ou o perfil não existir
        if (profileError || !profile) {
          await this.signOut()
          throw new Error('Acesso não autorizado. Perfil não encontrado ou erro de permissão.')
        }

        // ✅ Lógica de Permissão
        if (!allowedLevels.includes(profile.nivel)) {
          await this.signOut() // Desloga o usuário
          throw new Error('Acesso permitido apenas para administradores.')
        }

        // Adicionar o nível ao objeto user da store para o getter funcionar
        // 💡 Melhoria: Garantir que this.user contenha todas as chaves padrão e o nivel
        this.user = { 
            ...data.user, 
            nivel: profile.nivel 
        }
        this.session = data.session
        
        return data

      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      this.loading = true
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        this.user = null
        this.session = null
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        this.session = session
        const currentSupabaseUser = session?.user ?? null
        
        // Define a lista de níveis permitidos
        const allowedLevels = ['admin', 'super'];

        if (currentSupabaseUser) {
          // Verificar permissões
          const { data: profile, error: profileError } = await supabase
            .from('admin_profiles')
            .select('nivel')
            .eq('id', currentSupabaseUser.id)
            .single()

          // Se o perfil não for encontrado ou o nível não for permitido, deslogar.
          if (profileError || !profile || !allowedLevels.includes(profile.nivel)) {
            await this.signOut()
            return false
          }

          // Adicionar o nível ao objeto user da store
          this.user = { ...currentSupabaseUser, nivel: profile.nivel }
        } else {
            this.user = null
        }

        return !!this.user
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        return false
      }
    },

    clearError() {
      this.error = null
    }
  },

  persist: true
})