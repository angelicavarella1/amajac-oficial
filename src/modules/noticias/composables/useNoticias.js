// src/modules/noticias/composables/useNoticias.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useNoticias() {
  const noticias = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchNoticias = async (limit = null) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('noticias')
        .select(`
          id,
          titulo,
          resumo,
          conteudo,
          imagem_url,
          imagem_alt,
          data_publicacao,
          autor,
          destaque,
          visualizacoes,
          categoria
        `)
        .eq('ativo', true)
        .eq('rascunho', false)
        .order('data_publicacao', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw new Error(`Erro ao buscar notícias: ${supabaseError.message}`)
      }

      noticias.value = data || []
    } catch (err) {
      console.error('[useNoticias] Erro:', err)
      error.value = 'Não foi possível carregar as notícias no momento.'
    } finally {
      loading.value = false
    }
  }

  const fetchNoticiaById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .select(`
          id,
          titulo,
          resumo,
          conteudo,
          imagem_url,
          imagem_alt,
          data_publicacao,
          autor,
          destaque,
          visualizacoes,
          categoria,
          ativo,
          rascunho
        `)
        .eq('id', id)
        .eq('ativo', true)
        .eq('rascunho', false)
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao buscar notícia: ${supabaseError.message}`)
      }

      if (data) {
        // Incrementa visualizações
        await supabase
          .from('noticias')
          .update({ visualizacoes: (data.visualizacoes || 0) + 1 })
          .eq('id', id)
      }

      return data
    } catch (err) {
      console.error('[useNoticias] Erro ao buscar notícia:', err)
      error.value = 'Não foi possível carregar a notícia.'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchNoticiasByCategoria = async (categoria, { limit = 4, excludeId = null } = {}) => {
    if (!categoria) return []

    try {
      let query = supabase
        .from('noticias')
        .select(`
          id,
          titulo,
          resumo,
          conteudo,
          imagem_url,
          imagem_alt,
          data_publicacao,
          autor,
          destaque,
          visualizacoes,
          categoria
        `)
        .eq('ativo', true)
        .eq('rascunho', false)
        .eq('categoria', categoria)
        .order('data_publicacao', { ascending: false })

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        console.warn('[useNoticias] Erro ao buscar relacionadas:', supabaseError.message)
        return []
      }

      return data || []
    } catch (err) {
      console.warn('[useNoticias] Falha ao buscar notícias por categoria:', err)
      return []
    }
  }

  return {
    noticias,
    loading,
    error,
    fetchNoticias,
    fetchNoticiaById,
    fetchNoticiasByCategoria
  }
}