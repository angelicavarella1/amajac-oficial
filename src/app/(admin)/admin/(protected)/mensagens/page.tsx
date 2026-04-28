'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Mensagem = {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  lida: boolean;
};

export default function AdminMensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensagemSelecionada, setMensagemSelecionada] = useState<Mensagem | null>(null);

  const fetchMensagens = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('mensagens_contato')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setMensagens(data as Mensagem[]);
    } catch (err: any) {
      console.error('Erro ao buscar mensagens:', err);
      setError('Falha ao carregar mensagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensagens();
  }, []);

  const marcarComoLida = async (id: string, lida: boolean) => {
    try {
      const { error: err } = await supabase.from('mensagens_contato').update({ lida: !lida }).eq('id', id);
      if (err) throw err;
      setMensagens((prev) => prev.map((m) => (m.id === id ? { ...m, lida: !lida } : m)));
      if (mensagemSelecionada?.id === id) {
        setMensagemSelecionada((prev) => (prev ? { ...prev, lida: !lida } : null));
      }
    } catch (err: any) {
      console.error('Erro ao marcar mensagem:', err);
      alert('Erro ao atualizar status.');
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const { error: err } = await supabase.from('mensagens_contato').update({ lida: true }).eq('lida', false);
      if (err) throw err;
      setMensagens((prev) => prev.map((m) => ({ ...m, lida: true })));
    } catch (err: any) {
      console.error('Erro ao marcar todas:', err);
      alert('Erro ao atualizar mensagens.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    try {
      const { error: err } = await supabase.from('mensagens_contato').delete().eq('id', id);
      if (err) throw err;
      setMensagens((prev) => prev.filter((m) => m.id !== id));
      if (mensagemSelecionada?.id === id) setMensagemSelecionada(null);
    } catch (err: any) {
      console.error('Erro ao deletar mensagem:', err);
      alert('Erro ao excluir.');
    }
  };

  const naoLidas = mensagens.filter((m) => !m.lida).length;

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mensagens de Contato</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {naoLidas > 0 ? `${naoLidas} mensagem(ns) não lida(s)` : 'Todas as mensagens foram lidas'}
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={fetchMensagens} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors text-sm">
              ↻ Recarregar
            </button>
            {naoLidas > 0 && (
              <button onClick={marcarTodasComoLidas} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Remetente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mensagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Carregando mensagens...</td></tr>
                ) : mensagens.length > 0 ? (
                  mensagens.map((m) => (
                    <tr
                      key={m.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer ${!m.lida ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      onClick={() => setMensagemSelecionada(m)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!m.lida ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse">
                            Nova
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            Lida
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{m.nome}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{m.email}</div>
                        {m.telefone && <div className="text-xs text-gray-500 dark:text-gray-400">📱 {m.telefone}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">{m.assunto}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{m.mensagem}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(m.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); marcarComoLida(m.id, m.lida); }}
                          className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors"
                          title={m.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                        >
                          {m.lida ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="text-red-500 hover:text-red-700 transition-colors" title="Excluir">×</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">Nenhuma mensagem encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-200">{error}</div>}
        </div>
      </div>

      {mensagemSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setMensagemSelecionada(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes da Mensagem</h2>
              <button onClick={() => setMensagemSelecionada(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Nome</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mensagemSelecionada.nome}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">E-mail</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mensagemSelecionada.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Telefone</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mensagemSelecionada.telefone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Assunto</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{mensagemSelecionada.assunto}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Mensagem</label>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-1">
                    {mensagemSelecionada.mensagem}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Recebida em</label>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(mensagemSelecionada.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button onClick={() => marcarComoLida(mensagemSelecionada.id, mensagemSelecionada.lida)} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors">
                {mensagemSelecionada.lida ? 'Marcar como não lida' : 'Marcar como lida'}
              </button>
              <button onClick={() => handleDelete(mensagemSelecionada.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
