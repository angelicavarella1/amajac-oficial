"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function NoticiasSection() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: e } = await supabase
          .from("noticias")
          .select("*")
          .eq("ativo", true)
          .eq("rascunho", false)
          .order("destaque", { ascending: false })
          .order("data_publicacao", { ascending: false })
          .limit(6);
        if (e) throw e;
        setNoticias(data || []);
      } catch (err) {
        setError("Não foi possível carregar as notícias.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("pt-BR") : "";
  const preview = (c: string) => c ? c.substring(0, 140) + (c.length > 140 ? "..." : "") : "";

  return (
    <section id="noticias-section" className="py-16 md:py-20 bg-gray-50/50 dark:bg-gray-900/30 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp} custom={0}
        >
          <h2 className="section-title text-gray-900 dark:text-white">Notícias</h2>
          <p className="section-subtitle">Fique por dentro das últimas novidades da AMAJAC</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-modern">
                <div className="skeleton h-48 rounded-none rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-1/4" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 dark:text-red-400">{error}</div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma notícia no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((n, i) => (
              <motion.article
                key={n.id}
                custom={i + 1}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                onClick={() => router.push(`/noticias/${n.id}`)}
                className="card-modern cursor-pointer flex flex-col group"
              >
                <div className="relative overflow-hidden">
                  {n.imagem_url ? (
                    <img src={n.imagem_url} alt={n.titulo} className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </div>
                  )}
                  {n.destaque && (
                    <span className="absolute top-3 left-3 badge badge-green bg-green-600 text-white dark:bg-green-500">
                      Destaque
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-semibold flex items-center gap-1">
                      Ler notícia <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  {n.data_publicacao && (
                    <time className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">{fmtDate(n.data_publicacao)}</time>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {n.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
                    {n.resumo || preview(n.conteudo)}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>Por {n.autor || "Equipe AMAJAC"}</span>
                    {n.visualizacoes > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {n.visualizacoes}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
