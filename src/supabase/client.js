// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validacao robusta das variaveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Variaveis de ambiente do Supabase nao configuradas corretamente'
  console.error('❌ ' + errorMessage)
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Definida' : 'Nao definida')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definida' : 'Nao definida')
  throw new Error(errorMessage)
}

// Checar se as URLs sao validas
if (!supabaseUrl.startsWith('https://')) {
  console.warn('⚠️  URL do Supabase pode estar mal formatada:', supabaseUrl)
}

// Configuracao otimizada do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'amajac-admin@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Log de inicializacao (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🚀 Supabase client inicializado:', {
    url: supabaseUrl?.substring(0, 20) + '...',
    hasKey: !!supabaseAnonKey,
    timestamp: new Date().toISOString()
  })
}

// Funcao auxiliar para checar conexao
export const testSupabaseConnection = async () => {
  try {
    // Tenta uma query simples para testar a conexao
    const { error } = await supabase.from('socios').select('id').limit(1) // ✅ Removida variável não usada

    if (error) {
      console.error('❌ Erro na conexao com Supabase:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }
    }

    console.log('✅ Conexao com Supabase estabelecida com sucesso')
    return {
      success: true,
      data: {
        connected: true,
        tablesAccessible: true
      }
    }
  } catch (error) {
    console.error('❌ Falha critica na conexao com Supabase:', error.message)
    return {
      success: false,
      error: {
        code: 'CONNECTION_FAILED',
        message: error.message,
        details: 'Falha na conexao com o servidor'
      }
    }
  }
}

// Funcao segura para queries
export const safeQuery = async (table, query = {}) => {
  try {
    // Validacao basica da tabela
    if (!table || typeof table !== 'string') {
      throw new Error('Nome da tabela e obrigatorio e deve ser uma string')
    }

    let supabaseQuery = supabase.from(table).select(query.select || '*')

    // Aplicar filtros se fornecidos
    if (query.filters && Array.isArray(query.filters)) {
      query.filters.forEach(filter => {
        if (filter && filter.operator && filter.column) {
          if (supabaseQuery[filter.operator]) {
            supabaseQuery = supabaseQuery[filter.operator](filter.column, filter.value)
          } else {
            console.warn(`⚠️ Operador nao suportado: ${filter.operator}`)
          }
        }
      })
    }

    // Aplicar ordenacao se fornecida
    if (query.order && query.order.column) {
      supabaseQuery = supabaseQuery.order(query.order.column, {
        ascending: query.order.ascending !== false
      })
    }

    // Aplicar paginacao se fornecida
    if (query.range && typeof query.range.from === 'number' && typeof query.range.to === 'number') {
      supabaseQuery = supabaseQuery.range(query.range.from, query.range.to)
    }

    // Aplicar limite se fornecido
    if (query.limit && typeof query.limit === 'number') {
      supabaseQuery = supabaseQuery.limit(query.limit)
    }

    const { data, error, count } = await supabaseQuery

    if (error) {
      console.error(`❌ Erro na query da tabela ${table}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        query: query
      })
      throw error
    }

    return {
      data,
      error: null,
      count: count || data?.length
    }
  } catch (error) {
    console.error(`❌ Erro na safeQuery para tabela ${table}:`, error)
    return {
      data: null,
      error,
      count: 0
    }
  }
}

// Funcao para checar autenticacao do usuario
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('❌ Erro ao obter usuario atual:', error)
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error) {
    console.error('❌ Erro inesperado ao obter usuario:', error)
    return { user: null, error }
  }
}

// Funcao para checar se o usuario e admin
export const isUserAdmin = async () => {
  try {
    const { user, error } = await getCurrentUser()

    if (error || !user) {
      return false
    }

    // Buscar perfil do usuario para verificar role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role === 'admin'
  } catch (error) {
    console.error('❌ Erro ao verificar role do usuario:', error)
    return false
  }
}

// Exportacao padrao
export default supabase