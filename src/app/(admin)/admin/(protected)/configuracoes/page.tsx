'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function AdminConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState<{ chave: string; valor: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const chavesIgnoradas = ['configuracoes_gerais'];

  const fetchConfiguracoes = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('configuracoes')
        .select('chave, valor')
        .order('chave', { ascending: true });
      if (err) throw err;
      setConfiguracoes((data || []).filter((item: any) => !chavesIgnoradas.includes(item.chave)));
    } catch (err: any) {
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const formatarChave = (chave: string) => {
    return chave
      .replace(/_/g, ' ')
      .replace(/\w+/g, (palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1));
  };

  const salvarTodas = async () => {
    setSalvando(true);
    setMensagem(null);
    try {
      const updates = configuracoes.map((item) => ({
        chave: item.chave,
        valor: item.valor,
        updated_at: new Date().toISOString(),
      }));
      const { error: err } = await supabase.from('configuracoes').upsert(updates, { onConflict: 'chave' });
      if (err) throw err;
      setMensagem('Configurações salvas com sucesso!');
      setTimeout(() => setMensagem(null), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      setMensagem('Erro ao salvar configurações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Configurações do Sistema</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações gerais da plataforma</p>
        </div>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'}`}>
            {mensagem}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando configurações...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configuracoes.map((item) => (
                <div key={item.chave}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{formatarChave(item.chave)}</label>
                  <textarea
                    value={item.valor}
                    onChange={(e) =>
                      setConfiguracoes((prev) =>
                        prev.map((c) => (c.chave === item.chave ? { ...c, valor: e.target.value } : c))
                      )
                    }
                    rows={item.chave.includes('descricao') || item.chave.includes('historia') || item.chave.includes('valores') ? 4 : 2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={salvarTodas}
                disabled={salvando}
                className="px-6 py-2 bg-[#2E7D32] hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
              >
                {salvando ? 'Salvando...' : 'Salvar Todas as Configurações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
