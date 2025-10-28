// src/admin/composables/useDashboardStats.js - VERSÃO CORRIGIDA E AUDITADA
import { ref } from 'vue'
import { supabase } from '@/supabase/client.js' // Importação direta do client.js

export const useDashboardStats = () => {
  const loading = ref(false)
  const error = ref(null)

  const obterEstatisticasDashboard = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🚀 Buscando estatísticas OTIMIZADAS...')

      // QUERY ÚNICA E RÁPIDA para todas as contagens
      const promises = [
        // Notícias ativas
        supabase
          .from('noticias')
          .select('*', { count: 'exact', head: true })
          .eq('ativo', true),

        // Eventos ativos
        supabase
          .from('eventos')
          .select('*', { count: 'exact', head: true })
          .eq('ativo', true),

        // Mensagens de contato (últimos 30 dias)
        supabase
          .from('mensagens_contato')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        // SÓCIOS ATIVOS - FILTRA POR status='ativo'
        supabase
          .from('socios')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ativo')
      ]

      // Executa todas as queries em paralelo
      const results = await Promise.all(promises)

      // Processa resultados
      const estatisticas = {
        noticias: results[0].count || 0,
        eventos: results[1].count || 0,
        mensagens: results[2].count || 0,
        associados: results[3].count || 0,

        // Trends simuladas
        noticiasTrend: 'up',
        noticiasTrendValue: '+5%',
        eventosTrend: 'neutral',
        eventosTrendValue: '0%',
        mensagensTrend: 'up',
        mensagensTrendValue: '+12%',
        associadosTrend: 'up',
        associadosTrendValue: '+2%'
      }

      console.log('✅ Estatísticas carregadas rapidamente:', estatisticas)
      return estatisticas

    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas:', err)
      error.value = err.message

      // Retorna valores padrão em caso de erro
      return {
        noticias: 0,
        eventos: 0,
        mensagens: 0,
        associados: 0,
        noticiasTrend: 'neutral',
        noticiasTrendValue: '0%',
        eventosTrend: 'neutral',
        eventosTrendValue: '0%',
        mensagensTrend: 'neutral',
        mensagensTrendValue: '0%',
        associadosTrend: 'neutral',
        associadosTrendValue: '0%'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    obterEstatisticasDashboard
  }
}
