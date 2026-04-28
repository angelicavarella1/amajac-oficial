'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAuditoria, setLoadingAuditoria] = useState(true);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const [stats, setStats] = useState({
    associadosAtivos: 0,
    classificadosAprovados: 0,
    mensagensNaoLidas: 0,
    eventosAtivos: 0,
    logsHoje: 0,
    adminsAtivos: 0,
    tabelasMonitoradas: 0,
    backupsMes: 3,
  });

  const [logsAuditoria, setLogsAuditoria] = useState<any[]>([]);

  const navegarPara = (rota: string) => {
    router.push(`/admin/${rota}`);
  };

  const carregarEstatisticas = async () => {
    setLoadingStats(true);
    try {
      const [associados, classificados, mensagens, eventos, logsHoje, admins] = await Promise.all([
        supabase.from('associados').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('classificados').select('*', { count: 'exact', head: true }).eq('aprovado', true),
        supabase.from('mensagens_contato').select('*', { count: 'exact', head: true }).eq('lida', false),
        supabase.from('eventos').select('*', { count: 'exact', head: true }).eq('ativo', true),
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('admin_profiles').select('*', { count: 'exact', head: true }).eq('ativo', true)
      ]);

      setStats({
        associadosAtivos: associados.count || 0,
        classificadosAprovados: classificados.count || 0,
        mensagensNaoLidas: mensagens.count || 0,
        eventosAtivos: eventos.count || 0,
        logsHoje: logsHoje.count || 0,
        adminsAtivos: admins.count || 1,
        tabelasMonitoradas: 5,
        backupsMes: 3,
      });
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const carregarAuditoria = async () => {
    setLoadingAuditoria(true);
    try {
      const { data: logs, error } = await supabase
        .from('admin_logs')
        .select('id, created_at, action, table_name, details, admin_id, ip_address, admin_profiles:admin_id(nome)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Erro ao carregar logs de auditoria:', error);
        const { data: fallback } = await supabase
          .from('admin_logs')
          .select('id, created_at, action, table_name, details, admin_id, ip_address')
          .order('created_at', { ascending: false })
          .limit(10);

        setLogsAuditoria((fallback || []).map((log: any) => ({
          ...log,
          admin_nome: `Admin ${log.admin_id?.slice(0, 8)}...`
        })));
        return;
      }

      setLogsAuditoria((logs || []).map((log: any) => ({
        ...log,
        admin_nome: log.admin_profiles?.[0]?.nome || log.admin_profiles?.nome || `Admin ${log.admin_id?.slice(0, 8)}...`
      })));
    } catch (err) {
      console.error('Erro ao carregar auditoria:', err);
      setLogsAuditoria([]);
    } finally {
      setLoadingAuditoria(false);
    }
  };

  useEffect(() => {
    carregarEstatisticas();
    carregarAuditoria();
  }, []);

  const formatarData = (dataString: string) => {
    if (!dataString) return 'Data inválida';
    try {
      return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dataString));
    } catch {
      return dataString;
    }
  };

  const formatAction = (action: string) => ({ 'INSERT': 'Criação', 'UPDATE': 'Atualização', 'DELETE': 'Exclusão' }[action] || action);
  const formatTableName = (t: string) => ({ 'associados': 'Associados', 'classificados': 'Classificados', 'configuracoes': 'Configurações', 'eventos': 'Eventos', 'mensagens_contato': 'Mensagens' }[t] || t);

  const getActionStyles = (action: string) => {
    const s = {
      'INSERT': { bg: 'bg-emerald-500', text: 'text-white', icon: '+' },
      'UPDATE': { bg: 'bg-amber-500', text: 'text-white', icon: '✓' },
      'DELETE': { bg: 'bg-red-500', text: 'text-white', icon: '×' }
    }[action] || { bg: 'bg-gray-300 dark:bg-gray-600', text: 'text-gray-800 dark:text-gray-200', icon: '•' };
    return s;
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Card Estatísticas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Visão Geral</h3>
          </div>
          <div className="p-6 flex-1">
            {loadingStats ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg animate-pulse">
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-16"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 h-full">
                {[
                  { label: 'Associados Ativos', value: stats.associadosAtivos },
                  { label: 'Classificados Aprovados', value: stats.classificadosAprovados },
                  { label: 'Mensagens Não Lidas', value: stats.mensagensNaoLidas },
                  { label: 'Eventos Ativos', value: stats.eventosAtivos }
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center flex flex-col justify-center border border-transparent hover:border-[#2E7D32] transition-colors cursor-default">
                    <div className="text-3xl font-bold text-[#2E7D32] dark:text-[#4CAF50] mb-2">{s.value}</div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Ações Rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ações Rápidas</h3>
          </div>
          <div className="p-6 flex-1">
            <div className="grid grid-cols-2 gap-4 h-full">
              {[
                { label: 'Gerenciar Associados', route: 'associados' },
                { label: 'Moderar Classificados', route: 'classificados' },
                { label: 'Ver Auditoria Completa', route: 'auditoria' },
                { label: 'Configurações', route: 'configuracoes' }
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => navegarPara(btn.route)}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg font-semibold text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-[#2E7D32] dark:hover:border-[#4CAF50] transition-all hover:-translate-y-1 text-center h-full flex items-center justify-center min-h-[100px]"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Segurança */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8 transition-all duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resumo de Segurança</h3>
        </div>
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔍', label: 'Logs hoje', value: stats.logsHoje },
            { icon: '👤', label: 'Admins ativos', value: stats.adminsAtivos },
            { icon: '📊', label: 'Tabelas monitoradas', value: stats.tabelasMonitoradas },
            { icon: '💾', label: 'Backups este mês', value: stats.backupsMes },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-transparent hover:border-[#2E7D32] transition-colors">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <div className="text-2xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">{item.value}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auditoria Recente */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Auditoria Recente</h3>
          <button onClick={carregarAuditoria} disabled={loadingAuditoria} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
            <span className={`text-xl ${loadingAuditoria ? 'animate-spin' : ''}`}>↻</span>
          </button>
        </div>
        <div className="p-6">
          {loadingAuditoria ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : logsAuditoria.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Nenhuma atividade de auditoria
            </div>
          ) : (
            <div className="space-y-4">
              {logsAuditoria.map(log => {
                const styles = getActionStyles(log.action);
                return (
                  <div key={log.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${styles.bg} ${styles.text}`}>
                      {styles.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white mb-2 leading-tight">
                        <strong>{formatAction(log.action)}</strong> em <strong>{formatTableName(log.table_name)}</strong>
                        {(log.details?.old_data || log.details?.new_data) && (
                          <span className="text-amber-600 dark:text-amber-400 ml-2 text-sm whitespace-nowrap">• Alterações detectadas</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>Por: {log.admin_nome}</span>
                        <span>{formatarData(log.created_at)}</span>
                      </div>
                      
                      {showDetails[log.id] && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                          {log.details?.old_data && (
                            <div className="mb-4 last:mb-0">
                              <strong className="block text-gray-900 dark:text-white mb-1">Antes:</strong>
                              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs text-gray-800 dark:text-gray-300">
                                {JSON.stringify(log.details.old_data, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.details?.new_data && (
                            <div className="mb-4 last:mb-0">
                              <strong className="block text-gray-900 dark:text-white mb-1">Depois:</strong>
                              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs text-gray-800 dark:text-gray-300">
                                {JSON.stringify(log.details.new_data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => setShowDetails(prev => ({ ...prev, [log.id]: !prev[log.id] }))}
                        className="mt-3 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 hover:text-[#2E7D32] hover:border-[#2E7D32] transition-colors"
                      >
                        {showDetails[log.id] ? 'Ocultar detalhes' : 'Ver detalhes'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
