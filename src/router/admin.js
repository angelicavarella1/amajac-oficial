// src/router/admin.js
const routes = [
  {
    path: '/admin/auditoria',
    name: 'admin-auditoria',
    component: () => import('@/admin/views/AuditoriaView.vue')
  },
  {
    path: '/admin/monitor',
    name: 'admin-monitor', 
    component: () => import('@/admin/views/MonitorView.vue')
  },
  {
    path: '/admin/backup',
    name: 'admin-backup',
    component: () => import('@/admin/views/BackupView.vue')
  }
]
