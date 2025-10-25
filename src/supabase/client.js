import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validação robusta das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Variáveis de ambiente do Supabase não configuradas corretamente'
  console.error('❌ ' + errorMessage)
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
    flowType: 'pkce'
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

// Função auxiliar para verificar conexão
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('socios').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso')
    return true
  } catch (error) {
    console.error('❌ Falha crítica na conexão com Supabase:', error.message)
    return false
  }
}

// Função segura para queries
export const safeQuery = async (table, query = {}) => {
  try {
    let supabaseQuery = supabase.from(table).select(query.select || '*')
    
    // Aplicar filtros se fornecidos
    if (query.filters) {
      query.filters.forEach(filter => {
        supabaseQuery = supabaseQuery[filter.operator](filter.column, filter.value)
      })
    }
    
    // Aplicar ordenação se fornecida
    if (query.order) {
      supabaseQuery = supabaseQuery.order(query.order.column, { 
        ascending: query.order.ascending !== false 
      })
    }
    
    // Aplicar paginação se fornecida
    if (query.range) {
      supabaseQuery = supabaseQuery.range(query.range.from, query.range.to)
    }
    
    const { data, error } = await supabaseQuery
    
    if (error) {
      console.error(`❌ Erro na query da tabela ${table}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        query: query
      })
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export default supabase