import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

export function useAdminClassificados() {
  const classificados = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Buscar todos os classificados (para admin)
  const fetchClassificadosAdmin = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      classificados.value = data || []

    } catch (err) {
      console.error('[useAdminClassificados] Erro:', err)
      error.value = 'Não foi possível carregar os classificados no momento.'
    } finally {
      loading.value = false
    }
  }

  // Atualizar classificado
  const updateClassificado = async (id, updates) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .update(updates)
        .eq('id', id)
        .select()

      if (supabaseError) throw supabaseError

      // Atualizar localmente
      const index = classificados.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classificados.value[index] = { ...classificados.value[index], ...updates }
      }

      return data
    } catch (err) {
      console.error('[useAdminClassificados] Erro ao atualizar:', err)
      throw err
    }
  }

  // Deletar classificado
  const deleteClassificado = async (id) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      // Remover localmente
      classificados.value = classificados.value.filter(c => c.id !== id)

      return data
    } catch (err) {
      console.error('[useAdminClassificados] Erro ao deletar:', err)
      throw err
    }
  }

  // Criar classificado
  const createClassificado = async (classificadoData) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .insert([classificadoData])
        .select()

      if (supabaseError) throw supabaseError

      // Adicionar localmente
      if (data && data[0]) {
        classificados.value.unshift(data[0])
      }

      return data
    } catch (err) {
      console.error('[useAdminClassificados] Erro ao criar:', err)
      throw err
    }
  }

  return {
    // Estados
    classificados,
    loading,
    error,

    // Métodos
    fetchClassificadosAdmin,
    updateClassificado,
    deleteClassificado,
    createClassificado
  }
}