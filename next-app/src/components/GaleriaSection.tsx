'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function GaleriaSection() {
  const [galeria, setGaleria] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('');
  const [imagemSelecionada, setImagemSelecionada] = useState<any>(null);

  const fetchGaleria = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('galeria')
        .select(`id, titulo, imagem_url, imagem_alt, descricao, created_at, categoria`)
        .order('created_at', { ascending: false });

      if (err) throw new Error(`Erro ao buscar galeria: ${err.message}`);

      const formatados = (data || []).map((row: any) => ({
        id: row.id,
        titulo: row.titulo?.trim() || 'Sem título',
        categoria: row.categoria?.trim() || 'Geral',
        url: row.imagem_url || 'https://placehold.co/400x300/2E7D32/FFFFFF?text=Sem+Imagem',
        alt: row.imagem_alt?.trim() || `Imagem: ${row.titulo || 'sem título'}`,
        descricao: row.descricao?.trim() || null,
        data: row.created_at,
      }));

      setGaleria(formatados);
    } catch (e: any) {
      console.error('[useGaleria] Erro:', e);
      setError('Não foi possível carregar a galeria no momento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleria();
  }, []);

  const categorias = useMemo(() => {
    const setCat = new Set<string>();
    galeria.forEach(img => {
      if (img.categoria) setCat.add(img.categoria);
    });
    return Array.from(setCat).sort();
  }, [galeria]);

  const imagensFiltradas = useMemo(() => {
    if (!categoriaAtiva) return galeria;
    return galeria.filter(img => img.categoria === categoriaAtiva);
  }, [galeria, categoriaAtiva]);

  const categoriasParaExibir = useMemo(() => {
    if (categoriaAtiva) return [categoriaAtiva];
    return categorias;
  }, [categoriaAtiva, categorias]);

  const imagensPorCategoria = useMemo(() => {
    const agrupadas: any = {};
    if (categoriaAtiva) {
      agrupadas[categoriaAtiva] = imagensFiltradas;
    } else {
      categorias.forEach(cat => {
        agrupadas[cat] = galeria.filter(img => img.categoria === cat);
      });
    }
    return agrupadas;
  }, [categoriaAtiva, imagensFiltradas, categorias, galeria]);

  const formatarCategoria = (cat: string) => {
    if (!cat) return 'Sem Categoria';
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return 'Data não informada';
    return new Date(dataStr).toLocaleDateString('pt-BR');
  };

  const abrirLightbox = (imagem: any) => setImagemSelecionada(imagem);
  const fecharLightbox = () => setImagemSelecionada(null);

  const indiceImagemAtual = imagemSelecionada ? imagensFiltradas.findIndex(img => img.id === imagemSelecionada.id) : -1;
  const podeNavegarAnterior = indiceImagemAtual > 0;
  const podeNavegarProximo = indiceImagemAtual < imagensFiltradas.length - 1;

  const imagemAnterior = () => {
    if (podeNavegarAnterior) setImagemSelecionada(imagensFiltradas[indiceImagemAtual - 1]);
  };

  const proximaImagem = () => {
    if (podeNavegarProximo) setImagemSelecionada(imagensFiltradas[indiceImagemAtual + 1]);
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!imagemSelecionada) return;
      if (e.key === 'Escape') fecharLightbox();
      if (e.key === 'ArrowLeft') imagemAnterior();
      if (e.key === 'ArrowRight') proximaImagem();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [imagemSelecionada, imagensFiltradas, indiceImagemAtual]);

  return (
    <section id="galeria-section" className="galeria-section min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Galeria de Fotos</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore nossa coleção de imagens organizadas por categorias
          </p>
        </div>

        {categorias.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setCategoriaAtiva('')}
              className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${categoriaAtiva === '' ? 'bg-[#2E7D32] text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${categoriaAtiva === cat ? 'bg-[#2E7D32] text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}
              >
                {formatarCategoria(cat)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2E7D32] border-t-transparent mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Carregando galeria...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Erro ao carregar galeria</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button onClick={fetchGaleria} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Tentar Novamente</button>
            </div>
          </div>
        ) : imagensFiltradas.length > 0 ? (
          <div className="space-y-12">
            {categoriasParaExibir.map((categoria) => (
              <section key={categoria} className="categoria-section">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formatarCategoria(categoria)}</h2>
                  <div className="w-16 h-1 bg-[#2E7D32] rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {imagensPorCategoria[categoria].map((imagem: any) => (
                    <div
                      key={imagem.id}
                      onClick={() => abrirLightbox(imagem)}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                    >
                      <div className="h-64 sm:h-56 md:h-64 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <img src={imagem.url} alt={imagem.alt} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white text-center">
                          <p className="text-sm font-medium">Ver detalhes</p>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col border-t border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate text-sm">{imagem.titulo}</h3>
                        {imagem.descricao && <p className="text-gray-600 dark:text-gray-300 text-xs truncate mb-2">{imagem.descricao}</p>}
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatarData(imagem.data)}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full capitalize">{formatarCategoria(imagem.categoria)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Nenhuma imagem encontrada</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {categoriaAtiva ? `Nenhuma imagem na categoria "${formatarCategoria(categoriaAtiva)}"` : 'Nenhuma imagem cadastrada na galeria'}
            </p>
          </div>
        )}
      </div>

      {imagemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={fecharLightbox}>
          <div className="relative max-w-6xl max-h-full w-full animate-[fadeIn_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <button onClick={fecharLightbox} className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {podeNavegarAnterior && (
              <button onClick={imagemAnterior} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-colors z-20 hidden md:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            {podeNavegarProximo && (
              <button onClick={proximaImagem} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-colors z-20 hidden md:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6 min-h-0 bg-gray-100 dark:bg-gray-900 h-[60vh]">
                <img src={imagemSelecionada.url} alt={imagemSelecionada.alt} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{imagemSelecionada.titulo}</h3>
                    <span className="inline-block px-2 py-1 bg-[#2E7D32] text-white text-xs rounded-full">{formatarCategoria(imagemSelecionada.categoria)}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatarData(imagemSelecionada.data)}</span>
                </div>
                {imagemSelecionada.descricao && <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{imagemSelecionada.descricao}</p>}
                <div className="flex justify-center items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{indiceImagemAtual + 1} de {imagensFiltradas.length}</span>
                </div>
                {/* Mobile controls */}
                <div className="flex justify-between mt-4 md:hidden">
                  <button onClick={imagemAnterior} disabled={!podeNavegarAnterior} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">Anterior</button>
                  <button onClick={proximaImagem} disabled={!podeNavegarProximo} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">Próxima</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
