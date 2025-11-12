/**
 * Configuração central de rotas da aplicação AMAJAC.
 * - Remove rota pública de associados (conforme Estatuto Art. 3º e Art. 4º).
 * - Mantém apenas área administrativa para gestão de sócios.
 * - Preserva formulário público de inscrição (via /associacao).
 * - Separação clara entre áreas públicas e administrativas.
 * - Guarda de autenticação com Supabase.
 * - Proteção baseada em e-mail para rotas de superadmin.
 * - Code-splitting via imports dinâmicos.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/core/utils/supabaseClient'

// Layouts
import SiteLayout from '@/modules/site/layouts/SiteLayout.vue'
import AdminLayout from '@/modules/admin/layouts/AdminLayout.vue'
import AuthLoginPage from '@/modules/auth/pages/AuthLoginPage.vue'

const routes = [
  // === ROTAS PÚBLICAS ===
  {
    path: '/',
    component: SiteLayout,
    children: [
      { 
        path: '', 
        name: 'Home',
        component: () => import('@/modules/site/pages/SiteHomePage.vue') 
      },
      // REMOVIDO: rota pública de /associados (não permitida pelo Estatuto)
      { 
        path: 'classificados', 
        name: 'Classificados',
        component: () => import('@/modules/classificados/pages/ClassificadosPage.vue') 
      },
      { 
        path: 'eventos', 
        name: 'Eventos',
        component: () => import('@/modules/eventos/pages/EventosPage.vue') 
      },
      { 
        path: 'noticias', 
        name: 'Noticias',
        component: () => import('@/modules/noticias/pages/NoticiasPage.vue') 
      },
      { 
        path: 'noticias/:id', 
        name: 'noticia-detail',
        component: () => import('@/modules/noticias/pages/NoticiaDetalhePage.vue') 
      },
      { 
        path: 'galeria', 
        name: 'Galeria',
        component: () => import('@/modules/galeria/pages/GaleriaPage.vue') 
      },
      { 
        path: 'parceiros', 
        name: 'Parceiros',
        component: () => import('@/modules/parceiros/pages/ParceirosPage.vue') 
      },
      { 
        path: 'contato', 
        name: 'Contato',
        component: () => import('@/modules/mensagens/pages/ContatoPage.vue') 
      },
      { 
        path: 'sobre', 
        name: 'Sobre',
        component: () => import('@/modules/sobre/pages/SobrePage.vue') 
      },
      { 
        path: 'termos', 
        name: 'Termos',
        component: () => import('@/modules/site/pages/TermosPage.vue') 
      },
      { 
        path: 'privacidade', 
        name: 'Privacidade',
        component: () => import('@/modules/site/pages/PrivacidadePage.vue') 
      },
      // ✅ ROTA ADICIONADA — única alteração no arquivo
      { 
        path: 'associacao',
        name: 'InscricaoSocio',
        component: () => import('@/modules/associados/pages/InscricaoSocioPage.vue')
      }
    ]
  },

  // === AUTENTICAÇÃO ===
  { 
    path: '/admin/login', 
    name: 'admin-login',
    component: AuthLoginPage,
    meta: { public: true }
  },

  // === ÁREA ADMINISTRATIVA (protegida) ===
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'Admin',
        redirect: '/admin/dashboard'
      },
      { 
        path: 'dashboard', 
        name: 'admin-dashboard',
        component: () => import('@/modules/admin/pages/AdminDashboard.vue') 
      },
      { 
        path: 'associados', 
        name: 'admin-associados',
        component: () => import('@/modules/associados/pages/AdminAssociadosPage.vue') 
      },
      { 
        path: 'noticias', 
        name: 'admin-noticias',
        component: () => import('@/modules/noticias/pages/AdminNoticiasPage.vue') 
      },
      { 
        path: 'eventos', 
        name: 'admin-eventos',
        component: () => import('@/modules/eventos/pages/AdminEventosPage.vue') 
      },
      { 
        path: 'parceiros', 
        name: 'admin-parceiros',
        component: () => import('@/modules/parceiros/pages/AdminParceirosPage.vue') 
      },
      { 
        path: 'classificados', 
        name: 'admin-classificados',
        component: () => import('@/modules/classificados/pages/AdminClassificadosPage.vue') 
      },
      { 
        path: 'galeria', 
        name: 'admin-galeria',
        component: () => import('@/modules/galeria/pages/AdminGaleriaPage.vue') 
      },
      { 
        path: 'mensagens', 
        name: 'admin-mensagens',
        component: () => import('@/modules/mensagens/pages/AdminMensagensPage.vue') 
      },
      { 
        path: 'sobre', 
        name: 'admin-sobre',
        component: () => import('@/modules/sobre/pages/AdminSobrePage.vue') 
      },
      { 
        path: 'configuracoes', 
        name: 'admin-configuracoes',
        component: () => import('@/modules/admin/pages/AdminConfiguracoes.vue'),
        meta: { requiresSuperadmin: true }
      },
      // NOVA ROTA: AUDITORIA COMPLETA
      { 
        path: 'auditoria', 
        name: 'admin-auditoria',
        component: () => import('@/modules/auditoria/pages/AdminAuditoriaPage.vue'),
        meta: { requiresSuperadmin: true }
      }
    ]
  },

  // Redirecionamento para login em rotas não encontradas protegidas
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      if (to.fullPath.startsWith('/admin')) {
        return { name: 'admin-login', query: { redirect: to.fullPath } }
      }
      return { name: 'Home' }
    }
  }
]

const router = createRouter({ 
  history: createWebHistory(), 
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Retorna ao topo da página em novas navegações
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

/**
 * Guarda global de autenticação e autorização.
 */
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresSuperadmin = to.matched.some(record => record.meta.requiresSuperadmin)
  const isPublic = to.meta.public

  // 1. Permite acesso a rotas públicas
  if (isPublic || !requiresAuth) {
    return next()
  }
  
  // A partir daqui, a rota é protegida

  const { data } = await supabase.auth.getSession()
  const session = data?.session

  // 2. Verifica autenticação
  if (!session) {
    if (to.name === 'admin-login') {
      return next() 
    }
    return next({ name: 'admin-login', query: { redirect: to.fullPath } })
  }

  // 3. Verifica superadmin (se necessário)
  if (requiresSuperadmin) {
    const userEmail = session.user.email
    // Lista de emails autorizados como superadmin
    const superadminEmails = [
      'angelicavarella@amajac.org.br',
      // Adicione outros emails de superadmin aqui se necessário
    ]
    
    if (!superadminEmails.includes(userEmail)) {
      // Redireciona para dashboard com mensagem de erro
      console.warn(`Acesso negado: ${userEmail} tentou acessar rota de superadmin`)
      return next({ name: 'admin-dashboard' })
    }
  }

  // 4. Continua a navegação
  next()
})

/**
 * Hook para tratamento de erros de navegação
 */
router.onError((error, to) => {
  console.error('Erro de navegação:', error)
  
  // Redireciona para home em caso de erro de carregamento de módulo
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.warn(`Módulo não encontrado para rota: ${to.path}`)
    if (to.fullPath.startsWith('/admin')) {
      router.replace({ name: 'admin-dashboard' })
    } else {
      router.replace({ name: 'Home' })
    }
  }
})

export default router