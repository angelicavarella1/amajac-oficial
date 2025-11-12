// src/modules/noticias/composables/useAdminNoticias.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useAdminNoticias() {
  const noticias = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getAll = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('noticias')
        .select('*')

      // Aplicar filtros
      if (filters.ativo !== undefined) {
        query = query.eq('ativo', filters.ativo)
      }
      if (filters.destaque !== undefined) {
        query = query.eq('destaque', filters.destaque)
      }
      if (filters.rascunho !== undefined) {
        query = query.eq('rascunho', filters.rascunho)
      }
      if (filters.search) {
        query = query.or(`titulo.ilike.%${filters.search}%,resumo.ilike.%${filters.search}%,conteudo.ilike.%${filters.search}%`)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw new Error(`Erro ao buscar notícias: ${supabaseError.message}`)
      }

      noticias.value = data || []
      return noticias.value
    } catch (err) {
      console.error('[useAdminNoticias] Erro:', err)
      error.value = `Erro ao carregar notícias: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const createNoticia = async (noticiaData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .insert([{ 
          ...noticiaData, 
          created_at: new Date(), 
          updated_at: new Date(),
          visualizacoes: 0 
        }])
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao criar notícia: ${supabaseError.message}`)
      }

      noticias.value.unshift(data)
      return data
    } catch (err) {
      console.error('[useAdminNoticias] Erro ao criar:', err)
      error.value = `Erro ao criar notícia: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const updateNoticia = async (id, noticiaData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .update({ ...noticiaData, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao atualizar notícia: ${supabaseError.message}`)
      }

      // Atualiza na lista local
      const index = noticias.value.findIndex(item => item.id === id)
      if (index !== -1) {
        noticias.value[index] = data
      }

      return data
    } catch (err) {
      console.error('[useAdminNoticias] Erro ao atualizar:', err)
      error.value = `Erro ao atualizar notícia: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteNoticia = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: supabaseError } = await supabase
        .from('noticias')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        throw new Error(`Erro ao excluir notícia: ${supabaseError.message}`)
      }

      // Remove da lista local
      noticias.value = noticias.value.filter(item => item.id !== id)
      return true
    } catch (err) {
      console.error('[useAdminNoticias] Erro ao excluir:', err)
      error.value = `Erro ao excluir notícia: ${err.message}`
      return false
    } finally {
      loading.value = false
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .update({ 
          ativo: !currentStatus,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao alterar status: ${supabaseError.message}`)
      }

      // Atualiza na lista local
      const index = noticias.value.findIndex(item => item.id === id)
      if (index !== -1) {
        noticias.value[index] = data
      }

      return data
    } catch (err) {
      console.error('[useAdminNoticias] Erro ao alterar status:', err)
      error.value = `Erro ao alterar status: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const toggleDestaque = async (id, currentDestaque) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .update({ 
          destaque: !currentDestaque,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao alterar destaque: ${supabaseError.message}`)
      }

      // Atualiza na lista local
      const index = noticias.value.findIndex(item => item.id === id)
      if (index !== -1) {
        noticias.value[index] = data
      }

      return data
    } catch (err) {
      console.error('[useAdminNoticias] Erro ao alterar destaque:', err)
      error.value = `Erro ao alterar destaque: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const publicarRascunho = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .update({ 
          ativo: true,
          rascunho: false,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao publicar rascunho: ${supabaseError.message}`)
      }

      // Atualiza na lista local
      const index = noticias.value.findIndex(item => item.id === id)
      if (index !== -1) {
        noticias.value[index] = data
      }

      return data
    } catch (err) {
      console.error('[useAdminNoticias] Erro ao publicar rascunho:', err)
      error.value = `Erro ao publicar rascunho: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // Estados reativos
    loading,
    error,
    noticias,

    // Métodos
    getAll,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    toggleStatus,
    toggleDestaque,
    publicarRascunho
  }
}