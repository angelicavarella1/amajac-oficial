"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: [0.4, 0, 0.2, 1] as const } }),
};

export default function EventosSection() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const hoje = new Date().toISOString();
        const { data, error: e } = await supabase
          .from("eventos")
          .select("*")
          .gte("data_evento", hoje)
          .order("data_evento", { ascending: true })
          .limit(6);
        if (e) throw e;

        const formatados = (data || []).map((ev: any) => {
          const d = new Date(ev.data_evento);
          const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
          const parts = fmt.formatToParts(d);
          const dia = parts.find((p) => p.type === "day")?.value;
          const mes = parts.find((p) => p.type === "month")?.value;
          const ano = parts.find((p) => p.type === "year")?.value;
          let hora = "";
          if (ev.hora_evento) {
            const [h, m] = ev.hora_evento.split(":");
            hora = ` às ${h}:${m}`;
          }
          return { ...ev, dataHorario: `${dia} de ${mes} de ${ano}${hora}` };
        });
        setEventos(formatados);
      } catch {
        setError("Não foi possível carregar os eventos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="eventos-section" className="py-16 md:py-20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp} custom={0}>
          <h2 className="section-title text-gray-900 dark:text-white">Próximos Eventos</h2>
          <p className="section-subtitle">Participe dos eventos e atividades da nossa comunidade</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-modern">
                <div className="skeleton h-40 rounded-none rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-3 w-3/4" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 dark:text-red-400">{error}</div>
        ) : eventos.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center py-16">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum evento agendado no momento.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((ev, i) => (
              <motion.article
                key={ev.id}
                custom={i + 1}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="card-modern flex flex-col group"
              >
                <div className="relative overflow-hidden">
                  {ev.imagem_url ? (
                    <img src={ev.imagem_url} alt={ev.titulo} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  {ev.destaque && (
                    <span className="absolute top-3 left-3 badge badge-green bg-amber-500 text-white">Destaque</span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {ev.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">{ev.descricao}</p>
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="font-medium">{ev.dataHorario}</span>
                    </div>
                    {ev.local && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>{ev.local}</span>
                      </div>
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
