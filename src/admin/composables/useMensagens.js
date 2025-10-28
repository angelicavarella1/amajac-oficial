// src/admin/composables/useMensagens.js - VERSÃO CORRIGIDA
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client.js'
import { useUIStore } from '@/shared/stores/ui'

export function useMensagens(admin = false) {
  const mensagens = ref([])
  const mensagem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // 📥 FETCH MENSAGENS (Admin apenas)
  const fetchMensagens = async () => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 Carregando mensagens...')

      const { data, error: supabaseError } = await supabase
        .from('mensagens_contato')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      mensagens.value = data || []
      console.log(`✅ ${data?.length || 0} mensagens carregadas`)
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

  // 📤 ENVIAR MENSAGEM (Público)
  const enviarMensagem = async (dadosMensagem) => {
    loading.value = true
    error.value = null

    try {
      console.log('📤 Enviando mensagem...', dadosMensagem)

      const { data, error: supabaseError } = await supabase
        .from('mensagens_contato')
        .insert([{
          ...dadosMensagem,
          lida: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      uiStore.showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success')
      console.log('✅ Mensagem enviada com sucesso')
      return data
    } catch (err) {
      console.error('❌ Erro ao enviar mensagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao enviar mensagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✅ MARCAR COMO LIDA (Admin)
  const marcarComoLida = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log(`✅ Marcando mensagem ${id} como lida...`)

      const { data, error: supabaseError } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualiza a lista local
      const index = mensagens.value.findIndex(m => m.id === id)
      if (index !== -1) {
        mensagens.value[index] = data
      }

      uiStore.showToast('Mensagem marcada como lida', 'success')
      console.log('✅ Mensagem marcada como lida')
      return data
    } catch (err) {
      console.error('❌ Erro ao marcar mensagem como lida:', err)
      error.value = err.message
      uiStore.showToast('Erro ao processar mensagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🗑️ DELETAR MENSAGEM (Admin)
  const deletarMensagem = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log(`🗑️ Deletando mensagem ${id}...`)

      const { error: supabaseError } = await supabase
        .from('mensagens_contato')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      // Remove da lista local
      mensagens.value = mensagens.value.filter(m => m.id !== id)

      uiStore.showToast('Mensagem excluída com sucesso!', 'success')
      console.log('✅ Mensagem excluída com sucesso')
      return true
    } catch (err) {
      console.error('❌ Erro ao excluir mensagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir mensagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔍 BUSCAR MENSAGEM POR ID
  const buscarMensagemPorId = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log(`🔍 Buscando mensagem ${id}...`)

      const { data, error: supabaseError } = await supabase
        .from('mensagens_contato')
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) throw supabaseError

      mensagem.value = data
      console.log('✅ Mensagem encontrada')
      return data
    } catch (err) {
      console.error('❌ Erro ao buscar mensagem:', err)
      error.value = err.message
      uiStore.showToast('Mensagem não encontrada', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📊 MARCAR TODAS COMO LIDAS
  const marcarTodasComoLidas = async () => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log('✅ Marcando todas as mensagens como lidas...')

      const { error: supabaseError } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true,
          updated_at: new Date().toISOString()
        })
        .eq('lida', false)

      if (supabaseError) throw supabaseError

      // Atualiza todas localmente
      mensagens.value.forEach(msg => {
        msg.lida = true
      })

      uiStore.showToast('Todas as mensagens foram marcadas como lidas', 'success')
      console.log('✅ Todas as mensagens marcadas como lidas')
      return true
    } catch (err) {
      console.error('❌ Erro ao marcar mensagens como lidas:', err)
      error.value = err.message
      uiStore.showToast('Erro ao processar mensagens', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📅 FORMATAR DATA
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada'
    try {
      const data = new Date(dataString)
      if (isNaN(data.getTime())) return 'Data inválida'
      return data.toLocaleDateString('pt-BR', {
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

  // 📊 COMPUTED - Mensagens não lidas
  const mensagensNaoLidas = computed(() => {
    return mensagens.value.filter(mensagem => !mensagem.lida)
  })

  // 📊 COMPUTED - Mensagens por status
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

  // 📊 COMPUTED - Estatísticas
  const estatisticas = computed(() => {
    const total = mensagens.value.length
    const lidas = mensagens.value.filter(m => m.lida).length
    const naoLidas = total - lidas

    return {
      total,
      lidas,
      naoLidas
    }
  })

  return {
    // Estado
    mensagens,
    mensagem,
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Computed
    mensagensNaoLidas,
    mensagensPorStatus,
    estatisticas,

    // Métodos
    fetchMensagens,
    enviarMensagem,
    marcarComoLida,
    deletarMensagem,
    buscarMensagemPorId,
    marcarTodasComoLidas,
    formatarData
  }
}