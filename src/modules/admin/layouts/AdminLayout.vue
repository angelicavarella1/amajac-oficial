<!-- src\modules\admin\layouts\AdminLayout.vue -->
<template>
  <div class="admin-layout flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Sidebar fixa à esquerda -->
    <div class="fixed left-0 top-0 h-full z-10">
      <AdminSidebar />
    </div>

    <!-- Conteúdo principal com offset automático -->
    <main class="flex-1 flex flex-col ml-[250px] overflow-hidden">
      <header class="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold text-amajac-green dark:text-amajac-green-light">
            Painel Administrativo
          </h1>
          
          <div class="flex items-center gap-3">
            <!-- Botão Dark Mode -->
            <button 
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group relative"
              :title="isDark ? 'Modo Claro' : 'Modo Escuro'"
              aria-label="Alternar modo de exibição"
            >
              <svg 
                v-if="!isDark" 
                class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 transform group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              
              <svg 
                v-else 
                class="w-5 h-5 text-yellow-300 transition-all duration-300 transform group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            <!-- Componente de Notificações -->
            <NotificationsDropdown />

            <!-- Perfil do Usuário Dinâmico -->
            <div class="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700" aria-label="Perfil do usuário">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ userProfile?.name || userProfile?.email?.split('@')[0] || 'Admin' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ userProfile?.email || 'Conectado' }}
                </p>
              </div>
              <div class="w-8 h-8 bg-gradient-to-br from-amajac-green to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {{ (userProfile?.name?.[0] || userProfile?.email?.[0] || 'A').toUpperCase() }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-auto p-6">
        <RouterView v-if="userProfile" />
        <!-- Opcional: exibir tela de carregamento ou redirecionamento -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/core/utils/supabaseClient'
import AdminSidebar from '@/modules/admin/components/layout/AdminSidebar.vue'
import NotificationsDropdown from '@/modules/mensagens/components/NotificationsDropdown.vue'

const router = useRouter()
const isDark = ref(false)
const userProfile = ref(null)

// Verificar preferência de dark mode
const checkDarkModePreference = () => {
  const saved = localStorage.getItem('amajac-dark-mode')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = saved === 'true' || (saved === null && systemPrefersDark)
  applyDarkMode(isDark.value)
}

const applyDarkMode = (dark) => {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('amajac-dark-mode', dark.toString())
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  applyDarkMode(isDark.value)
}

// Carregar perfil do usuário - CORRIGIDO
const loadUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Tenta buscar dados do admin_profiles
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('nome')
        .eq('id', user.id)
        .single()

      userProfile.value = {
        email: user.email,
        name: adminProfile?.nome || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'
      }
    } else {
      await router.push({ name: 'admin-login' })
    }
  } catch (error) {
    console.warn('Erro ao carregar perfil:', error)
    // Fallback seguro
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userProfile.value = {
        email: user.email,
        name: user.user_metadata?.full_name || 'Administrador'
      }
    } else {
      await router.push({ name: 'admin-login' })
    }
  }
}

onMounted(() => {
  checkDarkModePreference()
  loadUserProfile()
})
</script>

<style scoped>
.admin-layout {
  font-family: 'Montserrat', sans-serif;
}

/* Animações suaves para transições de tema */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Melhorias de acessibilidade */
button:focus {
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  main {
    margin-left: 0;
    margin-top: 60px; /* Altura da sidebar mobile */
  }
  
  header {
    padding: 1rem;
  }
  
  .flex.items-center.gap-3 {
    gap: 1rem;
  }
  
  .text-right {
    display: none; /* Oculta informações do usuário em mobile */
  }
}

/* Melhorias para dark mode */
.dark .admin-layout {
  color-scheme: dark;
}

/* Loading state */
.skeleton-loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>