<template>
  <div class="admin-noticias-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
      {{ isEditing ? 'Editar Notícia' : 'Nova Notícia' }}
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
          placeholder="Ex: AMAJAC promove novo evento comunitário"
        />
      </div>

      <!-- Categoria -->
      <div>
        <label for="categoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categoria <span class="text-red-500">*</span>
        </label>
        <select
          id="categoria"
          v-model="formData.categoria"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Selecione uma categoria</option>
          <option value="comunidade">Comunidade</option>
          <option value="eventos">Eventos</option>
          <option value="obras">Obras e Infraestrutura</option>
          <option value="administracao">Administração</option>
          <option value="seguranca">Segurança</option>
          <option value="meio-ambiente">Meio Ambiente</option>
          <option value="saude">Saúde</option>
          <option value="educacao">Educação</option>
        </select>
      </div>

      <!-- Resumo -->
      <div>
        <label for="resumo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Resumo <span class="text-red-500">*</span>
        </label>
        <textarea
          id="resumo"
          v-model="formData.resumo"
          required
          rows="2"
          maxlength="300"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Resumo curto para a listagem"
        ></textarea>
      </div>

      <!-- Conteúdo -->
      <div>
        <label for="conteudo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Conteúdo <span class="text-red-500">*</span>
        </label>
        <textarea
          id="conteudo"
          v-model="formData.conteudo"
          required
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Conteúdo completo da notícia"
        ></textarea>
      </div>

      <!-- Data de Publicação -->
      <div>
        <label for="data_publicacao" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data de Publicação <span class="text-red-500">*</span>
        </label>
        <input
          id="data_publicacao"
          v-model="formData.data_publicacao"
          type="date"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Autor -->
      <div>
        <label for="autor" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Autor
        </label>
        <input
          id="autor"
          v-model="formData.autor"
          type="text"
          maxlength="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Nome do autor"
        />
      </div>

      <!-- IMAGEM DE CAPA -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Imagem de Capa
        </label>
        <ImageUploader
          v-model="formData.imagem_url"
          bucket="noticias"
          :max-size="3 * 1024 * 1024"
          @update:alt="formData.imagem_alt = $event"
        />
      </div>

      <!-- Texto alternativo da imagem (se houver imagem) -->
      <div v-if="formData.imagem_url">
        <label for="imagem_alt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Texto Alternativo da Imagem
        </label>
        <input
          id="imagem_alt"
          v-model="formData.imagem_alt"
          type="text"
          maxlength="200"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Descrição da imagem para acessibilidade"
        />
      </div>

      <!-- Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <!-- Rascunho -->
      <div class="flex items-center">
        <input
          id="rascunho"
          v-model="formData.rascunho"
          type="checkbox"
          class="h-4 w-4 text-amajac-green focus:ring-amajac-green rounded"
        />
        <label for="rascunho" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Salvar como rascunho (não publicar ainda)
        </label>
      </div>

      <!-- Aviso sobre rascunho -->
      <div v-if="formData.rascunho" class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center">
          <i class="mdi mdi-information text-yellow-600 mr-2"></i>
          <span class="text-sm text-yellow-700">
            Esta notícia será salva como rascunho e não será visível publicamente.
          </span>
        </div>
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
          {{ isEditing ? 'Atualizar' : formData.rascunho ? 'Salvar Rascunho' : 'Publicar' }}
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
      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-200">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminNoticias } from '../composables/useAdminNoticias.js'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Estados
const formData = ref({
  titulo: '',
  categoria: '', // ✅ novo campo
  resumo: '',
  conteudo: '',
  data_publicacao: new Date().toISOString().split('T')[0],
  autor: '',
  destaque: false,
  ativo: true,
  rascunho: false,
  imagem_url: '',
  imagem_alt: '',
  visualizacoes: 0
})

const { createNoticia, updateNoticia, loading, error } = useAdminNoticias()

// Detectar modo edição
const isEditing = ref(false)

// Definir resetForm ANTES do watch
const resetForm = () => {
  formData.value = {
    titulo: '',
    categoria: '', // ✅ reset
    resumo: '',
    conteudo: '',
    data_publicacao: new Date().toISOString().split('T')[0],
    autor: '',
    destaque: false,
    ativo: true,
    rascunho: false,
    imagem_url: '',
    imagem_alt: '',
    visualizacoes: 0
  }
}

// Sincronizar rascunho e ativo
watch(() => formData.value.rascunho, (newVal) => {
  if (newVal) {
    formData.value.ativo = false
  }
})

watch(() => formData.value.ativo, (newVal) => {
  if (newVal) {
    formData.value.rascunho = false
  }
})

// Sincronizar com modelValue
watch(() => props.modelValue, (val) => {
  if (val && val.id) {
    isEditing.value = true
    formData.value = {
      ...val,
      categoria: val.categoria || '', // ✅ garantir que carregue
      data_publicacao: val.data_publicacao ? val.data_publicacao.split('T')[0] : new Date().toISOString().split('T')[0],
      rascunho: val.rascunho || false
    }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

const handleSubmit = async () => {
  let result
  if (isEditing.value) {
    result = await updateNoticia(props.modelValue.id, formData.value)
  } else {
    result = await createNoticia(formData.value)
  }

  if (result) {
    emit('submit', result)
    if (!isEditing.value) {
      resetForm()
    }
  }
}
</script>

<style scoped>
/* Estilos mantidos */
</style>