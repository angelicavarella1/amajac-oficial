import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'

export const useColaboradoresStore = defineStore('colaboradores', () => {
  const itens = ref([])
  const loading = ref(false)
  const error = ref(null)
  const cacheTimestamp = ref(null)
  const CACHE_DURATION = 15 * 60 * 1000 // 15 minutos

  // --- Getters (padrão notícias) ---
  const parceiros = computed(() => itens.value || [])
  const parceirosAtivos = computed(() => {
    return itens.value.filter(parceiro => parceiro.ativo === true)
  })
  const parceirosHome = computed(() => {
    const ativos = parceirosAtivos.value
    return ativos.slice(0, 8) // Mostra 8 na home
  })

  // --- Leitura (Read) ---
  const carregarColaboradores = async (forceRefresh = false) => {
    if (!forceRefresh && cacheTimestamp.value && (Date.now() - cacheTimestamp.value < CACHE_DURATION)) {
      console.log('🤝 Parceiros retornados do cache.')
      return itens.value
    }

    loading.value = true
    error.value = null

    try {
      console.log('🤝 Carregando parceiros...')
      const { data, error: supabaseError } = await supabase
        .from('colaboradores')
        .select('*')
        .order('nome', { ascending: true })

      if (supabaseError) {
        throw new Error(`Erro ao carregar parceiros: ${supabaseError.message}`)
      }

      itens.value = data || []
      cacheTimestamp.value = Date.now()
      console.log(`✅ ${itens.value.length} parceiros carregados com sucesso`)
      return itens.value
    } catch (err) {
      console.error('❌ Erro ao carregar parceiros:', err)
      error.value = err.message
      itens.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const carregarColaboradorPorId = async (id) => {
    const cachedItem = itens.value.find(c => c.id === id)
    if (cachedItem) return cachedItem

    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null
        }
        throw new Error(`Erro ao carregar parceiro: ${supabaseError.message}`)
      }
      return data
    } catch (err) {
      console.error('❌ Erro ao carregar parceiro:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // --- Criação/Atualização (Create/Update) ---
  const salvarColaborador = async (colaborador, id = null) => {
    loading.value = true
    error.value = null

    try {
      let result

      if (id) {
        // ATUALIZAÇÃO
        const { data, error: supabaseError } = await supabase
          .from('colaboradores')
          .update(colaborador)
          .eq('id', id)
          .select()
          .single()

        if (supabaseError) throw new Error(supabaseError.message)
        result = data
        console.log(`✅ Parceiro ${id} atualizado com sucesso.`)
      } else {
        // CRIAÇÃO - Remove ID se for null/undefined
        const dadosParaInserir = { ...colaborador }
        if (!dadosParaInserir.id) {
          delete dadosParaInserir.id
        }

        const { data, error: supabaseError } = await supabase
          .from('colaboradores')
          .insert([dadosParaInserir])
          .select()
          .single()

        if (supabaseError) throw new Error(supabaseError.message)
        result = data
        console.log(`✅ Novo parceiro criado com sucesso.`)
      }

      // Atualiza o cache
      await carregarColaboradores(true)
      return result
    } catch (err) {
      console.error('❌ Erro ao salvar parceiro:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Exclusão (Delete) ---
  const excluirColaborador = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: supabaseError } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id)

      if (supabaseError) throw new Error(supabaseError.message)

      itens.value = itens.value.filter(item => item.id !== id)
      cacheTimestamp.value = Date.now()
      console.log(`✅ Parceiro ${id} excluído com sucesso.`)
      return true
    } catch (err) {
      console.error('❌ Erro ao excluir parceiro:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // --- Upload de Imagem (padrão notícias) ---
  const uploadImagem = async (file) => {
    try {
      console.log('📤 Store: Iniciando upload de imagem...', file.name)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `parceiros/${fileName}`

      const { data, error } = await supabase.storage
        .from('imagens')
        .upload(filePath, file)

      if (error) {
        console.error('❌ Store: Erro no upload da imagem:', error)
        throw error
      }

      // Obtém a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath)

      console.log('✅ Store: Imagem upload com sucesso:', publicUrl)
      return publicUrl

    } catch (error) {
      console.error('💥 Store: Erro crítico no upload da imagem:', error)
      throw error
    }
  }

  // --- Funções auxiliares ---
  const buscarPorNome = (nome) => {
    return itens.value.filter(colab => 
      colab.nome?.toLowerCase().includes(nome.toLowerCase())
    )
  }

  const buscarPorRamo = (ramo) => {
    return itens.value.filter(parceiro => 
      parceiro.ramo?.toLowerCase().includes(ramo.toLowerCase())
    )
  }

  const ramosDisponiveis = computed(() => {
    const ramos = itens.value
      .map(parceiro => parceiro.ramo)
      .filter(Boolean)
    return [...new Set(ramos)]
  })

  return {
    // State
    itens,
    loading,
    error,
    
    // Getters (padrão notícias)
    parceiros,
    parceirosAtivos,
    parceirosHome,
    ramosDisponiveis,
    
    // Actions
    carregarColaboradores,
    carregarColaboradorPorId,
    salvarColaborador,
    excluirColaborador,
    uploadImagem,
    
    // Funções auxiliares
    buscarPorNome,
    buscarPorRamo
  }
})