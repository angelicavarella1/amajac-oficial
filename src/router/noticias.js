// src/router/noticias.js
export default [
  {
    path: '/noticias',
    name: 'noticias',
    component: () => import('@/modules/noticias/pages/NoticiasPage.vue'),
    meta: {
      title: 'Notícias - AMAJAC',
      requiresAuth: false
    }
  },
  {
    path: '/noticias/:id',
    name: 'noticia-detail',
    component: () => import('@/modules/noticias/pages/NoticiaDetalhePage.vue'), // ✅ NOME CORRETO
    meta: {
      title: 'Notícia - AMAJAC',
      requiresAuth: false
    }
  },
  {
    path: '/admin/noticias',
    name: 'admin-noticias',
    component: () => import('@/modules/noticias/pages/AdminNoticiasPage.vue'),
    meta: {
      title: 'Gestão de Notícias - AMAJAC',
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]