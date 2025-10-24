// src/admin/composables/useNoticias.js
import { ref } from 'vue'
import { adminApi } from '@/supabase/admin' // Importação correta: adminApi
import { useUIStore } from '@/stores/ui'

export function useNoticias() {
  const uiStore = useUIStore()
  const noticias = ref([])
  const noticia = ref(null) // Para armazenar uma notícia individual (detalhe)
  const loading = ref(false)
  const error = ref(null)

  // 🔥 CARREGAR NOTÍCIAS (Renomeado para fetchNoticias para consistência com o store)
  const fetchNoticias = async (forceRefresh = false) => {
    loading.value = true
    error.value = null
    try {
      console.log('📰 Carregando notícias do banco...')

      // 🔧 CHAMADA REAL PARA O SUPABASE VIA adminApi
      const dados = await adminApi.noticias.getAll()

      noticias.value = dados
      console.log(`✅ ${dados.length} notícias carregadas`)
      return dados
    } catch (err) {
      console.error('❌ Erro ao carregar notícias:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar notícias', 'error')
      return []
    } finally {
      loading.value = false
    }
  }

  // 🔥 CARREGAR NOTÍCIA POR ID (Renomeado de fetchNoticia para carregarNoticiaPorId)
  const carregarNoticiaPorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔍 Buscando notícia com ID: ${id}`)

      // 🔧 CHAMADA REAL PARA O SUPABASE VIA adminApi
      const noticiaEncontrada = await adminApi.noticias.getById(id)

      if (!noticiaEncontrada) {
        throw new Error('Notícia não encontrada')
      }

      noticia.value = noticiaEncontrada
      console.log('✅ Notícia carregada:', noticiaEncontrada)
      return noticiaEncontrada
    } catch (err) {
      console.error('❌ Erro ao carregar notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar notícia', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  // 🔥 CRIAR NOTÍCIA
  const criarNoticia = async (noticiaData) => {
    loading.value = true
    error.value = null
    try {
      console.log('📝 Criando nova notícia...')

      // 🔧 CHAMADA REAL PARA O SUPABASE VIA adminApi
      const novaNoticia = await adminApi.noticias.create(noticiaData)

      // Atualizar cache local
      noticias.value.unshift(novaNoticia)
      uiStore.showToast('Notícia criada com sucesso!', 'success')
      return novaNoticia
    } catch (err) {
      console.error('❌ Erro ao criar notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao criar notícia', 'error')
      throw err // Re-lança para o componente tratar
    } finally {
      loading.value = false
    }
  }

  // 🔥 ATUALIZAR NOTÍCIA
  const atualizarNoticia = async (id, noticiaData) => {
    loading.value = true
    error.value = null
    try {
      console.log(`✏️ Atualizando notícia com ID: ${id}`)

      // 🔧 CHAMADA REAL PARA O SUPABASE VIA adminApi
      const noticiaAtualizada = await adminApi.noticias.update(id, noticiaData)

      // Atualizar cache local
      const index = noticias.value.findIndex(n => n.id === id)
      if (index !== -1) {
        noticias.value[index] = noticiaAtualizada
      }

      // Atualizar notícia individual se for a mesma sendo editada
      if (noticia.value && noticia.value.id === id) {
        noticia.value = noticiaAtualizada
      }

      uiStore.showToast('Notícia atualizada com sucesso!', 'success')
      return noticiaAtualizada
    } catch (err) {
      console.error('❌ Erro ao atualizar notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar notícia', 'error')
      throw err // Re-lança para o componente tratar
    } finally {
      loading.value = false
    }
  }

  // 🔥 DELETAR NOTÍCIA
  const deletarNoticia = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🗑️ Deletando notícia com ID: ${id}`)

      // 🔧 CHAMADA REAL PARA O SUPABASE VIA adminApi
      await adminApi.noticias.delete(id)

      // Atualizar cache local
      noticias.value = noticias.value.filter(n => n.id !== id)

      // Limpar notícia individual se for a mesma sendo deletada
      if (noticia.value && noticia.value.id === id) {
        noticia.value = null
      }

      uiStore.showToast('Notícia excluída com sucesso!', 'success')
      return true
    } catch (err) {
      console.error('❌ Erro ao excluir notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir notícia', 'error')
      throw err // Re-lança para o componente tratar
    } finally {
      loading.value = false
    }
  }

  // 🔥 ALTERAR STATUS (Ativo/Inativo)
  const alterarStatusNoticia = async (id, ativo) => {
    try {
      console.log(`🔄 Alterando status da notícia ${id} para ${ativo ? 'ativo' : 'inativo'}`)
      // Supondo que adminApi.noticias.update também atualize o campo 'ativo'
      const noticiaAtualizada = await atualizarNoticia(id, { ativo })
      return noticiaAtualizada
    } catch (err) {
      console.error(`❌ Erro ao alterar status da notícia ${id}:`, err)
      throw err
    }
  }

  // 🔥 ALTERAR DESTAQUE
  const alterarDestaqueNoticia = async (id, destaque) => {
    try {
      console.log(`⭐ Alterando destaque da notícia ${id} para ${destaque ? 'destaque' : 'não destaque'}`)
      // Supondo que adminApi.noticias.update também atualize o campo 'destaque'
      const noticiaAtualizada = await atualizarNoticia(id, { destaque })
      return noticiaAtualizada
    } catch (err) {
      console.error(`❌ Erro ao alterar destaque da notícia ${id}:`, err)
      throw err
    }
  }

  return {
    // Estado
    noticias,
    noticia, // Adicionado
    loading,
    error,
    // Ações
    fetchNoticias, // Renomeado
    carregarNoticiaPorId, // Renomeado
    criarNoticia, // Renomeado
    atualizarNoticia, // Renomeado
    deletarNoticia, // Renomeado
    alterarStatusNoticia,
    alterarDestaqueNoticia // Adicionado
  }
}