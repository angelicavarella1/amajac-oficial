'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

interface Parceiro {
  id: string;
  nome: string;
  logo_url: string | null;
  link_site: string | null;
  instagram: string | null;
  facebook: string | null;
  ramo: string | null;
  imagem_alt: string;
}

export default function ParceirosSection() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParceiros = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('parceiros_comerciais')
        .select('id, nome, logo_url, link_site, instagram, facebook, ramo, imagem_alt')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (err) throw err;

      const formatados = (data || []).map((p: any) => ({
        ...p,
        link_site: p.link_site?.trim() || null,
        instagram: p.instagram?.trim() || null,
        facebook: p.facebook?.trim() || null,
        imagem_alt: p.imagem_alt || p.nome || 'Logo do parceiro',
      }));

      setParceiros(formatados);
    } catch (e) {
      console.error('Erro ao buscar parceiros:', e);
      setError('Não foi possível carregar os parceiros.');
      setParceiros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParceiros();
  }, []);

  const handleImageError = (index: number) => {
    const novos = [...parceiros];
    novos[index].logo_url = null;
    setParceiros(novos);
  };

  return (
    <aside
      id="parceiros-sidebar"
      aria-labelledby="parceiros-sidebar-title"
      className="parceiros-sidebar bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-6 px-4 transition-colors duration-300 h-full flex flex-col"
    >
      <header className="mb-6 text-center">
        <h2
          id="parceiros-sidebar-title"
          className="text-lg md:text-xl font-bold text-gray-900 dark:text-white"
        >
          Nossos Colaboradores
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Parceiros Comerciais da AMAJAC
        </p>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#2E7D32] border-t-transparent"></div>
          <p className="mt-3 text-sm">Carregando...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm mb-2">{error}</p>
          <button
            onClick={fetchParceiros}
            className="text-xs px-3 py-1.5 rounded bg-[#2E7D32] text-white hover:bg-[#256a2a] focus:outline-none"
            aria-label="Tentar carregar novamente os parceiros comerciais"
          >
            Tentar novamente
          </button>
        </div>
      ) : parceiros.length > 0 ? (
        <div role="list" className="space-y-4 overflow-y-auto flex-1 pb-8">
          {parceiros.map((p, idx) => (
            <article
              key={p.id}
              role="listitem"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {p.logo_url ? (
                    <img
                      src={p.logo_url}
                      alt={p.imagem_alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={() => handleImageError(idx)}
                    />
                  ) : (
                    <div className="text-lg font-bold text-[#2E7D32]">
                      {p.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {p.nome}
                  </h3>
                  {p.ramo && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {p.ramo}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.link_site && (
                      <a
                        href={p.link_site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#2E7D32] hover:underline"
                        aria-label={`Site de ${p.nome}`}
                      >
                        Site
                      </a>
                    )}
                    {p.instagram && (
                      <a
                        href={`https://instagram.com/${p.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-pink-600 hover:underline dark:text-pink-400 ml-1"
                        aria-label={`Instagram de ${p.nome}`}
                      >
                        IG
                      </a>
                    )}
                    {p.facebook && (
                      <a
                        href={`https://facebook.com/${p.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:underline dark:text-blue-400 ml-1"
                        aria-label={`Facebook de ${p.nome}`}
                      >
                        FB
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum parceiro ativo.</p>
        </div>
      )}
    </aside>
  );
}
