import { ref, computed } from 'vue'
import { publicApi, adminApi } from '@/supabase'
import { useUIStore } from '@/stores/ui'

export function useClassificados(admin = false) {
  const classificados = ref([])
  const classificado = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // Cache
  const cacheTimestamp = ref(null)
  const CACHE_DURATION = admin ? 1 * 60 * 1000 : 3 * 60 * 1000 // Classificados mudam rápido

  // 🏷️ CARREGAR CLASSIFICADOS (Renomeado para fetchClassificados)
  const fetchClassificados = async (forceRefresh = false) => {
    if (!forceRefresh && cacheTimestamp.value && (Date.now() - cacheTimestamp.value < CACHE_DURATION)) {
      return classificados.value // Retorna o array em cache
    }

    loading.value = true
    error.value = null

    try {
      let data
      
      if (admin) {
        // CORREÇÃO 1: adminApi.classificados.getAll()
        data = await adminApi.classificados.getAll()
      } else {
        // CORREÇÃO 2: publicApi.classificados.getAll()
        data = await publicApi.classificados.getAll()
      }

      classificados.value = data
      cacheTimestamp.value = Date.now()
      
      console.log(`✅ ${data.length} classificados carregados (${admin ? 'admin' : 'público'})`)
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

  // 🏷️ CARREGAR CLASSIFICADO POR ID
  const carregarClassificadoPorId = async (id) => {
    loading.value = true
    error.value = null

    try {
      if (admin) {
        // Usa a nova função de busca: fetchClassificados
        await fetchClassificados() 
        classificado.value = classificados.value.find(c => c.id === id)
      } else {
        // CORREÇÃO 3: publicApi.classificados.getById(id)
        classificado.value = await publicApi.classificados.getById(id)
      }

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

  // 🏷️ CRIAR CLASSIFICADO (Público pode criar) - Refatorado para usar publicApi
  const criarClassificado = async (dadosClassificado) => {
    loading.value = true
    error.value = null

    try {
      // CORREÇÃO 4: publicApi.classificados.create(dadosClassificado)
      // Assumindo que você mapeou publicApi.classificados.create para a função de insert.
      const data = await publicApi.classificados.create(dadosClassificado);
      
      // Se estiver no admin, adiciona à lista para reatividade
      if (admin) {
        classificados.value.unshift(data)
      }
      
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

  // 🏷️ APROVAR CLASSIFICADO (Admin)
  const aprovarClassificado = async (id) => {
    loading.value = true
    error.value = null

    try {
      if (!admin) throw new Error('Acesso não autorizado')

      // CORREÇÃO 5: adminApi.classificados.approve(id)
      const classificadoAprovado = await adminApi.classificados.approve(id)
      
      const index = classificados.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classificados.value[index] = { ...classificados.value[index], ...classificadoAprovado }
      }

      uiStore.showToast('Classificado aprovado com sucesso!')
      return classificadoAprovado
    } catch (err) {
      console.error('❌ Erro ao aprovar classificado:', err)
      error.value = err.message
      uiStore.showToast('Erro ao aprovar classificado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🏷️ REJEITAR CLASSIFICADO (Admin)
  const rejeitarClassificado = async (id) => {
    loading.value = true
    error.value = null

    try {
      if (!admin) throw new Error('Acesso não autorizado')

      // CORREÇÃO 6: adminApi.classificados.reject(id)
      const classificadoRejeitado = await adminApi.classificados.reject(id)
      
      const index = classificados.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classificados.value[index] = { ...classificados.value[index], ...classificadoRejeitado }
      }

      uiStore.showToast('Classificado rejeitado')
      return classificadoRejeitado
    } catch (err) {
      console.error('❌ Erro ao rejeitar classificado:', err)
      error.value = err.message
      uiStore.showToast('Erro ao rejeitar classificado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🏷️ DELETAR CLASSIFICADO (Admin)
  const deletarClassificado = async (id) => {
    loading.value = true
    error.value = null

    try {
      if (!admin) throw new Error('Acesso não autorizado')

      // CORREÇÃO 7: adminApi.classificados.delete(id)
      await adminApi.classificados.delete(id)
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

  // 🏷️ FORMATAR DATA
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

  // 🏷️ FORMATAR PREÇO
  const formatarPreco = (preco) => {
    if (!preco) return 'Grátis'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  // 🏷️ COMPUTED - Classificados aprovados e ativos
  const classificadosAtivos = computed(() => {
    return classificados.value.filter(classificado => classificado.ativo && classificado.aprovado)
  })

  // 🏷️ COMPUTED - Classificados pendentes (Admin)
  const classificadosPendentes = computed(() => {
    return classificados.value.filter(classificado => classificado.ativo && !classificado.aprovado)
  })

  // 🏷️ COMPUTED - Classificados por categoria
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

  // 🏷️ COMPUTED - Categorias disponíveis
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
    fetchClassificados, // 💡 RENOMEADO AQUI
    carregarClassificadoPorId,
    criarClassificado,
    aprovarClassificado,
    rejeitarClassificado,
    deletarClassificado,
    formatarData,
    formatarPreco
  }
}