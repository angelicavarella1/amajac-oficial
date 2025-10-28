// src/admin/composables/useGaleria.js - VERSÃO CORRIGIDA
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client.js' // Importação direta do client.js correta
import { useUIStore } from '@/shared/stores/ui' // ← CORRIGIDO: removida a barra invertida

export function useGaleria() { // ✅ Removido parâmetro não usado
  const imagens = ref([])
  const imagem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  // Assumindo que useUIStore está disponível e tem showToast
  // Se useUIStore não estiver definido, isso causará um erro em tempo de execução
  // Mas manteremos a estrutura do código conforme fornecido.
  const uiStore = useUIStore()

  // BUSCAR GALERIA
  const fetchGaleria = async () => { // ✅ Removido parâmetro não usado
    loading.value = true
    error.value = null

    try {
      console.log(' 📸 Buscando galeria do Supabase...')

      const { data, error: supabaseError } = await supabase
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        console.error(' ❌ Erro ao buscar galeria:', supabaseError)
        throw supabaseError
      }

      imagens.value = data || []
      console.log(` ✅ ${data?.length || 0} imagens carregadas`)
      return data

    } catch (err) {
      console.error(' ❌ Erro ao carregar galeria:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar galeria', 'error')
      return []
    } finally {
      loading.value = false
    }
  }

  // ADICIONAR IMAGEM (CORRIGIDA para estrutura da sua tabela)
  const adicionarImagem = async (dadosImagem) => {
    loading.value = true
    error.value = null

    try {
      console.log(' 💾 Salvando imagem na tabela galeria...', dadosImagem)

      // Estrutura correta da sua tabela galeria
      const { data, error: supabaseError } = await supabase
        .from('galeria')
        .insert([{
          titulo: dadosImagem.titulo,
          descricao: dadosImagem.descricao,
          imagem_url: dadosImagem.url, // Coluna correta: imagem_url
          categoria: 'geral', // Valor padrão
          imagem_alt: dadosImagem.titulo, // Usar título como alt
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (supabaseError) {
        console.error(' ❌ Erro ao salvar na tabela galeria:', supabaseError)
        throw supabaseError
      }

      console.log(' ✅ Imagem salva na tabela galeria:', data)

      // Adicionar a lista local
      imagens.value.unshift(data)

      uiStore.showToast('Imagem adicionada com sucesso!', 'success')
      return data

    } catch (err) {
      console.error(' ❌ Erro completo ao adicionar imagem:', err)
      error.value = err.message
      uiStore.showToast('Erro na operação. Tente novamente.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETAR IMAGEM
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
          // Extrair caminho do arquivo da URL. Isso é um palpite baseado em como o Supabase gera URLs.
          // Ex: .../storage/v1/object/public/bucket/pasta/nome_do_arquivo
          // Aqui, estamos assumindo que o caminho do arquivo é "pasta/nome_do_arquivo" ou similar.
          // Simplificamos para extrair o nome do arquivo, mas a API de Storage geralmente precisa do caminho completo dentro do bucket.
          // Baseado no seu código, a remoção está tentando `galeria/nome_do_arquivo`, o que implica que a URL é gerada a partir de `supabase.storage.from('galeria').upload('galeria/nome_do_arquivo', ...)`
          
          const urlParts = imagemParaDeletar.imagem_url.split('/')
          // O caminho do arquivo é o que vem depois do nome do bucket ('galeria') na URL de armazenamento
          // Assumindo que a URL tem a estrutura: .../storage/v1/object/public/bucket_name/path/to/file
          // Vamos tentar extrair o path que é usado na função `.remove()`
          
          let caminhoCompleto = null;
          const publicIndex = urlParts.indexOf('public');
          if (publicIndex !== -1 && urlParts.length > publicIndex + 2) {
              // ✅ CORREÇÃO: Removida variável não usada
              // O caminho é tudo depois do nome do bucket
              caminhoCompleto = urlParts.slice(publicIndex + 2).join('/');
          }
          
          const bucket = 'galeria' // Seu bucket correto

          if (caminhoCompleto) {
              console.log(` 🗑️ Tentando remover do storage: ${bucket}/${caminhoCompleto}`)
              const { error: storageError } = await supabase.storage
                  .from(bucket)
                  .remove([caminhoCompleto])

              if (storageError) {
                  console.error(' ❌ Erro ao deletar do storage:', storageError)
                  // Continua mesmo com erro no storage
              }
          } else {
              // Tentativa de fallback do seu código original (usando o último segmento)
              const fileName = urlParts[urlParts.length - 1];
              console.log(` 🔄 Fallback: Tentando remover do storage: ${bucket}/${fileName}`)
              const { error: storageErrorFallback } = await supabase.storage
                  .from(bucket)
                    .remove([`galeria/${fileName}`])

                  if (storageErrorFallback) {
                      console.error(' ❌ Erro ao deletar do storage (fallback):', storageErrorFallback)
                  }
          }
        } catch (storageErr) {
          console.error(' ❌ Erro ao tentar deletar do storage:', storageErr)
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
      console.error(' ❌ Erro ao excluir imagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir imagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ATUALIZAR IMAGEM
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
      console.error(' ❌ Erro ao atualizar imagem:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar imagem', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // COMPUTED
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