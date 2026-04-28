'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
// TODO: NotificationsDropdown se houver

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDarkModePreference = () => {
      const saved = localStorage.getItem('amajac-dark-mode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = saved === 'true' || (saved === null && systemPrefersDark);
      setIsDark(initialDark);
      document.documentElement.classList.toggle('dark', initialDark);
    };

    checkDarkModePreference();
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('amajac-dark-mode', newDark.toString());
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('nome')
            .eq('id', user.id)
            .single();

          setUserProfile({
            email: user.email,
            name: adminProfile?.nome || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'
          });
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.warn('Erro ao carregar perfil, usando fallback:', error);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserProfile({
            email: user.email,
            name: user.user_metadata?.full_name || 'Administrador'
          });
        } else {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2E7D32] border-t-transparent"></div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col ml-[250px] overflow-hidden transition-all duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center transition-colors duration-300">
          <h1 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">
            Painel Administrativo
          </h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group relative"
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {!isDark ? (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-300 transition-all duration-300 transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* <NotificationsDropdown /> placeholder */}

            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userProfile.email}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#2E7D32] to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {(userProfile.name?.[0] || userProfile.email?.[0] || 'A').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
