"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

const categoriasOptions = [
  { value: null, label: "Todos", icon: "mdi mdi-view-grid" },
  { value: "jardinagem", label: "Jardinagem", icon: "mdi mdi-leaf" },
  { value: "limpeza", label: "Limpeza", icon: "mdi mdi-broom" },
  { value: "reparos", label: "Reparos", icon: "mdi mdi-tools" },
  { value: "pintura", label: "Pintura", icon: "mdi mdi-format-paint" },
  { value: "encanamento", label: "Encanamento", icon: "mdi mdi-pipe" },
  { value: "eletrica", label: "Elétrica", icon: "mdi mdi-flash" },
  { value: "construcao", label: "Construção", icon: "mdi mdi-hard-hat" },
  { value: "informatica", label: "Informática", icon: "mdi mdi-laptop" },
  { value: "transporte", label: "Transporte", icon: "mdi mdi-truck" },
  { value: "outros", label: "Outros", icon: "mdi mdi-hammer-wrench" },
];

const getIcon = (cat: string) => categoriasOptions.find((c) => c.value === cat)?.icon || "mdi mdi-toolbox";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } }),
};

// ── Avaliar Modal ──
function AvaliarModal({ classificadoId, onDone, onClose }: { classificadoId: string; onDone: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: "", email: "", nota: 0, comentario: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { setError("Nome é obrigatório."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("E-mail válido é obrigatório."); return; }
    if (!form.nota) { setError("Selecione uma nota."); return; }
    setSending(true);
    try {
      await supabase.from("avaliacoes_classificados").insert([{
        classificado_id: classificadoId,
        nota: form.nota,
        comentario: form.comentario.trim() || null,
        nome_avaliador: form.nome.trim(),
        email_avaliador: form.email.trim().toLowerCase(),
        created_at: new Date().toISOString(),
      }]);
      onDone();
      onClose();
    } catch {
      setError("Erro ao enviar avaliação.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avaliar Serviço</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu nome *</label>
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" placeholder="Maria Silva" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nota *</label>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setForm({ ...form, nota: s })} className={`text-2xl transition-colors ${s <= form.nota ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}>★</button>
            ))}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comentário (opcional)</label>
            <textarea value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none" />
          </div>
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm">{error}</div>}
          <button type="submit" disabled={sending} className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 disabled:opacity-60 transition-all shadow-md shadow-green-600/20">
            {sending ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Detalhes Modal ──
function DetalhesModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAvaliar, setShowAvaliar] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data: c } = await supabase.from("classificados").select("*").eq("id", id).single();
    const { data: a } = await supabase.from("avaliacoes_classificados").select("*").eq("classificado_id", id).order("created_at", { ascending: false });
    const avs = (a || []).map((x: any) => ({ ...x, data: new Date(x.created_at).toLocaleDateString("pt-BR") }));
    const med = avs.length ? (avs.reduce((acc: number, x: any) => acc + x.nota, 0) / avs.length).toFixed(1) : null;
    setData({ ...c, mediaAvaliacoes: med ? parseFloat(med) : null, totalAvaliacoes: avs.length, avaliacoes: avs });
    setLoading(false);
  }, [id]);

  useEffect(() => { if (id) load(); }, [id, load]);

  if (!id) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="p-12 text-center"><div className="skeleton h-64 rounded-xl mb-4" /><p className="text-gray-500">Carregando...</p></div>
        ) : data ? (
          <>
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.titulo}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-5 space-y-5">
              {data.imagem_url ? (
                <img src={data.imagem_url} alt={data.titulo} className="w-full h-64 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <i className={`${getIcon(data.categoria)} text-white text-5xl`}></i>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-green">{data.categoria}</span>
                {data.mediaAvaliacoes && <span className="text-sm text-yellow-600 font-medium">★ {data.mediaAvaliacoes} ({data.totalAvaliacoes} avaliações)</span>}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.descricao}</p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Anunciante:</span> <span className="font-medium text-gray-900 dark:text-white">{data.nome_anunciante}</span></div>
                <div><span className="text-gray-500">Bairro:</span> <span className="font-medium text-gray-900 dark:text-white">{data.bairro}</span></div>
                <div><span className="text-gray-500">Telefone:</span> <span className="font-medium text-gray-900 dark:text-white">{data.telefone}</span></div>
                {data.email && <div><span className="text-gray-500">E-mail:</span> <span className="font-medium text-gray-900 dark:text-white">{data.email}</span></div>}
              </div>
              {data.avaliacoes?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Avaliações</h3>
                  <div className="space-y-3">{data.avaliacoes.map((a: any) => (
                    <div key={a.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-500">{Array(a.nota).fill("★").join("")}</span>
                        <span className="text-xs text-gray-500">{a.data}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{a.comentario || "Sem comentário."}</p>
                    </div>
                  ))}</div>
                </div>
              )}
              <button onClick={() => setShowAvaliar(true)} className="w-full py-2.5 border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm">★ Avaliar este serviço</button>
            </div>
            {data.telefone && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-5">
                <a href={`https://wa.me/55${data.telefone.replace(/\D/g, "")}?text=Olá! Gostaria de saber mais sobre: ${encodeURIComponent(data.titulo)}`} target="_blank" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-600/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                  WhatsApp
                </a>
              </div>
            )}
            <AnimatePresence>{showAvaliar && <AvaliarModal classificadoId={id} onDone={load} onClose={() => setShowAvaliar(false)} />}</AnimatePresence>
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

// ── Card ──
function Card({ c, onOpen }: { c: any; onOpen: (id: string) => void }) {
  const whatsapp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!c.telefone) return;
    window.open(`https://wa.me/55${c.telefone.replace(/\D/g, "")}?text=Olá! Gostaria de saber mais sobre: ${encodeURIComponent(c.titulo)}`, "_blank");
  };

  return (
    <motion.article
      variants={fadeInUp}
      onClick={() => onOpen(c.id)}
      className="card-modern cursor-pointer flex flex-col group"
    >
      <div className="relative overflow-hidden">
        {c.imagem_url ? (
          <img src={c.imagem_url} alt={c.titulo} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <i className={`${getIcon(c.categoria)} text-white text-4xl`}></i>
          </div>
        )}
        {c.mediaAvaliacoes && (
          <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-yellow-600 text-xs font-bold px-2 py-1 rounded-full shadow-sm">★ {c.mediaAvaliacoes}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-sm font-semibold">Ver detalhes →</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="badge badge-green mb-2 text-[10px]">{c.categoria}</span>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{c.titulo}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">{c.descricao}</p>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-900 dark:text-white truncate mr-2">{c.nome_anunciante}</span>
          {c.telefone && (
            <button onClick={whatsapp} className="flex-shrink-0 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors">WhatsApp</button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ── Main Section ──
export default function ClassificadosSection() {
  const [classificados, setClassificados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 12;

  const fetch = useCallback(async (cat: string | null, reset: boolean) => {
    const p = reset ? 0 : page;
    if (!reset && !hasMore) return;
    if (reset) { setClassificados([]); setHasMore(true); }
    setLoading(true);
    try {
      let q = supabase.from("classificados").select("*", { count: "exact" }).eq("ativo", true).eq("aprovado", true).order("created_at", { ascending: false }).range(p * PAGE_SIZE, (p + 1) * PAGE_SIZE - 1);
      if (cat) q = q.eq("categoria", cat);
      const { data, error: e } = await q;
      if (e) throw e;
      const items = data || [];
      setClassificados((prev) => (reset ? items : [...prev, ...items]));
      setHasMore(items.length === PAGE_SIZE);
      setPage(p + 1);
    } catch {
      setError("Erro ao carregar classificados.");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => { fetch(null, true); }, []);

  const mudarFiltro = (cat: string | null) => {
    setFiltro(cat);
    setPage(0);
    setHasMore(true);
    fetch(cat, true);
  };

  return (
    <section id="classificados-section" className="py-16 md:py-20 bg-gray-50/50 dark:bg-gray-900/30 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp} custom={0}>
          <h2 className="section-title text-gray-900 dark:text-white">Classificados</h2>
          <p className="section-subtitle">Encontre os melhores prestadores de serviço da região</p>
        </motion.div>

        {/* CTA banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-center">
          <p className="text-green-800 dark:text-green-200 font-medium text-sm">💼 <strong>Você presta serviço no bairro?</strong> Associe-se à AMAJAC e anuncie gratuitamente!</p>
          <Link href="/associacao" className="mt-3 inline-block px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">Quero me associar</Link>
        </motion.div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categoriasOptions.map((cat) => (
            <button key={cat.value || "todos"} onClick={() => mudarFiltro(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filtro === cat.value
                  ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
              }`}
            >
              <i className={`${cat.icon} mr-1.5`}></i>{cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading && classificados.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-modern"><div className="skeleton h-44 rounded-none rounded-t-xl" /><div className="p-4 space-y-2"><div className="skeleton h-3 w-1/4" /><div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-full" /></div></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : classificados.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-4">🔍</div><p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum classificado encontrado.</p></div>
        ) : (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {classificados.map((c) => <Card key={c.id} c={c} onOpen={setSelectedId} />)}
          </motion.div>
        )}

        {hasMore && classificados.length > 0 && (
          <div className="text-center mt-10">
            <button onClick={() => fetch(filtro, false)} disabled={loading}
              className="px-8 py-3 border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          </div>
        )}

        <AnimatePresence>{selectedId && <DetalhesModal id={selectedId} onClose={() => setSelectedId(null)} />}</AnimatePresence>
      </div>
    </section>
  );
}
