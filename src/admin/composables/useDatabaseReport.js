// src/admin/composables/useDatabaseReport.js
import { ref } from 'vue'
import { supabase } from '@/supabase'

export function useDatabaseReport() {
  const loading = ref(false)
  const error = ref(null)

  const obterRelatorioCompleto = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('🎯 Gerando relatório completo do banco...')
      
      // Buscar dados REAIS de todas as tabelas
      const tabelas = [
        'noticias', 'eventos', 'mensagens_contato', 'colaboradores', 
        'classificados', 'avaliacoes_classificados', 'configuracoes', 
        'galeria', 'socios'
      ]

      const relatorio = {
        metadata: {
          gerado_em: new Date().toISOString(),
          total_tabelas: tabelas.length,
          sistema: 'Amajac CMS'
        },
        estatisticas: {
          totais: {},
          detalhes: {},
          resumo: {}
        }
      }

      // Buscar dados de CADA tabela individualmente
      for (const tabela of tabelas) {
        try {
          const { data, count, error: tableError } = await supabase
            .from(tabela)
            .select('*', { count: 'exact', head: false })

          if (tableError) {
            console.warn(`⚠️ Erro ao buscar ${tabela}:`, tableError)
            relatorio.estatisticas.totais[tabela] = 0
            relatorio.estatisticas.detalhes[tabela] = { error: tableError.message }
          } else {
            relatorio.estatisticas.totais[tabela] = count || data?.length || 0
            relatorio.estatisticas.detalhes[tabela] = {
              registros: data?.length || 0,
              ultima_atualizacao: new Date().toISOString(),
              // Adicionar algumas informações específicas por tabela
              ...(tabela === 'mensagens_contato' && {
                nao_lidas: data?.filter(msg => !msg.lida)?.length || 0
              }),
              ...(tabela === 'colaboradores' && {
                ativos: data?.filter(col => col.ativo)?.length || 0
              }),
              ...(tabela === 'noticias' && {
                ativas: data?.filter(not => not.ativo)?.length || 0,
                destaques: data?.filter(not => not.destaque)?.length || 0
              })
            }
          }
        } catch (err) {
          console.error(`❌ Erro crítico em ${tabela}:`, err)
          relatorio.estatisticas.totais[tabela] = 0
          relatorio.estatisticas.detalhes[tabela] = { error: err.message }
        }
      }

      // Calcular totais REAIS
      const totalRegistros = Object.values(relatorio.estatisticas.totais).reduce((a, b) => a + b, 0)
      
      relatorio.estatisticas.resumo = {
        total_registros: totalRegistros,
        tabela_maior: Object.entries(relatorio.estatisticas.totais)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0],
        tabelas_vazias: Object.entries(relatorio.estatisticas.totais)
          .filter(([_, total]) => total === 0).length,
        data_geracao: new Date().toISOString()
      }

      console.log('✅ Relatório gerado com dados REAIS:', relatorio.estatisticas.resumo)
      return relatorio

    } catch (err) {
      console.error('❌ Erro ao gerar relatório:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Função para obter estatísticas em tempo real
  const obterEstatisticasTempoReal = async () => {
    try {
      const [
        noticiasCount,
        eventosCount,
        mensagensCount,
        colaboradoresCount,
        classificadosCount
      ] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
        supabase.from('eventos').select('*', { count: 'exact', head: true }),
        supabase.from('mensagens_contato').select('*', { count: 'exact', head: true }),
        supabase.from('colaboradores').select('*', { count: 'exact', head: true }),
        supabase.from('classificados').select('*', { count: 'exact', head: true })
      ])

      return {
        noticias: noticiasCount.count || 0,
        eventos: eventosCount.count || 0,
        mensagens: mensagensCount.count || 0,
        colaboradores: colaboradoresCount.count || 0,
        classificados: classificadosCount.count || 0,
        atualizado_em: new Date().toISOString()
      }
    } catch (err) {
      console.error('❌ Erro ao obter estatísticas em tempo real:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    obterRelatorioCompleto,
    obterEstatisticasTempoReal
  }
}