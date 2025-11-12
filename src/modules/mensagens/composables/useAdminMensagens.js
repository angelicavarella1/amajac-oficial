// src/modules/mensagens/composables/useAdminMensagens.js
import { ref, onMounted, onUnmounted } from 'vue'
import { useCRUD } from '@/modules/base/composables/useCRUD'
import { supabase } from '@/core/utils/supabaseClient'

/**
 * Composable padronizado para gestão de mensagens de contato
 * - Tabela: 'mensagens_contato'
 * - Campos: nome, email, telefone, assunto, mensagem, lida, created_at
 */
export function useAdminMensagens() {
  const crud = useCRUD('mensagens_contato')
  const realtimeSubscription = ref(null)

  /**
   * Busca mensagens com opções de ordenação e filtro
   * @param {Object} options - Opções de consulta
   * @returns {Promise<Array>}
   */
  const buscarMensagens = async (options = {}) => {
    const {
      order = 'created_at',
      ascending = false,
      limite = 100,
      apenasNaoLidas = false
    } = options

    let query = supabase
      .from('mensagens_contato')
      .select('*')
      .order(order, { ascending })

    if (apenasNaoLidas) {
      query = query.eq('lida', false)
    }

    if (limite) {
      query = query.limit(limite)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar mensagens:', error)
      throw error
    }

    crud.items.value = data || []
    console.log(`Buscar mensagens: encontradas ${data?.length || 0} mensagens`)
    return data
  }

  /**
   * Marca uma mensagem como lida
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  const marcarComoLida = async (id) => {
    try {
      console.log('Marcando mensagem como lida:', id)
      
      const { data, error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase ao marcar como lida:', error)
        throw error
      }

      console.log('Mensagem marcada como lida com sucesso:', data)

      // Atualiza o item localmente
      const index = crud.items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        crud.items.value[index] = { ...crud.items.value[index], ...data }
        console.log('Item atualizado localmente após marcar como lida:', crud.items.value[index])
      }

      return data
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error)
      throw error
    }
  }

  /**
   * Marca uma mensagem como não lida
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  const marcarComoNaoLida = async (id) => {
    try {
      console.log('Marcando mensagem como não lida:', id)
      
      const { data, error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: false
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase ao marcar como não lida:', error)
        throw error
      }

      console.log('Mensagem marcada como não lida com sucesso:', data)

      // Atualiza o item localmente
      const index = crud.items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        crud.items.value[index] = { ...crud.items.value[index], ...data }
        console.log('Item atualizado localmente após marcar como não lida:', crud.items.value[index])
      }

      return data
    } catch (error) {
      console.error('Erro ao marcar mensagem como não lida:', error)
      throw error
    }
  }

  /**
   * Alterna o status de lida/não lida
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  const alternarStatusLida = async (id) => {
    console.log('alternarStatusLida chamado para ID:', id)
    
    try {
      // Primeiro busca a mensagem atual do banco para garantir que temos o status correto
      const { data: mensagemAtual, error: fetchError } = await supabase
        .from('mensagens_contato')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Erro ao buscar mensagem:', fetchError)
        throw new Error('Mensagem não encontrada no banco de dados')
      }

      console.log('Mensagem encontrada no banco:', mensagemAtual)

      const novoStatus = !mensagemAtual.lida
      const dadosAtualizacao = { 
        lida: novoStatus
      }

      console.log('Atualizando mensagem com:', dadosAtualizacao)

      const { data, error } = await supabase
        .from('mensagens_contato')
        .update(dadosAtualizacao)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      console.log('Mensagem atualizada com sucesso:', data)

      // Atualiza o item localmente
      const index = crud.items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        crud.items.value[index] = { ...crud.items.value[index], ...data }
        console.log('Item atualizado localmente:', crud.items.value[index])
      } else {
        console.log('Mensagem não encontrada no array local, recarregando lista...')
        // Se não encontrou localmente, recarrega a lista
        await buscarMensagens({ order: 'created_at', ascending: false })
      }

      return data
    } catch (error) {
      console.error('Erro completo ao alternar status:', error)
      throw error
    }
  }

  /**
   * Marca todas as mensagens como lidas
   * @returns {Promise<boolean>}
   */
  const marcarTodasComoLidas = async () => {
    try {
      console.log('Marcando todas as mensagens como lidas')
      
      const { error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true
        })
        .eq('lida', false)

      if (error) throw error

      // Atualiza todos os itens localmente
      crud.items.value = crud.items.value.map(item => ({
        ...item,
        lida: true
      }))

      console.log('Todas as mensagens marcadas como lidas')
      return true
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
      throw error
    }
  }

  /**
   * Exclui uma mensagem
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  const excluirMensagem = async (id) => {
    console.log('Excluindo mensagem:', id)
    return await crud.remove(id)
  }

  /**
   * Busca estatísticas das mensagens
   * @returns {Promise<Object>}
   */
  const buscarEstatisticas = async () => {
    try {
      const { count: total, error: errorTotal } = await supabase
        .from('mensagens_contato')
        .select('*', { count: 'exact', head: true })

      const { count: naoLidas, error: errorNaoLidas } = await supabase
        .from('mensagens_contato')
        .select('*', { count: 'exact', head: true })
        .eq('lida', false)

      const hoje = new Date()
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      const { count: esteMes, error: errorEsteMes } = await supabase
        .from('mensagens_contato')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes.toISOString())

      if (errorTotal || errorNaoLidas || errorEsteMes) {
        throw new Error('Erro ao buscar estatísticas')
      }

      const estatisticas = {
        total: total || 0,
        naoLidas: naoLidas || 0,
        lidas: (total || 0) - (naoLidas || 0),
        esteMes: esteMes || 0
      }

      console.log('Estatísticas carregadas:', estatisticas)
      return estatisticas
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return {
        total: 0,
        naoLidas: 0,
        lidas: 0,
        esteMes: 0
      }
    }
  }

  /**
   * Configura realtime para atualizações automáticas
   */
  const configurarRealtime = () => {
    try {
      realtimeSubscription.value = supabase
        .channel('mensagens-contato-admin')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mensagens_contato'
          },
          (payload) => {
            console.log('Mudança detectada na tabela mensagens_contato:', payload)
            
            // Recarrega as mensagens quando houver mudanças
            buscarMensagens({ order: 'created_at', ascending: false })
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Inscrito nas mudanças da tabela mensagens_contato')
          }
        })
    } catch (error) {
      console.warn('Erro ao configurar realtime:', error)
    }
  }

  /**
   * Limpa a subscription do realtime
   */
  const limparRealtime = () => {
    if (realtimeSubscription.value) {
      supabase.removeChannel(realtimeSubscription.value)
      realtimeSubscription.value = null
    }
  }

  // Configura realtime quando o composable é usado
  onMounted(() => {
    configurarRealtime()
  })

  // Limpa realtime quando o composable não é mais usado
  onUnmounted(() => {
    limparRealtime()
  })

  return {
    // Estados
    loading: crud.loading,
    error: crud.error,
    mensagens: crud.items,

    // Métodos CRUD básicos
    getAll: crud.getAll,
    getById: crud.getById,
    create: crud.create,

    // Métodos específicos de mensagens
    buscarMensagens,
    marcarComoLida,
    marcarComoNaoLida,
    alternarStatusLida,
    marcarTodasComoLidas,
    excluirMensagem,
    buscarEstatisticas,

    // Controle de realtime
    configurarRealtime,
    limparRealtime
  }
}