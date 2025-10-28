<!-- src/admin/views/AuditoriaView.vue -->
<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Auditoria do Sistema</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Registro completo de todas as ações no sistema</p>
    </div>

    <!-- Estatísticas Rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Total de Eventos -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
            <i class="fas fa-chart-bar text-xl"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Eventos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.totalEventos.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Eventos Hoje -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
            <i class="fas fa-calendar-day text-xl"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Eventos Hoje</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.eventosHoje }}</p>
          </div>
        </div>
      </div>

      <!-- Alertas de Segurança -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4">
            <i class="fas fa-shield-alt text-xl"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Alertas de Segurança</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.alertasSeguranca }}</p>
          </div>
        </div>
      </div>

      <!-- Usuários Ativos -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
            <i class="fas fa-users text-xl"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Usuários Ativos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.usuariosAtivos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros e Controles -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filtros e Pesquisa</h3>
        
        <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <!-- Pesquisa -->
          <div class="relative flex-1 md:w-64">
            <input 
              type="text" 
              v-model="filtros.pesquisa"
              placeholder="Pesquisar eventos..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"/>
            </div>
          </div>
          
          <!-- Filtro de Tipo -->
          <select 
            v-model="filtros.tipo"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os Tipos</option>
            <option value="login">Login</option>
            <option value="usuario">Usuário</option>
            <option value="sistema">Sistema</option>
            <option value="backup">Backup</option>
            <option value="seguranca">Segurança</option>
          </select>
          
          <!-- Filtro de Status -->
          <select 
            v-model="filtros.status"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os Status</option>
            <option value="sucesso">Sucesso</option>
            <option value="aviso">Aviso</option>
            <option value="erro">Erro</option>
          </select>
        </div>
      </div>
      
      <!-- Filtros Avançados -->
      <div v-show="mostrarFiltrosAvancados" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Data Inicial -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Inicial</label>
            <input 
              type="date" 
              v-model="filtros.dataInicial"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <!-- Data Final -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
            <input 
              type="date" 
              v-model="filtros.dataFinal"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <!-- Usuário -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuário</label>
            <select 
              v-model="filtros.usuario"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os Usuários</option>
              <option value="admin">Administrador</option>
              <option value="joao.silva">João Silva</option>
              <option value="maria.santos">Maria Santos</option>
              <option value="carlos.oliveira">Carlos Oliveira</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end mt-4">
          <button 
            @click="aplicarFiltros"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-150"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
      
      <div class="flex justify-between items-center mt-4">
        <button 
          @click="mostrarFiltrosAvancados = !mostrarFiltrosAvancados"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center"
        >
          <i class="fas fa-filter mr-1"/>
          {{ mostrarFiltrosAvancados ? 'Ocultar Filtros' : 'Filtros Avançados' }}
        </button>
        
        <div class="flex space-x-2">
          <button 
            @click="exportarPDF"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <i class="fas fa-file-pdf mr-2"/>
            Exportar PDF
          </button>
          <button 
            @click="exportarCSV"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <i class="fas fa-file-csv mr-2"/>
            Exportar CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Eventos de Auditoria -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Registros de Auditoria</h3>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {{ eventosFiltrados.length }} de {{ eventosAuditoria.length }} eventos
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data/Hora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuário
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ação
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                IP
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Detalhes
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="evento in eventosFiltrados" 
              :key="evento.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ evento.data }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                    <i class="fas fa-user text-sm"/>
                  </div>
                  {{ evento.usuario }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getClasseTipo(evento.tipo)">
                  <i class="fas mr-1 text-xs" :class="getIconeTipo(evento.tipo)"/>
                  {{ formatarTipo(evento.tipo) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {{ evento.acao }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getClasseStatus(evento.status)">
                  <i class="fas fa-circle mr-1 text-xs"/>
                  {{ formatarStatus(evento.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ evento.ip }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="mostrarDetalhesEvento(evento)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center"
                >
                  <i class="fas fa-eye mr-1"/> Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Página {{ paginacao.paginaAtual }} de {{ paginacao.totalPaginas }}
        </div>
        <div class="flex space-x-2">
          <button 
            @click="paginaAnterior"
            :disabled="paginacao.paginaAtual === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left mr-1"/> Anterior
          </button>
          <button 
            v-for="pagina in paginacao.paginasVisiveis"
            :key="pagina"
            @click="irParaPagina(pagina)"
            class="px-3 py-1 border rounded text-sm"
            :class="pagina === paginacao.paginaAtual 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'"
          >
            {{ pagina }}
          </button>
          <button 
            @click="paginaProxima"
            :disabled="paginacao.paginaAtual === paginacao.totalPaginas"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo <i class="fas fa-chevron-right ml-1"/>
          </button>
        </div>
      </div>
    </div>

    <!-- Gráficos e Estatísticas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Eventos por Tipo -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eventos por Tipo</h3>
        <div class="space-y-4">
          <div 
            v-for="(valor, tipo) in estatisticas.eventosPorTipo" 
            :key="tipo"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :class="getCorTipo(tipo)"/>
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ formatarTipo(tipo) }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ valor.quantidade }} ({{ valor.percentual }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Atividade por Hora do Dia -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Atividade por Hora do Dia</h3>
        <div class="space-y-2">
          <div 
            v-for="(percentual, hora) in estatisticas.atividadePorHora" 
            :key="hora"
            class="flex items-center"
          >
            <span class="w-16 text-sm text-gray-600 dark:text-gray-400">{{ hora }}</span>
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                class="bg-blue-500 h-4 rounded-full transition-all duration-500" 
                :style="{ width: percentual + '%' }"
              />
            </div>
            <span class="w-10 text-right text-sm text-gray-600 dark:text-gray-400">{{ percentual }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas de Segurança -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">🔒 Alertas de Segurança</h3>
        <span class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-full">
          {{ alertasSeguranca.length }} Alertas Ativos
        </span>
      </div>

      <div class="space-y-4">
        <div 
          v-for="alerta in alertasSeguranca" 
          :key="alerta.id"
          class="flex items-start p-4 border rounded-lg transition-colors duration-150"
          :class="getClasseAlerta(alerta.nivel)"
        >
          <div class="flex-shrink-0 mt-1">
            <i class="fas text-lg" :class="getIconeAlerta(alerta.nivel)"/>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium" :class="getClasseTextoAlerta(alerta.nivel)">
              {{ alerta.titulo }}
            </h4>
            <p class="text-sm mt-1" :class="getClasseTextoAlerta(alerta.nivel, true)">
              {{ alerta.descricao }}
            </p>
            <p class="text-xs mt-2" :class="getClasseTextoAlerta(alerta.nivel, true)">
              <i class="far fa-clock mr-1"/> {{ alerta.tempo }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Detalhes do Evento -->
  <div 
    v-if="eventoSelecionado"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
    @click.self="fecharModal"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Detalhes do Evento</h3>
        <button 
          @click="fecharModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
        >
          <i class="fas fa-times text-xl"/>
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Data/Hora</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ eventoSelecionado.data }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Usuário</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ eventoSelecionado.usuario }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getClasseTipo(eventoSelecionado.tipo)">
              <i class="fas mr-1 text-xs" :class="getIconeTipo(eventoSelecionado.tipo)"/>
              {{ formatarTipo(eventoSelecionado.tipo) }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getClasseStatus(eventoSelecionado.status)">
              <i class="fas fa-circle mr-1 text-xs"/>
              {{ formatarStatus(eventoSelecionado.status) }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Endereço IP</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ eventoSelecionado.ip }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ação</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ eventoSelecionado.acao }}</p>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Detalhes</p>
          <p class="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {{ eventoSelecionado.detalhes }}
          </p>
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <button 
          @click="fecharModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-150"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Estados
const mostrarFiltrosAvancados = ref(false)
const eventoSelecionado = ref(null)

// Dados de exemplo para eventos de auditoria
const eventosAuditoria = ref([
  { 
    id: 1, 
    data: '24/10/2025, 09:15:23', 
    usuario: 'admin', 
    tipo: 'login', 
    acao: 'Login no sistema', 
    status: 'sucesso', 
    ip: '192.168.1.100',
    detalhes: 'Login realizado com sucesso a partir do navegador Chrome no Windows 10.'
  },
  { 
    id: 2, 
    data: '24/10/2025, 09:20:45', 
    usuario: 'joao.silva', 
    tipo: 'usuario', 
    acao: 'Alteração de perfil', 
    status: 'sucesso', 
    ip: '192.168.1.101',
    detalhes: 'Usuário alterou informações do perfil: email atualizado para joao.silva@empresa.com.'
  },
  { 
    id: 3, 
    data: '24/10/2025, 09:35:12', 
    usuario: 'sistema', 
    tipo: 'sistema', 
    acao: 'Backup automático', 
    status: 'sucesso', 
    ip: 'Sistema',
    detalhes: 'Backup automático realizado com sucesso. Tamanho: 245 MB. Duração: 2min 34s.'
  },
  { 
    id: 4, 
    data: '24/10/2025, 10:05:33', 
    usuario: 'maria.santos', 
    tipo: 'seguranca', 
    acao: 'Tentativa de acesso negada', 
    status: 'erro', 
    ip: '192.168.1.105',
    detalhes: 'Tentativa de acesso com credenciais inválidas. Múltiplas tentativas detectadas em 10 minutos.'
  },
  { 
    id: 5, 
    data: '24/10/2025, 10:30:18', 
    usuario: 'admin', 
    tipo: 'backup', 
    acao: 'Backup manual iniciado', 
    status: 'sucesso', 
    ip: '192.168.1.100',
    detalhes: 'Backup manual iniciado pelo administrador. Tipo: Completo. Estimativa: 5 minutos.'
  }
])

// Filtros
const filtros = reactive({
  pesquisa: '',
  tipo: '',
  status: '',
  dataInicial: '',
  dataFinal: '',
  usuario: ''
})

// Paginação
const paginacao = reactive({
  paginaAtual: 1,
  itensPorPagina: 10,
  totalPaginas: computed(() => Math.ceil(eventosAuditoria.value.length / paginacao.itensPorPagina)),
  paginasVisiveis: computed(() => {
    const total = paginacao.totalPaginas
    const atual = paginacao.paginaAtual
    const paginas = []
    
    for (let i = Math.max(1, atual - 2); i <= Math.min(total, atual + 2); i++) {
      paginas.push(i)
    }
    
    return paginas
  })
})

// Estatísticas
const estatisticas = reactive({
  totalEventos: 12847,
  eventosHoje: 127,
  alertasSeguranca: 3,
  usuariosAtivos: 42,
  eventosPorTipo: {
    login: { quantidade: 4289, percentual: 33 },
    usuario: { quantidade: 3572, percentual: 28 },
    sistema: { quantidade: 2845, percentual: 22 },
    backup: { quantidade: 1247, percentual: 10 },
    seguranca: { quantidade: 894, percentual: 7 }
  },
  atividadePorHora: {
    '00:00': 10,
    '06:00': 25,
    '12:00': 65,
    '18:00': 45
  }
})

// Alertas de segurança
const alertasSeguranca = ref([
  {
    id: 1,
    nivel: 'alto',
    titulo: 'Múltiplas tentativas de login falhas',
    descricao: 'IP 192.168.1.105 tentou acessar a conta "admin" 7 vezes em 10 minutos.',
    tempo: 'Detectado há 15 minutos'
  },
  {
    id: 2,
    nivel: 'medio',
    titulo: 'Acesso fora do horário comercial',
    descricao: 'Usuário "carlos.oliveira" acessou o sistema às 03:25 (fora do horário padrão).',
    tempo: 'Detectado hoje às 03:25'
  },
  {
    id: 3,
    nivel: 'baixo',
    titulo: 'Permissão elevada concedida',
    descricao: 'Usuário "maria.santos" recebeu permissões de administrador temporariamente.',
    tempo: 'Detectado ontem às 14:30'
  }
])

// Eventos filtrados
const eventosFiltrados = computed(() => {
  let filtrados = eventosAuditoria.value.filter(evento => {
    // Filtro por pesquisa
    const correspondePesquisa = 
      evento.usuario.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
      evento.acao.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
      evento.detalhes.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
      evento.ip.toLowerCase().includes(filtros.pesquisa.toLowerCase())
    
    // Filtro por tipo
    const correspondeTipo = !filtros.tipo || evento.tipo === filtros.tipo
    
    // Filtro por status
    const correspondeStatus = !filtros.status || evento.status === filtros.status
    
    // Filtro por usuário
    const correspondeUsuario = !filtros.usuario || evento.usuario === filtros.usuario
    
    return correspondePesquisa && correspondeTipo && correspondeStatus && correspondeUsuario
  })
  
  // Aplicar paginação
  const inicio = (paginacao.paginaAtual - 1) * paginacao.itensPorPagina
  const fim = inicio + paginacao.itensPorPagina
  
  return filtrados.slice(inicio, fim)
})

// Métodos
const aplicarFiltros = () => {
  paginacao.paginaAtual = 1
}

const exportarPDF = () => {
  alert('Exportando relatório em PDF...')
  // Em uma implementação real, aqui seria feita a geração do PDF
}

const exportarCSV = () => {
  alert('Exportando dados em CSV...')
  // Em uma implementação real, aqui seria feita a geração do CSV
}

const mostrarDetalhesEvento = (evento) => {
  eventoSelecionado.value = evento
}

const fecharModal = () => {
  eventoSelecionado.value = null
}

const paginaAnterior = () => {
  if (paginacao.paginaAtual > 1) {
    paginacao.paginaAtual--
  }
}

const paginaProxima = () => {
  if (paginacao.paginaAtual < paginacao.totalPaginas) {
    paginacao.paginaAtual++
  }
}

const irParaPagina = (pagina) => {
  paginacao.paginaAtual = pagina
}

// Funções auxiliares para classes e formatação
const getClasseTipo = (tipo) => {
  const classes = {
    'login': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'usuario': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'sistema': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'backup': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    'seguranca': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[tipo] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getClasseStatus = (status) => {
  const classes = {
    'sucesso': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'aviso': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'erro': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getIconeTipo = (tipo) => {
  const icones = {
    'login': 'fa-sign-in-alt',
    'usuario': 'fa-user',
    'sistema': 'fa-cog',
    'backup': 'fa-database',
    'seguranca': 'fa-shield-alt'
  }
  return icones[tipo] || 'fa-circle'
}

const formatarTipo = (tipo) => {
  const formatos = {
    'login': 'Login',
    'usuario': 'Usuário',
    'sistema': 'Sistema',
    'backup': 'Backup',
    'seguranca': 'Segurança'
  }
  return formatos[tipo] || tipo
}

const formatarStatus = (status) => {
  const formatos = {
    'sucesso': 'Sucesso',
    'aviso': 'Aviso',
    'erro': 'Erro'
  }
  return formatos[status] || status
}

const getCorTipo = (tipo) => {
  const cores = {
    'login': 'bg-green-500',
    'usuario': 'bg-blue-500',
    'sistema': 'bg-yellow-500',
    'backup': 'bg-purple-500',
    'seguranca': 'bg-red-500'
  }
  return cores[tipo] || 'bg-gray-500'
}

const getClasseAlerta = (nivel) => {
  const classes = {
    'alto': 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    'medio': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    'baixo': 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
  }
  return classes[nivel] || 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
}

const getIconeAlerta = (nivel) => {
  const icones = {
    'alto': 'fa-exclamation-triangle text-red-500',
    'medio': 'fa-shield-alt text-yellow-500',
    'baixo': 'fa-user-lock text-orange-500'
  }
  return icones[nivel] || 'fa-info-circle text-gray-500'
}

const getClasseTextoAlerta = (nivel, secundario = false) => {
  const classes = {
    'alto': secundario ? 'text-red-700 dark:text-red-300' : 'text-red-800 dark:text-red-200',
    'medio': secundario ? 'text-yellow-700 dark:text-yellow-300' : 'text-yellow-800 dark:text-yellow-200',
    'baixo': secundario ? 'text-orange-700 dark:text-orange-300' : 'text-orange-800 dark:text-orange-200'
  }
  return classes[nivel] || (secundario ? 'text-gray-700 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200')
}

// Lifecycle
onMounted(() => {
  console.log('AuditoriaView carregada')
})
</script>