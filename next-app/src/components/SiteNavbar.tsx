'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Relogio from './ui/Relogio';

const AMAJAC_GREEN_DARK = '#2E7D32';
const AMAJAC_GREEN_LIGHT = '#4CAF50';
const AMAJAC_GREEN_SOS = '#059669';
const AMAJAC_GREEN_ASSOC = '#047857';
const AMAJAC_GREEN_ADMIN = '#065F46';

const links = [
  { to: '/sobre', text: 'Quem Somos', sectionId: 'quem-somos-section' },
  { to: '/noticias', text: 'Notícias', sectionId: 'noticias-section' },
  { to: '/eventos', text: 'Eventos', sectionId: 'eventos-section' },
  { to: '/classificados', text: 'Classificados', sectionId: 'classificados-section' },
  { to: '/galeria', text: 'Galeria', sectionId: 'galeria-section' },
  { to: '/contato', text: 'Contato', sectionId: 'site-footer' },
];

export default function SiteNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('amajac-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : systemDark;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('amajac-theme', newVal ? 'dark' : 'light');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.innerHTML = '<span class="text-xl font-bold text-white flex items-center justify-center h-full">A</span>';
      parent.classList.add('bg-[#2E7D32]');
    }
  };

  const navegarParaSecao = (rota: string, sectionId: string) => {
    setIsMobileOpen(false);
    if (rota === '/contato') {
      const footer = document.getElementById('site-footer');
      if (footer) {
        const navbarHeight = 128;
        const footerPosition = footer.offsetTop - navbarHeight;
        window.scrollTo({ top: footerPosition, behavior: 'smooth' });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openContactModal'));
        }, 800);
      } else {
        router.push('/contato'); // Fallback if no footer found
      }
      return;
    }

    if (pathname === rota) {
      const el = document.getElementById(sectionId);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 128, behavior: 'smooth' });
      }
    } else {
      router.push(rota);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.offsetTop - 128, behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <>
      <header className="site-navbar bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 no-underline">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-[#2E7D32]">
                  <img 
                    src="/images/logo-amajac.png"
                    alt="Logotipo AMAJAC" 
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="text-2xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                  AMAJAC
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex lg:space-x-2 lg:items-center h-full">
              {links.map((link) => {
                const isActive = pathname === link.to;
                return (
                  <button 
                    key={link.to}
                    onClick={() => navegarParaSecao(link.to, link.sectionId)}
                    className={`nav-link flex items-center justify-center min-h-[40px] px-4 py-2 rounded-lg font-semibold border-2 border-transparent transition-all duration-300 cursor-pointer ${isActive ? 'nav-link-active' : 'text-[#2E7D32] hover:text-[#4CAF50] hover:-translate-y-[2px] hover:shadow-sm'}`}
                  >
                    {link.text}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleDarkMode}
                className="dark-mode-button p-1 rounded transition-all duration-300 text-[#2E7D32] dark:text-[#4CAF50] hover:scale-110 hover:rotate-12"
                title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                <div className="relative w-5 h-5">
                  {isDarkMode ? (
                    <svg className="h-5 w-5 transform transition-all duration-300 rotate-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 transform transition-all duration-300 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </div>
              </button>
              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="mobile-menu-button lg:hidden text-gray-700 dark:text-gray-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {!isMobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-t border-gray-200 dark:border-gray-700 h-16">
            <Relogio />
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href="https://sosjacapp.amajac.org.br/login" 
                target="_blank"
                className="quick-btn sos-btn text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1 transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 6px rgba(5,150,105,0.3)' }}
              >
                <span className="text-base">🚨</span>
                <span className="hidden sm:inline">SOSJAC</span>
              </a>
              <a 
                href="https://associacoes.softaliza.com.br/login/amajac" 
                target="_blank"
                className="quick-btn associados-btn text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1 transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #047857, #065F46)', boxShadow: '0 4px 6px rgba(4,120,87,0.3)' }}
              >
                <span className="text-base">👤</span>
                <span className="hidden sm:inline">Associados</span>
              </a>
              <a 
                href="/admin"
                target="_blank"
                className="quick-btn admin-btn text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1 transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #065F46, #064E3B)', boxShadow: '0 4px 6px rgba(6,95,70,0.3)' }}
              >
                <span className="text-base">⚙️</span>
                <span className="hidden sm:inline">Admin</span>
              </a>
            </div>
          </div>
        </div>

        {isMobileOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {links.map((link) => {
                  const isActive = pathname === link.to;
                  return (
                    <button 
                      key={link.to}
                      onClick={() => navegarParaSecao(link.to, link.sectionId)}
                      className={`mobile-link flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all text-left w-full ${isActive ? 'bg-[#2E7D32] text-white' : 'text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white'}`}
                    >
                      {link.text}
                    </button>
                  );
                })}
                <button onClick={toggleDarkMode} className="mobile-link flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all text-left w-full">
                  <span className="text-xl">
                      {isDarkMode ? '☀️' : '🌙'}
                  </span>
                  <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link-active {
          color: #2E7D32;
          font-weight: 700;
          border-bottom: 3px solid #2E7D32;
          border-radius: 0;
          background: transparent !important;
          transform: none;
        }
        .nav-link-active:hover {
          color: #2E7D32;
          transform: none;
        }
      ` }} />
    </>
  );
}
