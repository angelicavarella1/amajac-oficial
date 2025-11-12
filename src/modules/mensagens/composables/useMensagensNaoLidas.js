// src/modules/mensagens/composables/useMensagensNaoLidas.js
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

export function useMensagensNaoLidas() {
  const count = ref(0)
  const loading = ref(true)
  const ultimasMensagens = ref([])
  const subscription = ref(null)

  const fetchCount = async () => {
    loading.value = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        count.value = 0
        ultimasMensagens.value = []
        return
      }

      // Busca contagem de mensagens não lidas
      const { count: c, error: countError } = await supabase
        .from('mensagens_contato')
        .select('*', { count: 'exact', head: true })
        .eq('lida', false)

      if (!countError) {
        count.value = c || 0
      } else {
        console.warn('Erro na consulta de mensagens não lidas:', countError)
        count.value = 0
      }

      // Busca últimas mensagens não lidas
      await carregarUltimasMensagens()
    } catch (error) {
      console.warn('Erro ao carregar mensagens não lidas:', error)
      count.value = 0
      ultimasMensagens.value = []
    } finally {
      loading.value = false
    }
  }

  // Carregar últimas mensagens para o dropdown
  const carregarUltimasMensagens = async (limite = 5) => {
    try {
      const { data, error } = await supabase
        .from('mensagens_contato')
        .select('*')
        .eq('lida', false)
        .order('created_at', { ascending: false })
        .limit(limite)

      if (error) throw error
      
      ultimasMensagens.value = data || []
      console.log('Últimas mensagens carregadas:', ultimasMensagens.value)
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro ao carregar últimas mensagens:', error)
      ultimasMensagens.value = []
      return { data: [], error }
    }
  }

  // Marcar mensagem específica como lida
  const marcarComoLida = async (mensagemId) => {
    try {
      const { error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true
        })
        .eq('id', mensagemId)

      if (error) throw error
      
      // Atualiza o contador localmente
      if (count.value > 0) {
        count.value--
      }
      
      // Remove a mensagem da lista de últimas mensagens
      ultimasMensagens.value = ultimasMensagens.value.filter(msg => msg.id !== mensagemId)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error)
      return { success: false, error }
    }
  }

  // Marcar todas as mensagens como lidas
  const marcarTodasComoLidas = async () => {
    try {
      const { error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true
        })
        .eq('lida', false)

      if (error) throw error
      
      count.value = 0
      ultimasMensagens.value = []
      return { success: true }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
      return { success: false, error }
    }
  }

  // Configurar realtime para atualizações automáticas
  const configurarRealtime = () => {
    try {
      subscription.value = supabase
        .channel('mensagens-contato-notificacoes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mensagens_contato'
          },
          (payload) => {
            console.log('Mudança detectada nas mensagens (notificações):', payload)
            
            // Recarrega a contagem e últimas mensagens quando houver mudanças
            fetchCount()
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Inscrito nas mudanças da tabela mensagens_contato (notificações)')
          }
        })
    } catch (error) {
      console.warn('Erro ao configurar realtime para notificações:', error)
    }
  }

  // Inicializar
  onMounted(() => {
    fetchCount()
    configurarRealtime()
  })

  // Limpar subscription ao desmontar
  onUnmounted(() => {
    if (subscription.value) {
      subscription.value.unsubscribe()
    }
  })

  return {
    count,
    loading,
    ultimasMensagens,
    refresh: fetchCount,
    marcarComoLida,
    marcarTodasComoLidas,
    carregarUltimasMensagens
  }
}