import { ref, computed } from 'vue'
import { publicApi, adminApi } from '@/supabase'
import { useUIStore } from '@/stores/ui'

export function useColaboradores(admin = false) {
  const colaboradores = ref([])
  const colaborador = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // Cache
  const cacheTimestamp = ref(null)
  const CACHE_DURATION = admin ? 3 * 60 * 1000 : 10 * 60 * 1000 // Colaboradores mudam menos

  // 👥 CARREGAR COLABORADORES (Renomeado para fetchColaboradores)
  const fetchColaboradores = async (forceRefresh = false) => {
    if (!forceRefresh && cacheTimestamp.value && (Date.now() - cacheTimestamp.value < CACHE_DURATION)) {
      return colaboradores.value // Retorna o array em cache para o Dashboard contar
    }

    loading.value = true
    error.value = null

    try {
      let data
      
      if (admin) {
        // CORREÇÃO 1: adminApi.colaboradores.getAll()
        data = await adminApi.colaboradores.getAll()
      } else {
        // CORREÇÃO 2: publicApi.colaboradores.getAll()
        data = await publicApi.colaboradores.getAll()
      }

      colaboradores.value = data
      cacheTimestamp.value = Date.now()
      
      console.log(`✅ ${data.length} colaboradores carregados (${admin ? 'admin' : 'público'})`)
      // 🎯 IMPORTANTE: Retorna os dados para serem usados no Promise.all do Dashboard.
      return data 
    } catch (err) {
      console.error('❌ Erro ao carregar colaboradores:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar colaboradores', 'error')
      return [] // Retorna array vazio em caso de falha
    } finally {
      loading.value = false
    }
  }

  // 👥 CARREGAR COLABORADOR POR ID
  const carregarColaboradorPorId = async (id) => {
    loading.value = true
    error.value = null

    try {
      if (admin) {
        // Usa a nova função de busca: fetchColaboradores
        await fetchColaboradores() 
        colaborador.value = colaboradores.value.find(c => c.id === id)
      } else {
        // CORREÇÃO 3: publicApi.colaboradores.getById(id)
        colaborador.value = await publicApi.colaboradores.getById(id)
      }

      if (!colaborador.value) {
        throw new Error('Colaborador não encontrado')
      }
    } catch (err) {
      console.error('❌ Erro ao carregar colaborador:', err)
      error.value = err.message
      uiStore.showToast('Colaborador não encontrado', 'error')
    } finally {
      loading.value = false
    }
  }

  // 👥 CRIAR COLABORADOR (Admin)
  const criarColaborador = async (dadosColaborador) => {
    loading.value = true
    error.value = null

    try {
      if (!admin) throw new Error('Acesso não autorizado')

      // CORREÇÃO 4: adminApi.colaboradores.create(dadosColaborador)
      const novoColaborador = await adminApi.colaboradores.create(dadosColaborador)
      colaboradores.value.push(novoColaborador)
      
      uiStore.showToast('Colaborador criado com sucesso!')
      return novoColaborador
    } catch (err) {
      console.error('❌ Erro ao criar colaborador:', err)
      error.value = err.message
      uiStore.showToast('Erro ao criar colaborador', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 👥 ATUALIZAR COLABORADOR (Admin)
  const atualizarColaborador = async (id, dadosAtualizados) => {
    loading.value = true
    error.value = null

    try {
      if (!admin) throw new Error('Acesso não autorizado')

      // CORREÇÃO 5: adminApi.colaboradores.update(id, dadosAtualizados)
      const colaboradorAtualizado = await adminApi.colaboradores.update(id, dadosAtualizados)
      
      const index = colaboradores.value.findIndex(c => c.id === id)
      if (index !== -1) {
        // Uso de spread para garantir que o objeto seja reativo e completo
        colaboradores.value[index] = { ...colaboradores.value[index], ...colaboradorAtualizado } 
      }
      
      if (colaborador.value && colaborador.value.id === id) {
        colaborador.value = colaboradorAtualizado
      }

      uiStore.showToast('Colaborador atualizado com sucesso!')
      return colaboradorAtualizado
    } catch (err) {
      console.error('❌ Erro ao atualizar colaborador:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar colaborador', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 👥 DELETAR COLABORADOR (Admin)
  const deletarColaborador = async (id) => {
    loading.value = true
    error.value = null

    try {
      if (!admin) throw new Error('Acesso não autorizado')

      // CORREÇÃO 6: adminApi.colaboradores.delete(id)
      await adminApi.colaboradores.delete(id)
      colaboradores.value = colaboradores.value.filter(c => c.id !== id)
      
      uiStore.showToast('Colaborador excluído com sucesso!')
    } catch (err) {
      console.error('❌ Erro ao excluir colaborador:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir colaborador', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 👥 FORMATAR TELEFONE
  const formatarTelefone = (telefone) => {
    if (!telefone) return ''
    const numeros = telefone.replace(/\D/g, '')
    
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    
    return telefone
  }

  // 👥 COMPUTED - Colaboradores ativos
  const colaboradoresAtivos = computed(() => {
    return colaboradores.value.filter(colaborador => colaborador.ativo)
  })

  // 👥 COMPUTED - Colaboradores por categoria
  const colaboradoresPorCategoria = computed(() => {
    const categorias = {}
    
    colaboradoresAtivos.value.forEach(colaborador => {
      const categoria = colaborador.categoria || 'Geral'
      if (!categorias[categoria]) {
        categorias[categoria] = []
      }
      categorias[categoria].push(colaborador)
    })
    
    return categorias
  })

  // 👥 COMPUTED - Categorias disponíveis
  const categoriasDisponiveis = computed(() => {
    const categorias = [...new Set(colaboradoresAtivos.value.map(c => c.categoria).filter(Boolean))]
    return categorias.sort()
  })

  return {
    // Estado
    colaboradores,
    colaborador,
    loading,
    error,
    
    // Computed
    colaboradoresAtivos,
    colaboradoresPorCategoria,
    categoriasDisponiveis,
    
    // Métodos
    fetchColaboradores, 
    carregarColaboradorPorId,
    criarColaborador,
    atualizarColaborador,
    deletarColaborador,
    formatarTelefone
  }
}