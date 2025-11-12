// src/modules/eventos/composables/useAdminEventos.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'
import { useImageHandler } from '@/modules/base/composables/useImageHandler'

export function useAdminEventos() {
  const eventos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getAll = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('eventos')
        .select('*')
        .order('data_hora_evento', { ascending: false })

      if (err) throw err
      eventos.value = data || []
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
      error.value = 'Falha ao carregar eventos.'
    } finally {
      loading.value = false
    }
  }

  const imageHandler = useImageHandler('eventos')

  const createEvento = async (eventData) => {
    loading.value = true
    error.value = null
    try {
      // Validação de data e horário
      let data_hora_evento = null
      if (eventData.data_evento && eventData.horario) {
        const dataValida = /^\d{4}-\d{2}-\d{2}$/.test(eventData.data_evento)
        const horaValida = /^([01]\d|2[0-3]):([0-5]\d)$/.test(eventData.horario)
        if (dataValida && horaValida) {
          data_hora_evento = `${eventData.data_evento}T${eventData.horario}:00`
        }
      }

      const payload = {
        titulo: eventData.titulo.trim(),
        descricao: eventData.descricao.trim(),
        local: eventData.local.trim(),
        destaque: Boolean(eventData.destaque),
        ativo: Boolean(eventData.ativo),
        imagem_alt: eventData.imagem_alt?.trim() || `Evento: ${eventData.titulo}`,
        data_evento: eventData.data_evento,
        horario: eventData.horario,
        data_hora_evento
      }

      if (eventData.imagem_url) {
        payload.imagem_url = eventData.imagem_url
      }

      const { data, error: err } = await supabase
        .from('eventos')
        .insert(payload)
        .select()
        .single()

      if (err) throw err

      eventos.value.unshift(data)
      return data
    } catch (err) {
      console.error('Erro createEvento:', err)
      error.value = 'Erro ao criar evento: ' + (err.message || 'verifique data e horário')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateEvento = async (id, eventData) => {
    loading.value = true
    error.value = null
    try {
      let data_hora_evento = null
      if (eventData.data_evento && eventData.horario) {
        const dataValida = /^\d{4}-\d{2}-\d{2}$/.test(eventData.data_evento)
        const horaValida = /^([01]\d|2[0-3]):([0-5]\d)$/.test(eventData.horario)
        if (dataValida && horaValida) {
          data_hora_evento = `${eventData.data_evento}T${eventData.horario}:00`
        }
      }

      const payload = {
        titulo: eventData.titulo.trim(),
        descricao: eventData.descricao.trim(),
        local: eventData.local.trim(),
        destaque: Boolean(eventData.destaque),
        ativo: Boolean(eventData.ativo),
        imagem_alt: eventData.imagem_alt?.trim() || `Evento: ${eventData.titulo}`,
        data_evento: eventData.data_evento,
        horario: eventData.horario,
        data_hora_evento
      }

      if (eventData.imagem_url !== undefined) {
        payload.imagem_url = eventData.imagem_url
      }

      const { data, error: err } = await supabase
        .from('eventos')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err

      const index = eventos.value.findIndex(e => e.id === id)
      if (index !== -1) {
        eventos.value[index] = data
      }
      return data
    } catch (err) {
      console.error('Erro updateEvento:', err)
      error.value = 'Erro ao atualizar evento: ' + (err.message || 'verifique data e horário')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteEvento = async (id) => {
    loading.value = true
    error.value = null
    try {
      const evento = eventos.value.find(e => e.id === id)
      if (evento?.imagem_url) {
        await imageHandler.removeImage(evento.imagem_url)
      }

      const { error: err } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id)

      if (err) throw err

      eventos.value = eventos.value.filter(e => e.id !== id)
      return true
    } catch (err) {
      console.error('Erro deleteEvento:', err)
      error.value = 'Erro ao excluir evento.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    eventos,
    getAll,
    createEvento,
    updateEvento,
    deleteEvento
  }
}