// src/admin/composables/useRelatorio.js
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
// import { useUIStore } from\ '@/shared/stores/ui' // Descomente se for usar toast notifications

export function useRelatorio() {
  const loading = ref(false)
  const error = ref(null)
  // const uiStore = useUIStore(); // Descomente se for usar toast

  const gerarRelatorio = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('ðŸ“Š Iniciando geraÃ§Ã£o de relatÃ³rio...')

      // Usar Promise.all para buscar todos os dados simultaneamente - CHAMADAS DIRETAS AO SUPABASE
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
        // Chamada direta para eventos
        (async () => {
          const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .order('data_inicio', { ascending: true }) // ou data_hora_evento, como preferir
          return { data, error };
        })(),
        // Chamada direta para noticias
        (async () => {
          const { data, error } = await supabase
            .from('noticias')
            .select('*')
            .order('data_publicacao', { ascending: false })
          return { data, error };
        })(),
        // Chamada direta para mensagens_contato
        (async () => {
          const { data, error } = await supabase
            .from('mensagens_contato')
            .select('*')
            .order('created_at', { ascending: false })
          return { data, error };
        })(),
        // Chamada direta para colaboradores
        (async () => {
          const { data, error } = await supabase
            .from('colaboradores')
            .select('*')
            .order('nome', { ascending: true })
          return { data, error };
        })(),
        // Chamada direta para classificados
        (async () => {
          const { data, error } = await supabase
            .from('classificados')
            .select('*')
            .order('created_at', { ascending: false })
          return { data, error };
        })(),
        // Chamada direta para avaliacoes_classificados
        (async () => {
          const { data, error } = await supabase
            .from('avaliacoes_classificados')
            .select('*')
            .order('created_at', { ascending: false })
          return { data, error };
        })(),
        // Chamada direta para galeria
        (async () => {
          const { data, error } = await supabase
            .from('galeria')
            .select('*')
            .order('created_at', { ascending: false })
          return { data, error };
        })(),
        // Chamada direta para socios
        (async () => {
          const { data, error } = await supabase
            .from('socios')
            .select('*')
            .order('data_inscricao', { ascending: false })
          return { data, error };
        })()
      ])

      // Verificar erros em cada resposta individualmente
      const responses = [
        eventosResponse, noticiasResponse, mensagensResponse,
        colaboradoresResponse, classificadosResponse, avaliacoesResponse, galeriaResponse, sociosResponse
      ]

      for (const response of responses) {
        if (response.error) {
            console.error('Erro em uma das chamadas do relatÃ³rio:', response.error);
            throw response.error; // LanÃ§a o erro para ser capturado pelo catch externo
        }
      }

      // Contar mensagens nÃ£o lidas
      const mensagensNaoLidas = mensagensResponse.data?.filter(msg => !msg.lida)?.length || 0

      // Contar colaboradores ativos
      const colaboradoresAtivos = colaboradoresResponse.data?.filter(col => col.ativo)?.length || 0

      const relatorio = {
        success: true,
        data: { // Corrigido: Adicionado 'data:'
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

      console.log('âœ… RelatÃ³rio gerado com sucesso:', relatorio.data)
      return relatorio

    } catch (err) {
      console.error('âŒ Erro ao gerar relatÃ³rio:', err)
      error.value = err.message
      // uiStore.showToast('Erro ao gerar relatÃ³rio: ' + err.message, 'error'); // Descomente se for usar toast
      return {
        success: false,
        error: err.message
      }
    } finally {
      loading.value = false
    }
  }

  // FunÃ§Ã£o corrigida para relatÃ³rio de auditoria
  const gerarRelatorioAuditoria = async (filtros = {}) => {
    try {
      // Chamada direta para admin_logs
      let query = supabase.from('admin_logs').select('*').order('created_at', { ascending: false });

      // Aplicar filtros se existirem
      if (filtros.admin_id) query = query.eq('admin_id', filtros.admin_id);
      if (filtros.acao) query = query.eq('acao', filtros.acao);
      if (filtros.tabela_afetada) query = query.eq('tabela_afetada', filtros.tabela_afetada);
      if (filtros.data_inicio) query = query.gte('created_at', filtros.data_inicio);
      if (filtros.data_fim) query = query.lte('created_at', filtros.data_fim);

      const logsResult = await query;

      if (logsResult.error) {
          console.error('Erro ao buscar logs de auditoria:', logsResult.error);
          throw logsResult.error;
      }

      // Obter estatÃ­sticas de logs
      const statsResult = await supabase
        .from('admin_logs')
        .select('acao, tabela_afetada')
        .order('created_at', { ascending: false }); // Ordenar para ter contexto, mas vamos agrupar

      if (statsResult.error) {
          console.error('Erro ao buscar estatÃ­sticas de auditoria:', statsResult.error);
          throw statsResult.error;
      }

      // Calcular estatÃ­sticas a partir dos dados recebidos
      const logsData = statsResult.data || [];
      const statsAcoes = logsData.reduce((acc, log) => {
        acc[log.acao] = (acc[log.acao] || 0) + 1;
        return acc;
      }, {});

      const statsTabelas = logsData.reduce((acc, log) => {
        acc[log.tabela_afetada] = (acc[log.tabela_afetada] || 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        data: { // Corrigido: Adicionado 'data:'
          logs: logsResult.data || [],
          total: logsResult.count || 0,
          estatisticas: {
            totalAcoes: logsData.length,
            statsAcoes,
            statsTabelas
          }
        }
      }
    } catch (err) {
      console.error('âŒ Erro ao gerar relatÃ³rio de auditoria:', err)
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

