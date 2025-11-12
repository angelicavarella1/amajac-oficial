<!-- src/components/ui/ImageUploader.vue -->
<template>
  <div class="image-uploader">
    <!-- Pré-visualização da imagem -->
    <div v-if="previewUrl || modelValue" class="mb-3">
      <img
        :src="previewUrl || modelValue"
        alt="Pré-visualização"
        class="w-full h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
        @error="handlePreviewError"
      />
      <button
        type="button"
        @click="removeImage"
        class="mt-2 text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
        :disabled="removing"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Remover imagem
      </button>
    </div>

    <!-- Botão de upload -->
    <label
      v-if="!previewUrl && !modelValue"
      class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amajac-green border-opacity-50 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
    >
      <div class="flex flex-col items-center justify-center pt-3 pb-2">
        <svg class="w-8 h-8 text-amajac-green mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <span class="text-sm text-gray-600 dark:text-gray-300">
          Clique para selecionar uma imagem
        </span>
        <span v-if="maxSize" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (Máx. {{ formatBytes(maxSize) }})
        </span>
      </div>
      <input
        type="file"
        :accept="accept"
        @change="onFileSelect"
        class="hidden"
        :disabled="uploading"
      />
    </label>

    <!-- Mensagens de status -->
    <div v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</div>
    <div v-if="uploading" class="mt-2 text-sm text-amajac-green flex items-center gap-2">
      <div class="w-4 h-4 border-2 border-amajac-green border-t-transparent rounded-full animate-spin"></div>
      Enviando...
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
// CORREÇÃO: Importar funções diretamente
import { upload, remove } from '@/core/services/ImageService'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  bucket: {
    type: String,
    required: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5 MB
  }
})

const emit = defineEmits(['update:modelValue', 'file-select', 'upload-start', 'upload-end', 'error'])

const previewUrl = ref('')
const uploading = ref(false)
const removing = ref(false)
const error = ref(null)

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    previewUrl.value = ''
  }
})

const onFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validações
  if (file.size > props.maxSize) {
    error.value = `Arquivo muito grande. Máximo permitido: ${formatBytes(props.maxSize)}.`
    event.target.value = ''
    return
  }
  if (!file.type.startsWith('image/')) {
    error.value = 'Apenas arquivos de imagem são permitidos.'
    event.target.value = ''
    return
  }

  error.value = null
  uploading.value = true
  emit('upload-start', file)

  // Pré-visualização local
  const localPreview = URL.createObjectURL(file)
  previewUrl.value = localPreview

  try {
    // ✓ CORREÇÃO: Usar função upload diretamente
    const publicUrl = await upload(props.bucket, file)
    if (publicUrl) {
      emit('update:modelValue', publicUrl)
      emit('file-select', file)
      emit('upload-end', publicUrl)
    } else {
      throw new Error('Falha no upload')
    }
  } catch (err) {
    error.value = 'Erro ao enviar a imagem. Tente novamente.'
    previewUrl.value = ''
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

const removeImage = async () => {
  if (!props.modelValue) return

  removing.value = true
  try {
    const path = extractPathFromUrl(props.modelValue)
    // ✓ CORREÇÃO: Usar função remove diretamente
    const success = await remove(props.bucket, path)
    if (success) {
      previewUrl.value = ''
      emit('update:modelValue', '')
    } else {
      throw new Error('Falha na remoção')
    }
  } catch (err) {
    error.value = 'Erro ao remover a imagem.'
  } finally {
    removing.value = false
  }
}

const handlePreviewError = () => {
  previewUrl.value = ''
  emit('update:modelValue', '')
}

const extractPathFromUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.split('/').pop()
  } catch {
    return url
  }
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}
</style>