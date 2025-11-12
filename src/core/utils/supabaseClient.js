import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas')
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Criar instância única do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// funções auxiliares para os classificados
export const classificadosAPI = {
  // Buscar classificados com paginação
  async getClassificados({ page = 0, pageSize = 12, categoria = null, ativo = true, aprovado = true }) {
    let query = supabase
      .from('classificados')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (ativo !== null) query = query.eq('ativo', ativo)
    if (aprovado !== null) query = query.eq('aprovado', aprovado)
    if (categoria) query = query.eq('categoria', categoria)

    const { data, error, count } = await query
    return { data, error, count }
  },

  // Buscar classificado por ID
  async getClassificadoById(id) {
    const { data, error } = await supabase
      .from('classificados')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  },

  // Buscar classificados por categoria
  async getClassificadosPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('classificados')
      .select('*')
      .eq('ativo', true)
      .eq('aprovado', true)
      .eq('categoria', categoria)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Atualizar classificado
  async updateClassificado(id, updates) {
    const { data, error } = await supabase
      .from('classificados')
      .update(updates)
      .eq('id', id)

    return { data, error }
  },

  // Deletar classificado
  async deleteClassificado(id) {
    const { data, error } = await supabase
      .from('classificados')
      .delete()
      .eq('id', id)

    return { data, error }
  },

  // Criar classificado
  async createClassificado(classificadoData) {
    const { data, error } = await supabase
      .from('classificados')
      .insert([classificadoData])
      .select()

    return { data, error }
  }
}