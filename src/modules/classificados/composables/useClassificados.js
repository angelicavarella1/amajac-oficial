// src/modules/classificados/composables/useClassificados.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

export function useClassificados() {
  const classificados = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)
  const page = ref(0)
  const PAGE_SIZE = 12

  // Buscar classificados com paginação (apenas ativos e aprovados)
  const fetchClassificados = async (categoriaFiltro = null, reset = false) => {
    if (reset) {
      classificados.value = []
      page.value = 0
      hasMore.value = true
    }
    if (!hasMore.value && !reset) return

    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('classificados')
        .select('*', { count: 'exact' })
        .eq('ativo', true)
        .eq('aprovado', true)
        .order('created_at', { ascending: false })
        .range(page.value * PAGE_SIZE, (page.value + 1) * PAGE_SIZE - 1)

      if (categoriaFiltro) {
        query = query.eq('categoria', categoriaFiltro)
      }

      const { data, error: supabaseError, count } = await query

      if (supabaseError) throw supabaseError

      const novosClassificados = data || []

      if (reset) {
        classificados.value = novosClassificados
      } else {
        classificados.value = [...classificados.value, ...novosClassificados]
      }

      hasMore.value = novosClassificados.length === PAGE_SIZE
      page.value += 1
    } catch (err) {
      console.error('[useClassificados] Erro:', err)
      error.value = 'Não foi possível carregar os classificados no momento.'
    } finally {
      loading.value = false
    }
  }

  // Buscar classificado por ID com detalhes completos E avaliações
  const getClassificadoDetalhes = async (id) => {
    try {
      // Buscar classificado
      const { data: classificadoData, error: classificadoError } = await supabase
        .from('classificados')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .eq('aprovado', true)
        .single()

      if (classificadoError) throw classificadoError

      // Buscar avaliações
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from('avaliacoes_classificados')
        .select('id, nota, comentario, nome_avaliador, email_avaliador, created_at')
        .eq('classificado_id', id)
        .order('created_at', { ascending: false })

      if (avaliacoesError && avaliacoesError.code !== 'PGRST116') {
        throw avaliacoesError
      }

      const avaliacoes = (avaliacoesData || []).map(a => ({
        ...a,
        data: new Date(a.created_at).toLocaleDateString('pt-BR')
      }))

      const notas = avaliacoes.map(a => a.nota)
      const media = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length) : 0

      return {
        ...classificadoData,
        mediAvaliacoes: notas.length > 0 ? parseFloat(media.toFixed(1)) : null,
        totalAvaliacoes: notas.length,
        avaliacoes
      }
    } catch (err) {
      console.error('[useClassificados] Erro ao buscar detalhes:', err)
      return null
    }
  }

  // Resetar paginação
  const resetPagination = () => {
    page.value = 0
    hasMore.value = true
    classificados.value = []
  }

  return {
    // Estados
    classificados,
    loading,
    error,
    hasMore,
    // Métodos
    fetchClassificados,
    getClassificadoDetalhes,
    resetPagination
  }
}