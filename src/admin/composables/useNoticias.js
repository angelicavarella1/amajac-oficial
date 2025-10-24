import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'

export function useNoticias() {
  const uiStore = useUIStore()
  const noticias = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Simulação de dados - substitua pela sua API real
  const noticiasMock = [
    {
      id: 1,
      titulo: 'Primeira Notícia de Exemplo',
      resumo: 'Esta é uma notícia de exemplo para demonstrar o funcionamento do sistema.',
      conteudo: 'Conteúdo completo da primeira notícia de exemplo...',
      imagem_url: '/placeholder-news.jpg',
      autor: 'AMAJAC',
      data_publicacao: new Date().toISOString(),
      ativo: true,
      destaque: true,
      visualizacoes: 150,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      titulo: 'Segunda Notícia de Teste',
      resumo: 'Outra notícia para testar a listagem e filtros.',
      conteudo: 'Conteúdo completo da segunda notícia...',
      imagem_url: '/placeholder-news.jpg',
      autor: 'Administrador',
      data_publicacao: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      ativo: true,
      destaque: false,
      visualizacoes: 75,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]

  const fetchNoticias = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Substituir pela chamada real da API
      // const response = await fetch('/api/noticias')
      // if (!response.ok) throw new Error('Erro ao carregar notícias')
      // noticias.value = await response.json()
      
      // Usando dados mock por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula delay
      noticias.value = noticiasMock
      return noticias.value
    } catch (err) {
      error.value = err.message
      uiStore.showToast('Erro ao carregar notícias', 'error')
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchNoticia = async (id) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Substituir pela chamada real da API
      // const response = await fetch(`/api/noticias/${id}`)
      // if (!response.ok) throw new Error('Erro ao carregar notícia')
      // return await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const noticia = noticiasMock.find(n => n.id === parseInt(id))
      if (!noticia) throw new Error('Notícia não encontrada')
      return noticia
    } catch (err) {
      error.value = err.message
      uiStore.showToast('Erro ao carregar notícia', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const createNoticia = async (noticiaData) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Substituir pela chamada real da API
      // const response = await fetch('/api/noticias', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(noticiaData)
      // })
      // if (!response.ok) throw new Error('Erro ao criar notícia')
      // const novaNoticia = await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      const novaNoticia = {
        ...noticiaData,
        id: Math.max(...noticiasMock.map(n => n.id)) + 1,
        visualizacoes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      noticias.value.push(novaNoticia)
      uiStore.showToast('Notícia criada com sucesso!', 'success')
      return novaNoticia
    } catch (err) {
      error.value = err.message
      uiStore.showToast('Erro ao criar notícia', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateNoticia = async (id, noticiaData) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Substituir pela chamada real da API
      // const response = await fetch(`/api/noticias/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(noticiaData)
      // })
      // if (!response.ok) throw new Error('Erro ao atualizar notícia')
      // const noticiaAtualizada = await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = noticias.value.findIndex(n => n.id === parseInt(id))
      if (index !== -1) {
        noticias.value[index] = {
          ...noticias.value[index],
          ...noticiaData,
          updated_at: new Date().toISOString()
        }
        uiStore.showToast('Notícia atualizada com sucesso!', 'success')
        return noticias.value[index]
      }
      throw new Error('Notícia não encontrada')
    } catch (err) {
      error.value = err.message
      uiStore.showToast('Erro ao atualizar notícia', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteNoticia = async (id) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Substituir pela chamada real da API
      // const response = await fetch(`/api/noticias/${id}`, {
      //   method: 'DELETE'
      // })
      // if (!response.ok) throw new Error('Erro ao excluir notícia')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      noticias.value = noticias.value.filter(n => n.id !== parseInt(id))
      uiStore.showToast('Notícia excluída com sucesso!', 'success')
      return true
    } catch (err) {
      error.value = err.message
      uiStore.showToast('Erro ao excluir notícia', 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  const alterarStatusNoticia = async (id, ativo) => {
    return await updateNoticia(id, { ativo })
  }

  return {
    noticias,
    loading,
    error,
    fetchNoticias,
    fetchNoticia,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    alterarStatusNoticia
  }
}