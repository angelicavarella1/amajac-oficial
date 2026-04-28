'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function AdminSobrePage() {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const chaves = [
    { key: 'historia', label: 'Nossa História', rows: 6 },
    { key: 'missao', label: 'Missão', rows: 4 },
    { key: 'visao', label: 'Visão', rows: 4 },
    { key: 'valores', label: 'Valores', rows: 4 },
    { key: 'endereco', label: 'Endereço', rows: 2 },
    { key: 'telefone', label: 'Telefone', rows: 1 },
    { key: 'email_institucional', label: 'E-mail Institucional', rows: 1 },
  ];

  const fetchConfiguracoes = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('configuracoes')
        .select('chave, valor')
        .in('chave', chaves.map((c) => c.key));
      if (err) throw err;
      const mapa: Record<string, string> = {};
      (data || []).forEach((item: any) => {
        mapa[item.chave] = item.valor || '';
      });
      setConfiguracoes(mapa);
    } catch (err: any) {
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const salvar = async () => {
    setSalvando(true);
    setMensagem(null);
    try {
      const updates = Object.entries(configuracoes).map(([chave, valor]) => ({
        chave,
        valor,
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Editar Conteúdo Institucional</h1>
          <p className="text-gray-600 dark:text-gray-400">Atualize as informações sobre a AMAJAC</p>
        </div>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'}`}>
            {mensagem}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando configurações...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
            {chaves.map((c) => (
              <div key={c.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{c.label}</label>
                <textarea
                  rows={c.rows}
                  value={configuracoes[c.key] || ''}
                  onChange={(e) => setConfiguracoes((prev) => ({ ...prev, [c.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => fetchConfiguracoes()}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Restaurar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70"
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
