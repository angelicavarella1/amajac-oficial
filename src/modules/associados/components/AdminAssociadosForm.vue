<!-- src/modules/associados/components/AdminAssociadosForm.vue -->
<template>
  <div class="admin-associados-form bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h2 class="text-xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light">
      {{ isEditing ? 'Editar Sócio' : 'Cadastrar Novo Sócio' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Nome -->
      <div>
        <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome Completo <span class="text-red-500">*</span>
        </label>
        <input
          id="nome"
          v-model="formData.nome"
          type="text"
          required
          maxlength="150"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ex: João Silva"
        />
      </div>

      <!-- CPF -->
      <div>
        <label for="cpf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          CPF <span class="text-red-500">*</span>
        </label>
        <input
          id="cpf"
          v-model="formData.cpf"
          type="text"
          required
          maxlength="14"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="000.000.000-00"
        />
      </div>

      <!-- E-mail -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          E-mail <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          maxlength="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="joao.silva@email.com"
        />
      </div>

      <!-- Telefone -->
      <div>
        <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Telefone / WhatsApp
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

      <!-- Endereço -->
      <div>
        <label for="endereco" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Endereço Completo <span class="text-red-500">*</span>
        </label>
        <input
          id="endereco"
          v-model="formData.endereco"
          type="text"
          required
          maxlength="200"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Rua Exemplo, 123  Jardim Atlântico Central, Maricá-RJ"
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
          <option value="fundador">Sócio Fundador</option>
          <option value="benemerito">Sócio Benemérito</option>
          <option value="remido">Sócio Remido</option>
        </select>
      </div>

      <!-- Status -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status <span class="text-red-500">*</span>
        </label>
        <select
          id="status"
          v-model="formData.status"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="pendente">Pendente</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Sócios "Pendentes" aguardam aprovação. Só sócios "Ativos" podem participar plenamente.
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
          {{ isEditing ? 'Atualizar Sócio' : 'Cadastrar Sócio' }}
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
import { useAdminAssociados } from '../composables/useAdminAssociados'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  categoria: 'benemerito',
  status: 'pendente'
})

const { createAssociado, updateAssociado, loading, error } = useAdminAssociados()
const isEditing = ref(false)

// Sincronizar com valor externo
watch(() => props.modelValue, (val) => {
  if (val && val.id) {
    isEditing.value = true
    formData.value = { ...val }
  } else {
    isEditing.value = false
    formData.value = {
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      endereco: '',
      categoria: 'benemerito',
      status: 'pendente'
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  const requiredFields = ['nome', 'cpf', 'email', 'endereco', 'categoria', 'status']
  for (const field of requiredFields) {
    if (!formData.value[field]) {
      error.value = 'Preencha todos os campos obrigatórios.'
      return
    }
  }

  let result
  if (isEditing.value) {
    result = await updateAssociado(props.modelValue.id, formData.value)
  } else {
    result = await createAssociado(formData.value)
  }

  if (result) {
    emit('submit', result)
  }
}
</script>