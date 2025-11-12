<!-- src\modules\admin\components\layout\AdminSidebar.vue -->
<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-white">AMAJAC Admin</h3>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <router-link
        :to="{ name: 'admin-dashboard' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-dashboard' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Dashboard
      </router-link>

      <router-link
        :to="{ name: 'admin-associados' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-associados' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM7 14a3 3 0 00-3 3v3h6v-3a3 3 0 00-3-3z" />
        </svg>
        Associados
      </router-link>

      <router-link
        :to="{ name: 'admin-noticias' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-noticias' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 5H5v2h10v-2z" clip-rule="evenodd" />
        </svg>
        Notícias
      </router-link>

      <router-link
        :to="{ name: 'admin-eventos' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-eventos' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 4h10v9H6V6z" clip-rule="evenodd" />
        </svg>
        Eventos
      </router-link>

      <router-link
        :to="{ name: 'admin-parceiros' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-parceiros' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.865 4.542l.535 1.07c.22.44.623.793 1.12.872l1.3.172c.983.12 1.405 1.25.77 1.873l-1.07 1.07c-.328.328-.535.78-.535 1.25v.17c0 .47.207.922.535 1.25l1.07 1.07c.635.623.213 1.753-.77 1.873l-1.3.172c-.497.079-.9.432-1.12.872l-.535 1.07c-.42.84-.78 1.4-1.52 1.4s-1.1-.56-1.52-1.4l-.535-1.07c-.22-.44-.623-.793-1.12-.872l-1.3-.172c-.983-.12-1.405-1.25-.77-1.873l1.07-1.07c.328-.328.535-.78.535-1.25v-.17c0-.47-.207-.922-.535-1.25L5.75 8.165c-.635-.623-.213-1.753.77-1.873l1.3-.172c.497-.079.9-.432 1.12-.872l.535-1.07c.42-.84 1.1-.84 1.52 0z" />
          <path fill-rule="evenodd" d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd" />
        </svg>
        Parceiros
      </router-link>

      <router-link
        :to="{ name: 'admin-classificados' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-classificados' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2h-2V8zm4 0h2v2h-2V8z" clip-rule="evenodd" />
        </svg>
        Classificados
      </router-link>

      <router-link
        :to="{ name: 'admin-galeria' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-galeria' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        Galeria
      </router-link>

      <router-link
        :to="{ name: 'admin-mensagens' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-mensagens' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 2a1 1 0 00-1-1H7a1 1 0 00-1 1v6a1 1 0 001 1h4a1 1 0 001-1V7z" clip-rule="evenodd" />
        </svg>
        Mensagens
      </router-link>

      <router-link
        :to="{ name: 'admin-sobre' }"
        class="sidebar-link"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-sobre' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Sobre
      </router-link>

      <router-link
        :to="{ name: 'admin-configuracoes' }"
        class="sidebar-link mt-4 border-t border-gray-700 pt-4"
        active-class="sidebar-link--active"
        :aria-current="$route.name === 'admin-configuracoes' ? 'page' : null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.533 1.533 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
        Configurações
      </router-link>
    </nav>
    
    <div class="sidebar-footer mt-auto p-4">
      <a
        href="/"
        class="sidebar-link external-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Voltar ao site institucional"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Site Institucional
      </a>
      
      <button 
        @click="handleLogout" 
        class="sidebar-link external-link mt-2 text-red-400 hover:text-red-300 hover:bg-gray-700 border-none w-full text-left"
        aria-label="Sair da Área Administrativa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 10-2 0v2H4V4h11v2a1 1 0 102 0V4a3 3 0 00-3-3H3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V4a3 3 0 00-3-3H3z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M12 7a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zM7 9a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zM7 13a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
        Sair
      </button>
    </div>
  </aside>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/core/utils/supabaseClient.js'

const router = useRouter()

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    router.push({ name: 'admin-login' })
  }
})

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.warn('Aviso: falha parcial no logout:', error.message)
    }
    router.push({ name: 'admin-login' })
  } catch (err) {
    console.error('Erro inesperado no logout:', err)
    router.push({ name: 'admin-login' })
  }
}
</script>

<style scoped>
.admin-sidebar {
  --amajac-green: #2E7D32;
  --amajac-green-dark: #1B5E20;
  --amajac-green-light: #4CAF50;
  
  width: 250px;
  background-color: #1f2937;
  color: #f9fafb;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #374151;
  background-color: var(--amajac-green);
}

.sidebar-header h3 {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.sidebar-nav {
  padding: 1rem 0;
  flex-grow: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  color: white;
  background-color: #374151;
}

.sidebar-link--active {
  color: white;
  background-color: var(--amajac-green);
  border-left: 4px solid var(--amajac-green-dark);
}

.sidebar-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.sidebar-footer {
  border-top: 1px solid #374151;
}
</style>