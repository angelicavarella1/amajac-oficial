<!-- src\modules\admin\pages\AdminDashboard.vue -->
<template>
  <div class="admin-dashboard bg-gray-50 dark:bg-gray-900 min-h-screen">
    <main class="admin-main">
      <div class="dashboard-grid">
        <!-- Linha 1: Visão Geral + Ações Rápidas -->
        <div class="dashboard-row">
          <!-- Card de Estatísticas -->
          <div class="dashboard-card stats-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div class="card-header border-b border-gray-200 dark:border-gray-600">
              <h3 class="text-gray-900 dark:text-white">Visão Geral</h3>
            </div>
            <div v-if="loadingStats" class="stats-grid">
              <div v-for="i in 4" :key="i" class="stat-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <Skeleton class="stat-number-skeleton bg-gray-300 dark:bg-gray-600" />
                <Skeleton class="stat-label-skeleton bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
            <div v-else class="stats-grid">
              <div class="stat-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
                <div class="stat-number text-amajac-green dark:text-amajac-green-light">{{ stats.associadosAtivos }}</div>
                <div class="stat-label text-gray-600 dark:text-gray-300">Associados Ativos</div>
              </div>
              <div class="stat-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
                <div class="stat-number text-amajac-green dark:text-amajac-green-light">{{ stats.classificadosAprovados }}</div>
                <div class="stat-label text-gray-600 dark:text-gray-300">Classificados Aprovados</div>
              </div>
              <div class="stat-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
                <div class="stat-number text-amajac-green dark:text-amajac-green-light">{{ stats.mensagensNaoLidas }}</div>
                <div class="stat-label text-gray-600 dark:text-gray-300">Mensagens Não Lidas</div>
              </div>
              <div class="stat-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
                <div class="stat-number text-amajac-green dark:text-amajac-green-light">{{ stats.eventosAtivos }}</div>
                <div class="stat-label text-gray-600 dark:text-gray-300">Eventos Ativos</div>
              </div>
            </div>
          </div>

          <!-- Ações Rápidas - COM MESMA ALTURA -->
          <div class="dashboard-card actions-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">
            <div class="card-header border-b border-gray-200 dark:border-gray-600">
              <h3 class="text-gray-900 dark:text-white">Ações Rápidas</h3>
            </div>
            <div class="actions-grid h-full">
              <button @click="navegarPara('admin-associados')" class="action-btn bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-amajac-green hover:bg-white dark:hover:bg-gray-600 h-full">
                <span class="action-text text-gray-900 dark:text-white">Gerenciar Associados</span>
              </button>
              <button @click="navegarPara('admin-classificados')" class="action-btn bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-amajac-green hover:bg-white dark:hover:bg-gray-600 h-full">
                <span class="action-text text-gray-900 dark:text-white">Moderar Classificados</span>
              </button>
              <button @click="navegarParaAuditoria()" class="action-btn bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-amajac-green hover:bg-white dark:hover:bg-gray-600 h-full">
                <span class="action-text text-gray-900 dark:text-white">Ver Auditoria Completa</span>
              </button>
              <button @click="navegarPara('admin-configuracoes')" class="action-btn bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-amajac-green hover:bg-white dark:hover:bg-gray-600 h-full">
                <span class="action-text text-gray-900 dark:text-white">Configurações</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Linha 2: Resumo de Segurança (largura total) -->
        <div class="dashboard-card security-card full-width bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="card-header border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-gray-900 dark:text-white">Resumo de Segurança</h3>
          </div>
          <div class="security-grid">
            <div class="security-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
              <div class="security-icon">🔍</div>
              <div class="security-info">
                <div class="security-number text-amajac-green dark:text-amajac-green-light">{{ stats.logsHoje }}</div>
                <div class="security-label text-gray-600 dark:text-gray-300">Logs hoje</div>
              </div>
            </div>
            <div class="security-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
              <div class="security-icon">👤</div>
              <div class="security-info">
                <div class="security-number text-amajac-green dark:text-amajac-green-light">{{ stats.adminsAtivos }}</div>
                <div class="security-label text-gray-600 dark:text-gray-300">Admins ativos</div>
              </div>
            </div>
            <div class="security-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
              <div class="security-icon">📊</div>
              <div class="security-info">
                <div class="security-number text-amajac-green dark:text-amajac-green-light">{{ stats.tabelasMonitoradas }}</div>
                <div class="security-label text-gray-600 dark:text-gray-300">Tabelas monitoradas</div>
              </div>
            </div>
            <div class="security-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-amajac-green">
              <div class="security-icon">💾</div>
              <div class="security-info">
                <div class="security-number text-amajac-green dark:text-amajac-green-light">{{ stats.backupsMes }}</div>
                <div class="security-label text-gray-600 dark:text-gray-300">Backups este mês</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Linha 3: Auditoria Recente (largura total) -->
        <div class="dashboard-card activity-card full-width bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="card-header border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-gray-900 dark:text-white">Auditoria Recente</h3>
            <button @click="carregarAuditoria" class="btn-refresh bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500" :disabled="loadingAuditoria">
              ↻
            </button>
          </div>
          <div v-if="loadingAuditoria" class="activity-list">
            <div v-for="i in 3" :key="i" class="activity-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <Skeleton class="activity-title-skeleton bg-gray-300 dark:bg-gray-600" />
              <Skeleton class="activity-time-skeleton bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>
          <div v-else class="activity-list">
            <div v-if="logsAuditoria.length === 0" class="empty-state text-gray-500 dark:text-gray-400">
              <p>Nenhuma atividade de auditoria</p>
            </div>
            <div v-else v-for="log in logsAuditoria" :key="log.id" class="activity-item bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500">
              <div class="activity-icon" :class="getActionClass(log.action)">
                {{ getActionIcon(log.action) }}
              </div>
              <div class="activity-content">
                <p class="text-gray-900 dark:text-white">
                  <strong>{{ formatAction(log.action) }}</strong> em 
                  <strong>{{ formatTableName(log.table_name) }}</strong>
                  <span v-if="log.details?.old_data || log.details?.new_data" class="change-indicator text-amber-600 dark:text-amber-400">
                    • Alterações detectadas
                  </span>
                </p>
                <div class="activity-meta">
                  <small class="text-gray-600 dark:text-gray-400">Por: {{ log.admin_nome || `Admin ${log.admin_id?.slice(0,8)}...` }}</small>
                  <small class="text-gray-600 dark:text-gray-400">{{ formatarData(log.created_at) }}</small>
                </div>
                <div v-if="showDetails[log.id]" class="audit-details bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                  <div v-if="log.details?.old_data" class="detail-section">
                    <strong class="text-gray-900 dark:text-white">Antes:</strong>
                    <pre class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">{{ JSON.stringify(log.details.old_data, null, 2) }}</pre>
                  </div>
                  <div v-if="log.details?.new_data" class="detail-section">
                    <strong class="text-gray-900 dark:text-white">Depois:</strong>
                    <pre class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">{{ JSON.stringify(log.details.new_data, null, 2) }}</pre>
                  </div>
                </div>
                <button 
                  @click="toggleDetails(log.id)" 
                  class="btn-details border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-amajac-green hover:text-amajac-green dark:hover:text-amajac-green-light hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {{ showDetails[log.id] ? 'Ocultar' : 'Ver' }} detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/core/utils/supabaseClient'
import Skeleton from '@/components/ui/Skeleton.vue'

const router = useRouter()
const loadingStats = ref(true)
const loadingAuditoria = ref(true)
const showDetails = ref({})

const stats = reactive({
  associadosAtivos: 0,
  classificadosAprovados: 0,
  mensagensNaoLidas: 0,
  eventosAtivos: 0,
  logsHoje: 0,
  adminsAtivos: 0,
  tabelasMonitoradas: 0,
  backupsMes: 3,
})

const logsAuditoria = ref([])

const navegarPara = (rota) => {
  router.push({ name: rota })
}

const navegarParaAuditoria = () => {
  if (router.hasRoute('admin-auditoria')) {
    router.push({ name: 'admin-auditoria' })
  } else {
    alert('Funcionalidade de auditoria completa em desenvolvimento!')
    console.log('Rota admin-auditoria não encontrada. Rotas disponíveis:', router.getRoutes().map(r => r.name))
  }
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data inválida'
  
  try {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data)
  } catch {
    return dataString
  }
}

const formatAction = (action) => {
  const actions = {
    'INSERT': 'Criação',
    'UPDATE': 'Atualização',
    'DELETE': 'Exclusão'
  }
  return actions[action] || action
}

const formatTableName = (tableName) => {
  const tables = {
    'associados': 'Associados',
    'classificados': 'Classificados',
    'configuracoes': 'Configurações',
    'eventos': 'Eventos',
    'mensagens_contato': 'Mensagens'
  }
  return tables[tableName] || tableName
}

const getActionClass = (action) => {
  const classes = {
    'INSERT': 'action-insert',
    'UPDATE': 'action-update',
    'DELETE': 'action-delete'
  }
  return classes[action] || 'action-default'
}

const getActionIcon = (action) => {
  const icons = {
    'INSERT': '+',
    'UPDATE': '✓',
    'DELETE': '×'
  }
  return icons[action] || '•'
}

const toggleDetails = (logId) => {
  showDetails.value[logId] = !showDetails.value[logId]
}

const carregarEstatisticas = async () => {
  try {
    loadingStats.value = true
    
    const [associados, classificados, mensagens, eventos, logsHoje, admins] = await Promise.all([
      supabase.from('associados').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
      supabase.from('classificados').select('*', { count: 'exact', head: true }).eq('aprovado', true),
      supabase.from('mensagens_contato').select('*', { count: 'exact', head: true }).eq('lida', false),
      supabase.from('eventos').select('*', { count: 'exact', head: true }).eq('ativo', true),
      
      supabase.from('admin_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0]),
      
      supabase.from('admin_profiles').select('*', { count: 'exact', head: true }).eq('ativo', true)
    ])

    stats.associadosAtivos = associados.count || 0
    stats.classificadosAprovados = classificados.count || 0
    stats.mensagensNaoLidas = mensagens.count || 0
    stats.eventosAtivos = eventos.count || 0
    stats.logsHoje = logsHoje.count || 0
    stats.adminsAtivos = admins.count || 1
    stats.tabelasMonitoradas = 5

  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err)
  } finally {
    loadingStats.value = false
  }
}

const carregarAuditoria = async () => {
  try {
    loadingAuditoria.value = true
    
    const { data: logs, error } = await supabase
      .from('admin_logs')
      .select(`
        id,
        created_at,
        action,
        table_name,
        details,
        admin_id,
        ip_address,
        admin_profiles:admin_id (nome)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.warn('Erro ao carregar logs de auditoria:', error)
      const { data: logsFallback } = await supabase
        .from('admin_logs')
        .select('id, created_at, action, table_name, details, admin_id, ip_address')
        .order('created_at', { ascending: false })
        .limit(10)
      
      logsAuditoria.value = (logsFallback || []).map(log => ({
        ...log,
        admin_nome: `Admin ${log.admin_id?.slice(0,8)}...`
      }))
      return
    }

    logsAuditoria.value = (logs || []).map(log => ({
      ...log,
      admin_nome: log.admin_profiles?.nome || `Admin ${log.admin_id?.slice(0,8)}...`
    }))

  } catch (err) {
    console.error('Erro ao carregar auditoria:', err)
    logsAuditoria.value = []
  } finally {
    loadingAuditoria.value = false
  }
}

onMounted(() => {
  carregarEstatisticas()
  carregarAuditoria()
})
</script>

<style scoped>
.admin-dashboard {
  font-family: 'Montserrat', sans-serif;
  transition: background-color 0.3s ease;
}

.admin-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: stretch;
}

.dashboard-card {
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.dashboard-card.full-width {
  grid-column: 1 / -1;
}

.dashboard-card:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  flex: 1;
}

.stat-item {
  text-align: center;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  flex: 1;
  height: 100%;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 80px;
  height: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.2);
}

.action-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-number-skeleton {
  height: 2.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.stat-label-skeleton {
  height: 1rem;
  width: 70%;
  margin: 0 auto;
  border-radius: 4px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(4px);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.action-insert {
  background: #10b981;
  color: white;
}

.action-update {
  background: #f59e0b;
  color: white;
}

.action-delete {
  background: #ef4444;
  color: white;
}

.action-default {
  background: #cbd5e1;
  color: #1f2937;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-content p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.activity-meta small {
  font-size: 0.8rem;
}

.audit-details {
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  font-size: 0.8rem;
}

.detail-section {
  margin-bottom: 1rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section pre {
  padding: 0.75rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5rem 0 0 0;
  font-size: 0.75rem;
  white-space: pre-wrap;
}

.btn-details {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.btn-refresh {
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-refresh:hover:not(:disabled) {
  transform: rotate(90deg);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.security-item:hover {
  transform: translateY(-2px);
}

.security-icon {
  font-size: 2rem;
}

.security-info {
  flex: 1;
}

.security-number {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.security-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.activity-title-skeleton {
  height: 1.25rem;
  width: 90%;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.activity-time-skeleton {
  height: 0.9rem;
  width: 40%;
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .dashboard-row {
    grid-template-columns: 1fr;
  }
  
  .security-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-main {
    padding: 1rem;
  }

  .dashboard-grid {
    gap: 1rem;
  }

  .dashboard-row {
    gap: 1rem;
  }

  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .security-grid {
    grid-template-columns: 1fr;
  }

  .activity-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .activity-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-main {
    padding: 0.5rem;
  }
  
  .dashboard-card {
    padding: 1rem;
  }
  
  .stat-item,
  .security-item {
    padding: 1rem;
  }
}
</style>