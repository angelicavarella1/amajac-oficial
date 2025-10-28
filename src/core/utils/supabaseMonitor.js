// src/admin/utils/supabaseMonitor.js
import { supabase } from '@/supabase'

// Limites do plano gratuito
export const LIMITES_PLANO_GRATUITO = {
  disco: 500 * 1024 * 1024, // 500MB
  bandwidth: 5 * 1024 * 1024 * 1024, // 5GB
  linhas: 500000, // 500k linhas
  cpu: 2 // 2 horas/dia
}

export const obterUsoRealSupabase = async () => {
  try {
    // Nota: O Supabase não fornece API pública para métricas de uso
    // Estas são estimativas baseadas em queries
    
    const uso = {
      disco: await estimarUsoDisco(),
      linhas: await contarLinhasTodasTabelas(),
      bandwidth: await estimarBandwidth(),
      tabelasMaiores: await obterTabelasMaiores()
    }
    
    return uso
  } catch (error) {
    console.error('Erro ao obter uso do Supabase:', error)
    throw error
  }
}

const estimarUsoDisco = async () => {
  // Estimativa baseada no tamanho dos registros
  const tabelas = ['admin_logs', 'noticias', 'eventos', 'mensagens_contato', 'classificados']
  let totalBytes = 0
  
  for (const tabela of tabelas) {
    const { count } = await supabase
      .from(tabela)
      .select('*', { count: 'exact', head: true })
    
    // Estimativa: ~1KB por registro em média
    totalBytes += (count || 0) * 1024
  }
  
  return totalBytes
}

const contarLinhasTodasTabelas = async () => {
  const tabelas = ['admin_logs', 'noticias', 'eventos', 'mensagens_contato', 'classificados']
  let totalLinhas = 0
  
  for (const tabela of tabelas) {
    const { count } = await supabase
      .from(tabela)
      .select('*', { count: 'exact', head: true })
    
    totalLinhas += count || 0
  }
  
  return totalLinhas
}

const obterTabelasMaiores = async () => {
  const tabelas = ['admin_logs', 'noticias', 'eventos', 'mensagens_contato', 'classificados']
  const resultados = []
  
  for (const tabela of tabelas) {
    const { count } = await supabase
      .from(tabela)
      .select('*', { count: 'exact', head: true })
    
    if (count && count > 0) {
      resultados.push({
        nome: tabela,
        registros: count,
        tamanho: count * 1024 // Estimativa
      })
    }
  }
  
  return resultados.sort((a, b) => b.registros - a.registros).slice(0, 5)
}

const estimarBandwidth = async () => {
  // Bandwidth é difícil de estimar sem métricas do Supabase
  // Retorna uma estimativa conservadora
  return 500 * 1024 * 1024 // 500MB
}