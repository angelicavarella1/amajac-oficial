// src/admin/composables/useImageUpload.js - VERSÃO CORRIGIDA
import { ref } from 'vue'
import { supabase } from '@/supabase/client.js' // Importação direta do client.js correta
import { useUIStore } from '@/shared/stores/ui' // ← CORRIGIDO: removida a barra invertida

export function useImageUpload() {
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref(null)
  const uiStore = useUIStore()

  // Buckets confirmados que existem
  const BUCKETS = {
    GALERIA: 'galeria',
    NOTICIAS: 'noticias',
    EVENTOS: 'eventos',
    COLABORADORES: 'colaboradores',
    LOGOS: 'logos',
    IMAGENS: 'imagens'
  }

  // Validação simples e eficaz
  const validarImagem = (file) => {
    if (!file) {
      throw new Error('Nenhum arquivo selecionado.')
    }

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!tiposPermitidos.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.')
    }

    const tamanhoMaximo = 5 * 1024 * 1024 // 5MB
    if (file.size > tamanhoMaximo) {
      throw new Error(`Arquivo muito grande. Máximo: 5MB. Seu arquivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }

    return true
  }

  // Compressão otimizada para evitar timeout
  const comprimirImagem = (file) => {
    return new Promise((resolve) => {
      // Não comprimir arquivos pequenos
      if (file.size < 500 * 1024) {
        resolve(file)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Redimensionar mantendo aspect ratio
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 1200

          let { width, height } = img

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height

          ctx.drawImage(img, 0, 0, width, height)

          // Converter para JPEG (menor que PNG)
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: 'image/jpeg',
                lastModified: Date.now()
              })

              console.log(` Compressão: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
              resolve(compressedFile)
            },
            'image/jpeg',
            0.8 // Qualidade 80%
          )
        }

        img.onerror = () => {
          console.warn(' Erro na compressão, usando original')
          resolve(file)
        }

        img.src = e.target.result
      }

      reader.onerror = () => {
        console.warn(' Erro no FileReader, usando original')
        resolve(file)
      }

      reader.readAsDataURL(file)
    })
  }

  // UPLOAD PRINCIPAL - Corrigido e testado
  const uploadImagem = async (file, bucketName = 'galeria') => {
    uploading.value = true
    progress.value = 0
    error.value = null

    try {
      console.log(' 📤 INICIANDO UPLOAD...')

      // 1. Validação
      validarImagem(file)
      console.log(' ✅ Arquivo validado')

      // 2. Comprimir se necessário
      let arquivoParaUpload = file
      if (file.size > 1 * 1024 * 1024) {
        console.log(' 🔄 Comprimindo imagem...')
        arquivoParaUpload = await comprimirImagem(file)
      }

      // 3. Gerar nome único
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 10)
      const extensao = arquivoParaUpload.type === 'image/png' ? 'png' : 'jpg'
      const nomeArquivo = `${timestamp}-${randomId}.${extensao}`

      console.log(' 📋 Informações do upload:', {
        bucket: bucketName,
        arquivo: nomeArquivo,
        tipo: arquivoParaUpload.type,
        tamanho: `${(arquivoParaUpload.size / 1024 / 1024).toFixed(2)}MB`
      })

      // 4. Fazer upload DIRETO sem complicações
      progress.value = 30

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(nomeArquivo, arquivoParaUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error(' ❌ Erro no upload Supabase:', uploadError)
        throw new Error(`Falha no upload: ${uploadError.message}`)
      }

      console.log(' ✅ Upload storage concluído:', data)

      // 5. Gerar URL pública
      progress.value = 90

      // CORREÇÃO: Destructuring e tratamento de erro corretos para getPublicUrl
      const { data: urlData, error: urlError } = supabase.storage 
        .from(bucketName)
        .getPublicUrl(nomeArquivo)

      if (urlError) {
        console.error(' ❌ Erro ao gerar URL pública:', urlError);
        throw new Error(`Falha ao gerar URL: ${urlError.message}`);
      }
      
      if (!urlData?.publicUrl) {
        throw new Error('Não foi possível gerar URL pública')
      }

      progress.value = 100

      console.log(' 🌐 URL pública gerada:', urlData.publicUrl)

      return {
        success: true,
        publicUrl: urlData.publicUrl,
        filePath: data.path,
        fileName: nomeArquivo,
        bucket: bucketName
      }

    } catch (err) {
      console.error(' ❌ ERRO NO UPLOAD:', err)
      error.value = err.message

      // Mensagens amigáveis
      let mensagemUsuario = 'Erro ao fazer upload da imagem'

      if (err.message.includes('timeout') || err.message.includes('Timeout')) {
        mensagemUsuario = 'Upload demorou muito. Tente uma imagem menor ou melhor conexão.'
      } else if (err.message.includes('network') || err.message.includes('Network')) {
        mensagemUsuario = 'Problema de conexão. Verifique sua internet.'
      } else if (err.message.includes('504')) {
        mensagemUsuario = 'Servidor demorou para responder. Tente novamente.'
      } else if (err.message.includes('bucket')) {
        mensagemUsuario = 'Problema no storage. Verifique as configurações.'
      }

      uiStore.showToast(mensagemUsuario, 'error')
      throw err

    } finally {
      uploading.value = false
    }
  }

  // Excluir imagem
  const excluirImagem = async (bucketName, filePath) => {
    try {
      if (!bucketName || !filePath) {
        throw new Error('Bucket ou caminho inválido')
      }

      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath])

      if (deleteError) throw deleteError

      console.log(' ✅ Imagem excluída:', filePath)
      return true

    } catch (err) {
      console.error(' ❌ Erro ao excluir:', err)
      error.value = err.message
      throw err
    }
  }

  // FUNÇÕES ESPECÍFICAS SIMPLIFICADAS
  const uploadImagemGaleria = async (file) => uploadImagem(file, BUCKETS.GALERIA)
  const uploadImagemNoticia = async (file) => uploadImagem(file, BUCKETS.NOTICIAS)
  const uploadImagemEvento = async (file) => uploadImagem(file, BUCKETS.EVENTOS)
  const uploadImagemColaborador = async (file) => uploadImagem(file, BUCKETS.COLABORADORES)
  const uploadImagemLogo = async (file) => uploadImagem(file, BUCKETS.LOGOS)
  const uploadImagemGenerica = async (file) => uploadImagem(file, BUCKETS.IMAGENS)

  // EXPORT
  return {
    // Estados
    uploading,
    progress,
    error,

    // Constantes
    BUCKETS,

    // Validação
    validarImagem,

    // Upload
    uploadImagem,
    uploadImagemGaleria,
    uploadImagemNoticia,
    uploadImagemEvento,
    uploadImagemColaborador,
    uploadImagemLogo,
    uploadImagemGenerica,

    // Exclusão
    excluirImagem
  }
}