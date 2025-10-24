import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useNoticiasStore = defineStore('noticias', {
  state: () => ({
    itens: [],
    loading: false,
    error: null
  }),

  getters: {
    noticias: (state) => state.itens || [],
    
    noticiasAtivas: (state) => {
      if (!state.itens || !Array.isArray(state.itens)) return []
      
      return state.itens
        .filter(noticia => {
          const isAtiva = noticia.ativo === true || noticia.ativo === 'true'
          return isAtiva
        })
        .sort((a, b) => {
          const dataA = new Date(a.data_publicacao || a.created_at)
          const dataB = new Date(b.data_publicacao || b.created_at)
          return dataB - dataA
        })
    },

    noticiasHome: (state) => {
      const noticias = state.noticiasAtivas
      return noticias.slice(0, 6)
    }
  },

  actions: {
    async carregarNoticias() {
      console.log('📰 Store: Iniciando carregamento de notícias...')
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('noticias')
          .select('*')
          .order('data_publicacao', { ascending: false })

        if (error) {
          console.error('❌ Store: Erro ao carregar notícias:', error)
          throw error
        }

        console.log(`✅ Store: ${data?.length || 0} notícias carregadas do banco`)
        
        if (data && data.length > 0) {
          data.forEach(noticia => {
            console.log(`   📄 "${noticia.titulo}" - ativo: ${noticia.ativo} - data: ${noticia.data_publicacao}`)
          })
        }

        this.itens = data || []
        
      } catch (error) {
        console.error('💥 Store: Erro crítico ao carregar notícias:', error)
        this.error = error.message
        this.itens = []
      } finally {
        this.loading = false
      }
    },

    async carregarNoticia(id) {
      try {
        const { data, error } = await supabase
          .from('noticias')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error('Erro ao carregar notícia:', error)
        throw error
      }
    },

    async criarNoticia(noticiaData) {
      try {
        console.log('📝 Store: Criando nova notícia...', noticiaData)
        
        const { data, error } = await supabase
          .from('noticias')
          .insert([{
            titulo: noticiaData.titulo,
            conteudo: noticiaData.conteudo,
            resumo: noticiaData.resumo,
            autor: noticiaData.autor || 'AMAJAC',
            imagem_url: noticiaData.imagem_url,
            data_publicacao: noticiaData.data_publicacao || new Date().toISOString(),
            ativo: noticiaData.ativo !== undefined ? noticiaData.ativo : true,
            destaque: noticiaData.destaque !== undefined ? noticiaData.destaque : false,
            visualizacoes: noticiaData.visualizacoes || 0
          }])
          .select()
          .single()

        if (error) {
          console.error('❌ Store: Erro ao criar notícia:', error)
          throw error
        }

        console.log('✅ Store: Notícia criada com sucesso:', data)
        
        // Adiciona a nova notícia ao state
        this.itens.unshift(data)
        
        return data
      } catch (error) {
        console.error('💥 Store: Erro crítico ao criar notícia:', error)
        throw error
      }
    },

    async atualizarNoticia(id, noticiaData) {
      try {
        console.log('📝 Store: Atualizando notícia...', id, noticiaData)
        
        const { data, error } = await supabase
          .from('noticias')
          .update({
            titulo: noticiaData.titulo,
            conteudo: noticiaData.conteudo,
            resumo: noticiaData.resumo,
            autor: noticiaData.autor,
            imagem_url: noticiaData.imagem_url,
            data_publicacao: noticiaData.data_publicacao,
            ativo: noticiaData.ativo,
            destaque: noticiaData.destaque,
            visualizacoes: noticiaData.visualizacoes,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('❌ Store: Erro ao atualizar notícia:', error)
          throw error
        }

        console.log('✅ Store: Notícia atualizada com sucesso:', data)
        
        // Atualiza a notícia no state
        const index = this.itens.findIndex(item => item.id === id)
        if (index !== -1) {
          this.itens[index] = data
        }
        
        return data
      } catch (error) {
        console.error('💥 Store: Erro crítico ao atualizar notícia:', error)
        throw error
      }
    },

    async excluirNoticia(id) {
      try {
        console.log('🗑️ Store: Excluindo notícia...', id)
        
        const { error } = await supabase
          .from('noticias')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('❌ Store: Erro ao excluir notícia:', error)
          throw error
        }

        console.log('✅ Store: Notícia excluída com sucesso')
        
        // Remove a notícia do state
        this.itens = this.itens.filter(item => item.id !== id)
        
      } catch (error) {
        console.error('💥 Store: Erro crítico ao excluir notícia:', error)
        throw error
      }
    },

    async alterarStatusNoticia(id, ativo) {
      try {
        console.log('🔄 Store: Alterando status da notícia...', id, ativo)
        
        const { data, error } = await supabase
          .from('noticias')
          .update({ 
            ativo: ativo,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('❌ Store: Erro ao alterar status:', error)
          throw error
        }

        console.log('✅ Store: Status alterado com sucesso:', data)
        
        // Atualiza o status no state
        const index = this.itens.findIndex(item => item.id === id)
        if (index !== -1) {
          this.itens[index].ativo = ativo
        }
        
        return data
      } catch (error) {
        console.error('💥 Store: Erro crítico ao alterar status:', error)
        throw error
      }
    },

    async uploadImagem(file) {
      try {
        console.log('📤 Store: Iniciando upload de imagem...', file.name)
        
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `noticias/${fileName}`

        const { data, error } = await supabase.storage
          .from('imagens')
          .upload(filePath, file)

        if (error) {
          console.error('❌ Store: Erro no upload da imagem:', error)
          throw error
        }

        // Obtém a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('imagens')
          .getPublicUrl(filePath)

        console.log('✅ Store: Imagem upload com sucesso:', publicUrl)
        return publicUrl

      } catch (error) {
        console.error('💥 Store: Erro crítico no upload da imagem:', error)
        throw error
      }
    }
  }
})