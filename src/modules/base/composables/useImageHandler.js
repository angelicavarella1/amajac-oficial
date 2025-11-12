// src/modules/base/composables/useImageHandler.js
import { ref } from 'vue'
// CORREÇÃO: Caminho correto baseado na estrutura do projeto
import { upload, remove, BUCKETS } from '@/core/services/ImageService'

/**
 * Manipulação de imagens com upload/remoção e estados
 * @param {string} bucketName - Nome do bucket (ex: 'noticias', 'eventos')
 * @returns {Object} { uploadImage, removeImage, uploadProgress, error }
 */
export function useImageHandler(bucketName) {
  const uploadProgress = ref(0)
  const error = ref(null)

  const uploadImage = async (file) => {
    if (!file) return null
    error.value = null
    try {
      // A função upload já retorna a URL pública
      const publicUrl = await upload(bucketName, file)
      if (!publicUrl) throw new Error('Falha no upload')
      return publicUrl
    } catch (err) {
      error.value = err.message || 'Erro no upload da imagem'
      console.error(`Erro no upload para bucket ${bucketName}:`, err)
      return null
    }
  }

  const removeImage = async (imageUrl) => {
    if (!imageUrl) return false
    error.value = null

    try {
      // Extrai o caminho do arquivo da URL
      const url = new URL(imageUrl)
      // Esta lógica é crucial para o Supabase: extrai o caminho relativo ao bucket.
      const path = url.pathname.split('/').slice(4).join('/') 

      const success = await remove(bucketName, path)
      if (!success) throw new Error('Falha na remoção')
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao remover imagem'
      console.error(`Erro ao remover imagem do bucket ${bucketName}:`, err)
      return false
    }
  }

  return {
    uploadImage,
    removeImage,
    uploadProgress,
    error: error
  }
}