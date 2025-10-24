// src/admin/composables/useAuditoriaCompleta.js - VERSÃO OTIMIZADA
import { ref } from 'vue'
import { supabase } from '@/supabase'

export const useAuditoriaCompleta = () => {
  const loading = ref(false)
  const error = ref(null)

  const obterLogsAuditoria = async (filtros = {}) => {
    loading.value = true
    error.value = null

    try {
      console.log('🚀 Buscando logs OTIMIZADO...')
      
      // QUERY ÚNICA E RÁPIDA
      let query = supabase
        .from('admin_logs')
        .select('id, admin_id, created_at, action, table_name, row_id', 
                { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(200) // Limite menor para performance

      // FILTROS RÁPIDOS
      if (filtros.tabela && filtros.tabela !== 'all') {
        query = query.eq('table_name', filtros.tabela)
      }
      
      if (filtros.acao && filtros.acao !== 'all') {
        query = query.eq('action', filtros.acao)
      }

      // Filtro de período SIMPLES
      if (filtros.periodo && filtros.periodo !== 'all') {
        const dias = { today: 1, week: 7, month: 30 }[filtros.periodo] || 30
        const dataInicio = new Date()
        dataInicio.setDate(dataInicio.getDate() - dias)
        query = query.gte('created_at', dataInicio.toISOString())
      }

      const { data, error: supabaseError, count } = await query

      if (supabaseError) throw supabaseError

      console.log(`✅ ${data?.length || 0} logs carregados rapidamente`)
      
      return {
        logs: data || [],
        total: count || 0
      }

    } catch (err) {
      console.error('❌ Erro rápido:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const obterEstatisticasAuditoria = async (filtros = {}) => {
    try {
      console.log('📈 Estatísticas RÁPIDAS...')
      
      // QUERY ÚNICA para estatísticas
      let query = supabase
        .from('admin_logs')
        .select('action, table_name, created_at')

      // Mesmos filtros
      if (filtros.periodo && filtros.periodo !== 'all') {
        const dias = { today: 1, week: 7, month: 30 }[filtros.periodo] || 30
        const dataInicio = new Date()
        dataInicio.setDate(dataInicio.getDate() - dias)
        query = query.gte('created_at', dataInicio.toISOString())
      }

      if (filtros.tabela && filtros.tabela !== 'all') {
        query = query.eq('table_name', filtros.tabela)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) throw supabaseError

      // CÁLCULO RÁPIDO no cliente
      const statsAcoes = { INSERT: 0, UPDATE: 0, DELETE: 0 }
      const statsTabelas = {}
      let hoje = 0

      const hojeDate = new Date().toDateString()

      data?.forEach(log => {
        // Ações
        statsAcoes[log.action] = (statsAcoes[log.action] || 0) + 1
        
        // Tabelas
        statsTabelas[log.table_name] = (statsTabelas[log.table_name] || 0) + 1
        
        // Hoje
        if (new Date(log.created_at).toDateString() === hojeDate) {
          hoje++
        }
      })

      return {
        totalAcoes: data?.length || 0,
        statsAcoes,
        statsTabelas,
        hoje
      }

    } catch (err) {
      console.error('❌ Erro estatísticas rápidas:', err)
      return {
        totalAcoes: 0,
        statsAcoes: { INSERT: 0, UPDATE: 0, DELETE: 0 },
        statsTabelas: {},
        hoje: 0
      }
    }
  }

  return {
    loading,
    error,
    obterLogsAuditoria,
    obterEstatisticasAuditoria
  }
}