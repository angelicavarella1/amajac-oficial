// src/admin/composables/useDatabaseReport.js
import { ref } from 'vue'
import { supabase } from '@/supabase/client.js' // ✅ Corrigido: Importação direta do client.js

export function useDatabaseReport() {
  const loading = ref(false)
  const error = ref(null)

  const obterRelatorioCompleto = async () => {
    loading.value = true
    error.value = null

    try { // ✅ `try` agora tem `catch`
      console.log('🎯 Gerando relatorio completo do banco...')

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
          // Nota: Usar head: false aqui para buscar todos os dados, pois a contagem individual
          // e o processamento de detalhes (filtros) dependem da coleta de 'data'.
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
              // Adicionar algumas informacoes especificas por tabela
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
          console.error(`❌ Erro critico em ${tabela}:`, err)
          relatorio.estatisticas.totais[tabela] = 0
          relatorio.estatisticas.detalhes[tabela] = { error: err.message }
        }
      }

      // Calcular totais REAIS
      const totalRegistros = Object.values(relatorio.estatisticas.totais).reduce((a, b) => a + b, 0)

      relatorio.estatisticas.resumo = {
        total_registros: totalRegistros,
        tabela_maior: Object.entries(relatorio.estatisticas.totais)
          .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0],
        tabelas_vazias: Object.entries(relatorio.estatisticas.totais)
          .filter(([, total]) => total === 0).length,
        data_geracao: new Date().toISOString()
      }

      console.log('✅ Relatorio gerado com dados REAIS:', relatorio.estatisticas.resumo)
      return relatorio

    } catch (err) { // ✅ Adicionado `catch`
      console.error('❌ Erro ao gerar relatorio:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Funcao para obter estatisticas em tempo real (contagens rápidas)
  const obterEstatisticasTempoReal = async () => {
    try { // ✅ `try` agora tem `catch`
      const [
        noticiasCount,
        eventosCount,
        mensagensCount,
        colaboradoresCount,
        classificadosCount,
        sociosCount // Incluindo sócios para a contagem rápida
      ] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
        supabase.from('eventos').select('*', { count: 'exact', head: true }),
        supabase.from('mensagens_contato').select('*', { count: 'exact', head: true }),
        supabase.from('colaboradores').select('*', { count: 'exact', head: true }),
        supabase.from('classificados').select('*', { count: 'exact', head: true }),
        supabase.from('socios').select('*', { count: 'exact', head: true }) // Adicionado
      ])

      return {
        noticias: noticiasCount.count || 0,
        eventos: eventosCount.count || 0,
        mensagens: mensagensCount.count || 0,
        colaboradores: colaboradoresCount.count || 0,
        classificados: classificadosCount.count || 0,
        socios: sociosCount.count || 0, // Adicionado
        atualizado_em: new Date().toISOString()
      }
    } catch (err) { // ✅ Adicionado `catch`
      console.error('❌ Erro ao obter estatisticas em tempo real:', err)
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