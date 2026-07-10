"use client";

import { useState, useEffect } from "react";

export default function Relogio() {
  const [hora, setHora] = useState("--:--:--");
  const [dia, setDia] = useState("---");
  const [data, setData] = useState("-- de --------");

  useEffect(() => {
    const dias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    let mounted = true;

    const tick = () => {
      if (!mounted) return;
      const d = new Date();
      setHora(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
      setDia(dias[d.getDay()].replace(/^\w/, (c) => c.toUpperCase()));
      setData(`${d.getDate()} de ${meses[d.getMonth()]}`);
    };

    tick();
    const id = setInterval(tick, 1000);

    const vis = () => { if (document.hidden) { clearInterval(id); } else { tick(); } };
    document.addEventListener("visibilitychange", vis);

    return () => { mounted = false; clearInterval(id); document.removeEventListener("visibilitychange", vis); };
  }, []);

  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span className="font-mono font-bold tracking-wide">{hora}</span>
      </div>
      <div className="hidden sm:block text-gray-600 dark:text-gray-400">
        <span className="font-semibold">{dia}</span>
        <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
        <span>{data}</span>
      </div>
    </div>
  );
}
