"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } }),
};

export default function GaleriaSection() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState("");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: e } = await supabase.from("galeria").select("*").order("created_at", { ascending: false });
        if (e) throw e;
        setImages((data || []).map((r: any) => ({
          ...r,
          url: r.imagem_url || "https://placehold.co/400x300/2E7D32/FFFFFF?text=Sem+Imagem",
          alt: r.imagem_alt || r.titulo || "Imagem",
        })));
      } catch { setError("Erro ao carregar galeria."); }
      finally { setLoading(false); }
    })();
  }, []);

  const categorias = useMemo(() => [...new Set(images.map((i) => i.categoria || "Geral"))].sort(), [images]);
  const filtradas = useMemo(() => categoriaAtiva ? images.filter((i) => (i.categoria || "Geral") === categoriaAtiva) : images, [images, categoriaAtiva]);
  const idx = selected ? filtradas.findIndex((i) => i.id === selected.id) : -1;

  const fmtCat = (c: string) => (c || "Geral").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("pt-BR") : "";

  const nav = useCallback((dir: 1 | -1) => {
    const next = idx + dir;
    if (next >= 0 && next < filtradas.length) setSelected(filtradas[next]);
  }, [idx, filtradas]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "ArrowRight") nav(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected, nav]);

  return (
    <section id="galeria-section" className="py-16 md:py-20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp} custom={0}>
          <h2 className="section-title text-gray-900 dark:text-white">Galeria de Fotos</h2>
          <p className="section-subtitle">Momentos e registros da nossa comunidade</p>
        </motion.div>

        {/* Filtros */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button onClick={() => setCategoriaAtiva("")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${categoriaAtiva === "" ? "bg-green-600 text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300"}`}>Todas</button>
            {categorias.map((cat) => (
              <button key={cat} onClick={() => setCategoriaAtiva(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${categoriaAtiva === cat ? "bg-green-600 text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300"}`}>{fmtCat(cat)}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="card-modern"><div className="skeleton h-48 rounded-none rounded-t-xl" /><div className="p-3"><div className="skeleton h-3 w-3/4" /></div></div>)}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : filtradas.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-4">🖼️</div><p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma imagem encontrada.</p></div>
        ) : (
          <>
            {categoriaAtiva ? (
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtradas.map((img, i) => (
                  <motion.div key={img.id} layout custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeInUp}
                    onClick={() => setSelected(img)}
                    className="card-modern cursor-pointer group"
                  >
                    <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{img.titulo || "Sem título"}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{fmtDate(img.created_at)}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="space-y-14">
                {categorias.map((cat) => {
                  const items = images.filter((i) => (i.categoria || "Geral") === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        {fmtCat(cat)}
                        <span className="text-sm font-normal text-gray-400">({items.length})</span>
                      </h3>
                      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((img, i) => (
                          <motion.div key={img.id} layout custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeInUp}
                            onClick={() => setSelected(img)}
                            className="card-modern cursor-pointer group"
                          >
                            <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700">
                              <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                              </div>
                            </div>
                            <div className="p-3"><h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{img.titulo || "Sem título"}</h3><p className="text-xs text-gray-500 mt-0.5">{fmtDate(img.created_at)}</p></div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {idx > 0 && (
              <button onClick={() => nav(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden sm:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            {idx < filtradas.length - 1 && (
              <button onClick={() => nav(1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden sm:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
            <motion.div key={selected.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="max-w-5xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
              <img src={selected.url} alt={selected.alt} className="w-full h-full object-contain max-h-[75vh]" />
              <div className="mt-4 text-center text-white">
                <h3 className="text-lg font-bold">{selected.titulo}</h3>
                <p className="text-sm text-gray-400">{fmtCat(selected.categoria || "Geral")} · {fmtDate(selected.created_at)}</p>
                <p className="text-xs text-gray-500 mt-1">{idx + 1} de {filtradas.length}</p>
              </div>
              {/* Mobile nav */}
              <div className="flex justify-center gap-4 mt-4 sm:hidden">
                <button onClick={() => nav(-1)} disabled={idx <= 0} className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30">Anterior</button>
                <button onClick={() => nav(1)} disabled={idx >= filtradas.length - 1} className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30">Próxima</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
