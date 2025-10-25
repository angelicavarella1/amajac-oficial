// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validação robusta das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Variáveis de ambiente do Supabase não configuradas corretamente'
  console.error('❌ ' + errorMessage)
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Definida' : 'Não definida')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definida' : 'Não definida')
  throw new Error(errorMessage)
}

// Verificar se as URLs são válidas
if (!supabaseUrl.startsWith('https://')) {
  console.warn('⚠️  URL do Supabase pode estar mal formatada:', supabaseUrl)
}

// Configuração otimizada do cliente Supabase
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

// Log de inicialização (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🚀 Supabase client inicializado:', {
    url: supabaseUrl?.substring(0, 20) + '...',
    hasKey: !!supabaseAnonKey,
    timestamp: new Date().toISOString()
  })
}

// Função auxiliar para verificar conexão
export const testSupabaseConnection = async () => {
  try {
    // Tenta uma query simples para testar a conexão
    const { data, error } = await supabase.from('socios').select('id').limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', {
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
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso')
    return { 
      success: true, 
      data: { 
        connected: true,
        tablesAccessible: true
      }
    }
  } catch (error) {
    console.error('❌ Falha crítica na conexão com Supabase:', error.message)
    return { 
      success: false, 
      error: {
        code: 'CONNECTION_FAILED',
        message: error.message,
        details: 'Falha na conexão com o servidor'
      }
    }
  }
}

// Função segura para queries
export const safeQuery = async (table, query = {}) => {
  try {
    // Validação básica da tabela
    if (!table || typeof table !== 'string') {
      throw new Error('Nome da tabela é obrigatório e deve ser uma string')
    }

    let supabaseQuery = supabase.from(table).select(query.select || '*')
    
    // Aplicar filtros se fornecidos
    if (query.filters && Array.isArray(query.filters)) {
      query.filters.forEach(filter => {
        if (filter && filter.operator && filter.column) {
          if (supabaseQuery[filter.operator]) {
            supabaseQuery = supabaseQuery[filter.operator](filter.column, filter.value)
          } else {
            console.warn(`⚠️ Operador não suportado: ${filter.operator}`)
          }
        }
      })
    }
    
    // Aplicar ordenação se fornecida
    if (query.order && query.order.column) {
      supabaseQuery = supabaseQuery.order(query.order.column, { 
        ascending: query.order.ascending !== false 
      })
    }
    
    // Aplicar paginação se fornecida
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

// Função para verificar autenticação do usuário
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ Erro ao obter usuário atual:', error)
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (error) {
    console.error('❌ Erro inesperado ao obter usuário:', error)
    return { user: null, error }
  }
}

// Função para verificar se o usuário é admin
export const isUserAdmin = async () => {
  try {
    const { user, error } = await getCurrentUser()
    
    if (error || !user) {
      return false
    }
    
    // Buscar perfil do usuário para verificar role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    return profile?.role === 'admin'
  } catch (error) {
    console.error('❌ Erro ao verificar role do usuário:', error)
    return false
  }
}

// Exportação padrão
export default supabase