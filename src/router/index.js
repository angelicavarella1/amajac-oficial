// src/router/index.js
import { createRouter, createWebHistory } from "vue-router"
// --- Imports Corrigidos ---
import { useUIStore } from '@/shared/stores/ui' // <-- Corrigido
import { useAuthStore } from '@/modules/auth/stores/auth' // <-- Corrigido

const routes = [
  {
    path: "/",
    name: "Home",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/HomeView.vue"), // <-- Movido para src/views/
    meta: { title: "Início - AMAJAC" }
  },
  {
    path: "/noticias",
    name: "Noticias",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/NoticiasView.vue"), // <-- Movido para src/views/
    meta: { title: "Notícias - AMAJAC" }
  },
  {
    path: "/noticias/:id",
    name: "NoticiaDetalhes",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/NoticiaDetalhesView.vue"), // <-- Movido para src/views/
    meta: { title: "Detalhes da Notícia - AMAJAC" },
    props: true
  },
  {
    path: "/eventos",
    name: "Eventos",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/EventosView.vue"), // <-- Movido para src/views/
    meta: { title: "Eventos - AMAJAC" }
  },
  {
    path: "/eventos/:id",
    name: "EventoDetalhes",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/EventoDetalhesView.vue"), // <-- Movido para src/views/
    meta: { title: "Detalhes do Evento - AMAJAC" },
    props: true
  },
  {
    path: "/galeria",
    name: "Galeria",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/GaleriaView.vue"), // <-- Movido para src/views/
    meta: { title: "Galeria de Fotos - AMAJAC" }
  },
  {
    path: "/galeria/:id",
    name: "GaleriaDetalhes",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/GaleriaDetalhesView.vue"), // <-- Movido para src/views/
    meta: { title: "Detalhes da Galeria - AMAJAC" },
    props: true
  },
  {
    path: "/parceiros",
    name: "Parceiros",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/ParceirosView.vue"), // <-- Movido para src/views/
    meta: { title: "Parceiros Comerciais - AMAJAC" }
  },
  {
    path: "/parceiros/:id",
    name: "ParceiroDetalhes",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/ParceiroDetalhesView.vue"), // <-- Movido para src/views/
    meta: { title: "Detalhes do Parceiro - AMAJAC" },
    props: true
  },
  {
    path: "/contato",
    name: "Contato",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/ContatoView.vue"), // <-- Movido para src/views/
    meta: { title: "Contato - AMAJAC" }
  },
  {
    path: "/torne-se-socio",
    name: "TorneSeSocio",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/TorneSeAssociadoView.vue"), // <-- Movido para src/views/
    meta: { title: "Torne-se Sócio - AMAJAC" }
  },
  {
    path: "/classificados",
    name: "Classificados",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/ClassificadosView.vue"), // <-- Movido para src/views/
    meta: { title: "Classificados - AMAJAC" }
  },
  {
    path: "/classificados/:id",
    name: "ClassificadoDetalhe",
    // --- CORREÇÃO CRÍTICA: CAMINHO ATUALIZADO ---
    component: () => import("@/modules/classificados/components/ClassificadoDetalhe.vue"), // <-- CORRIGIDO: estava em views, agora em modules/classificados/components
    meta: { title: "Detalhes do Classificado - AMAJAC" },
    props: true
  },

  // ===== ROTAS DO PAINEL ADMIN =====
  
  // 🔐 ROTAS PÚBLICAS DE AUTENTICAÇÃO
  {
    path: "/admin/login",
    name: "AdminLogin",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/admin/views/AdminLogin.vue"), // <-- Movido para src/admin/views/
    meta: { 
      title: "Login - Painel Admin",
      public: true
    }
  },
  
  // ✅ CORREÇÃO: Rotas de recuperação de senha adicionadas
  {
    path: "/admin/forgot-password",
    name: "AdminForgotPassword",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/admin/views/AdminEsqueciSenha.vue"), // <-- Movido para src/admin/views/
    meta: { 
      title: "Recuperar Senha - Painel Admin",
      public: true 
    }
  },
  
  {
    path: "/admin/reset-password", 
    name: "AdminResetPassword",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/admin/views/AdminResetSenha.vue"), // <-- Movido para src/admin/views/
    meta: { 
      title: "Nova Senha - Painel Admin",
      public: true 
    }
  },
  
  {
    path: "/admin/esqueci-senha",
    name: "AdminEsqueciSenha",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/admin/views/AdminEsqueciSenha.vue"), // <-- Movido para src/admin/views/
    meta: { 
      title: "Recuperar Senha - Painel Admin",
      public: true 
    }
  },
  
  // 🎯 CORREÇÃO CRÍTICA: ROTA PRINCIPAL DO ADMIN DEVE SER "/admin"
  {
    path: "/admin",
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/admin/views/AdminLayout.vue"), // <-- Movido para src/admin/views/
    meta: { 
      requiresAuth: true,
      title: "Painel Admin - AMAJAC"
    },
    children: [
      // ✅ Redirecionamento da raiz do admin para dashboard
      {
        path: "",
        redirect: "/admin/dashboard"
      },
      
      // ✅ Dashboard - AGORA como rota filha
      {
        path: "dashboard",
        name: "AdminDashboard",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminDashboard.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Dashboard" }
      },
      
      // Notícias
      {
        path: "noticias",
        name: "AdminNoticias",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminNoticias.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Gerenciar Notícias" }
      },
      {
        path: "noticias/nova", // ✅ AGORA será: /admin/noticias/nova
        name: "AdminNoticiaNova",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminNoticiaForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Nova Notícia" }
      },
      {
        path: "noticias/editar/:id", // ✅ AGORA será: /admin/noticias/editar/1
        name: "AdminNoticiaEditar",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminNoticiaForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Editar Notícia" },
        props: true
      },
      
      // Eventos
      {
        path: "eventos",
        name: "AdminEventos",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminEventos.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Gerenciar Eventos" }
      },
      {
        path: "eventos/novo", // ✅ AGORA será: /admin/eventos/novo
        name: "AdminEventoNovo",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminEventoForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Novo Evento" }
      },
      {
        path: "eventos/editar/:id", // ✅ AGORA será: /admin/eventos/editar/1
        name: "AdminEventoEditar",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminEventoForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Editar Evento" },
        props: true
      },
      
      // Galeria
      {
        path: "galeria",
        name: "AdminGaleria",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminGaleria.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Gerenciar Galeria" }
      },
      {
        path: "galeria/nova", // ✅ AGORA será: /admin/galeria/nova
        name: "AdminGaleriaNova",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminGaleriaForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Nova Imagem" }
      },
      {
        path: "galeria/editar/:id", // ✅ AGORA será: /admin/galeria/editar/1
        name: "AdminGaleriaEditar",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminGaleriaForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Editar Imagem" },
        props: true
      },
      
      // Parceiros
      {
        path: "parceiros",
        name: "AdminParceiros",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminParceiros.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Gerenciar Parceiros Comerciais" }
      },
      {
        path: "parceiros/novo", // ✅ AGORA será: /admin/parceiros/novo
        name: "AdminParceiroNovo",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminParceiroForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Novo Parceiro Comercial" }
      },
      {
        path: "parceiros/editar/:id", // ✅ AGORA será: /admin/parceiros/editar/1
        name: "AdminParceiroEditar",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminParceiroForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Editar Parceiro Comercial" },
        props: true
      },
      
      // Classificados
      {
        path: "classificados",
        name: "AdminClassificados",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminClassificados.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Gerenciar Classificados" }
      },
      {
        path: "classificados/novo", // ✅ AGORA será: /admin/classificados/novo
        name: "AdminClassificadoNovo",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminClassificadoForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Novo Classificado" }
      },
      {
        path: "classificados/editar/:id", // ✅ AGORA será: /admin/classificados/editar/1
        name: "AdminClassificadoEditar",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminClassificadoForm.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Editar Classificado" },
        props: true
      },
      
      // Mensagens
      {
        path: "mensagens",
        name: "AdminMensagens",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminMensagens.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Mensagens de Contato" }
      },
      
      // Solicitações de Sócio
      {
        path: "solicitacoes-socio",
        name: "AdminSolicitacoesSocio",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminSolicitacoesSocio.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Solicitações de Sócio" }
      },
      
      // Configurações
      {
        path: "configuracoes",
        name: "AdminConfiguracoes",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminConfiguracoes.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Configurações Gerais" }
      },
      {
        path: "configuracoes-completo",
        name: "AdminConfiguracoesCompleto",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminConfiguracoesCompleto.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Configurações Avançadas" }
      },
      
      // Relatórios
      {
        path: "relatorios",
        name: "AdminRelatorios",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AdminRelatorios.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Relatórios e Estatísticas" }
      },
      
      // Auditoria
      {
        path: "relatorios/auditoria",
        name: "RelatorioAuditoria",
        // --- CORREÇÃO CRÍTICA: CAMINHO ATUALIZADO ---
        component: () => import("@/admin/modules/auth/RelatorioAuditoria.vue"), // <-- CORRIGIDO: estava em views, agora em admin/modules/auth
        meta: { title: "Auditoria do Sistema" }
      },

      // ===== NOVAS ROTAS ADICIONADAS =====
      
      // Monitor Supabase
      {
        path: "monitor",
        name: "AdminMonitor",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/MonitorView.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Monitor Supabase" }
      },
      
      // Backup & Limpeza
      {
        path: "backup", 
        name: "AdminBackup",
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/BackupView.vue"), // <-- Movido para src/admin/views/
        meta: { title: "Backup & Limpeza" }
      },
      
      // Auditoria Completa
      {
        path: "auditoria",
        name: "AdminAuditoria", 
        // --- CAMINHO CORRIGIDO ---
        component: () => import("@/admin/views/AuditoriaView.vue"), // <-- Movido para src/admin/views/
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
    // --- CAMINHO CORRIGIDO ---
    component: () => import("@/views/NotFoundView.vue"), // <-- Movido para src/views/
    meta: { title: "Página Não Encontrada - AMAJAC" }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
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
router.afterEach(() => {
  const uiStore = useUIStore()
  
  // Fechar menu mobile se estiver aberto
  if (uiStore.mobileMenuOpen && uiStore.closeMobileMenu) {
    uiStore.closeMobileMenu()
  }
})

export default router