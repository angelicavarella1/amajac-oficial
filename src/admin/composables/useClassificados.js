// src/admin/composables/useClassificados.js - VERSÃO CORRIGIDA E OTIMIZADA (Codificação e Sintaxe)
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client.js' // Importar o cliente Supabase diretamente
import { useUIStore } from '@/shared/stores/ui'

export function useClassificados(admin = false) {
  const classificados = ref([])
  const classificado = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // Cache
  const cacheTimestamp = ref(null)
  const CACHE_DURATION = admin ? 1 * 60 * 1000 : 3 * 60 * 1000 // Classificados mudam rápido

  // 🏠 CARREGAR CLASSIFICADOS (Renomeado para fetchClassificados)
  const fetchClassificados = async (forceRefresh = false) => {
    // Retorna o cache se não for forçado e ainda estiver dentro da validade
    if (!forceRefresh && cacheTimestamp.value && (Date.now() - cacheTimestamp.value < CACHE_DURATION)) {
      return classificados.value
    }

    loading.value = true
    error.value = null

    try {
      console.log(`🚀 Carregando classificados (${admin ? 'admin' : 'público'})...`)

      let query = supabase.from('classificados').select('*')

      if (!admin) {
        // Se não for admin, filtra por ativos e aprovados
        query = query.eq('ativo', true).eq('aprovado', true)
      }
      // Se for admin, busca todos (ativos/inativos, aprovados/pendentes)

      query = query.order('created_at', { ascending: false }) // Ordena por data

      const { data, error: supabaseError } = await query

      if (supabaseError) throw supabaseError

      classificados.value = data || []
      cacheTimestamp.value = Date.now()

      console.log(`✅ ${data?.length || 0} classificados carregados (${admin ? 'admin' : 'público'})`)
      return data // 🎯 Retorna os dados para quem chamou
    } catch (err) {
      console.error('❌ Erro ao carregar classificados:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar classificados', 'error')
      return [] // Retorna array vazio em caso de falha
    } finally {
      loading.value = false
    }
  }

  // 🏠 CARREGAR CLASSIFICADO POR ID
  const carregarClassificadoPorId = async (id) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase.from('classificados').select('*').eq('id', id).single()

      if (!admin) {
        // Se não for admin, verifica se está ativo e aprovado
        query = query.eq('ativo', true).eq('aprovado', true)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) throw supabaseError

      classificado.value = data

      if (!classificado.value) {
        throw new Error('Classificado não encontrado')
      }
    } catch (err) {
      console.error('❌ Erro ao carregar classificado:', err)
      error.value = err.message
      uiStore.showToast('Classificado não encontrado', 'error')
    } finally {
      loading.value = false
    }
  }

  // 🏠 CRIAR CLASSIFICADO (Público pode criar)
  const criarClassificado = async (dadosClassificado) => {
    loading.value = true
    error.value = null

    try {
      console.log('💾 Salvando novo classificado...', dadosClassificado)

      // O novo classificado deve começar com aprovado = false
      const dadosParaInserir = {
        ...dadosClassificado,
        aprovado: false, // Novos classificados pendem aprovação
        data_aprovacao: null // Será preenchido quando aprovado
      }

      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .insert([dadosParaInserir])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      uiStore.showToast('Classificado enviado para aprovação!')
      return data
    } catch (err) {
      console.error('❌ Erro ao criar classificado:', err)
      error.value = err.message
      uiStore.showToast('Erro ao criar classificado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🏠 APROVAR CLASSIFICADO (Admin)
  const aprovarClassificado = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log(`🔍 Aprovando classificado ID: ${id}`)

      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .update({ aprovado: true, data_aprovacao: new Date().toISOString() }) // Define como aprovado e registra a data
        .eq('id', id)
        .select() // Retorna o registro atualizado
        .single()

      if (supabaseError) throw supabaseError

      // Atualiza a lista local
      const index = classificados.value.findIndex(c => c.id === id)
      if (index !== -1) {
        // Usar spread operator para garantir reatividade total (embora o Vue 3 seja inteligente)
        classificados.value[index] = { ...classificados.value[index], ...data }
      }

      uiStore.showToast('Classificado aprovado com sucesso!')
      return data
    } catch (err) {
      console.error('❌ Erro ao aprovar classificado:', err)
      error.value = err.message
      uiStore.showToast('Erro ao aprovar classificado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🏠 REJEITAR CLASSIFICADO (Admin)
  const rejeitarClassificado = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log(`🔍 Rejeitando classificado ID: ${id}`)

      // Opção: Marcar como inativo e não aprovado, mantendo o histórico.
      const { data, error: supabaseError } = await supabase
        .from('classificados')
        .update({ ativo: false, aprovado: false }) // Marca como inativo e rejeitado
        .eq('id', id)
        .select() // Retorna o registro atualizado
        .single()

      if (supabaseError) throw supabaseError

      // Atualiza a lista local
      const index = classificados.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classificados.value[index] = { ...classificados.value[index], ...data }
      }

      uiStore.showToast('Classificado rejeitado')
      return data
    } catch (err) {
      console.error('❌ Erro ao rejeitar classificado:', err)
      error.value = err.message
      uiStore.showToast('Erro ao rejeitar classificado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🏠 DELETAR CLASSIFICADO (Admin)
  const deletarClassificado = async (id) => {
    if (!admin) {
      error.value = 'Acesso não autorizado'
      uiStore.showToast('Acesso não autorizado', 'error')
      throw new Error('Acesso não autorizado')
    }

    loading.value = true
    error.value = null

    try {
      console.log(`🗑️ Deletando classificado ID: ${id}`)

      const { error: supabaseError } = await supabase
        .from('classificados')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      // Remove da lista local
      classificados.value = classificados.value.filter(c => c.id !== id)

      uiStore.showToast('Classificado excluído com sucesso!')
    } catch (err) {
      console.error('❌ Erro ao excluir classificado:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir classificado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🏠 FORMATAR DATA
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada'
    try {
      const data = new Date(dataString)
      if (isNaN(data.getTime())) return 'Data inválida'
      return data.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Data inválida'
    }
  }

  // 🏠 FORMATAR PREÇO
  const formatarPreco = (preco) => {
    if (preco === undefined || preco === null) return 'Grátis'
    // Garantir que é um número, assumindo 0 se a conversão falhar
    const valorNumerico = parseFloat(preco) || 0
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorNumerico)
  }

  // 🏠 COMPUTED - Classificados aprovados e ativos
  const classificadosAtivos = computed(() => {
    return classificados.value.filter(classificado => classificado.ativo && classificado.aprovado)
  })

  // 🏠 COMPUTED - Classificados pendentes (Admin)
  const classificadosPendentes = computed(() => {
    return classificados.value.filter(classificado => classificado.ativo && !classificado.aprovado)
  })

  // 🏠 COMPUTED - Classificados por categoria
  const classificadosPorCategoria = computed(() => {
    const categorias = {}

    classificadosAtivos.value.forEach(classificado => {
      const categoria = classificado.categoria || 'Geral'
      if (!categorias[categoria]) {
        categorias[categoria] = []
      }
      categorias[categoria].push(classificado)
    })

    return categorias
  })

  // 🏠 COMPUTED - Categorias disponíveis
  const categoriasDisponiveis = computed(() => {
    const categorias = [...new Set(classificadosAtivos.value.map(c => c.categoria).filter(Boolean))]
    return categorias.sort()
  })

  return {
    // Estado
    classificados,
    classificado,
    loading,
    error,

    // Computed
    classificadosAtivos,
    classificadosPendentes,
    classificadosPorCategoria,
    categoriasDisponiveis,

    // Métodos
    fetchClassificados,
    carregarClassificadoPorId,
    criarClassificado,
    aprovarClassificado,
    rejeitarClassificado,
    deletarClassificado,
    formatarData,
    formatarPreco
  }
}