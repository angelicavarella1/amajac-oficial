// src/core/services/ImageService.js
import { supabase } from '@/core/utils/supabaseClient'

// Mapeamento de buckets
export const BUCKETS = {
  NOTICIAS: 'noticias',
  EVENTOS: 'eventos',
  GALERIA: 'galeria',
  LOGOS: 'logos',
  COLABORADORES: 'colaboradores',
  IMAGENS: 'imagens'
}

// função de sanitização
export function sanitizeFileName(filename) {
  if (!filename) return `${Date.now()}.bin`
  
  let name = filename
  let extension = ''
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex !== -1 && lastDotIndex < filename.length - 1) {
    name = filename.substring(0, lastDotIndex)
    extension = filename.substring(lastDotIndex + 1)
    if (!/^[a-zA-Z0-9]{2,10}$/i.test(extension)) extension = 'bin'
  } else {
    extension = 'bin'
  }

  let sanitized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
    .substring(0, 50)

  if (!sanitized) sanitized = 'arquivo'
  return `${Date.now()}_${sanitized}.${extension}`
}

// função de upload
export async function upload(bucketName, file, customPath = null) {
  if (!file) return null
  try {
    const fileName = customPath || sanitizeFileName(file.name)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true })
    
    if (error) {
      console.error(`Erro ao fazer upload no bucket ${bucketName}:`, error)
      return null
    }

    const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path)

    return publicUrl?.publicUrl || null
  } catch (error) {
    console.error('Erro inesperado no upload:', error)
    return null
  }
}

// função de remoção
export async function remove(bucketName, filePath) {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    return !error
  } catch (error) {
    console.error('Erro ao remover imagem:', error)
    return false
  }
}

// função para obter URL pública
export function getUrl(bucketName, filePath) {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)
  return data?.publicUrl || ''
}

// Exportação padrão com todas as funções
export default {
  BUCKETS,
  upload,
  remove,
  getUrl,
  sanitizeFileName
}