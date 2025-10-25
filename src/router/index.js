// src/router/index.js
import { createRouter, createWebHistory } from "vue-router"
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "Início - AMAJAC" }
  },
  {
    path: "/noticias",
    name: "Noticias",
    component: () => import("@/views/NoticiasView.vue"),
    meta: { title: "Notícias - AMAJAC" }
  },
  {
    path: "/noticias/:id",
    name: "NoticiaDetalhes",
    component: () => import("@/views/NoticiaDetalhesView.vue"),
    meta: { title: "Detalhes da Notícia - AMAJAC" },
    props: true
  },
  {
    path: "/eventos",
    name: "Eventos",
    component: () => import("@/views/EventosView.vue"),
    meta: { title: "Eventos - AMAJAC" }
  },
  {
    path: "/eventos/:id",
    name: "EventoDetalhes",
    component: () => import("@/views/EventoDetalhesView.vue"),
    meta: { title: "Detalhes do Evento - AMAJAC" },
    props: true
  },
  {
    path: "/galeria",
    name: "Galeria",
    component: () => import("@/views/GaleriaView.vue"),
    meta: { title: "Galeria de Fotos - AMAJAC" }
  },
  {
    path: "/galeria/:id",
    name: "GaleriaDetalhes",
    component: () => import("@/views/GaleriaDetalhesView.vue"),
    meta: { title: "Detalhes da Galeria - AMAJAC" },
    props: true
  },
  {
    path: "/parceiros",
    name: "Parceiros",
    component: () => import("@/views/ParceirosView.vue"),
    meta: { title: "Parceiros Comerciais - AMAJAC" }
  },
  {
    path: "/parceiros/:id",
    name: "ParceiroDetalhes",
    component: () => import("@/views/ParceiroDetalhesView.vue"),
    meta: { title: "Detalhes do Parceiro - AMAJAC" },
    props: true
  },
  {
    path: "/contato",
    name: "Contato",
    component: () => import("@/views/ContatoView.vue"),
    meta: { title: "Contato - AMAJAC" }
  },
  {
    path: "/torne-se-socio",
    name: "TorneSeSocio",
    component: () => import("@/views/TorneSeAssociadoView.vue"),
    meta: { title: "Torne-se Sócio - AMAJAC" }
  },
  {
    path: "/classificados",
    name: "Classificados",
    component: () => import("@/views/ClassificadosView.vue"),
    meta: { title: "Classificados - AMAJAC" }
  },
  {
    path: "/classificados/:id",
    name: "ClassificadoDetalhe",
    component: () => import("@/views/ClassificadoDetalhe.vue"),
    meta: { title: "Detalhes do Classificado - AMAJAC" },
    props: true
  },

  // ===== ROTAS DO PAINEL ADMIN =====
  
  // 🔐 ROTAS PÚBLICAS DE AUTENTICAÇÃO
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/admin/views/AdminLogin.vue"),
    meta: { 
      title: "Login - Painel Admin",
      public: true
    }
  },
  
  // ✅ CORREÇÃO: Rotas de recuperação de senha adicionadas
  {
    path: "/admin/forgot-password",
    name: "AdminForgotPassword",
    component: () => import("@/admin/components/AdminEsqueciSenha.vue"),
    meta: { 
      title: "Recuperar Senha - Painel Admin",
      public: true 
    }
  },
  
  {
    path: "/admin/reset-password", 
    name: "AdminResetPassword",
    component: () => import("@/admin/components/AdminResetSenha.vue"),
    meta: { 
      title: "Nova Senha - Painel Admin",
      public: true 
    }
  },
  
  {
    path: "/admin/esqueci-senha",
    name: "AdminEsqueciSenha",
    component: () => import("@/admin/views/AdminEsqueciSenha.vue"),
    meta: { 
      title: "Recuperar Senha - Painel Admin",
      public: true 
    }
  },
  
  // ✅ CORREÇÃO CRÍTICA: Rota principal do admin redireciona para dashboard
  {
    path: "/admin",
    redirect: "/admin/dashboard"
  },

  // ROTA PROTEGIDA: Layout Principal do Admin
  {
    path: "/admin/dashboard",
    component: () => import("@/admin/components/AdminLayout.vue"),
    meta: { 
      requiresAuth: true,
      title: "Dashboard - Painel Admin"
    },
    children: [
      // ✅ CORREÇÃO: Dashboard Principal - caminho vazio dentro do layout
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("@/admin/views/AdminDashboard.vue"),
        meta: { title: "Dashboard" }
      },
      
      // Notícias
      {
        path: "noticias",
        name: "AdminNoticias",
        component: () => import("@/admin/views/AdminNoticias.vue"),
        meta: { title: "Gerenciar Notícias" }
      },
      {
        path: "noticias/nova",
        name: "AdminNoticiaNova",
        component: () => import("@/admin/views/AdminNoticiaForm.vue"),
        meta: { title: "Nova Notícia" }
      },
      {
        path: "noticias/editar/:id",
        name: "AdminNoticiaEditar",
        component: () => import("@/admin/views/AdminNoticiaForm.vue"),
        meta: { title: "Editar Notícia" },
        props: true
      },
      
      // Eventos
      {
        path: "eventos",
        name: "AdminEventos",
        component: () => import("@/admin/views/AdminEventos.vue"),
        meta: { title: "Gerenciar Eventos" }
      },
      {
        path: "eventos/novo",
        name: "AdminEventoNovo",
        component: () => import("@/admin/views/AdminEventoForm.vue"),
        meta: { title: "Novo Evento" }
      },
      {
        path: "eventos/editar/:id",
        name: "AdminEventoEditar",
        component: () => import("@/admin/views/AdminEventoForm.vue"),
        meta: { title: "Editar Evento" },
        props: true
      },
      
      // Galeria
      {
        path: "galeria",
        name: "AdminGaleria",
        component: () => import("@/admin/views/AdminGaleria.vue"),
        meta: { title: "Gerenciar Galeria" }
      },
      {
        path: "galeria/nova",
        name: "AdminGaleriaNova",
        component: () => import("@/admin/views/AdminGaleriaForm.vue"),
        meta: { title: "Nova Imagem" }
      },
      {
        path: "galeria/editar/:id",
        name: "AdminGaleriaEditar",
        component: () => import("@/admin/views/AdminGaleriaForm.vue"),
        meta: { title: "Editar Imagem" },
        props: true
      },
      
      // Parceiros
      {
        path: "parceiros",
        name: "AdminParceiros",
        component: () => import("@/admin/views/AdminParceiros.vue"),
        meta: { title: "Gerenciar Parceiros Comerciais" }
      },
      {
        path: "parceiros/novo",
        name: "AdminParceiroNovo",
        component: () => import("@/admin/views/AdminParceiroForm.vue"),
        meta: { title: "Novo Parceiro Comercial" }
      },
      {
        path: "parceiros/editar/:id",
        name: "AdminParceiroEditar",
        component: () => import("@/admin/views/AdminParceiroForm.vue"),
        meta: { title: "Editar Parceiro Comercial" },
        props: true
      },
      
      // Classificados
      {
        path: "classificados",
        name: "AdminClassificados",
        component: () => import("@/admin/views/AdminClassificados.vue"),
        meta: { title: "Gerenciar Classificados" }
      },
      {
        path: "classificados/novo",
        name: "AdminClassificadoNovo",
        component: () => import("@/admin/views/AdminClassificadoForm.vue"),
        meta: { title: "Novo Classificado" }
      },
      {
        path: "classificados/editar/:id",
        name: "AdminClassificadoEditar",
        component: () => import("@/admin/views/AdminClassificadoForm.vue"),
        meta: { title: "Editar Classificado" },
        props: true
      },
      
      // Mensagens
      {
        path: "mensagens",
        name: "AdminMensagens",
        component: () => import("@/admin/views/AdminMensagens.vue"),
        meta: { title: "Mensagens de Contato" }
      },
      
      // Solicitações de Sócio
      {
        path: "solicitacoes-socio",
        name: "AdminSolicitacoesSocio",
        component: () => import("@/admin/views/AdminSolicitacoesSocio.vue"),
        meta: { title: "Solicitações de Sócio" }
      },
      
      // Configurações
      {
        path: "configuracoes",
        name: "AdminConfiguracoes",
        component: () => import("@/admin/views/AdminConfiguracoes.vue"),
        meta: { title: "Configurações Gerais" }
      },
      {
        path: "configuracoes-completo",
        name: "AdminConfiguracoesCompleto",
        component: () => import("@/admin/views/AdminConfiguracoesCompleto.vue"),
        meta: { title: "Configurações Avançadas" }
      },
      
      // Relatórios
      {
        path: "relatorios",
        name: "AdminRelatorios",
        component: () => import("@/admin/views/AdminRelatorios.vue"),
        meta: { title: "Relatórios e Estatísticas" }
      },
      
      // Auditoria
      {
        path: "relatorios/auditoria",
        name: "RelatorioAuditoria",
        component: () => import("@/admin/views/RelatorioAuditoria.vue"),
        meta: { title: "Auditoria do Sistema" }
      },

      // ===== NOVAS ROTAS ADICIONADAS =====
      
      // Monitor Supabase
      {
        path: "monitor",
        name: "AdminMonitor",
        component: () => import("@/admin/views/MonitorView.vue"),
        meta: { title: "Monitor Supabase" }
      },
      
      // Backup & Limpeza
      {
        path: "backup", 
        name: "AdminBackup",
        component: () => import("@/admin/views/BackupView.vue"),
        meta: { title: "Backup & Limpeza" }
      },
      
      // Auditoria Completa
      {
        path: "auditoria",
        name: "AdminAuditoria", 
        component: () => import("@/admin/views/AuditoriaView.vue"),
        meta: { title: "Auditoria do Sistema" }
      }
    ]
  },

  // ===== REDIRECIONAMENTOS PARA MANTENER COMPATIBILIDADE =====
  {
    path: "/colaboradores",
    redirect: "/parceiros"
  },
  {
    path: "/colaboradores/:id",
    redirect: to => ({ path: `/parceiros/${to.params.id}` })
  },

  // ===== ROTA 404 =====
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "Página Não Encontrada - AMAJAC" }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else if (to.hash) {
          const element = document.querySelector(to.hash)
          if (element) {
            resolve({
              el: to.hash,
              behavior: 'smooth',
              top: 80
            })
          } else {
            resolve({ top: 0, behavior: 'smooth' })
          }
        } else {
          resolve({ top: 0, behavior: 'smooth' })
        }
      }, 50)
    })
  }
})

// Guarda de navegação - CORRIGIDO E MELHORADO
router.beforeEach(async (to, from, next) => {
  const uiStore = useUIStore()
  const authStore = useAuthStore()
  
  // Inicializar modo escuro
  uiStore.initializeDarkMode()
  
  // Atualizar título da página
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // ✅ CORREÇÃO: Verificar autenticação apenas para rotas que requerem
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    
    if (!isAuthenticated) {
      uiStore.showToast('Acesso negado. Por favor, faça login.', 'error')
      next('/admin/login')
      return
    }
  }
  
  // ✅ CORREÇÃO: Se já está autenticado e tenta acessar login/recuperação
  if (to.meta.public && (to.path === '/admin/login' || to.path.includes('/admin/forgot-password') || to.path.includes('/admin/reset-password'))) {
    const currentAuth = await authStore.checkAuth()
    
    if (currentAuth) {
      next('/admin/dashboard')
      return
    }
  }

  next()
})

// Hook após navegação
router.afterEach((to) => {
  const uiStore = useUIStore()
  
  // Fechar menu mobile se estiver aberto
  if (uiStore.mobileMenuOpen && uiStore.closeMobileMenu) {
    uiStore.closeMobileMenu()
  }
})

export default router