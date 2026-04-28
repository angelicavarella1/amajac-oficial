'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

const categoriasOptions = [
  { value: null, label: 'Todos', icon: 'mdi mdi-view-grid' },
  { value: 'jardinagem', label: 'Jardinagem', icon: 'mdi mdi-leaf' },
  { value: 'limpeza', label: 'Limpeza', icon: 'mdi mdi-broom' },
  { value: 'reparos', label: 'Reparos', icon: 'mdi mdi-tools' },
  { value: 'pintura', label: 'Pintura', icon: 'mdi mdi-format-paint' },
  { value: 'encanamento', label: 'Encanamento', icon: 'mdi mdi-pipe' },
  { value: 'eletrica', label: 'Elétrica', icon: 'mdi mdi-flash' },
  { value: 'construcao', label: 'Construção', icon: 'mdi mdi-hard-hat' },
  { value: 'informatica', label: 'Informática', icon: 'mdi mdi-laptop' },
  { value: 'transporte', label: 'Transporte', icon: 'mdi mdi-truck' },
  { value: 'outros', label: 'Outros', icon: 'mdi mdi-hammer-wrench' }
];

const getServiceIcon = (categoria: string) => {
  const c = categoriasOptions.find(o => o.value === categoria);
  return c?.icon || 'mdi mdi-toolbox';
};

function AvaliarClassificado({ classificadoId, onAvaliacaoEnviada }: { classificadoId: string, onAvaliacaoEnviada: () => void }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', nota: 0, comentario: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abrirModal = () => {
    setMostrarModal(true);
    setForm({ nome: '', email: '', nota: 0, comentario: '' });
    setError(null);
  };

  const fecharModal = () => setMostrarModal(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const enviarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome?.trim()) { setError('Nome é obrigatório.'); return; }
    if (!validateEmail(form.email)) { setError('E-mail válido é obrigatório.'); return; }
    if (!form.nota) { setError('Por favor, selecione uma nota.'); return; }

    setEnviando(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dadosAvaliacao = {
        classificado_id: classificadoId,
        nota: form.nota,
        comentario: form.comentario?.trim() || null,
        nome_avaliador: form.nome.trim(),
        email_avaliador: form.email.trim().toLowerCase(),
        created_at: new Date().toISOString(),
        usuario_id: user?.id || null
      };

      const { error: supabaseError } = await supabase.from('avaliacoes_classificados').insert([dadosAvaliacao]).select();
      
      if (supabaseError) {
        if (supabaseError.code === '23502' && supabaseError.message.includes('usuario_id')) {
          const { error: errSemUser } = await supabase.from('avaliacoes_classificados').insert([{ ...dadosAvaliacao, usuario_id: null }]);
          if (errSemUser) throw errSemUser;
        } else {
          throw supabaseError;
        }
      }

      onAvaliacaoEnviada();
      fecharModal();
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      setError('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="avaliar-classificado">
      <button onClick={abrirModal} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors text-sm flex items-center gap-2">
        <i className="mdi mdi-star"></i> Avaliar
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avaliar Serviço</h3>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <i className="mdi mdi-close text-xl"></i>
              </button>
            </div>

            <form onSubmit={enviarAvaliacao} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu nome *</label>
                <input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Maria Silva" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu e-mail *</label>
                <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sua avaliação *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(estrela => (
                    <button key={estrela} type="button" onClick={() => setForm({...form, nota: estrela})} className={`text-2xl transition-colors ${estrela <= form.nota ? 'text-yellow-500' : 'text-gray-300'}`}>
                      <i className="mdi mdi-star"></i>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comentário (opcional)</label>
                <textarea id="comentario" value={form.comentario} onChange={(e) => setForm({...form, comentario: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Conte sua experiência..."></textarea>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-200">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={enviando} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg font-medium hover:bg-[#1B5E20] transition-colors disabled:opacity-70 flex items-center gap-2 flex-1 justify-center">
                  <i className={`mdi ${enviando ? 'mdi-loading mdi-spin' : 'mdi-send'}`}></i>
                  {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
                <button type="button" onClick={fecharModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassificadoDetalhes({ mostrar, classificadoId, onFechar }: { mostrar: boolean, classificadoId: string | null, onFechar: () => void }) {
  const [classificado, setClassificado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const getClassificadoDetalhes = async (id: string) => {
    try {
      const { data: cData, error: cErr } = await supabase.from('classificados').select('*').eq('id', id).eq('ativo', true).eq('aprovado', true).single();
      if (cErr) throw cErr;

      const { data: aData, error: aErr } = await supabase.from('avaliacoes_classificados').select('id, nota, comentario, nome_avaliador, email_avaliador, created_at').eq('classificado_id', id).order('created_at', { ascending: false });
      if (aErr && aErr.code !== 'PGRST116') throw aErr;

      const avaliacoes = (aData || []).map((a: any) => ({ ...a, data: new Date(a.created_at).toLocaleDateString('pt-BR') }));
      const notas = avaliacoes.map((a: any) => a.nota);
      const media = notas.length > 0 ? (notas.reduce((acc: number, cur: number) => acc + cur, 0) / notas.length) : 0;

      return {
        ...cData,
        mediaAvaliacoes: notas.length > 0 ? parseFloat(media.toFixed(1)) : null,
        totalAvaliacoes: notas.length,
        avaliacoes
      };
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      return null;
    }
  };

  const carregar = async () => {
    if (!classificadoId) return;
    setCarregando(true);
    const data = await getClassificadoDetalhes(classificadoId);
    setClassificado(data);
    setCarregando(false);
  };

  useEffect(() => {
    if (mostrar && classificadoId) carregar();
    else setClassificado(null);
  }, [mostrar, classificadoId]);

  const abrirWhatsApp = () => {
    if (classificado?.telefone) {
      const tel = classificado.telefone.replace(/\D/g, '');
      const msg = `Olá! Gostaria de saber mais sobre o serviço: ${classificado.titulo}`;
      window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onFechar}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{classificado?.titulo}</h2>
          <button onClick={onFechar} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"><i className="mdi mdi-close text-2xl"></i></button>
        </div>

        {classificado && (
          <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  {classificado.imagem_url ? (
                    <div className="rounded-lg overflow-hidden"><img src={classificado.imagem_url} alt={classificado.titulo} className="w-full h-64 object-cover" /></div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-[#2E7D32] to-green-600 rounded-lg flex items-center justify-center">
                      <i className={`${getServiceIcon(classificado.categoria)} text-white text-6xl`}></i>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full dark:bg-blue-900 dark:text-blue-200 capitalize">{classificado.categoria}</span>
                    {classificado.mediaAvaliacoes && (
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <i className="mdi mdi-star text-yellow-500"></i>
                        <span className="font-medium text-gray-900 dark:text-white">{classificado.mediaAvaliacoes}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({classificado.totalAvaliacoes} avaliações)</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Descrição</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{classificado.descricao}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informações de Contato</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Anunciante:</span><span className="font-medium text-gray-900 dark:text-white">{classificado.nome_anunciante}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Bairro:</span><span className="font-medium text-gray-900 dark:text-white">{classificado.bairro}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Telefone:</span><span className="font-medium text-gray-900 dark:text-white">{classificado.telefone}</span></div>
                      {classificado.email && <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">E-mail:</span><span className="font-medium text-gray-900 dark:text-white">{classificado.email}</span></div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                {classificado.avaliacoes && classificado.avaliacoes.length > 0 ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Avaliações ({classificado.totalAvaliacoes})</h3>
                    <div className="space-y-4">
                      {classificado.avaliacoes.map((av: any) => (
                        <div key={av.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-500">
                              {[1, 2, 3, 4, 5].map(n => <i key={n} className={`mdi mdi-star ${n <= av.nota ? 'text-yellow-500' : 'text-gray-300'}`}></i>)}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{av.data}</span>
                          </div>
                          {av.comentario ? <p className="text-gray-700 dark:text-gray-300">{av.comentario}</p> : <p className="text-gray-500 dark:text-gray-400 italic">Sem comentário</p>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <i className="mdi mdi-star-outline text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 dark:text-gray-400">Este classificado ainda não possui avaliações.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <AvaliarClassificado classificadoId={classificado.id} onAvaliacaoEnviada={carregar} />
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex gap-3">
            {classificado?.telefone && (
              <button onClick={abrirWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-3">
                <i className="mdi mdi-whatsapp text-xl"></i> Entrar em Contato via WhatsApp
              </button>
            )}
            <button onClick={onFechar} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Fechar</button>
          </div>
        </div>

        {carregando && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 flex items-center justify-center z-10">
            <div className="text-center"><i className="mdi mdi-loading mdi-spin text-[#2E7D32] text-4xl mb-2"></i><p className="text-gray-600 dark:text-gray-300">Carregando detalhes...</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClassificadoCard({ c, onVerDetalhes, onFiltrarCategoria }: { c: any, onVerDetalhes: (id: string) => void, onFiltrarCategoria: (cat: string) => void }) {
  const classificado = { ...c, anunciante: c.nome_anunciante, data: new Date(c.created_at).toLocaleDateString('pt-BR') };

  const abrirWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!classificado.telefone) return;
    const tel = classificado.telefone.replace(/\D/g, '');
    const msg = `Olá! Gostaria de saber mais sobre o serviço: ${classificado.titulo}`;
    window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <article onClick={() => onVerDetalhes(classificado.id)} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer flex flex-col">
      {classificado.imagem_url ? (
        <div className="h-48 overflow-hidden"><img src={classificado.imagem_url} alt={classificado.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /></div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#2E7D32] to-green-600 flex items-center justify-center">
          <i className={`${getServiceIcon(classificado.categoria)} text-white text-5xl`}></i>
        </div>
      )}
      <div className="p-5 flex flex-col h-full flex-grow">
        <div className="flex justify-between items-start mb-3">
          <button onClick={(e) => { e.stopPropagation(); onFiltrarCategoria(classificado.categoria); }} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200 capitalize hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
            {classificado.categoria}
          </button>
          {classificado.mediaAvaliacoes && (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <i className="mdi mdi-star text-yellow-500 text-sm"></i>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{classificado.mediaAvaliacoes}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({classificado.totalAvaliacoes})</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-[#2E7D32] transition-colors">{classificado.titulo}</h3>
        <p className="text-sm mb-4 flex-grow line-clamp-3 text-gray-600 dark:text-gray-300">{classificado.descricao}</p>
        <div className="text-sm space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center justify-between"><span className="font-medium text-gray-900 dark:text-white">{classificado.anunciante}</span><span className="text-gray-600 dark:text-gray-400">{classificado.bairro}</span></div>
          {classificado.telefone && (
            <button onClick={abrirWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <i className="mdi mdi-whatsapp text-lg"></i> Entrar em Contato
            </button>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><i className="mdi mdi-calendar"></i><span>Publicado em {classificado.data}</span></div>
            <span className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors flex items-center gap-1"><span>Ver detalhes</span><i className="mdi mdi-chevron-right"></i></span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ClassificadosSection() {
  const [classificados, setClassificados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
  const [classificadoSelecionadoId, setClassificadoSelecionadoId] = useState<string | null>(null);

  const fetchClassificados = async (catFiltro: string | null, reset = false) => {
    const currentPage = reset ? 0 : page;
    if (reset) {
      setClassificados([]);
      setHasMore(true);
    } else {
      if (!hasMore) return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('classificados').select('*', { count: 'exact' })
        .eq('ativo', true).eq('aprovado', true).order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

      if (catFiltro) query = query.eq('categoria', catFiltro);

      const { data, error: err } = await query;
      if (err) throw err;

      const novos = data || [];
      if (reset) setClassificados(novos);
      else setClassificados(prev => [...prev, ...novos]);

      setHasMore(novos.length === PAGE_SIZE);
      setPage(currentPage + 1);
    } catch (err) {
      console.error('Erro:', err);
      setError('Não foi possível carregar os classificados no momento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassificados(null, true);
  }, []);

  const mudarCategoria = (cat: string | null) => {
    setCategoriaFiltro(cat);
    setPage(0);
    setHasMore(true);
    fetchClassificados(cat, true);
  };

  return (
    <section id="classificados-section" className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Classificados de Serviços</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">Encontre os melhores prestadores de serviço da região. Entre em contato diretamente via WhatsApp.</p>
          <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-xl py-4 px-6 max-w-2xl mx-auto">
            <p className="text-[#2E7D32] font-medium">📢 <strong>Você também presta serviço no bairro?</strong><br />Associe-se à AMAJAC e anuncie gratuitamente!</p>
            <Link href="/associacao" className="mt-2 inline-block text-sm bg-[#2E7D32] text-white px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition-colors">Quero me associar</Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {categoriasOptions.map(cat => (
            <button key={cat.value || 'todos'} onClick={() => mudarCategoria(cat.value)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${categoriaFiltro === cat.value ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}>
              <i className={`${cat.icon} mr-2`}></i>{cat.label}
            </button>
          ))}
        </div>

        {loading && classificados.length === 0 ? (
          <div className="text-center py-12">
            <i className="mdi mdi-loading mdi-spin text-[#2E7D32] text-4xl mb-4"></i>
            <p className="text-gray-600 dark:text-gray-300">Carregando classificados...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <i className="mdi mdi-alert-circle-outline text-red-500 text-4xl mb-4"></i>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button onClick={() => fetchClassificados(categoriaFiltro, true)} className="mt-4 px-6 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors">Tentar Novamente</button>
          </div>
        ) : classificados.length === 0 ? (
          <div className="text-center py-12">
            <i className="mdi mdi-bullhorn-outline text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum classificado encontrado</h3>
            <p className="text-gray-600 dark:text-gray-300">{categoriaFiltro ? 'Nenhum serviço encontrado na categoria.' : 'Ainda não há classificados cadastrados.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classificados.map(c => (
              <ClassificadoCard key={c.id} c={c} onVerDetalhes={(id) => { setClassificadoSelecionadoId(id); setMostrarModalDetalhes(true); }} onFiltrarCategoria={mudarCategoria} />
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-12">
            <button onClick={() => fetchClassificados(categoriaFiltro, false)} className="px-8 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors font-medium">Carregar Mais Classificados</button>
          </div>
        )}
        {loading && classificados.length > 0 && (
          <div className="text-center mt-8">
            <i className="mdi mdi-loading mdi-spin text-[#2E7D32] text-2xl"></i>
          </div>
        )}

        <ClassificadoDetalhes mostrar={mostrarModalDetalhes} classificadoId={classificadoSelecionadoId} onFechar={() => { setMostrarModalDetalhes(false); setClassificadoSelecionadoId(null); }} />
      </div>
    </section>
  );
}
