'use client';

import { useState, useEffect } from 'react';

export default function Relogio() {
  const [hora, setHora] = useState('--:--:--');
  const [diaSemana, setDiaSemana] = useState('---');
  const [dataExtenso, setDataExtenso] = useState('-- de --------');

  useEffect(() => {
    let timeoutId: number | null = null;
    let ultimaAtualizacao = 0;
    const INTERVALO_ATUALIZACAO = 1000;
    const THRESHOLD_PERFORMANCE = 16;
    let isMounted = true;

    const diasSemanaStr = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const mesesStr = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    const atualizar = () => {
      if (!isMounted) return;

      const agora = Date.now();
      
      if (agora - ultimaAtualizacao < THRESHOLD_PERFORMANCE) {
        agendarProximaAtualizacao();
        return;
      }
      
      ultimaAtualizacao = agora;
      const data = new Date(agora);
      
      try {
        const horas = data.getHours().toString().padStart(2, '0');
        const minutos = data.getMinutes().toString().padStart(2, '0');
        const segundos = data.getSeconds().toString().padStart(2, '0');
        setHora(`${horas}:${minutos}:${segundos}`);
        
        const diaNum = data.getDay();
        let diaNome = diasSemanaStr[diaNum];
        diaNome = diaNome.charAt(0).toUpperCase() + diaNome.slice(1);
        setDiaSemana(diaNome);
        
        const dia = data.getDate();
        const mes = mesesStr[data.getMonth()];
        setDataExtenso(`${dia} de ${mes}`);
      } catch (error) {
        console.warn('Erro ao atualizar relógio:', error);
      }
      
      agendarProximaAtualizacao();
    };

    const agendarProximaAtualizacao = () => {
      const agora = Date.now();
      const proximoTick = INTERVALO_ATUALIZACAO - (agora % INTERVALO_ATUALIZACAO);
      timeoutId = window.setTimeout(() => {
        requestAnimationFrame(atualizar);
      }, Math.max(proximoTick, 0));
    };

    const iniciarRelogio = () => {
      requestAnimationFrame(atualizar);
    };

    const pararRelogio = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    iniciarRelogio();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pararRelogio();
      } else {
        iniciarRelogio();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      pararRelogio();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <div className="relogio-data flex items-center gap-3 font-semibold text-[#2E7D32] dark:text-[#4CAF50] bg-[#2E7D32]/10 dark:bg-[#2E7D32]/15 px-4 py-2 rounded-lg min-w-[280px] h-[56px] will-change-transform font-['Montserrat',sans-serif]">
        <div className="hora text-lg font-bold font-mono tracking-wide">{hora}</div>
        <div className="separador w-[1px] h-[30px] bg-[#2E7D32]/30"></div>
        <div className="data-completa flex flex-col gap-0.5">
          <span className="dia-semana text-sm font-semibold lowercase first-letter:uppercase">{diaSemana}</span>
          <span className="data-extenso text-sm font-medium opacity-90">{dataExtenso}</span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .relogio-data { min-width: 240px; padding: 0.5rem 0.8rem; gap: 0.5rem; }
          .relogio-data .hora { font-size: 1rem; }
          .relogio-data .dia-semana, .relogio-data .data-extenso { font-size: 0.8rem; }
        }
        @media (max-width: 640px) {
          .relogio-data { min-width: 220px; padding: 0.4rem 0.7rem; gap: 0.4rem; }
          .relogio-data .hora { font-size: 0.9rem; }
          .relogio-data .dia-semana, .relogio-data .data-extenso { font-size: 0.75rem; }
          .relogio-data .separador { height: 25px; }
        }
      ` }} />
    </>
  );
}
