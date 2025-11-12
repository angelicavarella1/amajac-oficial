// src/modules/galeria/composables/useAdminGaleria.js
import { useCRUD } from '@/modules/base/composables/useCRUD'
// CORREÇÃO: Importar funções diretamente
import { upload, remove, BUCKETS } from '@/core/services/ImageService'

/**
 * Composable padronizado para gestão de galeria de imagens
 */
export function useAdminGaleria() {
  const crud = useCRUD('galeria')

  /**
   * Extrai o caminho do arquivo (relativo ao bucket) da URL pública.
   * Ex: De '.../storage/v1/object/public/galeria/nome_do_arquivo.png'
   * Retorna 'nome_do_arquivo.png'
   *
   * NOTA: Este método funciona bem se o arquivo estiver na raiz do bucket.
   * Se você usa subpastas (ex: galeria/festas/arquivo.png), use um método mais robusto.
   */
  const extractFilePath = (imageUrl) => {
    if (!imageUrl) return null
    try {
      // Cria um objeto URL para analisar o caminho (pathname)
      const urlObj = new URL(imageUrl)
      const pathParts = urlObj.pathname.split('/')
      // O caminho relevante é geralmente a última parte
      return pathParts[pathParts.length - 1]
    } catch (e) {
      // Se não for uma URL válida, assume que já é o path
      return imageUrl.split('/').pop()
    }
  }

  /**
   * Cria um novo item na galeria
   */
  const createItem = async (data, imagemFile = null) => {
    try {
      let imageUrl = data.imagem_url

      // Se há um arquivo, faz upload
      if (imagemFile) {
        // CORREÇÃO: Usar função upload diretamente
        imageUrl = await upload(BUCKETS.GALERIA, imagemFile)
        if (!imageUrl) {
          crud.error.value = 'Falha no upload da imagem.'
          return null
        }
      }

      if (!imageUrl) {
        crud.error.value = 'Imagem é obrigatória para a galeria.'
        return null
      }

      // Prepara dados
      const itemData = {
        titulo: data.titulo || '',
        descricao: data.descricao || '',
        categoria: data.categoria || 'geral',
        imagem_url: imageUrl,
        imagem_alt: data.imagem_alt?.trim() || data.titulo?.trim() || 'Imagem da galeria'
      }

      const novoItem = await crud.create(itemData)
      if (novoItem) {
        crud.items.value.unshift(novoItem)
      }
      return novoItem

    } catch (error) {
      console.error('Erro ao criar item:', error)
      crud.error.value = 'Erro ao criar item na galeria.'
      return null
    }
  }

  /**
   * Atualiza um item existente
   */
  const updateItem = async (id, data, novaImagemFile = null) => {
    try {
      let imageUrl = data.imagem_url

      // Se há nova imagem, faz upload e remove a antiga
      if (novaImagemFile) {
        // Remove imagem antiga se existir
        const itemAntigo = crud.items.value.find(item => item.id === id)
        if (itemAntigo?.imagem_url) {
          const filePath = extractFilePath(itemAntigo.imagem_url)
          if (filePath) {
            // CORREÇÃO: Usar função remove diretamente
            await remove(BUCKETS.GALERIA, filePath)
          }
        }

        // Upload da nova imagem
        // CORREÇÃO: Usar função upload diretamente
        imageUrl = await upload(BUCKETS.GALERIA, novaImagemFile)
        if (!imageUrl) {
          crud.error.value = 'Falha no upload da nova imagem.'
          return null
        }
      }

      // Prepara dados
      const updateData = {
        titulo: data.titulo || '',
        descricao: data.descricao || '',
        categoria: data.categoria || 'geral',
        imagem_url: imageUrl,
        imagem_alt: data.imagem_alt?.trim() || data.titulo?.trim() || 'Imagem da galeria'
      }

      const itemAtualizado = await crud.update(id, updateData)
      if (itemAtualizado) {
        const index = crud.items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          crud.items.value[index] = itemAtualizado
        }
      }
      return itemAtualizado

    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      crud.error.value = 'Erro ao atualizar item na galeria.'
      return null
    }
  }

  /**
   * Remove um item (e sua imagem)
   */
  const deleteItem = async (id) => {
    try {
      const item = crud.items.value.find(i => i.id === id)
      
      // Remove imagem do storage
      if (item?.imagem_url) {
        const filePath = extractFilePath(item.imagem_url)
        if (filePath) {
          // CORREÇÃO: Usar função remove diretamente
          await remove(BUCKETS.GALERIA, filePath)
        }
      }

      return await crud.remove(id)
    } catch (error) {
      console.error('Erro ao deletar item:', error)
      crud.error.value = 'Erro ao deletar item da galeria.'
      return false
    }
  }

  return {
    // Estados
    loading: crud.loading,
    error: crud.error,
    itens: crud.items,

    // Métodos CRUD
    getAll: crud.getAll,
    getById: crud.getById,
    createItem,
    updateItem,
    deleteItem
  }
}