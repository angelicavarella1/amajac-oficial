import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'

export const useMensagensStore = defineStore('mensagens', {
  state: () => ({
    mensagens: [],
    mensagemSelecionada: null,
    loading: false,
    error: null
  }),

  actions: {
    async carregarMensagens() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('mensagens_contato')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        this.mensagens = data
      } catch (error) {
        this.error = error.message
        console.error('Erro ao carregar mensagens:', error)
      } finally {
        this.loading = false
      }
    },

    async carregarMensagem(id) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('mensagens_contato')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        this.mensagemSelecionada = data
        return data
      } catch (error) {
        this.error = error.message
        console.error('Erro ao carregar mensagem:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async marcarComoLida(id) {
      try {
        const { error } = await supabase
          .from('mensagens_contato')
          .update({ lida: true })
          .eq('id', id)

        if (error) throw error

        const mensagem = this.mensagens.find(m => m.id === id)
        if (mensagem) {
          mensagem.lida = true
        }
        
        if (this.mensagemSelecionada && this.mensagemSelecionada.id === id) {
          this.mensagemSelecionada.lida = true
        }
      } catch (error) {
        console.error('Erro ao marcar mensagem como lida:', error)
        throw error
      }
    },

    async deletarMensagem(id) {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await supabase
          .from('mensagens_contato')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.mensagens = this.mensagens.filter(m => m.id !== id)
      } catch (error) {
        this.error = error.message
        console.error('Erro ao excluir mensagem:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    getMensagensNaoLidas() {
      return this.mensagens.filter(m => !m.lida)
    },

    clearError() {
      this.error = null
    }
  }
})