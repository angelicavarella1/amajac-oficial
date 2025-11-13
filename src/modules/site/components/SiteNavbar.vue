<!-- src/modules/site/components/SiteNavbar.vue -->
<template>
  <header class="site-navbar">
    <div class="container mx-auto px-4">
      <!-- PRIMEIRA LINHA -->
      <div class="flex items-center justify-between py-2 h-16">
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-3 no-underline">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-amajac-green">
              <img 
                src="/images/logo-amajac.png"
                alt="Logotipo AMAJAC" 
                class="w-full h-full object-cover"
                @error="handleImageError"
              >
            </div>
            <div class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">
              AMAJAC
            </div>
          </router-link>
        </div>
        <!-- NAVEGAÇÃO -->
        <nav class="hidden lg:flex lg:space-x-2 lg:items-center">
          <button 
            v-for="link in desktopLinks"
            :key="link.to"
            @click="navegarParaSecao(link.to, link.sectionId)"
            class="nav-link flex items-center"
            :class="{ 'nav-link-active': isActiveSection(link.to) }"
          >
            {{ link.text }}
          </button>
        </nav>
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleDarkMode"
            class="dark-mode-button transition-all duration-300"
            :title="isDarkMode ? 'Modo Claro' : 'Modo Escuro'"
          >
            <div class="relative w-5 h-5">
              <svg v-if="isDarkMode" class="h-5 w-5 transform transition-all duration-300 rotate-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-5 w-5 transform transition-all duration-300 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
          </button>
          <button @click="toggleMobileMenu" class="mobile-menu-button lg:hidden">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <!-- SEGUNDA LINHA - Apenas Relógio e Links Rápidos -->
      <div class="flex flex-wrap items-center justify-between gap-3 py-2 border-t border-gray-200 dark:border-gray-700 h-16">
        <Relogio />
        <div class="flex flex-wrap items-center gap-2">
          <!-- LINKS EXTERNOS SEM ESPAÇOS -->
          <a 
            href="https://sosjacapp.amajac.org.br/login" 
            target="_blank"
            class="quick-btn sos-btn"
          >
            <span>🚨</span>
            <span class="hidden sm:inline">SOSJAC</span>
          </a>
          <a 
            href="https://associacoes.softaliza.com.br/login/amajac" 
            target="_blank"
            class="quick-btn associados-btn"
          >
            <span>👤</span>
            <span class="hidden sm:inline">Associados</span>
          </a>
          <!-- ADMIN CORRIGIDO - ABRE EM NOVA ABA -->
          <a 
            href="/admin"
            target="_blank"
            class="quick-btn admin-btn"
            @click.prevent="abrirAdminNovaAba"
          >
            <span>⚙️</span>
            <span class="hidden sm:inline">Admin</span>
          </a>
        </div>
      </div>
    </div>
    <div v-if="isMobileOpen" class="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex flex-col space-y-3">
          <button 
            v-for="link in mobileLinks"
            :key="link.to"
            @click="navegarParaSecao(link.to, link.sectionId)"
            class="mobile-link text-amajac-green hover:text-white"
            :class="{ 'mobile-link-active': isActiveSection(link.to) }"
          >
            {{ link.text }}
          </button>
          <button @click="toggleDarkMode" class="mobile-link text-amajac-green hover:text-white">
            <span class="text-xl">
                {{ isDarkMode ? '☀️' : '🌙' }}
            </span>
            <span>{{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Relogio from '@/components/ui/Relogio.vue'

const AMAJAC_GREEN_DARK = '#2E7D32';
const AMAJAC_GREEN_LIGHT = '#4CAF50';
const AMAJAC_GREEN_SOS = '#059669';
const AMAJAC_GREEN_ASSOC = '#047857';
const AMAJAC_GREEN_ADMIN = '#065F46';

const router = useRouter()
const route = useRoute()
const isMobileOpen = ref(false)
const isDarkMode = ref(false)

const desktopLinks = [
  { to: '/sobre', text: 'Quem Somos', sectionId: 'quem-somos-section' },
  { to: '/noticias', text: 'Notícias', sectionId: 'noticias-section' },
  { to: '/eventos', text: 'Eventos', sectionId: 'eventos-section' },
  { to: '/classificados', text: 'Classificados', sectionId: 'classificados-section' },
  { to: '/galeria', text: 'Galeria', sectionId: 'galeria-section' },
  { to: '/contato', text: 'Contato', sectionId: 'site-footer' },
]

const mobileLinks = [
  { to: '/sobre', text: 'Quem Somos', sectionId: 'quem-somos-section' },
  { to: '/noticias', text: 'Notícias', sectionId: 'noticias-section' },
  { to: '/eventos', text: 'Eventos', sectionId: 'eventos-section' },
  { to: '/classificados', text: 'Classificados', sectionId: 'classificados-section' },
  { to: '/galeria', text: 'Galeria', sectionId: 'galeria-section' },
  { to: '/contato', text: 'Contato', sectionId: 'site-footer' },
]

// FUNÇÃO NOVA PARA ABRIR ADMIN EM NOVA ABA
const abrirAdminNovaAba = () => {
  window.open('/admin', '_blank')
}

const isActiveSection = computed(() => (linkTo) => {
  return route.path === linkTo
})

const navegarParaSecao = async (rota, sectionId) => {
  closeMobileMenu()
  if (rota === '/contato') {
    scrollToFooterAndOpenModal()
    return
  }
  if (route.path === rota) {
    scrollToSection(sectionId)
  } else {
    await router.push(rota)
    setTimeout(() => {
      scrollToSection(sectionId)
    }, 300)
  }
}

const scrollToFooterAndOpenModal = () => {
  const footer = document.getElementById('site-footer')
  if (footer) {
    const navbarHeight = 128
    const footerPosition = footer.offsetTop - navbarHeight
    window.scrollTo({
      top: footerPosition,
      behavior: 'smooth'
    })
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openContactModal'))
    }, 800)
  }
}

const scrollToSection = (sectionId) => {
  const sectionElement = document.getElementById(sectionId)
  if (sectionElement) {
    const navbarHeight = 128
    const sectionPosition = sectionElement.offsetTop - navbarHeight
    window.scrollTo({
      top: sectionPosition,
      behavior: 'smooth'
    })
  }
}

const handleImageError = (event) => {
  event.target.onerror = null; 
  const parent = event.target.parentElement;
  if (parent) {
    parent.innerHTML = `<span class="text-xl font-bold text-white flex items-center justify-center h-full">A</span>`;
    parent.classList.add('bg-amajac-green');
  }
}

const checkDarkModePreference = () => {
  const saved = localStorage.getItem('amajac-theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = saved ? saved === 'dark' : systemDark
  applyTheme(false)
}

const applyTheme = (save = true) => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  if (save) {
    localStorage.setItem('amajac-theme', isDarkMode.value ? 'dark' : 'light')
  }
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  applyTheme()
}

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value
}

const closeMobileMenu = () => {
  isMobileOpen.value = false
}

onMounted(() => {
  checkDarkModePreference()
})
</script>

<style scoped>
.text-amajac-green { color: v-bind('AMAJAC_GREEN_DARK'); }
.border-amajac-green { border-color: v-bind('AMAJAC_GREEN_DARK'); }
.dark .text-amajac-green-light { color: v-bind('AMAJAC_GREEN_LIGHT'); }

.site-navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.dark .site-navbar {
  background: #1f2937;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  color: v-bind('AMAJAC_GREEN_DARK');
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: transparent !important;
  border: none;
  cursor: pointer;
}

.nav-link:hover {
  color: v-bind('AMAJAC_GREEN_LIGHT');
  transform: translateY(-2px);
  text-shadow: 0 2px 4px rgba(46, 125, 50, 0.3);
}

.nav-link-active {
  color: v-bind('AMAJAC_GREEN_DARK');
  font-weight: 700;
  border-bottom: 3px solid v-bind('AMAJAC_GREEN_DARK');
  border-radius: 0;
  background: transparent !important;
  transform: none;
}

.nav-link-active:hover {
  color: v-bind('AMAJAC_GREEN_DARK');
  transform: none;
}

nav {
  display: flex;
  align-items: center;
  height: 100%;
}

.dark-mode-button {
  padding: 0.25rem;
  border-radius: 0.25rem;
  color: v-bind('AMAJAC_GREEN_DARK');
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.dark-mode-button:hover {
  color: v-bind('AMAJAC_GREEN_LIGHT');
  transform: scale(1.1) rotate(12deg);
  background: transparent;
}

.dark .dark-mode-button {
  color: v-bind('AMAJAC_GREEN_LIGHT');
}

.dark .dark-mode-button:hover {
  color: #4CAF50;
  background: transparent;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.75rem;
  text-decoration: none;
  border: none;
  transition: all 0.3s ease;
  color: white;
  position: relative;
  overflow: hidden;
}

.quick-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.75rem;
  padding: 2px;
  background: linear-gradient(135deg, currentColor, rgba(255,255,255,0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.quick-btn > span:first-child {
  font-size: 1rem;
}

.sos-btn {
  background: linear-gradient(135deg, v-bind('AMAJAC_GREEN_SOS'), #047857);
  box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
}

.sos-btn:hover {
  background: linear-gradient(135deg, #047857, v-bind('AMAJAC_GREEN_SOS'));
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(5, 150, 105, 0.4);
}

.associados-btn {
  background: linear-gradient(135deg, v-bind('AMAJAC_GREEN_ASSOC'), #065F46);
  box-shadow: 0 4px 6px rgba(4, 120, 87, 0.3);
}

.associados-btn:hover {
  background: linear-gradient(135deg, #065F46, v-bind('AMAJAC_GREEN_ASSOC'));
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(4, 120, 87, 0.4);
}

.admin-btn {
  background: linear-gradient(135deg, v-bind('AMAJAC_GREEN_ADMIN'), #064E3B);
  box-shadow: 0 4px 6px rgba(6, 95, 70, 0.3);
}

.admin-btn:hover {
  background: linear-gradient(135deg, #064E3B, v-bind('AMAJAC_GREEN_ADMIN'));
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(6, 95, 70, 0.4);
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  color: v-bind('AMAJAC_GREEN_DARK');
  border-color: transparent;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.mobile-link:hover, .mobile-link-active {
  background: v-bind('AMAJAC_GREEN_DARK');
  color: white;
  border-color: v-bind('AMAJAC_GREEN_DARK');
  transform: translateX(5px);
}

.mobile-link-active {
  background: v-bind('AMAJAC_GREEN_DARK');
  color: white;
}

.no-underline {
  text-decoration: none;
}

.h-16 {
  height: 4rem;
}
</style>