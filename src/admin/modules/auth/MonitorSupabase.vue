<!-- src/admin/components/MonitorSupabase.vue -->
<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Monitor do Supabase (Plano Gratuito)</h2>

    <!-- Alertas de Limite -->
    <div v-if="alertas.length > 0" class="mb-6 space-y-3">
      <div v-for="alerta in alertas" :key="alerta.tipo" 
           :class="['p-4 rounded-lg border', getClasseAlerta(alerta.nivel)]">
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ alerta.icone }}</span>
          <div class="flex-1">
            <div class="font-semibold">{{ alerta.titulo }}</div>
            <div class="text-sm">{{ alerta.mensagem }}</div>
          </div>
          <div class="text-right">
            <div class="font-bold text-lg">{{ alerta.percentual }}%</div>
            <div class="text-xs">{{ alerta.usado }} / {{ alerta.limite }}</div>
          </div>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="getClasseBarra(alerta.nivel)"
            :style="{ width: alerta.percentual + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Cartões de Uso -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Espaço em Disco -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-600 dark:text-gray-400">💾 Espaço em Disco</div>
          <i class="fas fa-database" :class="getCorIcone(uso.disco.percentual)"/>
        </div>
        <div class="text-2xl font-bold" :class="getCorTexto(uso.disco.percentual)">
          {{ uso.disco.percentual }}%
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="getClasseBarraPorPercentual(uso.disco.percentual)"
            :style="{ width: uso.disco.percentual + '%' }"
          />
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formatarBytes(uso.disco.usado) }} / {{ formatarBytes(uso.disco.limite) }}
        </div>
      </div>

      <!-- Bandwidth -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-600 dark:text-gray-400">🌐 Bandwidth</div>
          <i class="fas fa-network-wired" :class="getCorIcone(uso.bandwidth.percentual)"/>
        </div>
        <div class="text-2xl font-bold" :class="getCorTexto(uso.bandwidth.percentual)">
          {{ uso.bandwidth.percentual }}%
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="getClasseBarraPorPercentual(uso.bandwidth.percentual)"
            :style="{ width: uso.bandwidth.percentual + '%' }"
          />
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formatarBytes(uso.bandwidth.usado) }} / {{ formatarBytes(uso.bandwidth.limite) }}
        </div>
      </div>

      <!-- Linhas da Tabela -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-600 dark:text-gray-400">📊 Linhas de Tabela</div>
          <i class="fas fa-table" :class="getCorIcone(uso.linhas.percentual)"/>
        </div>
        <div class="text-2xl font-bold" :class="getCorTexto(uso.linhas.percentual)">
          {{ uso.linhas.percentual }}%
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="getClasseBarraPorPercentual(uso.linhas.percentual)"
            :style="{ width: uso.linhas.percentual + '%' }"
          />
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formatarNumero(uso.linhas.usado) }} / {{ formatarNumero(uso.linhas.limite) }} linhas
        </div>
      </div>

      <!-- Uso de CPU -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-600 dark:text-gray-400">⚡ Uso de CPU</div>
          <i class="fas fa-microchip" :class="getCorIcone(uso.cpu.percentual)"/>
        </div>
        <div class="text-2xl font-bold" :class="getCorTexto(uso.cpu.percentual)">
          {{ uso.cpu.percentual }}%
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="getClasseBarraPorPercentual(uso.cpu.percentual)"
            :style="{ width: uso.cpu.percentual + '%' }"
          />
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ uso.cpu.usado }}h / {{ uso.cpu.limite }}h este mês
        </div>
      </div>
    </div>

    <!-- Tabelas com Mais Espaço -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">📋 Tabelas Consomem Mais Espaço</h3>
      </div>
      <div class="p-4">
        <div class="space-y-3">
          <div v-for="tabela in tabelasMaiores" :key="tabela.nome" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-lg">📄</span>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ formatarNomeTabela(tabela.nome) }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-300">{{ tabela.registros.toLocaleString() }} registros</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900 dark:text-white">{{ formatarBytes(tabela.tamanho) }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-300">{{ tabela.percentual }}% do total</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recomendações -->
    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <h3 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Recomendações</h3>
      <div class="space-y-2 text-sm">
        <div v-for="rec in recomendacoes" :key="rec.id" class="flex items-start gap-2">
          <span class="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
          <span :class="[
            rec.critica 
              ? 'font-semibold text-red-600 dark:text-red-400' 
              : 'text-yellow-700 dark:text-yellow-300'
          ]">{{ rec.mensagem }}</span>
        </div>
      </div>
    </div>

    <!-- Atualizar -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Última atualização: {{ ultimaAtualizacao }}
      </div>
      <button 
        @click="carregarUsoSupabase"
        :disabled="carregando"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fas fa-sync-alt" :class="{ 'animate-spin': carregando }"/>
        {{ carregando ? 'Atualizando...' : 'Atualizar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// Estados
const carregando = ref(false)
const ultimaAtualizacao = ref('')

// Dados de uso do Supabase (Plano Gratuito)
const uso = reactive({
  disco: { usado: 0, limite: 500 * 1024 * 1024, percentual: 0 }, // 500MB
  bandwidth: { usado: 0, limite: 5 * 1024 * 1024 * 1024, percentual: 0 }, // 5GB
  linhas: { usado: 0, limite: 500000, percentual: 0 }, // 500k linhas
  cpu: { usado: 0, limite: 2, percentual: 0 } // 2 horas/dia
})

// Tabelas que mais consomem espaço
const tabelasMaiores = ref([])

// Computed
const alertas = computed(() => {
  const alertasArray = []
  
  if (uso.disco.percentual > 80) {
    alertasArray.push({
      tipo: 'disco',
      nivel: uso.disco.percentual > 90 ? 'critico' : 'alerta',
      icone: '💾',
      titulo: 'Espaço em Disco',
      mensagem: uso.disco.percentual > 90 ? 'Quase esgotado!' : 'Está ficando cheio',
      usado: formatarBytes(uso.disco.usado),
      limite: formatarBytes(uso.disco.limite),
      percentual: uso.disco.percentual
    })
  }
  
  if (uso.linhas.percentual > 80) {
    alertasArray.push({
      tipo: 'linhas',
      nivel: uso.linhas.percentual > 90 ? 'critico' : 'alerta',
      icone: '📊',
      titulo: 'Linhas de Tabela',
      mensagem: uso.linhas.percentual > 90 ? 'Limite quase atingido!' : 'Muitos registros',
      usado: formatarNumero(uso.linhas.usado),
      limite: formatarNumero(uso.linhas.limite),
      percentual: uso.linhas.percentual
    })
  }
  
  if (uso.bandwidth.percentual > 80) {
    alertasArray.push({
      tipo: 'bandwidth',
      nivel: uso.bandwidth.percentual > 90 ? 'critico' : 'alerta',
      icone: '🌐',
      titulo: 'Bandwidth',
      mensagem: 'Tráfego elevado',
      usado: formatarBytes(uso.bandwidth.usado),
      limite: formatarBytes(uso.bandwidth.limite),
      percentual: uso.bandwidth.percentual
    })
  }
  
  return alertasArray.sort((a, b) => b.percentual - a.percentual)
})

const recomendacoes = computed(() => {
  const recs = []
  
  if (uso.disco.percentual > 70) {
    recs.push({
      id: 'disco',
      mensagem: `Faça backup e limpe registros antigos. Espaço usado: ${uso.disco.percentual}%`,
      critica: uso.disco.percentual > 85
    })
  }
  
  if (uso.linhas.percentual > 70) {
    recs.push({
      id: 'linhas',
      mensagem: `Considere arquivar dados antigos. ${uso.linhas.percentual}% das linhas usadas`,
      critica: uso.linhas.percentual > 85
    })
  }
  
  if (uso.bandwidth.percentual > 70) {
    recs.push({
      id: 'bandwidth',
      mensagem: `Otimize imagens e cache. Bandwidth: ${uso.bandwidth.percentual}%`,
      critica: uso.bandwidth.percentual > 85
    })
  }
  
  if (recs.length === 0) {
    recs.push({
      id: 'ok',
      mensagem: 'Seu uso está dentro dos limites. Continue monitorando.',
      critica: false
    })
  }
  
  return recs
})

// Métodos
const carregarUsoSupabase = async () => {
  carregando.value = true
  
  try {
    // Simular carregamento de dados reais
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Dados simulados (substitua por API real do Supabase)
    uso.disco.usado = Math.floor(Math.random() * 400 * 1024 * 1024) + 100 * 1024 * 1024
    uso.bandwidth.usado = Math.floor(Math.random() * 4 * 1024 * 1024 * 1024) + 500 * 1024 * 1024
    uso.linhas.usado = Math.floor(Math.random() * 400000) + 50000
    uso.cpu.usado = (Math.random() * 1.5 + 0.5).toFixed(1)
    
    // Calcular percentuais
    uso.disco.percentual = Math.min(100, Math.floor((uso.disco.usado / uso.disco.limite) * 100))
    uso.bandwidth.percentual = Math.min(100, Math.floor((uso.bandwidth.usado / uso.bandwidth.limite) * 100))
    uso.linhas.percentual = Math.min(100, Math.floor((uso.linhas.usado / uso.linhas.limite) * 100))
    uso.cpu.percentual = Math.min(100, Math.floor((uso.cpu.usado / uso.cpu.limite) * 100))
    
    // Simular tabelas maiores
    tabelasMaiores.value = [
      { nome: 'admin_logs', registros: 45000, tamanho: 150 * 1024 * 1024, percentual: 30 },
      { nome: 'mensagens_contato', registros: 12000, tamanho: 80 * 1024 * 1024, percentual: 16 },
      { nome: 'noticias', registros: 500, tamanho: 50 * 1024 * 1024, percentual: 10 },
      { nome: 'eventos', registros: 300, tamanho: 40 * 1024 * 1024, percentual: 8 },
      { nome: 'classificados', registros: 800, tamanho: 35 * 1024 * 1024, percentual: 7 }
    ]
    
    ultimaAtualizacao.value = new Date().toLocaleString('pt-BR')
    
  } catch (error) {
    console.error('Erro ao carregar uso do Supabase:', error)
  } finally {
    carregando.value = false
  }
}

const getClasseAlerta = (nivel) => {
  return nivel === 'critico' 
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
}

const getClasseBarra = (nivel) => {
  return nivel === 'critico' ? 'bg-red-500' : 'bg-yellow-500'
}

const getClasseBarraPorPercentual = (percentual) => {
  if (percentual < 70) return 'bg-green-500'
  if (percentual < 85) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getCorIcone = (percentual) => {
  if (percentual < 70) return 'text-green-500'
  if (percentual < 85) return 'text-yellow-500'
  return 'text-red-500'
}

const getCorTexto = (percentual) => {
  if (percentual < 70) return 'text-green-600 dark:text-green-400'
  if (percentual < 85) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const formatarBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatarNumero = (numero) => {
  if (numero >= 1000000) {
    return (numero / 1000000).toFixed(1) + 'M'
  }
  if (numero >= 1000) {
    return (numero / 1000).toFixed(1) + 'k'
  }
  return numero.toLocaleString()
}

const formatarNomeTabela = (tabela) => {
  const nomes = {
    'admin_logs': 'Logs Admin',
    'noticias': 'Notícias',
    'eventos': 'Eventos',
    'mensagens_contato': 'Mensagens',
    'classificados': 'Classificados'
  }
  return nomes[tabela] || tabela
}

// Lifecycle
onMounted(() => {
  carregarUsoSupabase()
})
</script>