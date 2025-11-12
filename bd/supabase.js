import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para os classificados
export const classificadosAPI = {
  // Buscar classificados com paginação
  async getClassificados({ page = 0, pageSize = 12, categoria = null, ativo = true, aprovado = true }) {
    let query = supabase
      .from('classificados')
      .select(`
        id,
        titulo,
        descricao,
        categoria,
        telefone,
        nome_anunciante,
        bairro,
        imagem_url,
        email,
        cpf,
        ativo,
        aprovado,
        data_aprovacao,
        created_at,
        updated_at,
        avaliacoes_classificados(
          nota,
          comentario
        )
      `, { count: 'exact' })
      .eq('ativo', ativo)
      .eq('aprovado', aprovado)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error, count } = await query
    return { data, error, count }
  },

  // Buscar classificado por ID
  async getClassificadoById(id) {
    const { data, error } = await supabase
      .from('classificados')
      .select(`
        *,
        avaliacoes_classificados(
          id,
          nota,
          comentario,
          created_at,
          usuario_id
        )
      `)
      .eq('id', id)
      .single()

    return { data, error }
  },

  // Buscar classificados por categoria
  async getClassificadosPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('classificados')
      .select(`
        id,
        titulo,
        descricao,
        categoria,
        telefone,
        nome_anunciante,
        bairro,
        imagem_url,
        created_at,
        avaliacoes_classificados(
          nota,
          comentario
        )
      `)
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