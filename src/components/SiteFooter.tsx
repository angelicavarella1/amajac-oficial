'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  return (
    <Link
      href={to}
      className={`text-[#f0fdf4] hover:text-[#a7f3d0] transition-colors duration-200 text-sm ${isActive ? 'font-semibold text-[#a7f3d0]' : ''}`}
    >
      {children}
    </Link>
  );
};

export default function SiteFooter() {
  const pathname = usePathname();

  const handleOpenModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openContactModal'));
    }
  };

  const handleGlobalModalOpen = () => {
    handleOpenModal();
  };

  useEffect(() => {
    window.addEventListener('openContactModal', handleGlobalModalOpen);
    return () => {
      window.removeEventListener('openContactModal', handleGlobalModalOpen);
    };
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.innerHTML = '<span class="text-sm font-bold text-green-800 flex items-center justify-center h-full">A</span>';
      parent.classList.add('bg-green-300');
    }
  };

  return (
    <footer id="site-footer" className="site-footer bg-[#1B5E20] text-white py-6 relative z-[1]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <div className="flex flex-col items-start mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white mb-2">
                <img 
                  src="/images/logo-amajac.png"
                  alt="Logotipo AMAJAC" 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <h3 className="text-lg font-bold">AMAJAC</h3>
              <p className="text-[#f0fdf4] text-xs mt-2">
                Associação de Moradores e Amigos do Jardim Atlântico Central
              </p>
            </div>
            <p className="text-[#f0fdf4] text-sm mt-4 leading-relaxed">
              Juntos pelo desenvolvimento urbano e social do nosso bairro.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Área Restrita</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://sosjacapp.amajac.org.br/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0fdf4] hover:text-[#a7f3d0] transition-colors duration-200 flex items-center text-sm"
                >
                  <span className="mr-2">🚨</span>
                  SOSJAC
                </a>
              </li>
              <li>
                <a
                  href="https://associacoes.softaliza.com.br/login/amajac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0fdf4] hover:text-[#a7f3d0] transition-colors duration-200 flex items-center text-sm"
                >
                  <span className="mr-2">👤</span>
                  ASSOCIADO
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className={`text-[#f0fdf4] hover:text-[#a7f3d0] transition-colors duration-200 flex items-center text-sm ${pathname === '/admin' ? 'font-semibold text-[#a7f3d0]' : ''}`}
                >
                  <span className="mr-2">⚙️</span>
                  ADMINISTRAÇÃO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Acesso Rápido</h3>
            <ul className="space-y-2">
              <li><NavLink to="/sobre">Quem Somos</NavLink></li>
              <li><NavLink to="/noticias">Notícias</NavLink></li>
              <li><NavLink to="/eventos">Eventos</NavLink></li>
              <li><NavLink to="/classificados">Classificados</NavLink></li>
              <li><NavLink to="/galeria">Galeria</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <address className="not-italic text-[#f0fdf4] space-y-3 text-sm leading-relaxed">
              <p>AMAJAC – Jardim Atlântico Central</p>
              <p>Rua Izabel Cristina Ouvina, 112</p>
              <p>Maricá - RJ, CEP 24934-405</p>
              <p>
                <a
                  href="https://wa.me/5521978979840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#f0fdf4] hover:text-[#a7f3d0] transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.172-1.171" />
                  </svg>
                  (21) 97897-9840
                </a>
              </p>
              <p>
                <a 
                  href="mailto:contato@amajac.org.br" 
                  className="text-[#f0fdf4] hover:text-[#a7f3d0] transition-colors duration-200"
                >
                  comunicacao@amajac.org.br
                </a>
              </p>
            </address>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Atendimento</h3>
            <button 
              onClick={handleOpenModal}
              className="fale-conosco-btn w-full flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 rounded-lg py-3 px-4 text-sm font-semibold cursor-pointer transition-all hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a7f3d0] focus:ring-offset-2"
            >
              <span className="btn-icon text-lg">📧</span>
              <span className="btn-text whitespace-nowrap">Fale Conosco</span>
            </button>
            <p className="text-[#f0fdf4] text-xs mt-3 leading-relaxed">
              Entre em contato com a AMAJAC. Responderemos o mais breve possível.
            </p>
          </div>
        </div>

        <div className="border-t border-green-700 mt-4 pt-3 text-center text-[#ccfbf1] text-sm">
          <p>&copy; {new Date().getFullYear()} AMAJAC — Associação de Moradores e Amigos do Bairro Jardim Atlântico Central</p>
          <p className="mt-1">
            <Link href="/termos" className="hover:text-[#a7f3d0] transition-colors duration-200">Termos de Uso</Link> |{' '}
            <Link href="/privacidade" className="hover:text-[#a7f3d0] transition-colors duration-200">Política de Privacidade</Link>
          </p>
          <p className="mt-2 text-[#a7f3d0] text-xs">
            Desenvolvido por Angélica Varella
          </p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .site-footer { padding: 1rem 0 0.75rem; }
          .fale-conosco-btn { padding: 0.625rem 0.875rem; font-size: 0.8rem; }
        }
      ` }} />
    </footer>
  );
}
