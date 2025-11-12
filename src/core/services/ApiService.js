// src/core/services/ApiService.js
import { supabase } from '@/core/utils/supabaseClient'

/**
 * Serviço genérico para operações CRUD com tabelas do Supabase
 */
export class ApiService {
  /**
   * Cria um novo registro
   * @param {string} tableName
   * @param {Object} data
   * @returns {Promise<{ data: any, error: any }>}
   */
  static async create(tableName, data) {
    return await supabase.from(tableName).insert(data).select()
  }

  /**
   * Atualiza um registro por ID
   * @param {string} tableName
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<{ data: any, error: any }>}
   */
  static async update(tableName, id, data) {
    return await supabase.from(tableName).update(data).eq('id', id).select()
  }

  /**
   * Remove um registro por ID
   * @param {string} tableName
   * @param {string|number} id
   * @returns {Promise<{ error: any }>}
   */
  static async remove(tableName, id) {
    return await supabase.from(tableName).delete().eq('id', id)
  }

  /**
   * Busca todos os registros (com filtros opcionais)
   * @param {string} tableName
   * @param {Object} options - { order: 'created_at', limit: 10, filter: { campo: valor } }
   * @returns {Promise<{ data: any[], error: any }>}
   */
  static async getAll(tableName, options = {}) {
    let query = supabase.from(tableName).select('*')

    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options.order) {
      query = query.order(options.order, { ascending: false })
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    return await query
  }

  /**
   * Busca um registro por ID
   * @param {string} tableName
   * @param {string|number} id
   * @returns {Promise<{ data: any, error: any }>}
   */
  static async getById(tableName, id) {
    return await supabase.from(tableName).select('*').eq('id', id).single()
  }
}