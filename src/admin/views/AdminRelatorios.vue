<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">Relatórios e Estatísticas</h2>
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        Carregando estatísticas...
      </div>
    </div>
    <div v-else>
      <RelatorioPortal :estatisticas="estatisticas" />

      <!-- ✅ Botão para acessar a página dedicada de auditoria -->
      <router-link
        to="/admin/relatorios/auditoria"
        class="inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors mt-4 mb-8"
      >
        👁️ Ver Auditoria Completa do Sistema
      </router-link>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Detalhes do Banco de Dados</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Notícias</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• {{ statsDetalhe.noticiasPublicadas }} publicadas</li>
              <li>• {{ statsDetalhe.noticiasRascunho }} em rascunho</li>
              <li>• Mais antiga: {{ statsDetalhe.noticiaMaisAntiga }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Eventos</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• {{ statsDetalhe.eventosFuturos }} futuros</li>
              <li>• {{ statsDetalhe.eventosPassados }} passados</li>
              <li>• Mais antigo: {{ statsDetalhe.eventoMaisAntigo }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagens</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• {{ statsDetalhe.mensagensLidas }} lidas</li>
              <li>• {{ statsDetalhe.mensagensNaoLidas }} não lidas</li>
              <li>• Mais antiga: {{ statsDetalhe.mensagemMaisAntiga }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Colaboradores</h4>
            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• {{ statsDetalhe.colaboradoresAtivos }} ativos</li>
              <li>• {{ statsDetalhe.colaboradoresInativos }} inativos</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Manutenção do Banco</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Use estas ações com cuidado. Elas não podem ser desfeitas.
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            @click="limparMensagensLidas"
            :disabled="loadingAcao"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loadingAcao" class="fas fa-spinner fa-spin mr-2"></i>
            Limpar mensagens lidas
          </button>
          <button
            @click="limparEventosPassados"
            :disabled="loadingAcao"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loadingAcao" class="fas fa-spinner fa-spin mr-2"></i>
            Limpar eventos passados
          </button>
          <button
            @click="limparTudo"
            :disabled="loadingAcao"
            class="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 disabled:opacity-50 transition-colors"
          >
            <i v-if="loadingAcao" class="fas fa-spinner fa-spin mr-2"></i>
            Limpar todos os dados (CUIDADO!)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import RelatorioPortal from '@/admin/components/RelatorioPortal.vue'
// Composables (Assumindo que eles estão configurados para retornar a lista completa)
import { useNoticias } from '@/admin/composables/useNoticias'
import { useEventos } from '@/admin/composables/useEventos'
import { useMensagens } from '@/admin/composables/useMensagens'
import { useColaboradores } from '@/admin/composables/useColaboradores'

const uiStore = useUIStore()

// Estados
const loading = ref(true)
const loadingAcao = ref(false)
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
/**
 * Encontra o item com a data de criação mais antiga.
 * @param {Array<Object>} items Lista de objetos com a propriedade created_at.
 * @returns {string} Data formatada ou '–'.
 */
const findOldestCreatedDate = (items) => {
    if (!items || items.length === 0) return '–';
    
    // Filtra itens com created_at válido e encontra a data mais antiga
    const oldest = items.filter(item => item.created_at)
      .reduce((oldest, current) => {
        const oldestDate = new Date(oldest.created_at);
        const currentDate = new Date(current.created_at);

        // Se uma das datas for inválida, favorece a outra ou retorna a anterior
        if (isNaN(currentDate)) return oldest;
        if (isNaN(oldestDate)) return current;
        
        return currentDate < oldestDate ? current : oldest;
      }, { created_at: new Date().toISOString() }); // Inicializa com data atual para comparação

    return formatarData(oldest.created_at);
}

// Formatação de data
const formatarData = (dataString) => {
  if (!dataString) return '–'
  try {
    return new Date(dataString).toLocaleDateString('pt-BR')
  } catch {
    return '–'
  }
}

// Carregar estatísticas reais
const carregarEstatisticas = async () => {
  loading.value = true;
  try {
    const [noticias, eventos, mensagens, colaboradores] = await Promise.all([
      useNoticias().fetchNoticias(),
      useEventos().fetchEventos(),
      useMensagens().fetchMensagens(),
      useColaboradores().fetchColaboradores()
    ])

    // Estatísticas principais
    estatisticas.value = {
      noticias: noticias.length,
      eventos: eventos.length,
      mensagens: mensagens.length,
      colaboradores: colaboradores.length
    }

    // Detalhes
    const agora = new Date()
    statsDetalhe.value = {
      // Notícias
      noticiasPublicadas: noticias.filter(n => n.status === 'publicado').length,
      noticiasRascunho: noticias.filter(n => n.status !== 'publicado').length,
      noticiaMaisAntiga: findOldestCreatedDate(noticias),

      // Eventos
      eventosFuturos: eventos.filter(e => new Date(e.data_hora_evento) >= agora).length,
      eventosPassados: eventos.filter(e => new Date(e.data_hora_evento) < agora).length,
      eventoMaisAntigo: findOldestCreatedDate(eventos),

      // Mensagens
      mensagensLidas: mensagens.filter(m => m.lida).length,
      mensagensNaoLidas: mensagens.filter(m => !m.lida).length,
      mensagemMaisAntiga: findOldestCreatedDate(mensagens),

      // Colaboradores
      // Assumindo que 'ativo' é a propriedade de status, ou que 'ativo === false' significa inativo
      colaboradoresAtivos: colaboradores.filter(c => c.status === 'ativo' || (c.status !== 'inativo' && c.status !== 'pendente')).length,
      colaboradoresInativos: colaboradores.filter(c => c.status === 'inativo').length
    }
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err)
    uiStore.showToast('Erro ao carregar relatórios', 'error')
  } finally {
    loading.value = false
  }
}

// Ações de limpeza
const limparMensagensLidas = async () => {
  if (!confirm('Tem certeza? Esta ação apagará todas as mensagens lidas. Isso não pode ser desfeito.')) return
  loadingAcao.value = true
  let successCount = 0;
  let errorCount = 0;
  try {
    const mensagensComposable = useMensagens()
    const todas = await mensagensComposable.fetchMensagens()
    const lidas = todas.filter(m => m.lida)
    
    // Itera sobre as mensagens lidas, tentando excluir cada uma
    for (const msg of lidas) {
      try {
        await mensagensComposable.deleteMensagem(msg.id)
        successCount++;
      } catch (err) {
        console.error(`Falha ao excluir mensagem ${msg.id}:`, err);
        errorCount++;
      }
    }

    await carregarEstatisticas()
    if (errorCount === 0) {
        uiStore.showToast(`Todas as ${successCount} mensagens lidas foram removidas com sucesso!`, 'success')
    } else {
        uiStore.showToast(`Concluído com ${successCount} remoções e ${errorCount} falhas. Verifique o console.`, 'warning')
    }
  } catch (err) {
    console.error('Erro ao limpar mensagens:', err)
    uiStore.showToast('Erro grave ao iniciar a limpeza de mensagens', 'error')
  } finally {
    loadingAcao.value = false
  }
}

const limparEventosPassados = async () => {
  if (!confirm('Tem certeza? Esta ação apagará todos os eventos passados. Isso não pode ser desfeito.')) return
  loadingAcao.value = true
  let successCount = 0;
  let errorCount = 0;
  try {
    const eventosComposable = useEventos()
    const todos = await eventosComposable.fetchEventos()
    const agora = new Date()
    const passados = todos.filter(e => new Date(e.data_hora_evento) < agora)
    
    // Itera sobre os eventos passados, tentando excluir cada um
    for (const ev of passados) {
      try {
        await eventosComposable.deleteEvento(ev.id)
        successCount++;
      } catch (err) {
        console.error(`Falha ao excluir evento ${ev.id}:`, err);
        errorCount++;
      }
    }

    await carregarEstatisticas()
    if (errorCount === 0) {
        uiStore.showToast(`Todos os ${successCount} eventos passados foram removidos com sucesso!`, 'success')
    } else {
        uiStore.showToast(`Concluído com ${successCount} remoções e ${errorCount} falhas. Verifique o console.`, 'warning')
    }
  } catch (err) {
    console.error('Erro ao limpar eventos:', err)
    uiStore.showToast('Erro grave ao iniciar a limpeza de eventos', 'error')
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
    // 1. Limpa Mensagens (assumindo que a API não tem um endpoint bulk)
    const mensagensComposable = useMensagens()
    const todasMensagens = await mensagensComposable.fetchMensagens()
    for (const msg of todasMensagens) {
      try { await mensagensComposable.deleteMensagem(msg.id) } catch (err) { console.warn(`Falha ao apagar mensagem ${msg.id}`, err) }
    }

    // 2. Limpa Eventos
    const eventosComposable = useEventos()
    const todosEventos = await eventosComposable.fetchEventos()
    for (const ev of todosEventos) {
      try { await eventosComposable.deleteEvento(ev.id) } catch (err) { console.warn(`Falha ao apagar evento ${ev.id}`, err) }
    }
    
    // 3. Limpa Notícias
    const noticiasComposable = useNoticias()
    const todasNoticias = await noticiasComposable.fetchNoticias()
    for (const noticia of todasNoticias) {
      try { await noticiasComposable.deleteNoticia(noticia.id) } catch (err) { console.warn(`Falha ao apagar notícia ${noticia.id}`, err) }
    }
    
    // 4. Limpa Colaboradores
    const colaboradoresComposable = useColaboradores()
    const todosColaboradores = await colaboradoresComposable.fetchColaboradores()
    for (const colab of todosColaboradores) {
      try { await colaboradoresComposable.deleteColaborador(colab.id) } catch (err) { console.warn(`Falha ao apagar colaborador ${colab.id}`, err) }
    }

    await carregarEstatisticas()
    uiStore.showToast('Limpeza total concluída! O banco está vazio.', 'success')

  } catch (err) {
    console.error('Erro na limpeza total:', err)
    uiStore.showToast('Erro crítico na limpeza total. Verifique o console.', 'error')
  } finally {
    loadingAcao.value = false
  }
}

onMounted(() => {
  carregarEstatisticas()
})
</script>