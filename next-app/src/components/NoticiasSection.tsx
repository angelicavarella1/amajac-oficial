'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';

export default function NoticiasSection() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNoticias = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('noticias')
        .select('*')
        .eq('ativo', true)
        .eq('rascunho', false)
        .order('destaque', { ascending: false })
        .order('data_publicacao', { ascending: false })
        .limit(6);

      if (err) throw err;
      setNoticias(data || []);
    } catch (e) {
      console.error('Erro ao buscar notícias:', e);
      setError('Não foi possível carregar as notícias recentes.');
      setNoticias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const generatePreview = (conteudo: string) => {
    if (!conteudo) return '';
    return conteudo.substring(0, 150) + (conteudo.length > 150 ? '...' : '');
  };

  return (
    <section
      id="noticias-section"
      aria-labelledby="noticias-title"
      className="noticias-section py-12 px-4 transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h2
            id="noticias-title"
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Notícias
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Confira as últimas atualizações da AMAJAC.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#2E7D32] border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando notícias...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="font-medium text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-300">Nenhuma notícia disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col"
                onClick={() => router.push(`/noticias/${noticia.id}`)}
              >
                <div className="relative">
                  {noticia.imagem_url ? (
                    <img
                      src={noticia.imagem_url}
                      alt={noticia.imagem_alt || `Imagem para: ${noticia.titulo}`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-48 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  {noticia.destaque && (
                    <div className="absolute top-3 left-3 bg-[#2E7D32] text-white text-xs font-bold px-2 py-1 rounded">
                      Destaque
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col h-full flex-grow">
                  {noticia.data_publicacao && (
                    <time className="text-sm text-[#2E7D32]">
                      {formatDate(noticia.data_publicacao)}
                    </time>
                  )}
                  <h3 className="text-xl font-bold mt-2 mb-2 line-clamp-2 text-gray-900 dark:text-white">
                    {noticia.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-grow line-clamp-3">
                    {noticia.resumo || generatePreview(noticia.conteudo)}
                  </p>
                  <footer className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Por {noticia.autor || 'Equipe AMAJAC'}
                    </span>
                    {noticia.visualizacoes > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <i className="mdi mdi-eye"></i>
                        {noticia.visualizacoes}
                      </span>
                    )}
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
