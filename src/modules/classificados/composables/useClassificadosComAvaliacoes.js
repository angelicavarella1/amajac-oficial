// src/modules/classificados/composables/useClassificadosComAvaliacoes.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

export function useClassificadosComAvaliacoes() {
  // Busca classificados com média de avaliações e total
  const fetchClassificadosComAvaliacoes = async (categoriaFiltro = null, limit = null) => {
    try {
      let query = supabase
        .from('classificados')
        .select(`
          *,
          avaliacoes_classificados!inner (
            nota,
            comentario,
            created_at
          )
        `, { count: 'exact' })
        .eq('ativo', true)
        .eq('aprovado', true)
        .order('created_at', { ascending: false })

      if (categoriaFiltro) {
        query = query.eq('categoria', categoriaFiltro)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error

      // Calcular média e total de avaliações
      const classificadosComAvaliacoes = data.map(c => {
        const notas = c.avaliacoes_classificados.map(a => a.nota)
        const media = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length) : 0
        return {
          ...c,
          mediaAvaliacoes: media,
          totalAvaliacoes: notas.length,
          avaliacoes: c.avaliacoes_classificados.map(a => ({
            ...a,
            data: new Date(a.created_at).toLocaleDateString('pt-BR')
          }))
        }
      })

      return classificadosComAvaliacoes
    } catch (err) {
      console.error('Erro ao buscar classificados com avaliações:', err)
      return []
    }
  }

  // Buscar um classificado com avaliações completas
  const getClassificadoDetalhes = async (id) => {
    try {
      const { data, error } = await supabase
        .from('classificados')
        .select(`
          *,
          avaliacoes_classificados!inner (
            nota,
            comentario,
            created_at
          )
        `)
        .eq('id', id)
        .eq('ativo', true)
        .eq('aprovado', true)
        .single()

      if (error) throw error

      const notas = data.avaliacoes_classificados.map(a => a.nota)
      const media = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length) : 0

      return {
        ...data,
        mediaAvaliacoes: media,
        totalAvaliacoes: notas.length,
        avaliacoes: data.avaliacoes_classificados.map(a => ({
          ...a,
          data: new Date(a.created_at).toLocaleDateString('pt-BR')
        }))
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes com avaliações:', err)
      return null
    }
  }

  return {
    fetchClassificadosComAvaliacoes,
    getClassificadoDetalhes
  }
}