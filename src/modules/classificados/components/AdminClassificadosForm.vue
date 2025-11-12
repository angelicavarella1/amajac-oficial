<!-- src/modules/classificados/components/AdminClassificadosForm.vue -->
<template>
  <div class="admin-classificados-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
      {{ isEditing ? 'Editar Classificado' : 'Novo Classificado' }}
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
          placeholder="Ex: Corte de grama e limpeza de terreno"
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
          <option value="jardinagem">Jardinagem (Corte de grama, podas)</option>
          <option value="limpeza">Limpeza (Doméstica, terrenos)</option>
          <option value="reparos">Reparos Gerais</option>
          <option value="pintura">Pintura</option>
          <option value="encanamento">Encanamento</option>
          <option value="eletrica">Serviços Elétricos</option>
          <option value="construcao">Construção e Reforma</option>
          <option value="informatica">Informática e Internet</option>
          <option value="transporte">Transporte e Mudanças</option>
          <option value="outros">Outros</option>
        </select>
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
          placeholder="Descreva o serviço ou produto oferecido"
        ></textarea>
      </div>

      <!-- Upload de Imagem -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Imagem do Classificado
        </label>
        
        <!-- Preview da imagem atual -->
        <div v-if="formData.imagem_url" class="mb-3">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Imagem atual:</p>
          <img 
            :src="formData.imagem_url" 
            alt="Preview" 
            class="h-32 w-32 object-cover rounded-lg border border-gray-300"
          >
          <button
            type="button"
            @click="removerImagem"
            class="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <i class="mdi mdi-delete"></i>
            Remover imagem
          </button>
        </div>

        <!-- Input de upload -->
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
          <div v-if="!uploadingImage">
            <i class="mdi mdi-image-outline text-3xl text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Clique para selecionar uma imagem
            </p>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="px-4 py-2 bg-amajac-green text-white rounded-lg text-sm hover:bg-green-700"
            >
              Selecionar Imagem
            </button>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Formatos: JPG, PNG, GIF • Máx: 2MB
            </p>
          </div>
          <div v-else class="text-amajac-green">
            <i class="mdi mdi-loading mdi-spin text-2xl"></i>
            <p class="text-sm mt-2">Fazendo upload...</p>
          </div>
        </div>

        <!-- Preview da nova imagem -->
        <div v-if="novaImagemPreview" class="mt-3">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Nova imagem:</p>
          <img 
            :src="novaImagemPreview" 
            alt="Nova imagem preview" 
            class="h-32 w-32 object-cover rounded-lg border border-gray-300"
          >
        </div>
      </div>

      <!-- Dados do Anunciante -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="nome_anunciante" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Anunciante <span class="text-red-500">*</span>
          </label>
          <input
            id="nome_anunciante"
            v-model="formData.nome_anunciante"
            type="text"
            required
            maxlength="100"
            :disabled="socioValido"
            :class="{ 'bg-green-50 dark:bg-green-900/20': socioValido }"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ex: João Silva"
          />
        </div>
        <div>
          <label for="bairro" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bairro de Atuação
          </label>
          <input
            id="bairro"
            v-model="formData.bairro"
            type="text"
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ex: Jardim Atlântico Central"
          />
        </div>
      </div>

      <!-- Contato -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telefone <span class="text-red-500">*</span>
          </label>
          <input
            id="telefone"
            v-model="formData.telefone"
            type="text"
            required
            maxlength="20"
            :disabled="socioValido"
            :class="{ 'bg-green-50 dark:bg-green-900/20': socioValido }"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="(11) 99999-9999"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-mail
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            maxlength="100"
            :disabled="socioValido"
            :class="{ 'bg-green-50 dark:bg-green-900/20': socioValido }"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="contato@exemplo.com.br"
          />
        </div>
      </div>

      <!-- CPF (obrigatório para validação de sócio) -->
      <div>
        <label for="cpf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          CPF do Anunciante <span class="text-red-500">*</span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">Somente sócios ativos podem anunciar</span>
        </label>
        <input
          id="cpf"
          v-model="cpfFormatted"
          type="text"
          required
          maxlength="14"
          inputmode="numeric"
          @blur="validarSocio"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="000.000.000-00"
        />
        <p v-if="verificandoSocio" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Verificando sócio...
        </p>
        <p v-else-if="socioValido" class="mt-1 text-xs text-green-600 dark:text-green-400">
          {{ socioInfo.nome }} - Sócio ativo da AMAJAC
        </p>
        <p v-else-if="cpfDigitado && !socioValido" class="mt-1 text-xs text-red-600 dark:text-red-400">
          CPF não vinculado a um sócio ativo. Apenas sócios podem anunciar.
        </p>
      </div>

      <!-- Status -->
      <div class="space-y-2">
        <div class="flex items-center">
          <input
            id="ativo"
            v-model="formData.ativo"
            type="checkbox"
            class="h-4 w-4 text-amajac-green focus:ring-amajac-green rounded"
          />
          <label for="ativo" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Classificado ativo e visível no site
          </label>
        </div>
        <div class="flex items-center">
          <input
            id="aprovado"
            v-model="formData.aprovado"
            type="checkbox"
            class="h-4 w-4 text-amajac-green focus:ring-amajac-green rounded"
          />
          <label for="aprovado" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Classificado aprovado (exibido mesmo sem login)
          </label>
        </div>
        
        <!-- Data de aprovação (apenas leitura) -->
        <div v-if="formData.data_aprovacao" class="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-xs text-green-700 dark:text-green-300">
            <i class="mdi mdi-calendar-check mr-1"></i>
            Aprovado em: {{ formatarData(formData.data_aprovacao) }}
          </p>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading || (!socioValido && !isEditing) || uploadingImage"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-content-save"></i>
          {{ isEditing ? 'Atualizar Classificado' : 'Publicar Classificado' }}
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
import { ref, watch, onMounted } from 'vue'
import { useAdminClassificados } from '../composables/useAdminClassificados'
import { hashCPF } from '@/core/utils/crypto.js' // ✅ Caminho corrigido

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
  descricao: '',
  categoria: '',
  nome_anunciante: '',
  telefone: '',
  email: '',
  bairro: '',
  cpf: '',
  imagem_url: '',
  ativo: true,
  aprovado: false,
  data_aprovacao: null
})

const cpfFormatted = ref('')
const socioValido = ref(false)
const socioInfo = ref(null)
const verificandoSocio = ref(false)
const cpfDigitado = ref(false)
const uploadingImage = ref(false)
const novaImagemPreview = ref(null)
const novaImagemFile = ref(null)

const { createClassificado, updateClassificado, loading, error, verificarSocioAtivo } = useAdminClassificados()
const isEditing = ref(false)

// Inicializar o formulário
const resetForm = () => {
  formData.value = {
    titulo: '',
    descricao: '',
    categoria: '',
    nome_anunciante: '',
    telefone: '',
    email: '',
    bairro: '',
    cpf: '',
    imagem_url: '',
    ativo: true,
    aprovado: false,
    data_aprovacao: null
  }
  cpfFormatted.value = ''
  socioValido.value = false
  socioInfo.value = null
  cpfDigitado.value = false
  novaImagemPreview.value = null
  novaImagemFile.value = null
}

onMounted(() => {
  resetForm()
})

watch(() => props.modelValue, (val) => {
  if (val && val.id) {
    isEditing.value = true
    formData.value = { ...val }
    socioValido.value = true
    socioInfo.value = { nome: val.nome_anunciante }
    if (val.cpf) {
      cpfFormatted.value = val.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

watch(cpfFormatted, (val) => {
  const cleaned = val.replace(/\D/g, '')
  if (cleaned.length <= 11) {
    formData.value.cpf = cleaned
    if (cleaned.length > 9) {
      cpfFormatted.value = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
    } else if (cleaned.length > 6) {
      cpfFormatted.value = cleaned.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
    } else if (cleaned.length > 3) {
      cpfFormatted.value = cleaned.replace(/(\d{3})(\d{0,3})/, '$1.$2')
    } else {
      cpfFormatted.value = cleaned
    }
  } else {
    const trimmed = cleaned.slice(0, 11)
    formData.value.cpf = trimmed
    cpfFormatted.value = trimmed.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }
  if (cleaned) {
    cpfDigitado.value = true
    socioValido.value = false
    socioInfo.value = null
  }
})

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = 'Por favor, selecione apenas arquivos de imagem.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'A imagem deve ter no máximo 2MB.'
    return
  }

  try {
    uploadingImage.value = true
    error.value = null
    const reader = new FileReader()
    reader.onload = (e) => {
      novaImagemPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    novaImagemFile.value = file
  } catch (err) {
    console.error('Erro no upload da imagem:', err)
    error.value = 'Erro ao processar a imagem.'
  } finally {
    uploadingImage.value = false
  }
}

const removerImagem = () => {
  formData.value.imagem_url = ''
  novaImagemPreview.value = null
  novaImagemFile.value = null
}

const formatarData = (dataString) => {
  return new Date(dataString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const validarSocio = async () => {
  const cpfClean = formData.value.cpf
  if (!cpfClean || cpfClean.length !== 11) {
    socioValido.value = false
    socioInfo.value = null
    return
  }

  verificandoSocio.value = true
  try {
    const socio = await verificarSocioAtivo(cpfClean)
    if (socio) {
      socioValido.value = true
      socioInfo.value = socio
      if (!isEditing.value) {
        formData.value.nome_anunciante = socio.nome
        formData.value.telefone = socio.telefone || ''
        formData.value.email = socio.email || ''
      }
    } else {
      socioValido.value = false
      socioInfo.value = null
    }
  } finally {
    verificandoSocio.value = false
  }
}

const validarCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.length === 11
}

const validarTelefone = (telefone) => {
  const cleaned = telefone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 11
}

const handleSubmit = async () => {
  if (!socioValido.value && !isEditing.value) {
    error.value = 'Apenas sócios ativos da AMAJAC podem publicar anúncios.'
    return
  }

  if (!validarCPF(formData.value.cpf)) {
    error.value = 'CPF inválido.'
    return
  }

  if (!validarTelefone(formData.value.telefone)) {
    error.value = 'Telefone inválido.'
    return
  }

  const required = ['titulo', 'descricao', 'categoria', 'nome_anunciante', 'telefone', 'cpf']
  for (const field of required) {
    if (!formData.value[field]) {
      error.value = 'Preencha todos os campos obrigatórios.'
      return
    }
  }

  // ✅ Criptografa CPF antes de salvar
  const cpfHash = await hashCPF(formData.value.cpf)
  const dadosParaSalvar = {
    ...formData.value,
    cpf: cpfHash
  }

  let result
  if (isEditing.value) {
    result = await updateClassificado(props.modelValue.id, dadosParaSalvar, novaImagemFile.value)
  } else {
    result = await createClassificado(dadosParaSalvar, novaImagemFile.value)
  }

  if (result) {
    emit('submit', result)
    if (!isEditing.value) {
      resetForm()
    }
  }
}
</script>