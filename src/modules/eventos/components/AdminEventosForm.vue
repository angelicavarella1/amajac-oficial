<!-- src/modules/eventos/components/AdminEventosForm.vue -->
<template>
  <div class="admin-eventos-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
      {{ isEditing ? 'Editar Evento' : 'Novo Evento' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Título -->
      <div>
        <label for="titulo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título <span class="text-red-500">*</span>
        </label>
        <input
          id="titulo"
          v-model="formData.titulo"
          type="text"
          required
          maxlength="150"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Festa Junina da Comunidade"
        />
      </div>

      <!-- Descrição -->
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição <span class="text-red-500">*</span>
        </label>
        <textarea
          id="descricao"
          v-model="formData.descricao"
          required
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Detalhes do evento, programação, atrações, etc."
        ></textarea>
      </div>

      <!-- Data e Horário -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="data_evento" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data <span class="text-red-500">*</span>
          </label>
          <input
            id="data_evento"
            v-model="formData.data_evento"
            type="date"
            required
            :min="hoje"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label for="horario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Horário <span class="text-red-500">*</span>
          </label>
          <input
            id="horario"
            v-model="formData.horario"
            type="time"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <!-- Local -->
      <div>
        <label for="local" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Local <span class="text-red-500">*</span>
        </label>
        <input
          id="local"
          v-model="formData.local"
          type="text"
          required
          maxlength="200"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Praça Central do Jardim Atlântico"
        />
      </div>

      <!-- Destaque -->
      <div class="flex items-center">
        <input
          id="destaque"
          v-model="formData.destaque"
          type="checkbox"
          class="h-4 w-4 text-amajac-green focus:ring-amajac-green rounded"
        />
        <label for="destaque" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Destaque (exibir em posição de destaque)
        </label>
      </div>

      <!-- Status -->
      <div class="flex items-center">
        <input
          id="ativo"
          v-model="formData.ativo"
          type="checkbox"
          class="h-4 w-4 text-amajac-green focus:ring-amajac-green rounded"
        />
        <label for="ativo" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Ativo (exibir publicamente)
        </label>
      </div>

      <!-- Imagem -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Imagem do Evento
        </label>
        <ImageUploader
          v-model="formData.imagem_url"
          bucket="eventos"
          :max-size="3 * 1024 * 1024"
          @file-select="onImageFileSelect"
        />
      </div>

      <!-- Texto alternativo -->
      <div>
        <label for="imagem_alt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Texto alternativo (acessibilidade) <span class="text-red-500">*</span>
        </label>
        <input
          id="imagem_alt"
          v-model="formData.imagem_alt"
          type="text"
          required
          maxlength="200"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          :placeholder="`Descreva a imagem de ${formData.titulo || 'evento'}`"
        />
      </div>

      <!-- Ações -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-content-save"></i>
          {{ isEditing ? 'Atualizar' : 'Criar Evento' }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminEventos } from '../composables/useAdminEventos'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const hoje = new Date().toISOString().split('T')[0]

const formData = ref({
  titulo: '',
  descricao: '',
  data_evento: '',
  horario: '',
  local: '',
  destaque: false,
  ativo: true,
  imagem_url: '',
  imagem_alt: ''
})

const imagemFile = ref(null) // ✓ Captura o arquivo real
const { createEvento, updateEvento, loading, error } = useAdminEventos()
const isEditing = ref(false)

const resetForm = () => {
  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
  formData.value = {
    titulo: '',
    descricao: '',
    data_evento: date,
    horario: time,
    local: '',
    destaque: false,
    ativo: true,
    imagem_url: '',
    imagem_alt: ''
  }
  imagemFile.value = null
}

watch(() => props.modelValue, (val) => {
  if (val && val.id) {
    isEditing.value = true
    formData.value = {
      ...val,
      data_evento: val.data_evento ? val.data_evento.split('T')[0] : '',
      horario: val.horario || (val.data_hora_evento ? val.data_hora_evento.split('T')[1]?.slice(0, 5) : ''),
      imagem_alt: val.imagem_alt || `Evento: ${val.titulo || 'sem título'}`
    }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

const onImageFileSelect = (file) => {
  imagemFile.value = file // ✓ Armazena o arquivo para upload
}

const handleSubmit = async () => {
  const { titulo, descricao, data_evento, horario, local, imagem_alt } = formData.value
  if (!titulo || !descricao || !data_evento || !horario || !local || !imagem_alt) {
    error.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  const dataEvento = new Date(data_evento)
  const agora = new Date()
  agora.setHours(0, 0, 0, 0)
  if (dataEvento < agora) {
    error.value = 'A data do evento não pode ser no passado.'
    return
  }

  let result
  if (isEditing.value) {
    result = await updateEvento(props.modelValue.id, formData.value, imagemFile.value)
  } else {
    result = await createEvento(formData.value, imagemFile.value) // ✓ Passa o arquivo
  }

  if (result) {
    emit('submit', result)
    if (!isEditing.value) {
      resetForm()
    }
  }
}
</script>