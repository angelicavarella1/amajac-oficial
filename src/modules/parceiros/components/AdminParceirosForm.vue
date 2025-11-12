<!-- src/modules/parceiros/components/AdminParceirosForm.vue -->
<template>
  <div class="admin-parceiros-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
      {{ isEditing ? 'Editar Parceiro Comercial' : 'Novo Parceiro Comercial' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Nome do Estabelecimento -->
      <div>
        <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome do Estabelecimento <span class="text-red-500">*</span>
        </label>
        <input
          id="nome"
          v-model="formData.nome"
          type="text"
          required
          maxlength="150"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Padaria Sabor Local"
        />
      </div>

      <!-- Tipo -->
      <div>
        <label for="tipo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tipo
        </label>
        <select
          id="tipo"
          v-model="formData.tipo"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Selecione o tipo</option>
          <option value="restaurante">Restaurante</option>
          <option value="loja">Loja</option>
          <option value="servico">Serviço</option>
          <option value="consultorio">Consultório</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <!-- Ramo -->
      <div>
        <label for="ramo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ramo
        </label>
        <input
          id="ramo"
          v-model="formData.ramo"
          type="text"
          maxlength="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Alimentação"
        />
      </div>

      <!-- Descrição Curta -->
      <div>
        <label for="descricao_curta" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição Curta <span class="text-red-500">*</span>
        </label>
        <textarea
          id="descricao_curta"
          v-model="formData.descricao_curta"
          required
          rows="2"
          maxlength="200"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Breve descrição do comércio"
        ></textarea>
      </div>

      <!-- Contato -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telefone
          </label>
          <input
            id="telefone"
            v-model="formData.telefone"
            type="text"
            maxlength="20"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="(11) 99999-9999"
          />
        </div>
        <div>
          <label for="email_contato" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-mail de Contato
          </label>
          <input
            id="email_contato"
            v-model="formData.email_contato"
            type="email"
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="contato@exemplo.com.br"
          />
        </div>
      </div>

      <!-- Endereço e CNPJ -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="endereco" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Endereço
          </label>
          <input
            id="endereco"
            v-model="formData.endereco"
            type="text"
            maxlength="200"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Rua Exemplo, 123 - Bairro"
          />
        </div>
        <div>
          <label for="cnpj" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CNPJ
          </label>
          <input
            id="cnpj"
            v-model="formData.cnpj"
            type="text"
            maxlength="18"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>

      <!-- Redes Sociais -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="link_site" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Site
          </label>
          <input
            id="link_site"
            v-model="formData.link_site"
            type="url"
            maxlength="200"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="https://exemplo.com.br"
          />
        </div>
        <div>
          <label for="facebook" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Facebook
          </label>
          <input
            id="facebook"
            v-model="formData.facebook"
            type="text"
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Nome da página"
          />
        </div>
        <div>
          <label for="instagram" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Instagram
          </label>
          <input
            id="instagram"
            v-model="formData.instagram"
            type="text"
            maxlength="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="@usuario"
          />
        </div>
      </div>

      <!-- Texto alternativo para logo -->
      <div>
        <label for="imagem_alt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Texto alternativo (alt) da logo
        </label>
        <input
          id="imagem_alt"
          v-model="formData.imagem_alt"
          type="text"
          maxlength="150"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: Logo da Padaria Sabor Local"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Usado por leitores de tela e quando a imagem não carrega.
        </p>
      </div>

      <!-- Tags (array de strings) -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Etiquetas (separadas por vírgula)
        </label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="ex: padaria, café, orgânico"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          As etiquetas ajudam na filtragem e busca.
        </p>
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

      <!-- Logo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo do Parceiro
        </label>
        <ImageUploader
          v-model="formData.logo_url"
          bucket="logos"
          :max-size="2 * 1024 * 1024"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Recomendado: imagem quadrada (ex: 300x300 px)
        </p>
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
          {{ isEditing ? 'Atualizar Parceiro' : 'Cadastrar Parceiro' }}
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
import { ref, watch, computed } from 'vue'
import { useAdminParceiros } from '../composables/useAdminParceiros'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import { encryptCPF_CNPJ } from '@/core/utils/crypto.js' // ✓ Importação corrigida

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const formData = ref({
  nome: '',
  tipo: '',
  logo_url: '',
  telefone: '',
  endereco: '',
  cnpj: '',
  email_contato: '',
  ramo: '',
  status: 'ativo',
  descricao_curta: '',
  link_site: '',
  facebook: '',
  instagram: '',
  tags: [],
  ativo: true,
  imagem_alt: ''
})

const tagsInput = ref('')

const { createParceiro, updateParceiro, loading, error } = useAdminParceiros()
const isEditing = ref(false)

watch(() => props.modelValue, (val) => {
  if (val && val.id) {
    isEditing.value = true
    formData.value = { ...val }
    tagsInput.value = Array.isArray(val.tags) ? val.tags.join(', ') : ''
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

watch(tagsInput, (val) => {
  if (val) {
    formData.value.tags = val
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  } else {
    formData.value.tags = []
  }
})

const resetForm = () => {
  formData.value = {
    nome: '',
    tipo: '',
    logo_url: '',
    telefone: '',
    endereco: '',
    cnpj: '',
    email_contato: '',
    ramo: '',
    status: 'ativo',
    descricao_curta: '',
    link_site: '',
    facebook: '',
    instagram: '',
    tags: [],
    ativo: true,
    imagem_alt: ''
  }
  tagsInput.value = ''
}

const handleSubmit = async () => {
  if (!formData.value.nome || !formData.value.descricao_curta) {
    error.value = 'Preencha os campos obrigatórios: Nome e Descrição Curta.'
    return
  }

  // ✓ Criptografa o CNPJ antes de salvar usando a função correta
  let cnpjHash = null
  if (formData.value.cnpj) {
    cnpjHash = await encryptCPF_CNPJ(formData.value.cnpj)
  }

  const dadosParaSalvar = {
    ...formData.value,
    cnpj: cnpjHash
  }

  let result
  if (isEditing.value) {
    result = await updateParceiro(props.modelValue.id, dadosParaSalvar)
  } else {
    result = await createParceiro(dadosParaSalvar)
  }

  if (result) {
    emit('submit', result)
    if (!isEditing.value) {
      resetForm()
    }
  }
}
</script>