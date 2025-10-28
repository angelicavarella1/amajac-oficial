// src/admin/composables/useNoticias.js - VERSÃO CORRIGIDA
import { ref } from 'vue'
import { supabase } from '@/supabase/client.js'
import { useUIStore } from '@/shared/stores/ui'

export function useNoticias() {
  const uiStore = useUIStore()
  const noticias = ref([])
  const noticia = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 📥 CARREGAR NOTÍCIAS
  const fetchNoticias = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('🔄 Carregando notícias do banco...')

      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .select('*')
        .order('data_publicacao', { ascending: false })

      if (supabaseError) throw supabaseError

      noticias.value = data || []
      console.log(`✅ ${data?.length || 0} notícias carregadas`)
      return data
    } catch (err) {
      console.error('❌ Erro ao carregar notícias:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar notícias', 'error')
      return []
    } finally {
      loading.value = false
    }
  }

  // 🔍 CARREGAR NOTÍCIA POR ID
  const carregarNoticiaPorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔍 Buscando notícia com ID: ${id}`)

      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) throw supabaseError

      if (!data) {
        throw new Error('Notícia não encontrada')
      }

      noticia.value = data
      console.log('✅ Notícia carregada:', data)
      return data
    } catch (err) {
      console.error('❌ Erro ao carregar notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar notícia', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  // 📝 CRIAR NOTÍCIA
  const criarNoticia = async (noticiaData) => {
    loading.value = true
    error.value = null
    try {
      console.log('📝 Criando nova notícia...')

      const dadosCompletos = {
        ...noticiaData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .insert([dadosCompletos])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar cache local
      noticias.value.unshift(data)
      uiStore.showToast('Notícia criada com sucesso!', 'success')
      console.log('✅ Notícia criada com sucesso')
      return data
    } catch (err) {
      console.error('❌ Erro ao criar notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao criar notícia', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✏️ ATUALIZAR NOTÍCIA
  const atualizarNoticia = async (id, noticiaData) => {
    loading.value = true
    error.value = null
    try {
      console.log(`✏️ Atualizando notícia com ID: ${id}`)

      const dadosAtualizados = {
        ...noticiaData,
        updated_at: new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .update(dadosAtualizados)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar cache local
      const index = noticias.value.findIndex(n => n.id === id)
      if (index !== -1) {
        noticias.value[index] = data
      }

      // Atualizar notícia individual se for a mesma sendo editada
      if (noticia.value && noticia.value.id === id) {
        noticia.value = data
      }

      uiStore.showToast('Notícia atualizada com sucesso!', 'success')
      console.log('✅ Notícia atualizada com sucesso')
      return data
    } catch (err) {
      console.error('❌ Erro ao atualizar notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar notícia', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🗑️ DELETAR NOTÍCIA
  const deletarNoticia = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🗑️ Deletando notícia com ID: ${id}`)

      const { error: supabaseError } = await supabase
        .from('noticias')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      // Atualizar cache local
      noticias.value = noticias.value.filter(n => n.id !== id)

      // Limpar notícia individual se for a mesma sendo deletada
      if (noticia.value && noticia.value.id === id) {
        noticia.value = null
      }

      uiStore.showToast('Notícia excluída com sucesso!', 'success')
      console.log('✅ Notícia excluída com sucesso')
      return true
    } catch (err) {
      console.error('❌ Erro ao excluir notícia:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir notícia', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔄 ALTERAR STATUS (Ativo/Inativo)
  const alterarStatusNoticia = async (id, ativo) => {
    try {
      console.log(`🔄 Alterando status da notícia ${id} para ${ativo ? 'ativo' : 'inativo'}`)
      const noticiaAtualizada = await atualizarNoticia(id, { ativo })
      return noticiaAtualizada
    } catch (err) {
      console.error(`❌ Erro ao alterar status da notícia ${id}:`, err)
      throw err
    }
  }

  // ⭐ ALTERAR DESTAQUE
  const alterarDestaqueNoticia = async (id, destaque) => {
    try {
      console.log(`⭐ Alterando destaque da notícia ${id} para ${destaque ? 'destaque' : 'não destaque'}`)
      const noticiaAtualizada = await atualizarNoticia(id, { destaque })
      return noticiaAtualizada
    } catch (err) {
      console.error(`❌ Erro ao alterar destaque da notícia ${id}:`, err)
      throw err
    }
  }

  // 🖼️ UPLOAD DE IMAGEM DA NOTÍCIA
  const uploadImagemNoticia = async (file, idNoticia) => {
    try {
      console.log('🖼️ Iniciando upload de imagem da notícia...')

      if (!file || !idNoticia) {
        throw new Error('Arquivo ou ID da notícia não informado')
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
      if (!tiposPermitidos.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.')
      }

      const timestamp = Date.now()
      const extensao = file.name.split('.').pop()
      const nomeArquivo = `noticia-${idNoticia}-${timestamp}.${extensao}`
      const caminho = `noticias/${nomeArquivo}`

      console.log('📤 Fazendo upload para:', caminho)

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(caminho, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(caminho)

      console.log('✅ Upload concluído:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (err) {
      console.error('❌ Erro no upload de imagem:', err)
      throw err
    }
  }

  // 📊 OBTER ESTATÍSTICAS
  const obterEstatisticas = () => {
    const total = noticias.value.length
    const ativas = noticias.value.filter(n => n.ativo).length
    const emDestaque = noticias.value.filter(n => n.destaque).length

    return {
      total,
      ativas,
      emDestaque,
      inativas: total - ativas
    }
  }

  return {
    // Estado
    noticias,
    noticia,
    loading,
    error,

    // Métodos
    fetchNoticias,
    carregarNoticiaPorId,
    criarNoticia,
    atualizarNoticia,
    deletarNoticia,
    alterarStatusNoticia,
    alterarDestaqueNoticia,
    uploadImagemNoticia,
    obterEstatisticas
  }
}