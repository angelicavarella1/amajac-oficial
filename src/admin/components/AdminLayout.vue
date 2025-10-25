=== C:\Users\angel\Documents\Projetos\amajac-oficial\src\admin\components\AdminLayout.vue ===
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 lg:flex">

    <div
      v-if="sidebarOpen && !isLargeScreen"
      class="fixed inset-0 flex z-40 lg:hidden"
      @click="sidebarOpen = false"
      aria-hidden="true"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300"></div>
    </div>

    <div
      class="fixed inset-y-0 left-0 flex flex-col z-50 lg:static lg:translate-x-0 lg:flex-shrink-0"
      :class="{ 'pointer-events-none': !sidebarOpen && !isLargeScreen }"
    >
      <div
        id="sidebar-menu"
        :class="[
          'flex flex-col flex-1 bg-emerald-600 dark:bg-emerald-800 border-r border-emerald-700 dark:border-emerald-900',
          'w-56 transform transition-transform duration-300 ease-in-out',
          isLargeScreen ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full'),
        ]"
        role="dialog"
        :aria-modal="sidebarOpen && !isLargeScreen"
        aria-label="Menu de Navegação Principal"
      >
        <div class="flex items-center justify-between h-16 flex-shrink-0 px-3 border-b border-emerald-700 dark:border-emerald-900">
          <div class="flex items-center">
            <div class="relative">
              <!-- LOGO NO LUGAR DO AVATAR - PRIMEIRO LUGAR -->
              <img
                class="h-7 w-7 rounded-full object-cover border-2 border-white bg-white p-0.5"
                src="/images/logo-amajac.png"
                alt="Logo AMAJAC"
                loading="eager"
              >
              <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-300 border-2 border-white dark:border-gray-800 rounded-full" title="Online"></div>
            </div>
            <span class="ml-2 text-lg font-bold text-white truncate max-w-[120px]">AMAJAC Admin</span>
          </div>
          <button
            @click="sidebarOpen = false"
            class="lg:hidden p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
            aria-label="Fechar menu lateral"
          >
            <i class="fas fa-times text-base"></i>
          </button>
        </div>

        <nav class="flex-1 px-2 py-3 space-y-1 overflow-y-auto sidebar-scroll" aria-label="Links do Dashboard">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'group flex items-center px-2 py-2 text-xs font-medium rounded-md transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset',
              $route.path === item.href
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-white hover:bg-emerald-700 hover:shadow-sm'
            ]"
            @click="!isLargeScreen && (sidebarOpen = false)"
            :aria-current="$route.path === item.href ? 'page' : undefined"
          >
            <i :class="[item.icon, 'mr-2 h-4 w-4']" aria-hidden="true"></i>
            <span class="truncate">{{ item.name }}</span>
          </router-link>
        </nav>

        <div class="flex-shrink-0 border-t border-emerald-700 dark:border-emerald-900 p-2 user-menu">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <!-- LOGO NO LUGAR DO AVATAR - SEGUNDO LUGAR -->
              <img
                class="h-8 w-8 rounded-full object-cover border-2 border-white bg-white p-0.5"
                src="/images/logo-amajac.png"
                alt="Logo AMAJAC"
                loading="eager"
              >
            </div>
            <div class="ml-2 flex-1 overflow-hidden min-w-0">
              <p class="text-xs font-medium text-white truncate" :title="displayUser.name">{{ displayUser.name }}</p>
              <p class="text-xs text-emerald-200 truncate" :title="displayUser.role">{{ displayUser.role }}</p>
            </div>
            <button
              ref="userMenuButtonRef"
              @click="toggleUserMenu"
              class="ml-1 p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :aria-expanded="userMenuOpen"
              aria-controls="user-menu-panel"
              aria-label="Opções do usuário"
            >
              <i class="fas fa-ellipsis-v text-xs"></i>
            </button>
          </div>

          <div
            v-if="userMenuOpen"
            id="user-menu-panel"
            ref="userMenuPanelRef"
            class="mt-1 space-y-1 bg-emerald-700 rounded-md p-1 shadow-lg"
            role="menu"
            aria-orientation="vertical"
          >
            <router-link
              to="/admin/dashboard/configuracoes"
              class="flex items-center px-2 py-1 text-xs text-white hover:bg-emerald-600 rounded-md transition-colors focus:outline-none focus:bg-emerald-600"
              role="menuitem"
              @click="userMenuOpen = false"
            >
              <i class="fas fa-cog mr-2 w-3" aria-hidden="true"></i>Configurações
            </router-link>
            <button
              @click="logout"
              class="flex items-center w-full text-left px-2 py-1 text-xs text-red-200 hover:bg-red-900 rounded-md transition-colors focus:outline-none focus:bg-red-900"
              role="menuitem"
              :disabled="isLoggingOut"
            >
              <i
                class="fas mr-2 w-3"
                :class="isLoggingOut ? 'fa-spinner fa-spin' : 'fa-sign-out-alt'"
                aria-hidden="true"
              ></i>
              {{ isLoggingOut ? 'Saindo...' : 'Sair' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col flex-1 lg:min-w-0 lg:ml-0">
      <header class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-controls="sidebar-menu"
              :aria-expanded="sidebarOpen"
              aria-label="Abrir menu lateral"
            >
              <i class="fas fa-bars text-lg" aria-hidden="true"></i>
            </button>

            <nav class="hidden lg:flex ml-4" aria-label="Caminho de navegação">
              <ol class="flex items-center space-x-2">
                <li>
                  <router-link
                    to="/admin/dashboard"
                    class="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus:text-gray-500"
                    aria-label="Início"
                  >
                    <i class="fas fa-home" aria-hidden="true"></i>
                  </router-link>
                </li>
                <li v-for="(crumb, index) in breadcrumbs" :key="crumb.name">
                  <div class="flex items-center">
                    <i class="fas fa-chevron-right text-gray-400 mx-2 text-xs" aria-hidden="true"></i>
                    <router-link
                      :to="crumb.href"
                      :class="[
                        'text-sm font-medium transition-colors focus:outline-none focus:underline',
                        index === breadcrumbs.length - 1
                          ? 'text-gray-900 dark:text-white cursor-default'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      ]"
                      :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
                    >
                      {{ crumb.name }}
                    </router-link>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <div
              v-if="isLoading"
              class="flex items-center text-gray-400"
              aria-label="Carregando"
            >
              <i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
              <span class="text-sm">Carregando...</span>
            </div>

            <button
              @click="toggleDarkMode"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :aria-label="uiStore.isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
            >
              <i :class="uiStore.isDark ? 'fas fa-sun' : 'fas fa-moon'" aria-hidden="true"></i>
            </button>

            <button
              @click="toggleNotifications"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 relative"
              aria-label="Notificações"
            >
              <i class="fas fa-bell" aria-hidden="true"></i>
              <span
                v-if="unreadNotifications > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >
                {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto focus:outline-none" tabindex="0">
        <div class="py-6">
          <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <router-view />
          </div>
        </div>
      </main>
    </div>

    <ToastNotification
      :show="uiStore.toast.show"
      :type="uiStore.toast.type"
      :message="uiStore.toast.message"
      @close="uiStore.hideToast()"
    />

    <div
      v-if="notificationsOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="notifications-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="notificationsOpen = false"></div>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 id="notifications-title" class="text-lg font-medium text-gray-900 dark:text-white">
              Notificações
            </h3>
            <button
              @click="notificationsOpen = false"
              class="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="text-center text-gray-500 dark:text-gray-400">
            <i class="fas fa-bell-slash text-3xl mb-2"></i>
            <p>Nenhuma notificação</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { debounce } from 'lodash-es'
import ToastNotification from '@/components/ui/ToastNotification.vue'

// Stores e Router
const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const authStore = useAuthStore()

// Estado Reativo
const isLargeScreen = ref(window.innerWidth >= 1024)
const sidebarOpen = ref(window.innerWidth >= 1024)
const userMenuOpen = ref(false)
const isLoading = ref(false)
const isLoggingOut = ref(false)
const notificationsOpen = ref(false)
const unreadNotifications = ref(0)

// Refs para menus dropdown
const userMenuButtonRef = ref(null)
const userMenuPanelRef = ref(null)

// Dados do Usuário - SIMPLIFICADO
const displayUser = computed(() => {
  if (!authStore.user) {
    return {
      name: 'Carregando...',
      role: 'Desconectado'
    }
  }
  
  const roleDisplay = authStore.user.nivel === 'super' ? 'Super Administrador' : 'Administrador'
  
  return {
    name: authStore.user.nome || 'Administrador',
    role: roleDisplay
  }
})

// REMOVIDO: currentPageTitle e currentPageDescription não são mais usados no template
const currentPageTitle = computed(() => {
  return breadcrumbs.value[breadcrumbs.value.length - 1]?.name || 'Dashboard'
})

const currentPageDescription = computed(() => {
  const descriptions = {
    '/admin/dashboard': 'Visão geral do sistema administrativo',
    '/admin/dashboard/noticias': 'Gerencie as notícias do portal',
    '/admin/dashboard/eventos': 'Organize eventos e atividades',
    '/admin/dashboard/solicitacoes-socio': 'Gerencie solicitações de associados',
    '/admin/dashboard/parceiros': 'Administre parceiros comerciais',
    '/admin/dashboard/galeria': 'Gerencie a galeria de imagens',
    '/admin/dashboard/classificados': 'Controle os classificados',
    '/admin/dashboard/mensagens': 'Visualize mensagens recebidas',
    '/admin/dashboard/configuracoes': 'Configure o sistema',
    '/admin/dashboard/relatorios': 'Acesse relatórios e estatísticas',
    '/admin/dashboard/monitor': 'Monitore o uso do Supabase',
    '/admin/dashboard/backup': 'Faça backup e limpeza do banco',
    '/admin/dashboard/auditoria': 'Relatório completo de auditoria'
  }
  return descriptions[route.path] || 'Página administrativa'
})

// ✅ CORREÇÃO CRÍTICA: Navegação atualizada para /admin/dashboard
const navigation = ref([
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'Notícias', href: '/admin/dashboard/noticias', icon: 'fas fa-file-alt' },
  { name: 'Eventos', href: '/admin/dashboard/eventos', icon: 'fas fa-calendar' },
  { name: 'Associados', href: '/admin/dashboard/solicitacoes-socio', icon: 'fas fa-users' },
  { name: 'Parceiros Comerciais', href: '/admin/dashboard/parceiros', icon: 'fas fa-handshake' },
  { name: 'Galeria', href: '/admin/dashboard/galeria', icon: 'fas fa-images' },
  { name: 'Classificados', href: '/admin/dashboard/classificados', icon: 'fas fa-list' },
  { name: 'Mensagens', href: '/admin/dashboard/mensagens', icon: 'fas fa-envelope' },
  { name: 'Monitor Supabase', href: '/admin/dashboard/monitor', icon: 'fas fa-chart-bar' },
  { name: 'Backup & Limpeza', href: '/admin/dashboard/backup', icon: 'fas fa-database' },
  { name: 'Auditoria', href: '/admin/dashboard/auditoria', icon: 'fas fa-clipboard-list' },
  { name: 'Configurações', href: '/admin/dashboard/configuracoes', icon: 'fas fa-cog' },
  { name: 'Relatórios', href: '/admin/dashboard/relatorios', icon: 'fas fa-chart-pie' }
])

// ✅ CORREÇÃO CRÍTICA: Breadcrumbs atualizados para /admin/dashboard
const breadcrumbs = computed(() => {
  const baseBreadcrumb = { name: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-tachometer-alt' }

  if (route.path === '/admin/dashboard') {
    return [baseBreadcrumb]
  }

  const crumbs = [baseBreadcrumb]
  const pathArray = route.path.split('/').filter(path => path && path !== 'admin' && path !== 'dashboard')

  pathArray.forEach((segment, index) => {
    const href = '/admin/dashboard/' + pathArray.slice(0, index + 1).join('/')

    const navItem = navigation.value.find(item =>
      item.href === href || item.href.includes(segment)
    )

    if (navItem) {
      crumbs.push({
        name: navItem.name,
        href: navItem.href
      })
    } else {
      const routeRecord = router.resolve(href)
      const name = routeRecord.meta?.breadcrumbName || formatBreadcrumbName(segment)

      if (name && !crumbs.some(crumb => crumb.name === name)) {
        crumbs.push({
          name: name,
          href: href
        })
      }
    }
  })

  return crumbs
})

// Funções
function formatBreadcrumbName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    nextTick(() => {
      const firstFocusable = userMenuPanelRef.value?.querySelector('a, button')
      firstFocusable?.focus()
    })
  }
}

function toggleDarkMode() {
  uiStore.toggleDarkMode()
}

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value
}

async function logout() {
  if (isLoggingOut.value) return

  isLoggingOut.value = true
  try {
    await authStore.signOut()
    uiStore.showToast('Logout realizado com sucesso', 'success')
    router.push('/admin/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    uiStore.showToast(
      error.response?.data?.message || 'Erro ao fazer logout. Tente novamente.',
      'error'
    )
  } finally {
    isLoggingOut.value = false
    userMenuOpen.value = false
  }
}

// Fechar menus ao clicar fora
const closeDropdownsOnClickOutside = (event) => {
  if (userMenuOpen.value) {
    const clickedOnButton = userMenuButtonRef.value?.contains(event.target)
    const clickedOnPanel = userMenuPanelRef.value?.contains(event.target)
    if (!clickedOnButton && !clickedOnPanel) {
      userMenuOpen.value = false
    }
  }

  if (notificationsOpen.value && !event.target.closest('[aria-label="Notificações"]')) {
    notificationsOpen.value = false
  }
}

// Navegação por teclado
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (userMenuOpen.value) {
      userMenuOpen.value = false
      userMenuButtonRef.value?.focus()
    }
    if (sidebarOpen.value && !isLargeScreen.value) {
      sidebarOpen.value = false
    }
    if (notificationsOpen.value) {
      notificationsOpen.value = false
    }
  }
}

// Debounced resize handler
const handleResize = debounce(() => {
  const newIsLargeScreen = window.innerWidth >= 1024
  isLargeScreen.value = newIsLargeScreen
  if (newIsLargeScreen) {
    sidebarOpen.value = true
  } else if (sidebarOpen.value) {
    sidebarOpen.value = false
  }
}, 150)

// Watchers
watch(() => route.path, async (newPath, oldPath) => {
  if (newPath !== oldPath) {
    isLoading.value = true
    userMenuOpen.value = false
    notificationsOpen.value = false

    if (!isLargeScreen.value) sidebarOpen.value = false

    await nextTick()
    setTimeout(() => {
      isLoading.value = false
    }, 150)
  }
}, { immediate: true })

// Atualizar título da página baseado nos breadcrumbs
watch(breadcrumbs, (newBreadcrumbs) => {
  const pageTitle = newBreadcrumbs
    .map(crumb => crumb.name)
    .join(' | ') + ' | AMAJAC Admin'

  document.title = pageTitle

  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      `Painel Administrativo AMAJAC - ${newBreadcrumbs.slice(-1)[0]?.name || 'Dashboard'}`
    )
  }
})

onMounted(() => {
  uiStore.initializeDarkMode()
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', closeDropdownsOnClickOutside)
  document.addEventListener('keydown', handleKeydown)

  // Preload Font Awesome se não estiver carregado
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesomeLink = document.createElement('link')
    fontAwesomeLink.rel = 'stylesheet'
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
    fontAwesomeLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontAwesomeLink)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', closeDropdownsOnClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
:root {
  --sidebar-width: 14rem;
  --header-height: 4rem;
  --transition-duration: 300ms;
}

#sidebar-menu {
  width: var(--sidebar-width);
  will-change: transform;
  transition: transform var(--transition-duration) ease-in-out;
}

.user-menu {
  min-height: auto;
}

* {
  transition-property: color, background-color, border-color, transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

@media (min-width: 1024px) {
  .lg-min-w-0 {
    min-width: 0;
  }

  .lg-sidebar-open {
    transform: translateX(0);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Focus styles para acessibilidade */
button:focus-visible,
a:focus-visible,
.router-link-active:focus-visible {
  outline: 2px solid #059669;
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .bg-emerald-600 {
    background-color: #004d40;
  }

  .border-emerald-700 {
    border-color: #00332c;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* Scrollbar personalizado para sidebar */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>