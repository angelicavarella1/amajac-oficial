// src/admin/composables/useRelatorio.js
import { adminApi } from '@/supabase/admin'

export function useRelatorio() {
  const loading = ref(false)
  const error = ref(null)

  const gerarRelatorio = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('📊 Iniciando geração de relatório...')
      
      // Usar Promise.all para buscar todos os dados simultaneamente
      const [
        eventosResponse, 
        noticiasResponse, 
        mensagensResponse, 
        colaboradoresResponse,
        classificadosResponse,
        avaliacoesResponse,
        galeriaResponse,
        sociosResponse
      ] = await Promise.all([
        adminApi.eventos.getAll(),
        adminApi.noticias.getAll(),
        adminApi.mensagens.getAll(),
        adminApi.colaboradores.getAll(),
        adminApi.classificados.getAll(),
        adminApi.avaliacoes.getAll(),
        adminApi.galeria.getAll(),
        adminApi.socios.getAll()
      ])

      // Verificar erros em cada resposta
      const responses = [
        eventosResponse, noticiasResponse, mensagensResponse, 
        colaboradoresResponse, classificadosResponse, avaliacoesResponse,
        galeriaResponse, sociosResponse
      ]
      
      for (const response of responses) {
        if (response.error) throw response.error
      }

      // Contar mensagens não lidas
      const mensagensNaoLidas = mensagensResponse.data?.filter(msg => !msg.lida)?.length || 0
      
      // Contar colaboradores ativos
      const colaboradoresAtivos = colaboradoresResponse.data?.filter(col => col.ativo)?.length || 0

      const relatorio = {
        success: true,
        data: {
          // Totais
          noticias: noticiasResponse.data?.length || 0,
          eventos: eventosResponse.data?.length || 0,
          mensagens: mensagensResponse.data?.length || 0,
          mensagensNaoLidas,
          colaboradores: colaboradoresResponse.data?.length || 0,
          colaboradoresAtivos,
          classificados: classificadosResponse.data?.length || 0,
          avaliacoes: avaliacoesResponse.data?.length || 0,
          galeria: galeriaResponse.data?.length || 0,
          socios: sociosResponse.data?.length || 0,
          
          // Resumo
          totalRegistros: 
            (noticiasResponse.data?.length || 0) +
            (eventosResponse.data?.length || 0) +
            (mensagensResponse.data?.length || 0) +
            (colaboradoresResponse.data?.length || 0) +
            (classificadosResponse.data?.length || 0) +
            (avaliacoesResponse.data?.length || 0) +
            (galeriaResponse.data?.length || 0) +
            (sociosResponse.data?.length || 0),
          
          // Timestamp
          geradoEm: new Date().toISOString(),
          
          // Dados brutos para detalhes (opcional)
          raw: {
            eventos: eventosResponse.data,
            noticias: noticiasResponse.data,
            mensagens: mensagensResponse.data,
            colaboradores: colaboradoresResponse.data,
            classificados: classificadosResponse.data,
            avaliacoes: avaliacoesResponse.data,
            galeria: galeriaResponse.data,
            socios: sociosResponse.data
          }
        }
      }
      
      console.log('✅ Relatório gerado com sucesso:', relatorio.data)
      return relatorio
      
    } catch (err) {
      console.error('❌ Erro ao gerar relatório:', err)
      error.value = err.message
      return { 
        success: false, 
        error: err.message 
      }
    } finally {
      loading.value = false
    }
  }

  const gerarRelatorioAuditoria = async (filtros = {}) => {
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        adminApi.auditoria.getLogs(filtros),
        adminApi.auditoria.getEstatisticas()
      ])

      if (logsResponse.error) throw logsResponse.error
      if (statsResponse.error) throw statsResponse.error

      // Calcular estatísticas
      const statsAcoes = {
        INSERT: statsResponse.data?.filter(log => log.acao === 'INSERT').length || 0,
        UPDATE: statsResponse.data?.filter(log => log.acao === 'UPDATE').length || 0,
        DELETE: statsResponse.data?.filter(log => log.acao === 'DELETE').length || 0
      }

      const statsTabelas = {}
      statsResponse.data?.forEach(log => {
        statsTabelas[log.tabela_afetada] = (statsTabelas[log.tabela_afetada] || 0) + 1
      })

      return {
        success: true,
        data: {
          logs: logsResponse.data || [],
          total: logsResponse.count || 0,
          estatisticas: {
            totalAcoes: statsResponse.data?.length || 0,
            statsAcoes,
            statsTabelas
          }
        }
      }
    } catch (err) {
      console.error('❌ Erro ao gerar relatório de auditoria:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    loading,
    error,
    gerarRelatorio,
    gerarRelatorioAuditoria
  }
}