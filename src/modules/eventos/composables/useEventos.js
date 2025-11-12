// src/modules/eventos/composables/useEventos.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useEventos() {
  const eventos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchEventos = async (limit = null) => {
    loading.value = true
    error.value = null

    try {
      const agora = new Date().toISOString()

      let query = supabase
        .from('eventos')
        .select(`
          id,
          titulo,
          descricao,
          data_evento,
          horario,
          local,
          imagem_url,
          imagem_alt,
          destaque
        `)
        .eq('ativo', true)
        .gte('data_hora_evento', agora)
        .order('data_hora_evento', { ascending: true })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw new Error(`Erro ao buscar eventos: ${supabaseError.message}`)
      }

      eventos.value = (data || []).map(row => {
        let dataHorario = 'Data não informada'
        if (row.data_evento) {
          const dia = new Date(row.data_evento).toLocaleDateString('pt-BR')
          const hora = row.horario ? ` às ${row.horario}` : ''
          dataHorario = `${dia}${hora}`
        }

        return {
          id: row.id,
          titulo: row.titulo?.trim() || 'Sem título',
          descricao: row.descricao?.trim() || '',
          dataHorario,
          local: row.local?.trim() || 'Local não informado',
          imagem_url: row.imagem_url || null,
          imagem_alt: row.imagem_alt?.trim() || `Evento: ${row.titulo || 'sem título'}`,
          destaque: Boolean(row.destaque)
        }
      })
    } catch (err) {
      console.error('[useEventos] Erro:', err)
      error.value = 'Não foi possível carregar os eventos.'
    } finally {
      loading.value = false
    }
  }

  return {
    eventos,
    loading,
    error,
    fetchEventos
  }
}