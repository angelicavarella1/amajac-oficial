'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function EventosSection() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = async () => {
    setLoading(true);
    setError(null);
    try {
      const hoje = new Date().toISOString();
      const { data, error: err } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_evento', hoje) // Apenas eventos futuros ou do dia
        .order('data_evento', { ascending: true })
        .limit(6);

      if (err) throw err;

      const formatados = (data || []).map(evento => {
        const dataEv = new Date(evento.data_evento);
        const formatadorData = new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        
        const partesData = formatadorData.formatToParts(dataEv);
        const dia = partesData.find(p => p.type === 'day')?.value;
        const mes = partesData.find(p => p.type === 'month')?.value;
        const ano = partesData.find(p => p.type === 'year')?.value;
        
        let horaFormatada = '';
        if (evento.hora_evento) {
          const [hora, min] = evento.hora_evento.split(':');
          horaFormatada = ` às ${hora}:${min}`;
        }

        return {
          ...evento,
          dataHorario: `${dia} de ${mes} de ${ano}${horaFormatada}`
        };
      });

      setEventos(formatados);
    } catch (e) {
      console.error('Erro ao buscar eventos:', e);
      setError('Não foi possível carregar os eventos recentes.');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <section
      id="eventos-section"
      aria-labelledby="eventos-title"
      className="eventos-section py-12 px-4 transition-colors duration-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h2
            id="eventos-title"
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Próximos Eventos
          </h2>
          <p className="max-w-2xl mx-auto">
            Confira os eventos oficiais da AMAJAC.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#2E7D32] border-t-transparent"></div>
            <p className="mt-4">Carregando eventos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="font-medium">{error}</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-16">
            <p>Nenhum evento agendado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((e) => (
              <article
                key={e.id}
                className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
              >
                <div className="relative">
                  {e.imagem_url ? (
                    <img
                      src={e.imagem_url}
                      alt={e.imagem_alt || `Imagem do evento ${e.titulo}`}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-40 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  {e.destaque && (
                    <div className="absolute top-3 left-3 bg-[#2E7D32] text-white text-xs font-bold px-2 py-1 rounded">
                      Destaque
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-800 dark:text-white">
                    {e.titulo}
                  </h3>
                  <p className="text-sm mb-3 flex-grow line-clamp-3 text-gray-600 dark:text-gray-400">
                    {e.descricao}
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-[#2E7D32]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{e.dataHorario}</span>
                    </div>
                    {e.local && (
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{e.local}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
