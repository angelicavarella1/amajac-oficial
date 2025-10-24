<!-- src/admin/components/ModalDetalhesAuditoria.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-search text-blue-500"></i>
              Detalhes da Ação de Auditoria
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Registro completo da operação realizada no sistema
            </p>
          </div>
          <button 
            @click="$emit('fechar')" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Fechar modal"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <!-- Informações Principais -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <i class="fas fa-calendar text-blue-500"></i>
              Data/Hora
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatarData(log.created_at) }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ formatarTempoRelativo(log.created_at) }}</div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <i class="fas fa-user text-green-500"></i>
              Administrador
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ log.admin_profiles?.nome || 'Sistema' }}</div>
            <div class="text-xs text-gray-500 mt-1">ID: {{ log.admin_id || 'N/A' }}</div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <i class="fas fa-table text-purple-500"></i>
              Tabela
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ log.tabela_afetada }}</div>
            <div class="text-xs text-gray-500 mt-1">ID Registro: {{ log.id_registro }}</div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <i class="fas fa-bolt text-yellow-500"></i>
              Ação
            </div>
            <div>
              <span :class="getClasseAcao(log.acao)" class="px-3 py-1 rounded-full text-sm font-medium">
                <i :class="getIconeAcao(log.acao)" class="mr-1"></i>
                {{ log.acao }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dados Antigos e Novos -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <!-- Dados Antigos -->
          <div v-if="log.dados_antigos && Object.keys(log.dados_antigos).length > 0">
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <i class="fas fa-history text-yellow-500"></i>
              Dados Antigos
              <span class="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                Antes da Alteração
              </span>
            </h4>
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden">
              <div class="bg-yellow-100 dark:bg-yellow-800 px-4 py-2 border-b border-yellow-200 dark:border-yellow-700">
                <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {{ Object.keys(log.dados_antigos).length }} campo(s) alterado(s)
                </span>
              </div>
              <pre class="p-4 text-xs overflow-auto max-h-80 font-mono">{{ formatarJSON(log.dados_antigos) }}</pre>
            </div>
          </div>
          <div v-else>
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <i class="fas fa-history text-gray-400"></i>
              Dados Antigos
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center">
              <i class="fas fa-ban text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Nenhum dado anterior disponível</p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Ação de inserção ou dados não capturados</p>
            </div>
          </div>
          
          <!-- Dados Novos -->
          <div v-if="log.dados_novos && Object.keys(log.dados_novos).length > 0">
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <i class="fas fa-arrow-right text-green-500"></i>
              Dados Novos
              <span class="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                Após a Alteração
              </span>
            </h4>
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
              <div class="bg-green-100 dark:bg-green-800 px-4 py-2 border-b border-green-200 dark:border-green-700">
                <span class="text-sm font-medium text-green-800 dark:text-green-200">
                  {{ Object.keys(log.dados_novos).length }} campo(s) modificado(s)
                </span>
              </div>
              <pre class="p-4 text-xs overflow-auto max-h-80 font-mono">{{ formatarJSON(log.dados_novos) }}</pre>
            </div>
          </div>
          <div v-else>
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <i class="fas fa-arrow-right text-gray-400"></i>
              Dados Novos
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center">
              <i class="fas fa-ban text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Nenhum dado novo disponível</p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Ação de exclusão ou dados não capturados</p>
            </div>
          </div>
        </div>

        <!-- Comparação de Dados (apenas para UPDATE) -->
        <div v-if="log.acao === 'UPDATE' && log.dados_antigos && log.dados_novos" class="mb-6">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <i class="fas fa-exchange-alt text-blue-500"></i>
            Comparação de Alterações
          </h4>
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
            <div class="bg-blue-100 dark:bg-blue-800 px-4 py-2 border-b border-blue-200 dark:border-blue-700">
              <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Campos Modificados
              </span>
            </div>
            <div class="p-4">
              <div v-for="(novoValor, campo) in log.dados_novos" :key="campo" class="mb-3 last:mb-0">
                <div v-if="JSON.stringify(log.dados_antigos[campo]) !== JSON.stringify(novoValor)" class="flex items-start gap-3 p-2 rounded hover:bg-white dark:hover:bg-gray-800">
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">{{ campo }}</div>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded text-xs line-through text-red-600 dark:text-red-400">
                        {{ formatarValor(log.dados_antigos[campo]) }}
                      </div>
                      <i class="fas fa-arrow-right text-gray-400 text-xs"></i>
                      <div class="flex-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded text-xs text-green-600 dark:text-green-400">
                        {{ formatarValor(novoValor) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informações Técnicas -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <i class="fas fa-info-circle text-purple-500"></i>
            Informações Técnicas
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div v-if="log.ip_address" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                <i class="fas fa-network-wired"></i>
                Endereço IP
              </div>
              <div class="text-gray-900 dark:text-gray-100 font-mono text-xs">{{ log.ip_address }}</div>
            </div>
            <div v-if="log.user_agent" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                <i class="fas fa-desktop"></i>
                User Agent
              </div>
              <div class="text-gray-900 dark:text-gray-100 text-xs">{{ log.user_agent }}</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="$emit('fechar')"
            class="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <i class="fas fa-times mr-2"></i>
            Fechar
          </button>
          <button
            v-if="log.dados_antigos || log.dados_novos"
            @click="copiarDados"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <i class="fas fa-copy"></i>
            Copiar Dados
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  log: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Emits
defineEmits(['fechar'])

// Métodos
const formatarData = (dataString) => {
  if (!dataString) return 'N/A'
  return new Date(dataString).toLocaleString('pt-BR')
}

const formatarTempoRelativo = (dataString) => {
  if (!dataString) return 'N/A'
  
  const agora = new Date()
  const data = new Date(dataString)
  const diffMs = agora - data
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora mesmo'
  if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays === 1) return 'Ontem'
  return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
}

const formatarJSON = (dados) => {
  try {
    return JSON.stringify(dados, null, 2)
  } catch {
    return 'Erro ao formatar dados'
  }
}

const formatarValor = (valor) => {
  if (valor === null || valor === undefined) return 'null'
  if (typeof valor === 'object') return JSON.stringify(valor)
  return String(valor)
}

const getClasseAcao = (acao) => {
  const classes = {
    'INSERT': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'UPDATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[acao] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getIconeAcao = (acao) => {
  const icones = {
    'INSERT': 'fa-plus-circle',
    'UPDATE': 'fa-edit',
    'DELETE': 'fa-trash-alt'
  }
  return icones[acao] || 'fa-question-circle'
}

const copiarDados = async () => {
  try {
    const dadosParaCopiar = {
      data: props.log.created_at,
      administrador: props.log.admin_profiles?.nome || 'Sistema',
      tabela: props.log.tabela_afetada,
      acao: props.log.acao,
      id_registro: props.log.id_registro,
      dados_antigos: props.log.dados_antigos,
      dados_novos: props.log.dados_novos,
      ip: props.log.ip_address,
      user_agent: props.log.user_agent
    }

    const texto = JSON.stringify(dadosParaCopiar, null, 2)
    await navigator.clipboard.writeText(texto)
    
    // Mostrar feedback visual (você pode implementar um toast aqui)
    console.log('✅ Dados copiados para a área de transferência')
  } catch (err) {
    console.error('❌ Erro ao copiar dados:', err)
  }
}
</script>

<style scoped>
/* Animações de entrada */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scrollbar personalizada */
pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dark pre::-webkit-scrollbar-track {
  background: #374151;
}

.dark pre::-webkit-scrollbar-thumb {
  background: #6b7280;
}

/* Melhorias de acessibilidade */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transições suaves */
.transition-colors {
  transition: all 0.2s ease-in-out;
}

/* Responsividade */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .xl\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .p-6 {
    padding: 1rem;
  }
}
</style>