// src/modules/parceiros/composables/useAdminParceiros.js
import { useCRUD } from '@/modules/base/composables/useCRUD'
import { useImageHandler } from '@/modules/base/composables/useImageHandler'

/**
 * Composable padronizado para gestão de parceiros comerciais
 * - Tabela: 'parceiros_comerciais'
 * - Bucket: 'logos'
 * - Campos suportados: nome, tipo, logo_url, telefone, endereco, cnpj, email_contato,
 *                      ramo, status, descricao_curta, link_site, facebook, instagram, tags
 */
export function useAdminParceiros() {
  // CRUD genérico para a tabela 'parceiros_comerciais'
  const crud = useCRUD('parceiros_comerciais')
  
  // Handler de imagens para o bucket 'logos'
  const imageHandler = useImageHandler('logos')

  /**
   * Cria um novo parceiro
   * @param {Object} parceiroData
   * @param {File} [logoFile]
   * @returns {Promise<Object|null>}
   */
  const createParceiro = async (parceiroData, logoFile = null) => {
    if (logoFile) {
      const logoUrl = await imageHandler.uploadImage(logoFile)
      if (!logoUrl) {
        crud.error.value = 'Falha no upload do logo'
        return null
      }
      parceiroData.logo_url = logoUrl
    }

    const novoParceiro = await crud.create(parceiroData)
    if (novoParceiro) {
      crud.items.value.unshift(novoParceiro)
    }
    return novoParceiro
  }

  /**
   * Atualiza um parceiro existente
   * @param {string} id
   * @param {Object} parceiroData
   * @param {File} [novaLogoFile]
   * @returns {Promise<Object|null>}
   */
  const updateParceiro = async (id, parceiroData, novaLogoFile = null) => {
    if (novaLogoFile) {
      const novaUrl = await imageHandler.uploadImage(novaLogoFile)
      if (!novaUrl) {
        crud.error.value = 'Falha no upload do novo logo'
        return null
      }

      // Remove logo antigo se existir
      if (parceiroData.logo_url) {
        await imageHandler.removeImage(parceiroData.logo_url)
      }

      parceiroData.logo_url = novaUrl
    }

    const parceiroAtualizado = await crud.update(id, parceiroData)
    if (parceiroAtualizado) {
      const index = crud.items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        crud.items.value[index] = parceiroAtualizado
      }
    }
    return parceiroAtualizado
  }

  /**
   * Remove um parceiro (e seu logo)
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  const deleteParceiro = async (id) => {
    const parceiro = crud.items.value.find(item => item.id === id)
    const logoUrl = parceiro?.logo_url

    if (logoUrl) {
      await imageHandler.removeImage(logoUrl)
    }

    return await crud.remove(id)
  }

  return {
    // Estados
    loading: crud.loading,
    error: crud.error,
    parceiros: crud.items,

    // CRUD
    getAll: crud.getAll,
    getById: crud.getById,
    createParceiro,
    updateParceiro,
    deleteParceiro,

    // Imagem
    uploadImage: imageHandler.uploadImage,
    removeImage: imageHandler.removeImage
  }
}