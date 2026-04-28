'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === 'angelicavarella@amajac.org.br') {
        setIsSuperadmin(true);
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Aviso: falha parcial no logout:', error.message);
      }
      router.push('/admin/login');
    } catch (err) {
      console.error('Erro inesperado no logout:', err);
      router.push('/admin/login');
    }
  };

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />,
    },
    {
      href: '/admin/associados',
      label: 'Associados',
      icon: <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM7 14a3 3 0 00-3 3v3h6v-3a3 3 0 00-3-3z" />,
    },
    {
      href: '/admin/noticias',
      label: 'Notícias',
      icon: <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 5H5v2h10v-2z" clipRule="evenodd" />,
    },
    {
      href: '/admin/eventos',
      label: 'Eventos',
      icon: <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 4h10v9H6V6z" clipRule="evenodd" />,
    },
    {
      href: '/admin/parceiros',
      label: 'Parceiros',
      icon: (
        <>
          <path d="M10.865 4.542l.535 1.07c.22.44.623.793 1.12.872l1.3.172c.983.12 1.405 1.25.77 1.873l-1.07 1.07c-.328.328-.535.78-.535 1.25v.17c0 .47.207.922.535 1.25l1.07 1.07c.635.623.213 1.753-.77 1.873l-1.3.172c-.497.079-.9.432-1.12.872l-.535 1.07c-.42.84-.78 1.4-1.52 1.4s-1.1-.56-1.52-1.4l-.535-1.07c-.22-.44-.623-.793-1.12-.872l-1.3-.172c-.983-.12-1.405-1.25-.77-1.873l1.07-1.07c.328-.328.535-.78.535-1.25v-.17c0-.47-.207-.922-.535-1.25L5.75 8.165c-.635-.623-.213-1.753.77-1.873l1.3-.172c.497-.079.9-.432 1.12-.872l.535-1.07c.42-.84 1.1-.84 1.52 0z" />
          <path fillRule="evenodd" d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
        </>
      ),
    },
    {
      href: '/admin/classificados',
      label: 'Classificados',
      icon: <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2h-2V8zm4 0h2v2h-2V8z" clipRule="evenodd" />,
    },
    {
      href: '/admin/galeria',
      label: 'Galeria',
      icon: <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />,
    },
    {
      href: '/admin/mensagens',
      label: 'Mensagens',
      icon: <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 2a1 1 0 00-1-1H7a1 1 0 00-1 1v6a1 1 0 001 1h4a1 1 0 001-1V7z" clipRule="evenodd" />,
    },
    {
      href: '/admin/sobre',
      label: 'Sobre',
      icon: <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />,
    },
  ];

  return (
    <aside className="w-[250px] bg-gray-800 text-gray-100 h-screen fixed top-0 left-0 overflow-y-auto z-50 flex flex-col">
      <div className="p-6 pb-4 border-b border-gray-700 bg-[#2E7D32]">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <h3 className="text-white text-xl font-bold m-0">AMAJAC Admin</h3>
        </div>
      </div>
      
      <nav className="py-4 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-[0.95rem] transition-all duration-200 decoration-none ${isActive ? 'bg-[#2E7D32] text-white border-l-4 border-[#1B5E20]' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/admin/configuracoes"
          className={`flex items-center gap-3 px-6 py-3 text-[0.95rem] transition-all duration-200 decoration-none mt-4 border-t border-gray-700 pt-4 ${pathname === '/admin/configuracoes' ? 'bg-[#2E7D32] text-white border-l-4 border-[#1B5E20]' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.533 1.533 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Configurações
        </Link>

        {isSuperadmin && (
          <Link
            href="/admin/auditoria"
            className={`flex items-center gap-3 px-6 py-3 text-[0.95rem] transition-all duration-200 decoration-none mt-1 ${pathname === '/admin/auditoria' ? 'bg-[#2E7D32] text-white border-l-4 border-[#1B5E20]' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 2h12V5H4v2zM2 11a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm2 2h12v-2H4v2z" clipRule="evenodd" />
            </svg>
            Auditoria
          </Link>
        )}
      </nav>
      
      <div className="border-t border-gray-700 mt-auto p-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-3 text-[0.95rem] transition-all duration-200 decoration-none text-gray-300 hover:bg-gray-700 hover:text-white rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Site Institucional
        </a>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-6 py-3 text-[0.95rem] transition-all duration-200 decoration-none mt-2 text-red-400 hover:text-red-300 hover:bg-gray-700 w-full text-left rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 10-2 0v2H4V4h11v2a1 1 0 102 0V4a3 3 0 00-3-3H3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V4a3 3 0 00-3-3H3z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12 7a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zM7 9a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zM7 13a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
}
