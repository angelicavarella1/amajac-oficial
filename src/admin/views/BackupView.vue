<!-- src/admin/views/BackupView.vue -->
<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Backup & Limpeza</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie backups e limpeza do sistema</p>
    </div>

    <!-- Status do Sistema -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Status do Backup -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">🛡️ Status do Backup</h3>
          <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
            Ativo
          </span>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Último Backup</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ ultimoBackup }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Próximo Backup</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ proximoBackup }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Tamanho Total</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ tamanhoBackups }}</span>
          </div>
        </div>
      </div>

      <!-- Espaço em Disco -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">💾 Espaço em Disco</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Utilizado</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ espacoUtilizado }} / {{ espacoTotal }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getCorBarraEspaco(percentualEspaco)"
                :style="{ width: percentualEspaco + '%' }"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ percentualEspaco }}% utilizado</div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div class="font-semibold text-blue-600 dark:text-blue-400">{{ backupsCount }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-300">Backups</div>
            </div>
            <div class="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div class="font-semibold text-green-600 dark:text-green-400">{{ logsCount }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-300">Logs</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estatísticas Rápidas -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Estatísticas</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <span class="text-gray-600 dark:text-gray-400">Backups Realizados</span>
            <span class="font-medium text-gray-900 dark:text-white">1.247</span>
          </div>
          <div class="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <span class="text-gray-600 dark:text-gray-400">Backups Automáticos</span>
            <span class="font-medium text-gray-900 dark:text-white">94%</span>
          </div>
          <div class="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <span class="text-gray-600 dark:text-gray-400">Taxa de Sucesso</span>
            <span class="font-medium text-green-600 dark:text-green-400">99.8%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações de Backup -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Backup Manual -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔄 Backup Manual</h3>
        <div class="space-y-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              Crie um backup manual do banco de dados. Recomendado antes de grandes alterações.
            </p>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Backup Completo</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Inclui todos os dados do sistema</div>
              </div>
              <button 
                @click="iniciarBackup('completo')"
                :disabled="backupEmAndamento"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <i class="fas fa-database mr-2" :class="{ 'animate-pulse': backupEmAndamento }"/>
                {{ backupEmAndamento ? 'Criando...' : 'Criar Backup' }}
              </button>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Backup Parcial</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Apenas dados essenciais</div>
              </div>
              <button 
                @click="iniciarBackup('parcial')"
                :disabled="backupEmAndamento"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <i class="fas fa-save mr-2"/>
                Backup Rápido
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Limpeza do Sistema -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧹 Limpeza do Sistema</h3>
        <div class="space-y-4">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p class="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Ações de limpeza não podem ser desfeitas. Faça backup antes de prosseguir.
            </p>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Limpar Cache</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Libera {{ tamanhoCache }} de cache temporário</div>
              </div>
              <button 
                @click="limparCache"
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200"
              >
                <i class="fas fa-broom mr-2"/>
                Limpar
              </button>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Limpar Logs Antigos</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">{{ logsAntigosCount }} logs com mais de 30 dias</div>
              </div>
              <button 
                @click="limparLogsAntigos"
                class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200"
              >
                <i class="fas fa-trash-alt mr-2"/>
                Limpar
              </button>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Otimizar Banco</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Remove dados temporários e otimiza performance</div>
              </div>
              <button 
                @click="otimizarBanco"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200"
              >
                <i class="fas fa-magic mr-2"/>
                Otimizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Histórico de Backups -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">📋 Histórico de Backups</h3>
        <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors duration-200">
          <i class="fas fa-download mr-1"/>
          Exportar Lista
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tamanho
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="backup in historicoBackups" :key="backup.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ backup.data }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="getClasseTipoBackup(backup.tipo)">
                  {{ backup.tipo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ backup.tamanho }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="getClasseStatus(backup.status)">
                  <i class="fas fa-circle mr-1 text-xs"/>
                  {{ backup.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3 transition-colors duration-200">
                  <i class="fas fa-download"/>
                </button>
                <button class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200">
                  <i class="fas fa-trash"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {{ historicoBackups.length }} de 1247 backups
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
            Anterior
          </button>
          <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm transition-colors duration-200">
            1
          </button>
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
            Próximo
          </button>
        </div>
      </div>
    </div>

    <!-- Configurações Automáticas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚙️ Configurações Automáticas</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Backup Automático</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Executa backup diariamente às 02:00</div>
            </div>
            <button 
              @click="toggleConfig('backupAuto')"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="configuracoes.backupAuto ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="configuracoes.backupAuto ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Notificações por Email</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Receba alertas de backup</div>
            </div>
            <button 
              @click="toggleConfig('notificacoesEmail')"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="configuracoes.notificacoesEmail ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="configuracoes.notificacoesEmail ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Limpeza Automática</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Remove logs com mais de 90 dias</div>
            </div>
            <button 
              @click="toggleConfig('limpezaAuto')"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="configuracoes.limpezaAuto ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="configuracoes.limpezaAuto ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Compactação</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Comprime backups para economizar espaço</div>
            </div>
            <button 
              @click="toggleConfig('compactacao')"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="configuracoes.compactacao ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="configuracoes.compactacao ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Progresso -->
  <div v-if="mostrarModalProgresso" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ modalTitulo }}</h3>
      <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
        <div class="h-2 rounded-full bg-blue-500 transition-all duration-500" :style="{ width: progresso + '%' }"/>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 text-center">{{ modalMensagem }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Estados
const backupEmAndamento = ref(false)
const mostrarModalProgresso = ref(false)
const modalTitulo = ref('')
const modalMensagem = ref('')
const progresso = ref(0)

const ultimoBackup = ref('23/10/2025, 02:00')
const proximoBackup = ref('24/10/2025, 02:00')
const tamanhoBackups = ref('2.4 GB')
const espacoUtilizado = ref('367.65 MB')
const espacoTotal = ref('500 MB')
const percentualEspaco = ref(73)
const backupsCount = ref(15)
const logsCount = ref('2.8k')
const tamanhoCache = ref('45.2 MB')
const logsAntigosCount = ref('1.2k')

// Configurações
const configuracoes = reactive({
  backupAuto: true,
  notificacoesEmail: true,
  limpezaAuto: false,
  compactacao: true
})

// Histórico de backups
const historicoBackups = ref([
  { id: 1, data: '23/10/2025, 02:00', tipo: 'Automático', tamanho: '245 MB', status: 'Concluído' },
  { id: 2, data: '22/10/2025, 02:00', tipo: 'Automático', tamanho: '238 MB', status: 'Concluído' },
  { id: 3, data: '21/10/2025, 14:30', tipo: 'Manual', tamanho: '251 MB', status: 'Concluído' },
  { id: 4, data: '21/10/2025, 02:00', tipo: 'Automático', tamanho: '233 MB', status: 'Concluído' },
  { id: 5, data: '20/10/2025, 02:00', tipo: 'Automático', tamanho: '229 MB', status: 'Concluído' }
])

// Métodos
const iniciarBackup = async (tipo) => {
  backupEmAndamento.value = true
  mostrarModalProgresso.value = true
  modalTitulo.value = tipo === 'completo' ? 'Criando Backup Completo' : 'Criando Backup Parcial'
  modalMensagem.value = 'Preparando dados do sistema...'
  progresso.value = 0
  
  try {
    // Simular processo de backup
    const intervalo = setInterval(() => {
      progresso.value += 10
      if (progresso.value >= 100) {
        clearInterval(intervalo)
        finalizarBackup(tipo)
      }
    }, 200)
    
  } catch (error) {
    console.error('Erro ao criar backup:', error)
    backupEmAndamento.value = false
    mostrarModalProgresso.value = false
    alert('Erro ao criar backup: ' + error.message)
  }
}

const finalizarBackup = (tipo) => {
  // Adicionar ao histórico
  const novoBackup = {
    id: historicoBackups.value.length + 1,
    data: new Date().toLocaleString('pt-BR'),
    tipo: tipo === 'completo' ? 'Manual' : 'Parcial',
    tamanho: tipo === 'completo' ? '248 MB' : '125 MB',
    status: 'Concluído'
  }
  
  historicoBackups.value.unshift(novoBackup)
  ultimoBackup.value = novoBackup.data
  
  backupEmAndamento.value = false
  mostrarModalProgresso.value = false
  
  setTimeout(() => {
    alert(`Backup ${tipo} criado com sucesso!`)
  }, 500)
}

const limparCache = async () => {
  if (confirm('Tem certeza que deseja limpar o cache? Esta ação não pode ser desfeita.')) {
    mostrarModalProgresso.value = true
    modalTitulo.value = 'Limpando Cache'
    modalMensagem.value = 'Removendo arquivos temporários...'
    progresso.value = 0
    
    const intervalo = setInterval(() => {
      progresso.value += 20
      if (progresso.value >= 100) {
        clearInterval(intervalo)
        mostrarModalProgresso.value = false
        tamanhoCache.value = '0 MB'
        alert('Cache limpo com sucesso!')
      }
    }, 200)
  }
}

const limparLogsAntigos = async () => {
  if (confirm(`Tem certeza que deseja limpar ${logsAntigosCount.value} logs antigos? Esta ação não pode ser desfeita.`)) {
    mostrarModalProgresso.value = true
    modalTitulo.value = 'Limpando Logs Antigos'
    modalMensagem.value = 'Removendo registros antigos...'
    progresso.value = 0
    
    const intervalo = setInterval(() => {
      progresso.value += 25
      if (progresso.value >= 100) {
        clearInterval(intervalo)
        mostrarModalProgresso.value = false
        logsAntigosCount.value = '0'
        alert('Logs antigos removidos com sucesso!')
      }
    }, 200)
  }
}

const otimizarBanco = async () => {
  if (confirm('Deseja otimizar o banco de dados? Isso pode levar alguns minutos.')) {
    mostrarModalProgresso.value = true
    modalTitulo.value = 'Otimizando Banco de Dados'
    modalMensagem.value = 'Reorganizando índices e tabelas...'
    progresso.value = 0
    
    const intervalo = setInterval(() => {
      progresso.value += 5
      if (progresso.value >= 100) {
        clearInterval(intervalo)
        mostrarModalProgresso.value = false
        alert('Banco de dados otimizado com sucesso!')
      }
    }, 200)
  }
}

const toggleConfig = (config) => {
  configuracoes[config] = !configuracoes[config]
}

const getCorBarraEspaco = (percentual) => {
  if (percentual < 70) return 'bg-green-500'
  if (percentual < 85) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getClasseTipoBackup = (tipo) => {
  const classes = {
    'Automático': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'Manual': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'Parcial': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
  }
  return classes[tipo] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getClasseStatus = (status) => {
  const classes = {
    'Concluído': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'Em Andamento': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'Falhou': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

// Lifecycle
onMounted(() => {
  console.log('BackupView carregado')
})
</script>