// src/modules/base/composables/useCRUD.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useCRUD(tableName) {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Lista de tabelas que não têm a coluna updated_at
  const tablesWithoutUpdatedAt = ['galeria', 'mensagens_contato']

  const hasUpdatedAt = !tablesWithoutUpdatedAt.includes(tableName)

  const getAll = async (options = {}) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase.from(tableName).select('*')

      // Aplicar ordenação
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Aplicar filtros
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value)
          }
        })
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw new Error(`Erro ao buscar dados: ${supabaseError.message}`)
      }

      items.value = data || []
      return items.value
    } catch (err) {
      console.error(`[useCRUD] Erro ao buscar ${tableName}:`, err)
      error.value = `Erro ao carregar dados: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const getById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao buscar item: ${supabaseError.message}`)
      }

      return data
    } catch (err) {
      console.error(`[useCRUD] Erro ao buscar ${tableName} por ID:`, err)
      error.value = `Erro ao carregar item: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const create = async (itemData) => {
    loading.value = true
    error.value = null

    try {
      // Preparar dados para inserção
      const insertData = { 
        ...itemData, 
        created_at: new Date().toISOString()
      }

      // Adicionar updated_at apenas se a tabela tiver essa coluna
      if (hasUpdatedAt) {
        insertData.updated_at = new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from(tableName)
        .insert([insertData])
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao criar item: ${supabaseError.message}`)
      }

      return data
    } catch (err) {
      console.error(`[useCRUD] Erro ao criar ${tableName}:`, err)
      error.value = `Erro ao criar item: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const update = async (id, itemData) => {
    loading.value = true
    error.value = null

    try {
      // Preparar dados para atualização
      const updateData = { ...itemData }

      // Adicionar updated_at apenas se a tabela tiver essa coluna
      if (hasUpdatedAt) {
        updateData.updated_at = new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erro ao atualizar item: ${supabaseError.message}`)
      }

      return data
    } catch (err) {
      console.error(`[useCRUD] Erro ao atualizar ${tableName}:`, err)
      error.value = `Erro ao atualizar item: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const remove = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: supabaseError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (supabaseError) {
        throw new Error(`Erro ao excluir item: ${supabaseError.message}`)
      }

      // Remove da lista local
      items.value = items.value.filter(item => item.id !== id)
      return true
    } catch (err) {
      console.error(`[useCRUD] Erro ao excluir ${tableName}:`, err)
      error.value = `Erro ao excluir item: ${err.message}`
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove
  }
}