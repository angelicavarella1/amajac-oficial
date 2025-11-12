// src/modules/associados/composables/useAdminAssociados.js
import { useCRUD } from '@/modules/base/composables/useCRUD'

/**
 * Composable padronizado para gestão de associados (Colaboradores - Parceiros Comerciais)
 * - Tabela: 'associados'
 * - Campos: nome, cpf, telefone, email, endereco, profissao, status
 * - Status esperados: 'pendente', 'ativo', 'inativo'
 */
export function useAdminAssociados() {
  const crud = useCRUD('associados')

  /**
   * Cria um novo associado
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  const createAssociado = async (data) => {
    // Garantir status padrão
    data.status = data.status || 'pendente'
    const novo = await crud.create(data)
    if (novo) crud.items.value.unshift(novo)
    return novo
  }

  /**
   * Atualiza um associado existente
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  const updateAssociado = async (id, data) => {
    const atualizado = await crud.update(id, data)
    if (atualizado) {
      const idx = crud.items.value.findIndex(item => item.id === id)
      if (idx !== -1) crud.items.value[idx] = atualizado
    }
    return atualizado
  }

  /**
   * Exclui um associado
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  const deleteAssociado = async (id) => {
    return await crud.remove(id)
  }

  /**
   * Filtra associados por status
   * @param {string} status - ex: 'ativo', 'pendente', 'inativo'
   * @returns {Array}
   */
  const getAssociadosByStatus = (status) => {
    return crud.items.value.filter(item => item.status === status)
  }

  return {
    // Estados
    loading: crud.loading,
    error: crud.error,
    associados: crud.items,

    // Métodos CRUD
    getAll: crud.getAll,
    getById: crud.getById,
    createAssociado,
    updateAssociado,
    deleteAssociado,

    // Métodos auxiliares
    getAssociadosByStatus
  }
}