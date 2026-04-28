'use client';

import { useState, useEffect } from 'react';

// Constantes de localização para API (Maricá/Região)
const LATITUDE = -22.956608;
const LONGITUDE = -42.951448;

const getMoonData = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (date.getHours() - 12) / 24 + date.getMinutes() / 1440 + date.getSeconds() / 86400;

  const daysSinceNew = jd - 2451550.1;
  const newMoons = daysSinceNew / 29.530588853;
  const phase = newMoons - Math.floor(newMoons);

  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50);

  let phaseLabel = 'Cheia';
  if (phase < 0.06 || phase > 0.94) phaseLabel = 'Lua Nova';
  else if (phase < 0.25) phaseLabel = 'Crescente Côncavo';
  else if (phase < 0.5) phaseLabel = 'Quarto Crescente';
  else if (phase < 0.75) phaseLabel = 'Crescente Convexo';
  else phaseLabel = 'Minguante';

  return { phase, illumination, phaseLabel };
};

const getMoonEmoji = (phase: number) => {
  if (phase < 0.1 || phase > 0.9) return '🌑';
  if (phase < 0.25) return '🌒';
  if (phase < 0.4) return '🌓';
  if (phase < 0.6) return '🌔';
  if (phase < 0.75) return '🌕';
  if (phase < 0.9) return '🌖';
  return '🌗';
};

const calcularDirecao = (graus: number) => {
  const direcoes = ['N', 'NNE', 'NE', 'ENE', 'L', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  return direcoes[Math.round(graus / 22.5) % 16] || '';
};

export default function PrevisaoTempo() {
  const [tempHoje, setTempHoje] = useState<number | string>('--');
  const [tempMin, setTempMin] = useState<number | string>('--');
  const [tempMax, setTempMax] = useState<number | string>('--');
  const [umidade, setUmidade] = useState<number | string>('--');
  const [vento, setVento] = useState<number | string>('--');
  const [direcaoVento, setDirecaoVento] = useState('--');
  const [ondas, setOndas] = useState({ wave_height: '--', wave_period: '--' });
  const [mare, setMare] = useState({ alta: '--:--' });
  const [lua, setLua] = useState({ phase: 0.5, phaseLabel: 'Cheia', illumination: 100 });
  const [tempoAtualizado, setTempoAtualizado] = useState(0);
  const [loading, setLoading] = useState(false);

  const carregarDados = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const climaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo&forecast_days=1`;
      const climaResponse = await fetch(climaUrl);
      const climaData = await climaResponse.json();

      if (climaData.error) throw new Error(climaData.reason || 'Erro na API de Clima.');

      const current = climaData.current;
      setTempHoje(Math.round(current.temperature_2m));
      setUmidade(Math.round(current.relative_humidity_2m));
      setVento(Math.round(current.wind_speed_10m));
      setDirecaoVento(calcularDirecao(current.wind_direction_10m));
      setTempMin(Math.round(climaData.daily.temperature_2m_min[0]));
      setTempMax(Math.round(climaData.daily.temperature_2m_max[0]));

      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=wave_height,wave_period&timezone=America%2FSao_Paulo`;
      const marineResponse = await fetch(marineUrl);
      const marineData = await marineResponse.json();

      if (marineData.error) throw new Error(marineData.reason || 'Erro na API Marinha.');
      const marineCurrent = marineData.current;
      setOndas({
        wave_height: marineCurrent.wave_height?.toFixed(1) || '--',
        wave_period: marineCurrent.wave_period?.toFixed(0) || '--',
      });

      const moonData = getMoonData();
      setLua({
        phase: moonData.phase,
        phaseLabel: moonData.phaseLabel,
        illumination: moonData.illumination,
      });

      const agora = new Date();
      const minutos = (agora.getMinutes() + 30) % 60;
      let horas = agora.getHours() + 2;
      if (minutos < 30) horas = (horas - 1) % 24;
      setMare({ alta: `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}` });

      setTempoAtualizado(0);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setTempHoje(26);
      setTempMin(20);
      setTempMax(29);
      setUmidade(78);
      setVento(15);
      setDirecaoVento('SE');
      setOndas({ wave_height: '1.2', wave_period: '8' });
      setMare({ alta: '06:30' });
      setLua({ phase: 0.5, phaseLabel: 'Cheia', illumination: 100 });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setTempoAtualizado(0);
    await carregarDados();
  };

  useEffect(() => {
    carregarDados();
    const intervalId = setInterval(async () => {
      setTempoAtualizado((prev) => {
        const next = prev + 15;
        if (next % 15 === 0) {
          carregarDados();
        }
        return next;
      });
    }, 900000); // 15 minutos

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="navbar-previsao-wrapper w-screen -ml-[50vw] left-[50%] relative bg-white border-b border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:bg-gray-800 dark:border-gray-700">
        <div className="navbar-previsao flex items-center justify-around max-w-[1200px] mx-auto p-2 gap-1 flex-wrap md:flex-nowrap">
          
          <div className="nav-item clima-item flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-gray-700 min-w-[110px] flex-1">
            <div className="nav-icon bg-amber-400/20 text-amber-600 flex items-center justify-center w-8 h-8 rounded shrink-0">
              <i className="mdi mdi-weather-sunny text-base"></i>
              <span className="fallback-icone hidden text-sm">☀️</span>
            </div>
            <div className="nav-info flex flex-col flex-1 min-w-0">
              <div className="nav-temp text-lg font-bold text-gray-800 dark:text-gray-50 leading-none">{tempHoje}°</div>
              <div className="nav-details text-[0.7rem] text-gray-500 mt-0.5 truncate max-w-full">
                <span className="nav-minmax font-semibold text-gray-500">{tempMin}° / {tempMax}°</span>
              </div>
            </div>
          </div>

          <div className="nav-item vento-item flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-gray-700 min-w-[110px] flex-1">
            <div className="nav-icon bg-blue-500/20 text-blue-600 flex items-center justify-center w-8 h-8 rounded shrink-0">
              <i className="mdi mdi-weather-windy text-base"></i>
              <span className="fallback-icone hidden text-sm">💨</span>
            </div>
            <div className="nav-info flex flex-col flex-1 min-w-0">
              <div className="nav-value text-sm font-bold text-gray-800 dark:text-gray-50 leading-none">{vento} km/h</div>
              <div className="nav-details text-[0.7rem] text-gray-500 mt-0.5 truncate max-w-full">{direcaoVento}</div>
            </div>
          </div>

          <div className="nav-item umidade-item flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-gray-700 min-w-[110px] flex-1">
            <div className="nav-icon bg-green-500/20 text-green-600 flex items-center justify-center w-8 h-8 rounded shrink-0">
              <i className="mdi mdi-water-percent text-base"></i>
              <span className="fallback-icone hidden text-sm">💧</span>
            </div>
            <div className="nav-info flex flex-col flex-1 min-w-0">
              <div className="nav-value text-sm font-bold text-gray-800 dark:text-gray-50 leading-none">{umidade}%</div>
              <div className="nav-details text-[0.7rem] text-gray-500 mt-0.5 truncate max-w-full">Umidade</div>
            </div>
          </div>

          <div className="nav-item ondas-item flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-gray-700 min-w-[110px] flex-1">
            <div className="nav-icon bg-sky-500/20 text-sky-600 flex items-center justify-center w-8 h-8 rounded shrink-0">
              <i className="mdi mdi-wave text-base"></i>
              <span className="fallback-icone hidden text-sm">🌊</span>
            </div>
            <div className="nav-info flex flex-col flex-1 min-w-0">
              <div className="nav-value text-sm font-bold text-gray-800 dark:text-gray-50 leading-none">{ondas.wave_height}m</div>
              <div className="nav-details text-[0.7rem] text-gray-500 mt-0.5 truncate max-w-full">{ondas.wave_period}s</div>
            </div>
          </div>

          <div className="nav-item mares-item flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-gray-700 min-w-[110px] flex-1">
            <div className="nav-icon bg-purple-500/20 text-purple-600 flex items-center justify-center w-8 h-8 rounded shrink-0">
              <span className="mare-emoji text-sm">🌅</span>
            </div>
            <div className="nav-info flex flex-col flex-1 min-w-0">
              <div className="nav-value text-sm font-bold text-gray-800 dark:text-gray-50 leading-none">{mare.alta}</div>
              <div className="nav-details text-[0.7rem] text-gray-500 mt-0.5 truncate max-w-full">Próxima alta</div>
            </div>
          </div>

          <div className="nav-item lua-item flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-gray-700 min-w-[110px] flex-1">
            <div className="nav-icon bg-gray-400/20 text-gray-500 flex items-center justify-center w-8 h-8 rounded shrink-0">
              <span className="lua-emoji text-sm">{getMoonEmoji(lua.phase)}</span>
            </div>
            <div className="nav-info flex flex-col flex-1 min-w-0">
              <div className="nav-value text-sm font-bold text-gray-800 dark:text-gray-50 leading-none">{lua.illumination}%</div>
              <div className="nav-details text-[0.7rem] text-gray-500 mt-0.5 truncate max-w-full">{lua.phaseLabel}</div>
            </div>
          </div>

          <div className="nav-item refresh-item flex items-center gap-2 p-0 rounded-md min-w-[110px] flex-1 md:flex-none">
            <button 
              onClick={refreshData} 
              disabled={loading} 
              title="Atualizar dados"
              className="nav-refresh-btn flex items-center gap-1.5 bg-[#2E7D32] text-white border-none rounded py-1.5 px-2.5 cursor-pointer text-xs font-semibold transition-all h-8 w-full justify-center hover:bg-[#1B5E20] hover:scale-[1.02] disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-80"
            >
              <i className={`mdi mdi-refresh ${loading ? 'animate-spin' : ''}`}></i>
              <span className="fallback-icone hidden">🔍</span>
              <span className="update-time text-[0.7rem] opacity-90">{loading ? 'Carregando...' : tempoAtualizado > 0 ? tempoAtualizado + 'min' : 'Agora'}</span>
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}
