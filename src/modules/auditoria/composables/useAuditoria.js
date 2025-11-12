import { ref, reactive } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

export function useAuditoria() {
  const loadingStats = ref(true)
  const loadingLogs = ref(true)
  const logs = ref([])
  
  const stats = reactive({
    totalLogs: 0,
    logsHoje: 0,
    inserts: 0,
    updates: 0,
    deletes: 0
  })

  const filters = reactive({
    dataInicio: '',
    dataFim: '',
    acao: '',
    tabela: '',
    adminId: '',
    search: ''
  })

  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // Carregar estatísticas
  const carregarEstatisticas = async () => {
    try {
      loadingStats.value = true
      const hoje = new Date().toISOString().split('T')[0]
      
      const [total, hojeCount, inserts, updates, deletes] = await Promise.all([
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).gte('created_at', hoje),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'INSERT'),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'UPDATE'),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'DELETE')
      ])

      stats.totalLogs = total.count || 0
      stats.logsHoje = hojeCount.count || 0
      stats.inserts = inserts.count || 0
      stats.updates = updates.count || 0
      stats.deletes = deletes.count || 0

    } catch (error) {
      console.error('Erro ao carregar estatisticas:', error)
    } finally {
      loadingStats.value = false
    }
  }

  // Carregar logs com filtros
  const carregarLogs = async () => {
    try {
      loadingLogs.value = true
      let query = supabase.from('admin_logs').select('*', { count: 'exact' })

      if (filters.dataInicio) {
        query = query.gte('created_at', filters.dataInicio + 'T00:00:00Z')
      }
      if (filters.dataFim) {
        query = query.lte('created_at', filters.dataFim + 'T23:59:59Z')
      }
      if (filters.acao) {
        query = query.eq('action', filters.acao)
      }
      if (filters.tabela) {
        query = query.eq('table_name', filters.tabela)
      }
      if (filters.adminId) {
        query = query.eq('admin_id', filters.adminId)
      }
      if (filters.search) {
        query = query.or(`row_id.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`)
      }

      const from = (pagination.page - 1) * pagination.pageSize
      const to = from + pagination.pageSize - 1

      const { data, error, count } = await query
        .order(pagination.sortBy, { ascending: pagination.sortOrder === 'asc' })
        .range(from, to)

      if (error) throw error

      logs.value = data || []
      pagination.total = count || 0

    } catch (error) {
      console.error('Erro ao carregar logs:', error)
      logs.value = []
    } finally {
      loadingLogs.value = false
    }
  }

  // Carregar TODOS os logs para exportação (sem paginação)
  const carregarLogsCompletos = async () => {
    try {
      let query = supabase.from('admin_logs').select(`
        id,
        created_at,
        action,
        table_name,
        row_id,
        details,
        admin_id,
        ip_address,
        user_agent,
        admin_profiles:admin_id (nome, email)
      `)

      // Aplicar os mesmos filtros
      if (filters.dataInicio) {
        query = query.gte('created_at', filters.dataInicio + 'T00:00:00Z')
      }
      if (filters.dataFim) {
        query = query.lte('created_at', filters.dataFim + 'T23:59:59Z')
      }
      if (filters.acao) {
        query = query.eq('action', filters.acao)
      }
      if (filters.tabela) {
        query = query.eq('table_name', filters.tabela)
      }
      if (filters.adminId) {
        query = query.eq('admin_id', filters.adminId)
      }
      if (filters.search) {
        query = query.or(`row_id.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []

    } catch (error) {
      console.error('Erro ao carregar logs completos:', error)
      return []
    }
  }

  // Mudar página
  const mudarPagina = (page) => {
    pagination.page = page
    carregarLogs()
  }

  // Ordenar logs
  const ordenarLogs = (sortBy, sortOrder) => {
    pagination.sortBy = sortBy
    pagination.sortOrder = sortOrder
    carregarLogs()
  }

  // Resetar filtros
  const resetarFiltros = () => {
    Object.assign(filters, {
      dataInicio: '',
      dataFim: '',
      acao: '',
      tabela: '',
      adminId: '',
      search: ''
    })
    pagination.page = 1
    carregarLogs()
  }

  // função para formatar dados para CSV
  const formatarParaCSV = (logs) => {
    const headers = ['Data/Hora', 'Ação', 'Tabela', 'ID Registro', 'Admin', 'IP', 'User Agent']
    const rows = logs.map(log => [
      new Date(log.created_at).toLocaleString('pt-BR'),
      getActionLabel(log.action),
      formatTableName(log.table_name),
      log.row_id || '-',
      log.admin_profiles?.nome || log.admin_id?.slice(0,8) + '...',
      log.ip_address || '-',
      log.user_agent || '-'
    ])
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
  }

  // função para formatar dados para JSON
  const formatarParaJSON = (logs) => {
    return JSON.stringify(logs.map(log => ({
      id: log.id,
      data_hora: log.created_at,
      acao: getActionLabel(log.action),
      tabela: formatTableName(log.table_name),
      id_registro: log.row_id,
      admin: log.admin_profiles?.nome || log.admin_id,
      ip: log.ip_address,
      user_agent: log.user_agent,
      detalhes: log.details
    })), null, 2)
  }

  // Helper functions
  const getActionLabel = (action) => {
    const labels = { 'INSERT': 'Inserção', 'UPDATE': 'Atualização', 'DELETE': 'Exclusão' }
    return labels[action] || action
  }

  const formatTableName = (tableName) => {
    const tables = {
      'associados': 'Associados',
      'classificados': 'Classificados', 
      'eventos': 'Eventos',
      'noticias': 'Notícias',
      'parceiros': 'Parceiros',
      'mensagens_contato': 'Mensagens'
    }
    return tables[tableName] || tableName
  }


  // Exportar logs - VERSÃO COM DEBUG
  const exportarLogs = async (formato) => {
    try {
      console.log(' INICIANDO EXPORTAÇÃO...')
      console.log('Filtros ativos:', filters)
      
      // Carregar todos os logs (sem paginação)
      const logsCompletos = await carregarLogsCompletos()
      
      console.log(' Logs carregados:', logsCompletos)
      console.log('Quantidade de logs:', logsCompletos.length)
      
      if (logsCompletos.length === 0) {
        console.log(' Nenhum dado encontrado. Possíveis causas:')
        console.log('   - Filtros muito restritivos')
        console.log('   - Problema na consulta SQL')
        console.log('   - Tabela admin_logs vazia')
        console.log('   - Permissões de acesso')
        
        // Tentar carregar SEM filtros para testar
        console.log(' Testando consulta sem filtros...')
        const { data: logsSemFiltro, error } = await supabase
          .from('admin_logs')
          .select('*')
          .limit(5)
          
        console.log('Logs sem filtros:', logsSemFiltro)
        console.log('Erro (se houver):', error)
        
        alert('Nenhum dado encontrado para exportar com os filtros atuais. Verifique o console para detalhes.')
        return
      }

      let blob, filename, mimeType

      switch (formato) {
        case 'csv':
          const csvData = formatarParaCSV(logsCompletos)
          blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
          filename = `auditoria_amajac_${new Date().toISOString().split('T')[0]}.csv`
          mimeType = 'text/csv'
          break

        case 'json':
          const jsonData = formatarParaJSON(logsCompletos)
          blob = new Blob([jsonData], { type: 'application/json' })
          filename = `auditoria_amajac_${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break

        case 'pdf':
          alert('Exportação PDF: Use a opção "Imprimir" do navegador e salve como PDF para uma versão formatada.')
          return

        default:
          throw new Error('Formato não suportado')
      }

      // Criar link de download
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(' Exportação concluída com sucesso!')
      alert(`Exportação ${formato.toUpperCase()} concluída! ${logsCompletos.length} registros exportados.`)

    } catch (error) {
      console.error(' Erro ao exportar logs:', error)
      alert('Erro ao exportar logs: ' + error.message)
    }
  }
}