<!-- src/modules/sobre/components/AdminSobreForm.vue -->
<template>
  <div class="admin-sobre-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-6 dark:text-amajac-green-light">
      Editar Conteúdo Institucional
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Missão -->
      <div>
        <label for="missao" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Missão
        </label>
        <textarea
          id="missao"
          v-model="formData.missao"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Descreva a missão da AMAJAC"
        ></textarea>
      </div>

      <!-- Visão -->
      <div>
        <label for="visao" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Visão
        </label>
        <textarea
          id="visao"
          v-model="formData.visao"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Descreva a visão da AMAJAC"
        ></textarea>
      </div>

      <!-- Valores -->
      <div>
        <label for="valores" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valores
        </label>
        <textarea
          id="valores"
          v-model="formData.valores"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Liste os valores (um por linha ou em parágrafo)"
        ></textarea>
      </div>

      <!-- História -->
      <div>
        <label for="historia" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          História da AMAJAC
        </label>
        <textarea
          id="historia"
          v-model="formData.historia"
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Conte a história da associação"
        ></textarea>
      </div>

      <!-- Informações de Contato -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="endereco" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço
          </label>
          <input
            id="endereco"
            v-model="formData.endereco"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ex: Rua das Palmeiras, 123 – Jardim Atlântico"
          />
        </div>
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <input
            id="telefone"
            v-model="formData.telefone"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="(21) 97897-9840"
          />
        </div>
        <div class="md:col-span-2">
          <label for="email_institucional" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-mail Institucional
          </label>
          <input
            id="email_institucional"
            v-model="formData.email_institucional"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="comunicacao@amajac.org.br"
          />
        </div>
      </div>

      <!-- Ações -->
      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-content-save"></i>
          Salvar Alterações
        </button>
        
        <button
          type="button"
          @click="limparCampos"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <i class="mdi mdi-broom"></i>
          Limpar Campos
        </button>
      </div>

      <!-- Mensagem de erro -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Mensagem de sucesso -->
      <div v-if="successMessage" class="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
        {{ successMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminSobre } from '../composables/useAdminSobre'

const router = useRouter()
const formData = ref({
  missao: '',
  visao: '',
  valores: '',
  historia: '',
  endereco: '',
  telefone: '',
  email_institucional: ''
})

const { loading, error, carregarConfiguracoes, salvarConfiguracao } = useAdminSobre()
const successMessage = ref('')

// Carregar configurações ao montar
onMounted(async () => {
  const configs = await carregarConfiguracoes()
  if (configs) {
    formData.value = {
      missao: configs.missao?.valor || '',
      visao: configs.visao?.valor || '',
      valores: configs.valores?.valor || '',
      historia: configs.historia?.valor || '',
      endereco: configs.endereco?.valor || '',
      telefone: configs.telefone?.valor || '',
      email_institucional: configs.email_institucional?.valor || ''
    }
  }
})

const limparCampos = () => {
  formData.value = {
    missao: '',
    visao: '',
    valores: '',
    historia: '',
    endereco: '',
    telefone: '',
    email_institucional: ''
  }
  successMessage.value = ''
  error.value = ''
}

const redirecionarParaHome = () => {
  setTimeout(() => {
    router.push('/')
  }, 1500) // 1.5 segundos para o usuário ver a mensagem de sucesso
}

const handleSubmit = async () => {
  successMessage.value = ''
  
  try {
    const chaves = Object.keys(formData.value)
    let salvosComSucesso = 0
    
    for (const chave of chaves) {
      const resultado = await salvarConfiguracao(chave, formData.value[chave])
      if (resultado) salvosComSucesso++
    }
    
    if (salvosComSucesso === chaves.length) {
      successMessage.value = 'Conteúdo institucional atualizado com sucesso! Redirecionando para a página inicial...'
      limparCampos()
      redirecionarParaHome()
    } else {
      error.value = 'Alguns campos não puderam ser salvos. Tente novamente.'
    }
  } catch (err) {
    error.value = 'Erro ao salvar conteúdo: ' + err.message
  }
}
</script>

<style scoped>
.admin-sobre-form {
  border: 1px solid #e5e7eb;
}

.dark .admin-sobre-form {
  border-color: #374151;
}
</style>