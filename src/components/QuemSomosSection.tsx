"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function QuemSomosSection() {
  const [texto, setTexto] = useState("");
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: e } = await supabase
          .from("configuracoes")
          .select("chave, valor")
          .in("chave", ["missao", "visao", "valores", "historia", "quem_somos_imagem_url"]);

        if (e) throw new Error(e.message);

        if (data && data.length > 0) {
          const cfg: Record<string, string> = {};
          data.forEach((item: any) => (cfg[item.chave] = item.valor));
          setImagemUrl(cfg.quem_somos_imagem_url || null);

          let html = "";
          if (cfg.historia) html += `<div class="historia-section"><h3 class="subtitulo">Nossa História</h3><p>${cfg.historia}</p></div>`;
          if (cfg.missao) html += `<div class="missao-section"><h3 class="subtitulo">Missão</h3><p>${cfg.missao}</p></div>`;
          if (cfg.visao) html += `<div class="visao-section"><h3 class="subtitulo">Visão</h3><p>${cfg.visao}</p></div>`;
          if (cfg.valores) html += `<div class="valores-section"><h3 class="subtitulo">Valores</h3><p>${cfg.valores}</p></div>`;
          setTexto(html || "Informações institucionais não disponíveis.");
        } else {
          setTexto("Informações institucionais não disponíveis.");
        }
      } catch (err: any) {
        setError("Não foi possível carregar as informações.");
        setTexto("Informações institucionais não disponíveis.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section
      id="quem-somos-section"
      ref={sectionRef}
      className="py-16 md:py-20 scroll-mt-32"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          custom={0}
        >
          <h2 className="section-title text-gray-900 dark:text-white">Quem Somos</h2>
          <p className="section-subtitle">
            Conheça a história, a missão e os valores que guiam a nossa associação
          </p>
        </motion.div>

        {/* Imagem institucional */}
        {imagemUrl && imgLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mb-14 rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
          >
            <img
              src={imagemUrl}
              alt="Imagem institucional AMAJAC"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgLoaded(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mx-auto"
            >
              Tentar novamente
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="quem-somos-conteudo"
            dangerouslySetInnerHTML={{ __html: texto }}
          />
        )}
      </div>

      {/* Inject motion classes into dynamically rendered HTML */}
      {!loading && !error && (
        <style>{`
          .quem-somos-conteudo .historia-section,
          .quem-somos-conteudo .missao-section,
          .quem-somos-conteudo .visao-section,
          .quem-somos-conteudo .valores-section {
            opacity: 0;
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .quem-somos-conteudo .historia-section { animation-delay: 0.2s; }
          .quem-somos-conteudo .missao-section { animation-delay: 0.35s; }
          .quem-somos-conteudo .visao-section { animation-delay: 0.5s; }
          .quem-somos-conteudo .valores-section { animation-delay: 0.65s; }
        `}</style>
      )}
    </section>
  );
}
