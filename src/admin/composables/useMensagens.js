import { ref, computed } from 'vue'
import { publicApi, adminApi } from '@/supabase'
import { useUIStore } from '@/stores/ui'

export function useMensagens(admin = false) {
  const mensagens = ref([])
  const mensagem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // ✉️ FETCH MENSAGENS (Admin apenas) - RENOMEADO PARA A CHAMADA NO DASHBOARD
  const fetchMensagens = async () => {
    loading.value = true
    error.value = null

    try {
      // CORREÇÃO: Usar adminApi.mensagens.getAll()
      const data = await adminApi.mensagens.getAll()
      mensagens.value = data
      
      console.log(`✅ ${data.length} mensagens carregadas`)
      return data 
    } catch (err) {
      console.error('❌ Erro ao carregar mensagens:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar mensagens', 'error')
      return [] 
    } finally {
      loading.value = false
    }
  }

  // ✉️ ENVIAR MENSAGEM (Público)
  const enviarMensagem = async (dadosMensagem) => {
    loading.value = true
    error.value = null

    try {
      // ✅ Esta chamada está correta se publicApi for um módulo separado
      const mensagemEnviada = await publicApi.enviarMensagemContato(dadosMensagem)
      
      uiStore.showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      return mensagemEnviada
    } catch (err) {
      console.error('❌ Erro ao enviar mensagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao enviar mensagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✉️ MARCAR COMO LIDA (Admin)
  const marcarComoLida = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      return
    }

    loading.value = true
    error.value = null

    try {
      // CORREÇÃO: Usar adminApi.mensagens.markAsRead(id)
      const mensagemAtualizada = await adminApi.mensagens.markAsRead(id)
      
      const index = mensagens.value.findIndex(m => m.id === id)
      if (index !== -1) {
        // Assume que a API retorna o objeto atualizado
        mensagens.value[index] = mensagemAtualizada
      }

      uiStore.showToast('Mensagem marcada como lida')
      return mensagemAtualizada
    } catch (err) {
      console.error('❌ Erro ao marcar mensagem como lida:', err)
      error.value = err.message
      uiStore.showToast('Erro ao processar mensagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✉️ DELETAR MENSAGEM (Admin)
  const deletarMensagem = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      return
    }

    loading.value = true
    error.value = null

    try {
      // CORREÇÃO: Usar adminApi.mensagens.delete(id)
      await adminApi.mensagens.delete(id)
      mensagens.value = mensagens.value.filter(m => m.id !== id)
      
      uiStore.showToast('Mensagem excluída com sucesso!')
    } catch (err) {
      console.error('❌ Erro ao excluir mensagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir mensagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✉️ FORMATAR DATA
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada'
    try {
      const data = new Date(dataString)
      if (isNaN(data.getTime())) return 'Data inválida'
      return data.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
  }

  // ✉️ COMPUTED - Mensagens não lidas
  const mensagensNaoLidas = computed(() => {
    return mensagens.value.filter(mensagem => !mensagem.lida)
  })

  // ✉️ COMPUTED - Mensagens por status
  const mensagensPorStatus = computed(() => {
    const status = {}
    
    mensagens.value.forEach(mensagem => {
      const statusMsg = mensagem.status || 'pendente'
      if (!status[statusMsg]) {
        status[statusMsg] = []
      }
      status[statusMsg].push(mensagem)
    })
    
    return status
  })

  return {
    // Estado
    mensagens,
    mensagem,
    loading,
    error,
    
    // Computed
    mensagensNaoLidas,
    mensagensPorStatus,
    
    // Métodos
    fetchMensagens, 
    enviarMensagem,
    marcarComoLida,
    deletarMensagem,
    formatarData
  }
}