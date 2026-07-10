"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

export default function ParceirosSection() {
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: e } = await supabase.from("parceiros_comerciais").select("*").eq("ativo", true).order("nome", { ascending: true });
        if (e) throw e;
        setParceiros(data || []);
      } catch { setError("Erro ao carregar."); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="text-center mb-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Nossos Colaboradores</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Parceiros Comerciais</p>
        <div className="section-divider mt-3" />
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-center text-sm text-red-500">{error}</div>
      ) : parceiros.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Nenhum parceiro ativo.</div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {parceiros.map((p) => (
            <motion.div key={p.id} whileHover={{ scale: 1.02 }} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center gap-3 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.nome} className="w-full h-full object-contain p-1" loading="lazy" />
                ) : (
                  <span className="text-sm font-bold text-green-600">{p.nome.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.nome}</p>
                {p.ramo && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.ramo}</p>}
                <div className="flex gap-2 mt-1">
                  {p.link_site && <a href={p.link_site} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-600 hover:underline">Site</a>}
                  {p.instagram && <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-pink-500 hover:underline">IG</a>}
                  {p.facebook && <a href={`https://facebook.com/${p.facebook}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline">FB</a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
