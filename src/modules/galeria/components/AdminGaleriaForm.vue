<!-- src/modules/galeria/components/AdminGaleriaForm.vue -->
<template>
  <div class="admin-galeria-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
      {{ isEditing ? 'Editar Imagem' : 'Adicionar à Galeria' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Upload de Imagem -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Imagem <span class="text-red-500">*</span>
        </label>
        
        <!-- Preview da imagem -->
        <div v-if="formData.imagem_url && (formData.imagem_url.startsWith('http') || formData.imagem_url.startsWith('data:'))" class="mb-4">
          <img 
            :src="formData.imagem_url" 
            :alt="formData.imagem_alt"
            class="max-w-xs max-h-48 rounded-lg border border-gray-300"
          />
        </div>

        <!-- Upload manual -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="hidden"
          />
          <button
            type="button"
            @click="$refs.fileInput.click()"
            class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors mb-2"
          >
            <i class="mdi mdi-upload mr-2"></i>
            Selecionar Imagem
          </button>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ selectedFile ? selectedFile.name : 'PNG, JPG, GIF ou WebP (máx. 5 MB)' }}
          </p>
        </div>

        <!-- Progresso do upload -->
        <div v-if="uploading" class="mt-2">
          <div class="bg-gray-200 rounded-full h-2">
            <div class="bg-amajac-green h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">Enviando... {{ uploadProgress }}%</p>
        </div>
      </div>

      <!-- Título -->
      <div>
        <label for="titulo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título
        </label>
        <input
          id="titulo"
          v-model="formData.titulo"
          type="text"
          maxlength="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Festa Junina 2025"
        />
      </div>

      <!-- Descrição -->
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          v-model="formData.descricao"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Descrição opcional da imagem"
        ></textarea>
      </div>

      <!-- Categoria -->
      <div>
        <label for="categoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categoria
        </label>
        <select
          id="categoria"
          v-model="formData.categoria"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="geral">Geral</option>
          <option value="eventos">Eventos</option>
          <option value="comunidade">Comunidade</option>
          <option value="obras">Obras</option>
          <option value="reunioes">Reuniões</option>
          <option value="festas">Festas</option>
          <option value="parceiros">Parceiros</option>
        </select>
      </div>

      <!-- Texto Alternativo -->
      <div>
        <label for="imagem_alt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Texto Alternativo (Acessibilidade) <span class="text-red-500">*</span>
        </label>
        <input
          id="imagem_alt"
          v-model="formData.imagem_alt"
          type="text"
          required
          maxlength="150"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Grupo de pessoas dançando quadrilha em festa junina"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Descreva a imagem para leitores de tela.
        </p>
      </div>

      <!-- Ações -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading || uploading || !formData.imagem_url || !formData.imagem_alt"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          <i v-if="loading || uploading" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-content-save"></i>
          {{ isEditing ? 'Atualizar Imagem' : 'Adicionar à Galeria' }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>

      <!-- Mensagem de erro -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminGaleria } from '../composables/useAdminGaleria'
import { supabase } from '@/core/utils/supabaseClient'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Estados
const formData = ref({
  imagem_url: '',
  imagem_alt: '',
  titulo: '',
  descricao: '',
  categoria: 'geral'
})

const selectedFile = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)

const { createItem, updateItem, loading, error } = useAdminGaleria()
const isEditing = ref(false)

// função para gerar nome único do arquivo
const generateUniqueFileName = (file) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()
  return `${timestamp}_${random}.${extension}`
}

// função de upload CORRIGIDA
const uploadImage = async () => {
  if (!selectedFile.value) return formData.value.imagem_url

  uploading.value = true
  uploadProgress.value = 0

  try {
    const fileName = generateUniqueFileName(selectedFile.value)
    
    // Simulação de progresso
    const progressInterval = setInterval(() => {
      uploadProgress.value = Math.min(uploadProgress.value + 10, 90)
    }, 100)

    // UPLOAD DIRETO COM SUPABASE - CORREÇÃO PRINCIPAL
    const { data, error: uploadError } = await supabase.storage
      .from('galeria')
      .upload(fileName, selectedFile.value, {
        cacheControl: '3600',
        upsert: false
      })

    clearInterval(progressInterval)

    if (uploadError) {
      console.error('Erro detalhado do upload:', uploadError)
      
      // Tratamento específico de erros
      if (uploadError.message.includes('row-level security policy')) {
        throw new Error('ERRO DE PERMISSÃO: Configure as políticas RLS no bucket "galeria" do Supabase Storage.')
      }
      
      if (uploadError.message.includes('Bucket not found')) {
        throw new Error('Bucket "galeria" não encontrado. Crie o bucket no Supabase Storage.')
      }
      
      throw new Error(`Falha no upload: ${uploadError.message}`)
    }

    uploadProgress.value = 100

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('galeria')
      .getPublicUrl(fileName)

    return publicUrl

  } catch (err) {
    console.error('Erro no upload:', err)
    error.value = err.message
    return null
  } finally {
    uploading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    imagem_url: '',
    imagem_alt: '',
    titulo: '',
    descricao: '',
    categoria: 'geral'
  }
  selectedFile.value = null
  uploading.value = false
  uploadProgress.value = 0
  error.value = null
}

watch(() => props.modelValue, (val) => {
  if (val && val.id) {
    isEditing.value = true
    formData.value = {
      ...val,
      categoria: val.categoria || 'geral'
    }
    selectedFile.value = null
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validação do arquivo
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    error.value = 'Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Arquivo muito grande. Máximo 5 MB.'
    return
  }

  selectedFile.value = file
  error.value = null

  // Preview da imagem
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.imagem_url = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!formData.value.imagem_alt) {
    error.value = 'Texto alternativo é obrigatório para acessibilidade.'
    return
  }

  // Se há um novo arquivo, faz upload
  let finalImageUrl = formData.value.imagem_url
  if (selectedFile.value && !formData.value.imagem_url.startsWith('http')) {
    finalImageUrl = await uploadImage()
    if (!finalImageUrl) return
  }

  if (!finalImageUrl) {
    error.value = 'Imagem é obrigatória.'
    return
  }

  const submitData = {
    ...formData.value,
    imagem_url: finalImageUrl
  }

  let result
  if (isEditing.value) {
    result = await updateItem(props.modelValue.id, submitData)
  } else {
    result = await createItem(submitData)
  }

  if (result) {
    emit('submit', result)
    if (!isEditing.value) {
      resetForm()
    }
  }
}
</script>