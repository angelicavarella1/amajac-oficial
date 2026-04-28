'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function QuemSomosSection() {
  const [titulo] = useState('Quem Somos');
  const [texto, setTexto] = useState('');
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchSobre = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .select('chave, valor')
        .in('chave', ['missao', 'visao', 'valores', 'historia', 'quem_somos_imagem_url']);

      if (supabaseError) {
        throw new Error(`Erro ao buscar configurações: ${supabaseError.message}`);
      }

      let conteudoCompleto = '';

      if (data && data.length > 0) {
        const config: Record<string, string> = {};
        data.forEach((item) => {
          config[item.chave] = item.valor;
        });

        const imgUrl = config.quem_somos_imagem_url || '';
        setImagemUrl(imgUrl);

        conteudoCompleto = `
          <div class="sobre-layout-com-imagem">
            <div class="conteudo-textual">
              ${config.historia ? `<div class="historia-section">
                <h3 class="subtitulo">Nossa História</h3>
                <p>${config.historia}</p>
              </div>` : ''}

              ${config.missao ? `<div class="missao-section">
                <h3 class="subtitulo">Missão</h3>
                <p>${config.missao}</p>
              </div>` : ''}

              ${config.visao ? `<div class="visao-section">
                <h3 class="subtitulo">Visão</h3>
                <p>${config.visao}</p>
              </div>` : ''}

              ${config.valores ? `<div class="valores-section">
                <h3 class="subtitulo">Valores</h3>
                <p>${config.valores}</p>
              </div>` : ''}
            </div>
          </div>
        `;

        if (!conteudoCompleto.trim()) {
          setTexto('Informações institucionais não disponíveis.');
        } else {
          setTexto(conteudoCompleto);
        }
      } else {
        setTexto('Informações institucionais não disponíveis.');
      }
    } catch (err: any) {
      console.error('[QuemSomosSection] Erro:', err);
      setError('Não foi possível carregar as informações institucionais.');
      setTexto('Informações institucionais não disponíveis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSobre();
    
    // Verificar se deve rolar para a seção
    const hash = window.location.hash;
    if (hash === '#quem-somos' || window.location.pathname.includes('sobre')) {
      setTimeout(() => {
        if (sectionRef.current) {
          const navbarHeight = 128;
          const sectionPosition = sectionRef.current.offsetTop - navbarHeight;
          window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []);

  const handleImageError = () => {
    setImagemCarregada(false);
    console.log('❌ Erro ao carregar imagem institucional');
  };

  return (
    <section
      id="quem-somos-section"
      ref={sectionRef}
      className="quem-somos-section"
      aria-labelledby="quem-somos-titulo"
    >
      <div className="container mx-auto px-4 sm:px-8 max-w-[1000px]">
        <h2 id="quem-somos-titulo" className="titulo text-[#2E7D32] text-[2.5rem] font-bold text-center mb-8">
          {titulo}
        </h2>

        {imagemUrl && imagemCarregada && (
          <div className="imagem-container w-full max-w-[800px] mx-auto mb-12 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
            <img 
              src={imagemUrl} 
              alt="Imagem institucional da AMAJAC"
              className="imagem-institucional w-full h-auto block object-cover"
              onError={handleImageError}
            />
          </div>
        )}

        {loading ? (
          <div className="estado-texto text-center p-8 text-slate-500 italic text-[1.1rem]">
            Carregando informações institucionais...
          </div>
        ) : error ? (
          <div className="estado-texto erro text-center p-8 text-red-500 italic text-[1.1rem]">
            {error}
            <button
              onClick={fetchSobre}
              className="btn-tentar-novamente block mx-auto mt-4 px-8 py-3 bg-[#2E7D32] text-white font-semibold rounded-lg transition-all duration-300 hover:bg-[#256a2a] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(46,125,50,0.3)]"
              aria-label="Tentar carregar novamente"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div
            className="conteudo text-lg leading-relaxed text-slate-700 dark:text-slate-200 max-w-[800px] mx-auto quem-somos-conteudo"
            dangerouslySetInnerHTML={{ __html: texto }}
          />
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .quem-somos-section {
          padding: 3rem 1rem;
          background-color: #f9fafb;
          color: #1e293b;
          transition: background-color 0.3s, color 0.3s;
          width: 100%;
          scroll-margin-top: 128px;
        }
        .dark .quem-somos-section {
          background-color: #111827;
          color: #f1f5f9;
        }
        .quem-somos-conteudo .subtitulo {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2E7D32;
          margin: 2rem 0 1rem 0;
          border-bottom: 2px solid #2E7D32;
          padding-bottom: 0.5rem;
          text-align: left;
        }
        .quem-somos-conteudo .historia-section,
        .quem-somos-conteudo .missao-section,
        .quem-somos-conteudo .visao-section,
        .quem-somos-conteudo .valores-section {
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-left: 4px solid #2E7D32;
          margin-bottom: 2rem;
        }
        .dark .quem-somos-conteudo .historia-section,
        .dark .quem-somos-conteudo .missao-section,
        .dark .quem-somos-conteudo .visao-section,
        .dark .quem-somos-conteudo .valores-section {
          background: #1f2937;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .quem-somos-conteudo p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
          text-align: justify;
        }
        .quem-somos-conteudo ul,
        .quem-somos-conteudo ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        .quem-somos-conteudo li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        @media (max-width: 480px) {
          .quem-somos-section {
            padding: 2rem 0.5rem;
            scroll-margin-top: 112px;
          }
        }
      ` }} />
    </section>
  );
}
