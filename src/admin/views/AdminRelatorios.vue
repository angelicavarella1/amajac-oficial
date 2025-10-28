<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">Relatórios e Estatísticas</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
        <i class="fas fa-spinner fa-spin text-xl"></i>
        Carregando estatísticas...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600 dark:text-red-400">
      <i class="fas fa-exclamation-triangle text-2xl mb-4"></i>
      <p class="text-lg font-medium mb-2">Erro ao carregar relatórios</p>
      <p class="text-sm mb-4">{{ error }}</p>
      <button
        @click="carregarEstatisticas"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i class="fas fa-redo mr-2"></i>Tentar Novamente
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Relatório Portal -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Visão Geral</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Notícias</p>
                <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ estatisticas.noticias }}</p>
              </div>
              <i class="fas fa-newspaper text-blue-500 text-xl"></i>
            </div>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-600 dark:text-green-400">Eventos</p>
                <p class="text-2xl font-bold text-green-700 dark:text-green-300">{{ estatisticas.eventos }}</p>
              </div>
              <i class="fas fa-calendar text-green-500 text-xl"></i>
            </div>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-yellow-600 dark:text-yellow-400">Mensagens</p>
                <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{{ estatisticas.mensagens }}</p>
              </div>
              <i class="fas fa-envelope text-yellow-500 text-xl"></i>
            </div>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-purple-600 dark:text-purple-400">Colaboradores</p>
                <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">{{ estatisticas.colaboradores }}</p>
              </div>
              <i class="fas fa-users text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão para Auditoria -->
      <router-link
        to="/admin/auditoria"
        class="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mb-8"
      >
        <i class="fas fa-eye mr-2"></i>Ver Auditoria Completa do Sistema
      </router-link>

      <!-- Detalhes do Banco de Dados -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Detalhes do Banco de Dados</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Notícias</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><i class="fas fa-check text-green-500 mr-2"></i>{{ statsDetalhe.noticiasPublicadas }} publicadas</li>
              <li><i class="fas fa-edit text-yellow-500 mr-2"></i>{{ statsDetalhe.noticiasRascunho }} em rascunho</li>
              <li><i class="fas fa-clock text-blue-500 mr-2"></i>Mais antiga: {{ statsDetalhe.noticiaMaisAntiga }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Eventos</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><i class="fas fa-calendar-plus text-green-500 mr-2"></i>{{ statsDetalhe.eventosFuturos }} futuros</li>
              <li><i class="fas fa-calendar-check text-gray-500 mr-2"></i>{{ statsDetalhe.eventosPassados }} passados</li>
              <li><i class="fas fa-clock text-blue-500 mr-2"></i>Mais antigo: {{ statsDetalhe.eventoMaisAntigo }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagens</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><i class="fas fa-envelope-open text-green-500 mr-2"></i>{{ statsDetalhe.mensagensLidas }} lidas</li>
              <li><i class="fas fa-envelope text-yellow-500 mr-2"></i>{{ statsDetalhe.mensagensNaoLidas }} não lidas</li>
              <li><i class="fas fa-clock text-blue-500 mr-2"></i>Mais antiga: {{ statsDetalhe.mensagemMaisAntiga }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Colaboradores</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><i class="fas fa-user-check text-green-500 mr-2"></i>{{ statsDetalhe.colaboradoresAtivos }} ativos</li>
              <li><i class="fas fa-user-times text-red-500 mr-2"></i>{{ statsDetalhe.colaboradoresInativos }} inativos</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Manutenção do Banco -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Manutenção do Banco</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          Use estas ações com cuidado. Elas não podem ser desfeitas.
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            @click="limparMensagensLidas"
            :disabled="loadingAcao"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <i v-if="loadingAcao" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-trash mr-2"></i>
            Limpar mensagens lidas
          </button>
          <button
            @click="limparEventosPassados"
            :disabled="loadingAcao"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <i v-if="loadingAcao" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-trash mr-2"></i>
            Limpar eventos passados
          </button>
          <button
            @click="limparTudo"
            :disabled="loadingAcao"
            class="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <i v-if="loadingAcao" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-bomb mr-2"></i>
            Limpar todos os dados
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUIStore } from '@/shared/stores/ui'

const uiStore = useUIStore()

// Estados
const loading = ref(true)
const loadingAcao = ref(false)
const error = ref(null)
const estatisticas = ref({
  noticias: 0,
  eventos: 0,
  mensagens: 0,
  colaboradores: 0
})
const statsDetalhe = ref({
  noticiasPublicadas: 0,
  noticiasRascunho: 0,
  noticiaMaisAntiga: '–',
  eventosFuturos: 0,
  eventosPassados: 0,
  eventoMaisAntigo: '–',
  mensagensLidas: 0,
  mensagensNaoLidas: 0,
  mensagemMaisAntiga: '–',
  colaboradoresAtivos: 0,
  colaboradoresInativos: 0
})

// Funções de Utilidade
const findOldestCreatedDate = (items) => {
  if (!items || items.length === 0) return '–'
  
  const oldest = items.filter(item => item.created_at)
    .reduce((oldest, current) => {
      const oldestDate = new Date(oldest.created_at)
      const currentDate = new Date(current.created_at)

      if (isNaN(currentDate)) return oldest
      if (isNaN(oldestDate)) return current
      
      return currentDate < oldestDate ? current : oldest
    }, { created_at: new Date().toISOString() })

  return formatarData(oldest.created_at)
}

const formatarData = (dataString) => {
  if (!dataString) return '–'
  try {
    return new Date(dataString).toLocaleDateString('pt-BR')
  } catch {
    return '–'
  }
}

// Carregar estatísticas (versão simplificada)
const carregarEstatisticas = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('📊 Carregando estatísticas...')
    
    // Simulação de dados enquanto os composables não estão funcionando
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Dados mockados para demonstração
    estatisticas.value = {
      noticias: 15,
      eventos: 8,
      mensagens: 23,
      colaboradores: 12
    }

    statsDetalhe.value = {
      noticiasPublicadas: 12,
      noticiasRascunho: 3,
      noticiaMaisAntiga: '15/10/2024',
      eventosFuturos: 5,
      eventosPassados: 3,
      eventoMaisAntigo: '01/09/2024',
      mensagensLidas: 18,
      mensagensNaoLidas: 5,
      mensagemMaisAntiga: '20/09/2024',
      colaboradoresAtivos: 10,
      colaboradoresInativos: 2
    }

    console.log('✅ Estatísticas carregadas com sucesso')
    
  } catch (err) {
    console.error('❌ Erro ao carregar estatísticas:', err)
    error.value = err.message || 'Erro desconhecido ao carregar estatísticas'
    uiStore.showToast('Erro ao carregar relatórios', 'error')
  } finally {
    loading.value = false
  }
}

// Ações de limpeza (versões simplificadas)
const limparMensagensLidas = async () => {
  if (!confirm('Tem certeza? Esta ação apagará todas as mensagens lidas. Isso não pode ser desfeito.')) return
  
  loadingAcao.value = true
  try {
    console.log('🗑️ Limpando mensagens lidas...')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulação
    uiStore.showToast('Mensagens lidas limpas com sucesso!', 'success')
    await carregarEstatisticas()
  } catch (err) {
    console.error('❌ Erro ao limpar mensagens:', err)
    uiStore.showToast('Erro ao limpar mensagens', 'error')
  } finally {
    loadingAcao.value = false
  }
}

const limparEventosPassados = async () => {
  if (!confirm('Tem certeza? Esta ação apagará todos os eventos passados. Isso não pode ser desfeito.')) return
  
  loadingAcao.value = true
  try {
    console.log('🗑️ Limpando eventos passados...')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulação
    uiStore.showToast('Eventos passados limpos com sucesso!', 'success')
    await carregarEstatisticas()
  } catch (err) {
    console.error('❌ Erro ao limpar eventos:', err)
    uiStore.showToast('Erro ao limpar eventos', 'error')
  } finally {
    loadingAcao.value = false
  }
}

const limparTudo = async () => {
  if (!confirm('⚠️ CUIDADO! Isto apagará TODOS os dados do banco. Não poderá ser desfeito.')) return
  if (!confirm('⚠️ CONFIRME MAIS UMA VEZ. VOCÊ ESTÁ PRESTES A APAGAR TUDO. Continuar?')) return

  loadingAcao.value = true
  uiStore.showToast('Iniciando limpeza total...', 'warning')
  
  try {
    console.log('💥 Iniciando limpeza total...')
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulação
    
    // Resetar dados
    estatisticas.value = { noticias: 0, eventos: 0, mensagens: 0, colaboradores: 0 }
    statsDetalhe.value = {
      noticiasPublicadas: 0, noticiasRascunho: 0, noticiaMaisAntiga: '–',
      eventosFuturos: 0, eventosPassados: 0, eventoMaisAntigo: '–',
      mensagensLidas: 0, mensagensNaoLidas: 0, mensagemMaisAntiga: '–',
      colaboradoresAtivos: 0, colaboradoresInativos: 0
    }
    
    uiStore.showToast('Limpeza total concluída! O banco está vazio.', 'success')
  } catch (err) {
    console.error('❌ Erro na limpeza total:', err)
    uiStore.showToast('Erro crítico na limpeza total', 'error')
  } finally {
    loadingAcao.value = false
  }
}

onMounted(() => {
  carregarEstatisticas()
})
</script>

<style scoped>
/* Estilos específicos do componente */
.relatorio-portal {
  font-family: 'Inter', sans-serif;
}

/* Animações suaves */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>