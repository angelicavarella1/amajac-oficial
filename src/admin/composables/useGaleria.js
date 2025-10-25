import { ref, computed } from 'vue'
import { supabase } from '@/supabase'
import { useUIStore } from '@/stores/ui'

export function useGaleria(admin = false) {
  const imagens = ref([])
  const imagem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // 🖼️ BUSCAR GALERIA
  const fetchGaleria = async (forceRefresh = false) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Buscando galeria do Supabase...')
      
      const { data, error: supabaseError } = await supabase
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        console.error('❌ Erro ao buscar galeria:', supabaseError)
        throw supabaseError
      }

      imagens.value = data || []
      console.log(`✅ ${data?.length || 0} imagens carregadas`)
      return data

    } catch (err) {
      console.error('❌ Erro ao carregar galeria:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar galeria', 'error')
      return []
    } finally {
      loading.value = false
    }
  }

  // 🖼️ ADICIONAR IMAGEM (CORRIGIDA para estrutura da sua tabela)
  const adicionarImagem = async (dadosImagem) => {
    loading.value = true
    error.value = null

    try {
      console.log('💾 Salvando imagem na tabela galeria...', dadosImagem)

      // 🔥 CORREÇÃO: Estrutura correta da sua tabela galeria
      const { data, error: supabaseError } = await supabase
        .from('galeria')
        .insert([{
          titulo: dadosImagem.titulo,
          descricao: dadosImagem.descricao,
          imagem_url: dadosImagem.url, // ✅ Coluna correta: imagem_url
          categoria: 'geral', // ✅ Valor padrão
          imagem_alt: dadosImagem.titulo, // ✅ Usar título como alt
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ Erro ao salvar na tabela galeria:', supabaseError)
        throw supabaseError
      }

      console.log('✅ Imagem salva na tabela galeria:', data)
      
      // Adicionar à lista local
      imagens.value.unshift(data)
      
      uiStore.showToast('Imagem adicionada com sucesso!', 'success')
      return data

    } catch (err) {
      console.error('❌ Erro completo ao adicionar imagem:', err)
      error.value = err.message
      uiStore.showToast('Erro na operação. Tente novamente.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🖼️ DELETAR IMAGEM
  const deletarImagem = async (id) => {
    loading.value = true
    error.value = null

    try {
      // Buscar imagem para obter info do arquivo
      const imagemParaDeletar = imagens.value.find(i => i.id === id)
      
      if (!imagemParaDeletar) {
        throw new Error('Imagem não encontrada')
      }

      // Deletar do storage se tiver URL
      if (imagemParaDeletar.imagem_url) {
        try {
          // Extrair caminho do arquivo da URL
          const urlParts = imagemParaDeletar.imagem_url.split('/')
          const fileName = urlParts[urlParts.length - 1]
          const bucket = 'galeria' // Seu bucket correto
          
          const { error: storageError } = await supabase.storage
            .from(bucket)
            .remove([`galeria/${fileName}`])

          if (storageError) {
            console.error('⚠️ Erro ao deletar do storage:', storageError)
            // Continua mesmo com erro no storage
          }
        } catch (storageErr) {
          console.error('⚠️ Erro ao tentar deletar do storage:', storageErr)
        }
      }

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('galeria')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // Remover da lista local
      imagens.value = imagens.value.filter(i => i.id !== id)
      
      uiStore.showToast('Imagem excluída com sucesso!', 'success')

    } catch (err) {
      console.error('❌ Erro ao excluir imagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir imagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🖼️ ATUALIZAR IMAGEM
  const atualizarImagem = async (id, dadosAtualizados) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('galeria')
        .update({
          ...dadosAtualizados,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      const index = imagens.value.findIndex(i => i.id === id)
      if (index !== -1) {
        imagens.value[index] = data
      }

      uiStore.showToast('Imagem atualizada com sucesso!', 'success')
      return data

    } catch (err) {
      console.error('❌ Erro ao atualizar imagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar imagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🖼️ COMPUTED
  const imagensAtivas = computed(() => {
    return imagens.value
  })

  return {
    // Estado
    imagens,
    imagem,
    loading,
    error,
    
    // Computed
    imagensAtivas,
    
    // Métodos
    fetchGaleria,
    adicionarImagem,
    atualizarImagem,
    deletarImagem
  }
}