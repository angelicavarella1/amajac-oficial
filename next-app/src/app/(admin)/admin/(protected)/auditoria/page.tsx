'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Log = {
  id: string;
  created_at: string;
  action: string;
  table_name: string;
  admin_id: string;
  ip_address: string;
  details: { old_data?: any; new_data?: any } | null;
};

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [stats, setStats] = useState({ totalLogs: 0, logsHoje: 0, inserts: 0, updates: 0, deletes: 0 });
  const [filters, setFilters] = useState({ dataInicio: '', dataFim: '', acao: '', tabela: '', adminId: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });

  const fetchStats = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const [total, hojeCount, inserts, updates, deletes] = await Promise.all([
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).gte('created_at', hoje),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'INSERT'),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'UPDATE'),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).eq('action', 'DELETE'),
      ]);
      setStats({
        totalLogs: total.count || 0,
        logsHoje: hojeCount.count || 0,
        inserts: inserts.count || 0,
        updates: updates.count || 0,
        deletes: deletes.count || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      let query = supabase.from('admin_logs').select('*', { count: 'exact' });

      if (filters.dataInicio) query = query.gte('created_at', filters.dataInicio + 'T00:00:00Z');
      if (filters.dataFim) query = query.lte('created_at', filters.dataFim + 'T23:59:59Z');
      if (filters.acao) query = query.eq('action', filters.acao);
      if (filters.tabela) query = query.eq('table_name', filters.tabela);
      if (filters.adminId) query = query.eq('admin_id', filters.adminId);
      if (filters.search) query = query.or(`row_id.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`);

      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
      if (error) throw error;
      setLogs((data as Log[]) || []);
      setPagination((prev) => ({ ...prev, total: count || 0 }));
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      setLogs([]);
    } finally {
      setLoadingLogs(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const temFiltrosAtivos = useMemo(() => Object.values(filters).some((v) => v !== ''), [filters]);

  const aplicarFiltros = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const resetarFiltros = () => {
    setFilters({ dataInicio: '', dataFim: '', acao: '', tabela: '', adminId: '', search: '' });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const mudarPagina = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchLogs();
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const getActionClass = (action: string) => {
    const classes: Record<string, string> = {
      INSERT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      UPDATE: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return classes[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = { INSERT: 'Inserção', UPDATE: 'Atualização', DELETE: 'Exclusão' };
    return labels[action] || action;
  };

  const exportarLogs = async (formato: 'csv' | 'json') => {
    try {
      let query = supabase.from('admin_logs').select('*');
      if (filters.dataInicio) query = query.gte('created_at', filters.dataInicio + 'T00:00:00Z');
      if (filters.dataFim) query = query.lte('created_at', filters.dataFim + 'T23:59:59Z');
      if (filters.acao) query = query.eq('action', filters.acao);
      if (filters.tabela) query = query.eq('table_name', filters.tabela);

      const { data: todosLogs, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      if (!todosLogs || todosLogs.length === 0) {
        alert('Nenhum dado encontrado para exportar.');
        return;
      }

      const logsArray = todosLogs as Log[];
      if (formato === 'csv') {
        const headers = ['Data/Hora', 'Ação', 'Tabela', 'Admin ID', 'IP'];
        const csvRows = logsArray.map((log) => [
          formatarData(log.created_at),
          getActionLabel(log.action),
          log.table_name,
          log.admin_id,
          log.ip_address || '-',
        ]);
        const csvContent = [headers, ...csvRows].map((row) => row.map((f) => `"${f}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else {
        const blob = new Blob([JSON.stringify(logsArray, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `auditoria_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar logs.');
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2E7D32] dark:text-[#4CAF50] mb-2">Auditoria Completa</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitoramento completo de todas as ações administrativas</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando auditoria...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Logs</p>
                <p className="text-2xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">{stats.totalLogs}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Logs Hoje</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.logsHoje}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Inserções</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.inserts}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Atualizações</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.updates}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Exclusões</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.deletes}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início</label>
                  <input type="date" value={filters.dataInicio} onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Fim</label>
                  <input type="date" value={filters.dataFim} onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ação</label>
                  <select value={filters.acao} onChange={(e) => setFilters({ ...filters, acao: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="">Todas</option>
                    <option value="INSERT">Inserção</option>
                    <option value="UPDATE">Atualização</option>
                    <option value="DELETE">Exclusão</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tabela</label>
                  <select value={filters.tabela} onChange={(e) => setFilters({ ...filters, tabela: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="">Todas</option>
                    <option value="associados">Associados</option>
                    <option value="classificados">Classificados</option>
                    <option value="eventos">Eventos</option>
                    <option value="noticias">Notícias</option>
                    <option value="parceiros_comerciais">Parceiros</option>
                    <option value="mensagens_contato">Mensagens</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar</label>
                  <input type="text" placeholder="ID ou IP" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={resetarFiltros} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Limpar Filtros</button>
                <button onClick={aplicarFiltros} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors">Aplicar Filtros</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logs de Auditoria</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: {pagination.total} | Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ação</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tabela</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Admin ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">IP</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loadingLogs ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Carregando logs...</td></tr>
                    ) : logs.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum log encontrado</td></tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatarData(log.created_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionClass(log.action)}`}>
                              {getActionLabel(log.action)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{log.table_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">{log.admin_id?.slice(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{log.ip_address || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} a {Math.min(pagination.page * pagination.pageSize, pagination.total)} de {pagination.total} registros
                </div>
                <div className="flex gap-1">
                  <button onClick={() => mudarPagina(pagination.page - 1)} disabled={pagination.page === 1} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Anterior</button>
                  <button onClick={() => mudarPagina(pagination.page + 1)} disabled={pagination.page * pagination.pageSize >= pagination.total} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Próxima</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exportar Relatório</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exporte os logs filtrados para análise externa</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportarLogs('csv')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">📥 CSV</button>
                  <button onClick={() => exportarLogs('json')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">📥 JSON</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
