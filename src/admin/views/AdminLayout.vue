<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Sidebar Desktop (sempre visível em lg+) -->
    <div 
      class="hidden lg:flex lg:flex-shrink-0"
      style="box-shadow: 2px 0 10px rgba(0,0,0,0.1);"
    >
      <div class="bg-emerald-800 text-white w-64 space-y-6 py-7 px-2 flex flex-col">
        <!-- Logo -->
        <div class="flex items-center justify-between px-4 mb-8">
          <router-link to="/admin/dashboard" class="flex items-center space-x-2">
            <img src="/images/logo-amajac.png" alt="AMAJAC" class="h-12 w-12 object-contain">
            <div class="flex flex-col leading-tight">
              <span class="text-lg font-bold text-white">Painel</span>
              <span class="text-lg font-bold text-white">Administrativo</span>
            </div>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="flex-1">
          <div class="space-y-2 px-4">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 group"
              :class="[
                $route.path === item.href 
                  ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/30' 
                  : 'text-emerald-100 hover:bg-emerald-700 hover:text-white hover:shadow-md'
              ]"
            >
              <i :class="[item.icon, 'text-lg w-6 text-center']"></i>
              <span class="font-medium">{{ item.name }}</span>
            </router-link>
          </div>
        </nav>

        <!-- User Info and Logout in Sidebar -->
        <div class="px-4 pt-6 mt-6 border-t border-emerald-700/50">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-white text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-white truncate">Administrador</div>
              <div class="text-xs text-emerald-300 truncate">Admin</div>
            </div>
          </div>
          
          <button
            @click="handleLogout"
            class="w-full flex items-center space-x-2 py-2 px-3 text-sm text-emerald-100 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar Mobile -->
    <div 
      v-show="sidebarOpen"
      class="lg:hidden fixed inset-0 z-50"
    >
      <div 
        class="fixed inset-0 bg-black bg-opacity-50"
        @click="sidebarOpen = false"
      ></div>
      
      <div class="relative bg-emerald-800 text-white w-64 h-full">
        <div class="flex flex-col h-full py-7 px-2">
          <!-- Logo e Botão Fechar -->
          <div class="flex items-center justify-between px-4 mb-8">
            <router-link to="/admin/dashboard" class="flex items-center space-x-2">
              <img src="/images/logo-amajac.png" alt="AMAJAC" class="h-12 w-12 object-contain">
              <div class="flex flex-col leading-tight">
                <span class="text-lg font-bold text-white">Painel</span>
                <span class="text-lg font-bold text-white">Administrativo</span>
              </div>
            </router-link>
            <button 
              @click="sidebarOpen = false"
              class="p-1 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <!-- Navigation Mobile -->
          <nav class="flex-1">
            <div class="space-y-2 px-4">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 group"
                :class="[
                  $route.path === item.href 
                    ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/30' 
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white hover:shadow-md'
                ]"
                @click="sidebarOpen = false"
              >
                <i :class="[item.icon, 'text-lg w-6 text-center']"></i>
                <span class="font-medium">{{ item.name }}</span>
              </router-link>
            </div>
          </nav>

          <!-- User Info and Logout in Mobile Sidebar -->
          <div class="px-4 pt-6 mt-6 border-t border-emerald-700/50">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white text-sm"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-white truncate">Administrador</div>
                <div class="text-xs text-emerald-300 truncate">Admin</div>
              </div>
            </div>
            
            <button
              @click="handleLogout"
              class="w-full flex items-center space-x-2 py-2 px-3 text-sm text-emerald-100 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <i class="fas fa-sign-out-alt"></i>
              <span>Sair do Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header - Same color as sidebar -->
      <header class="bg-emerald-800 shadow-sm border-b border-emerald-700 z-40">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <!-- Left: Menu Button & Breadcrumb -->
          <div class="flex items-center space-x-4">
            <button 
              @click="sidebarOpen = true"
              class="p-2 rounded-md text-white hover:text-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 lg:hidden"
            >
              <i class="fas fa-bars text-lg"></i>
            </button>
            
            <!-- Breadcrumb Only - No Page Title -->
            <nav class="flex" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-2">
                <li v-for="(crumb, index) in breadcrumbs" :key="crumb.name">
                  <div class="flex items-center">
                    <router-link
                      v-if="index === 0 && breadcrumbs.length > 1"
                      :to="crumb.href"
                      class="text-sm font-medium text-emerald-200 hover:text-white flex items-center"
                    >
                      <i :class="[crumb.icon, 'mr-2']"></i>
                      {{ crumb.name }}
                    </router-link>
                    <span v-else-if="index > 0" class="flex items-center">
                      <i class="fas fa-chevron-right text-emerald-400 mx-2 text-xs"></i>
                      <span 
                        class="text-sm font-medium text-emerald-200"
                        :class="{
                          'text-white': index === breadcrumbs.length - 1
                        }"
                      >
                        {{ crumb.name }}
                      </span>
                    </span>
                    <span v-else class="text-sm font-medium text-white flex items-center">
                      <i :class="[crumb.icon, 'mr-2']"></i>
                      {{ crumb.name }}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <!-- Right: Notifications and Dark Mode Toggle -->
          <div class="flex items-center space-x-4">
            <!-- Dark Mode Toggle -->
            <button 
              @click="toggleDarkMode"
              class="p-2 rounded-full text-white hover:text-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-colors"
              :title="isDarkMode ? 'Modo Claro' : 'Modo Escuro'"
            >
              <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>

            <!-- Notifications Dropdown -->
            <div class="relative">
              <button 
                @click="notificationsOpen = !notificationsOpen"
                class="p-2 rounded-full text-white hover:text-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 relative transition-colors"
              >
                <i class="fas fa-bell text-lg"></i>
                <span 
                  v-if="unreadNotifications > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                >
                  {{ unreadNotifications }}
                </span>
              </button>

              <!-- Notifications Dropdown Menu -->
              <div 
                v-show="notificationsOpen"
                class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
              >
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-center">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Notificações</h3>
                    <button
                      v-if="unreadNotifications > 0"
                      @click="markAllAsRead"
                      class="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ notifications.length }} notificaç{{ notifications.length === 1 ? 'ão' : 'ões' }}
                  </p>
                </div>

                <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
                  <i class="fas fa-bell-slash text-gray-400 dark:text-gray-500 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Nenhuma notificação</p>
                </div>

                <div v-else>
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30': !notification.read
                    }"
                    @click="markAsRead(notification.id)"
                  >
                    <div class="flex items-start space-x-3">
                      <div 
                        class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        :class="getNotificationColor(notification.type)"
                      >
                        <i :class="notification.icon"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
                          <button
                            v-if="!notification.read"
                            @click.stop="markAsRead(notification.id)"
                            class="opacity-0 group-hover:opacity-100 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-opacity"
                          >
                            Marcar como lida
                          </button>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatTime(notification.timestamp) }}</p>
                      </div>
                      <div v-if="!notification.read" class="flex-shrink-0">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                  <button
                    @click="clearAllNotifications"
                    class="w-full text-xs text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 transition-colors"
                    :disabled="notifications.length === 0"
                  >
                    Limpar todas as notificações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div class="py-6 px-4 sm:px-6 lg:px-8">
          <!-- Router View - Pages will handle their own titles -->
          <router-view />
        </div>
      </main>
    </div>

    <!-- Click outside to close notifications -->
    <div 
      v-if="notificationsOpen"
      class="fixed inset-0 z-40"
      @click="notificationsOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estado do sidebar
const sidebarOpen = ref(false)

// Estado das notificações
const notificationsOpen = ref(false)
const notifications = ref([
  {
    id: 1,
    title: 'Nova solicitação de associado',
    message: 'João Silva enviou uma nova solicitação de cadastro',
    type: 'info',
    icon: 'fas fa-user-plus',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    read: false
  },
  {
    id: 2,
    title: 'Evento aprovado',
    message: 'O evento "Reunião Mensal" foi aprovado com sucesso',
    type: 'success',
    icon: 'fas fa-calendar-check',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    read: false
  },
  {
    id: 3,
    title: 'Backup realizado',
    message: 'Backup automático do sistema concluído',
    type: 'success',
    icon: 'fas fa-database',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    read: true
  },
  {
    id: 4,
    title: 'Alerta de sistema',
    message: 'Uso de CPU acima do normal detectado',
    type: 'warning',
    icon: 'fas fa-exclamation-triangle',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    read: true
  }
])

// Dark Mode
const isDarkMode = ref(false)

// Notificações não lidas
const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// ✅ CORREÇÃO CRÍTICA: Navegação atualizada para a nova estrutura de rotas
const navigation = ref([
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'Notícias', href: '/admin/noticias', icon: 'fas fa-file-alt' },
  { name: 'Eventos', href: '/admin/eventos', icon: 'fas fa-calendar' },
  { name: 'Associados', href: '/admin/solicitacoes-socio', icon: 'fas fa-users' },
  { name: 'Parceiros Comerciais', href: '/admin/parceiros', icon: 'fas fa-handshake' },
  { name: 'Galeria', href: '/admin/galeria', icon: 'fas fa-images' },
  { name: 'Classificados', href: '/admin/classificados', icon: 'fas fa-list' },
  { name: 'Mensagens', href: '/admin/mensagens', icon: 'fas fa-envelope' },
  { name: 'Monitor Supabase', href: '/admin/monitor', icon: 'fas fa-chart-bar' },
  { name: 'Backup & Limpeza', href: '/admin/backup', icon: 'fas fa-database' },
  { name: 'Auditoria', href: '/admin/auditoria', icon: 'fas fa-clipboard-list' },
  { name: 'Configurações', href: '/admin/configuracoes', icon: 'fas fa-cog' },
  { name: 'Relatórios', href: '/admin/relatorios', icon: 'fas fa-chart-pie' }
])

// ✅ CORREÇÃO: Breadcrumbs atualizada para a nova estrutura
const breadcrumbs = computed(() => {
  const baseBreadcrumb = { name: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-tachometer-alt' }

  // Se estiver na página inicial do admin
  if (route.path === '/admin/dashboard' || route.path === '/admin') {
    return [baseBreadcrumb]
  }

  const crumbs = [baseBreadcrumb]
  
  // Remove 'admin' e 'dashboard' do path. Ex: /admin/noticias/nova -> ['noticias', 'nova']
  const pathArray = route.path.split('/').filter(path => path && path !== 'admin' && path !== 'dashboard')

  pathArray.forEach((segment, index) => {
    // ✅ CORREÇÃO: URL construída no formato correto /admin/segmento1/segmento2
    const currentPathSegments = pathArray.slice(0, index + 1).join('/')
    const href = '/admin/' + currentPathSegments

    // Tenta encontrar o item de navegação correspondente
    const navItem = navigation.value.find(item =>
      item.href === href || item.href.includes(segment)
    )

    if (navItem) {
      crumbs.push({
        name: navItem.name,
        href: navItem.href,
        icon: navItem.icon
      })
    } else {
      // Para rotas dinâmicas ou aninhadas
      const formattedName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      crumbs.push({
        name: formattedName,
        href: href,
        icon: 'fas fa-chevron-right'
      })
    }
  })

  return crumbs
})

// Funções para notificações
const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification && !notification.read) {
    notification.read = true
    // Aqui você pode adicionar uma chamada API para marcar como lida no backend
    console.log(`Notificação ${notificationId} marcada como lida`)
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    if (!notification.read) {
      notification.read = true
    }
  })
  console.log('Todas as notificações marcadas como lidas')
}

const clearAllNotifications = () => {
  notifications.value = []
  console.log('Todas as notificações limpas')
}

const getNotificationColor = (type) => {
  const colors = {
    success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
    error: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
  }
  return colors[type] || colors.info
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Agora mesmo'
  if (minutes < 60) return `${minutes} min atrás`
  if (hours < 24) return `${hours} h atrás`
  if (days === 1) return 'Ontem'
  return `${days} dias atrás`
}

// Dark Mode functions
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('dark-mode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('dark-mode', 'false')
  }
}

const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('dark-mode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedMode === 'true' || (!savedMode && prefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
}

// Logout function
const handleLogout = () => {
  // Implementar lógica de logout
  console.log('Logout realizado')
  router.push('/login')
}

// Fechar dropdowns ao clicar fora
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    notificationsOpen.value = false
  }
}

// Fechar sidebar em mobile ao mudar de rota
const closeSidebarOnRouteChange = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

// Event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  router.afterEach(closeSidebarOnRouteChange)
  initializeDarkMode()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.router-link-active {
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 0 2px 2px 0;
}
</style>