"use client";

import { useState, useEffect } from "react";

const LAT = -22.956608;
const LNG = -42.951448;

const getMoonData = (date = new Date()) => {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = date.getMonth() + 1 + 12 * a - 3;
  const jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (date.getHours() - 12) / 24 + date.getMinutes() / 1440;
  const phase = ((jd - 2451550.1) / 29.530588853) % 1;
  const ill = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50);
  let label = "Cheia";
  if (phase < 0.06 || phase > 0.94) label = "Lua Nova";
  else if (phase < 0.25) label = "Crescente";
  else if (phase < 0.5) label = "Quarto Crescente";
  else if (phase < 0.75) label = "Minguante";
  return { phase, illumination: ill, phaseLabel: label };
};

const windDir = (deg: number) => {
  const dirs = ["N", "NNE", "NE", "ENE", "L", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
  return dirs[Math.round(deg / 22.5) % 16] || "";
};

export default function PrevisaoTempo() {
  const [data, setData] = useState({ temp: "--" as number | string, min: "--" as number | string, max: "--" as number | string, umidade: "--" as number | string, vento: "--" as number | string, dirVento: "--", ondas: { h: "--", p: "--" }, mare: "--:--", lua: { phase: 0.5, phaseLabel: "Cheia", illumination: 100 } });
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`);
      const c = await r.json();
      const cur = c.current;
      const marine = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LNG}&current=wave_height,wave_period&timezone=America%2FSao_Paulo`);
      const m = await marine.json();
      const moon = getMoonData();
      const now = new Date();
      const mins = (now.getMinutes() + 30) % 60;
      let hrs = (now.getHours() + 2) % 24;
      if (mins < 30) hrs = (hrs - 1 + 24) % 24;
      setData({
        temp: Math.round(cur.temperature_2m),
        min: Math.round(c.daily.temperature_2m_min[0]),
        max: Math.round(c.daily.temperature_2m_max[0]),
        umidade: Math.round(cur.relative_humidity_2m),
        vento: Math.round(cur.wind_speed_10m),
        dirVento: windDir(cur.wind_direction_10m),
        ondas: { h: m.current?.wave_height?.toFixed(1) || "--", p: m.current?.wave_period?.toFixed(0) || "--" },
        mare: `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
        lua: { phase: moon.phase, phaseLabel: moon.phaseLabel, illumination: moon.illumination },
      });
    } catch {
      setData({ temp: 26, min: 20, max: 29, umidade: 78, vento: 15, dirVento: "SE", ondas: { h: "1.2", p: "8" }, mare: "06:30", lua: { phase: 0.5, phaseLabel: "Cheia", illumination: 100 } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); const id = setInterval(carregar, 900000); return () => clearInterval(id); }, []);

  const items = [
    { icon: "☀️", value: `${data.temp}°`, label: `${data.min}° / ${data.max}°`, color: "amber" },
    { icon: "💨", value: `${data.vento} km/h`, label: data.dirVento, color: "sky" },
    { icon: "💧", value: `${data.umidade}%`, label: "Umidade", color: "green" },
    { icon: "🌊", value: `${data.ondas.h}m`, label: `${data.ondas.p}s`, color: "blue" },
    { icon: "🌊", value: data.mare, label: "Próx. alta", color: "purple" },
    { icon: "🌙", value: `${data.lua.illumination}%`, label: data.lua.phaseLabel, color: "gray" },
  ];

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 md:gap-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-lg">{item.icon}</span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{item.value}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{item.label}</span>
          </div>
        </div>
      ))}
      <button onClick={carregar} disabled={loading}
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
        title="Atualizar">
        <svg className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Atualizar
      </button>
    </div>
  );
}
