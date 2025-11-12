<!-- src/modules/associados/components/FormularioInscricaoSocio.vue -->
<template>
  <div class="formulario-inscricao-socio bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-amajac-green mb-4 dark:text-amajac-green-light text-center">
      Inscrição como Sócio da AMAJAC
    </h2>
    <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
      A AMAJAC é uma associação de moradores do <strong>Jardim Atlântico Central</strong>.
      Qualquer morador pode se associar, independentemente de renda ou atividade profissional.
    </p>

    <div v-if="success" class="mb-6 p-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-lg text-center">
      <i class="mdi mdi-check-circle text-2xl mb-2 block"></i>
      <strong>Inscrição enviada com sucesso!</strong><br />
      Nossa equipe entrará em contato para confirmar sua residência no bairro.
      <br v-if="formData.categoria === 'remido'" />
      <strong v-if="formData.categoria === 'remido'">Candidatos a Sócio Remido</strong> serão avaliados por uma comissão, conforme Art. 4º do Estatuto.
    </div>

    <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-5">
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
          placeholder="Ex: Ana Silva"
        />
      </div>

      <!-- CPF -->
      <div>
        <label for="cpf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          CPF <span class="text-red-500">*</span>
        </label>
        <input
          id="cpf"
          v-model="cpfFormatted"
          type="text"
          required
          maxlength="14"
          inputmode="numeric"
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
          placeholder="ana@email.com"
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
          placeholder="(21) 99999-9999"
        />
      </div>

      <!-- Endereço completo (obrigatório, com bairro explícito) -->
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
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          O endereço deve estar localizado no bairro <strong>Jardim Atlântico Central</strong>, Maricá-RJ (Art. 3º do Estatuto).
        </p>
      </div>

      <!-- Confirmação de residência -->
      <div class="flex items-start gap-3">
        <input
          id="moradorLocal"
          v-model="formData.moradorLocal"
          type="checkbox"
          required
          class="mt-1 h-4 w-4 text-amajac-green focus:ring-amajac-green border-gray-300 rounded"
        />
        <label for="moradorLocal" class="text-sm text-gray-700 dark:text-gray-300">
          <span class="text-red-500">*</span> Confirmo que sou <strong>morador do bairro Jardim Atlântico Central, Maricá-RJ</strong>, conforme exigido pelo Art. 3º do Estatuto Social da AMAJAC.
        </label>
      </div>

      <!-- Categoria de Sócio -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Categoria pretendida <span class="text-red-500">*</span>
        </label>
        <div class="space-y-3">
          <label class="flex items-start gap-3">
            <input
              v-model="formData.categoria"
              type="radio"
              value="benemerito"
              required
              class="mt-1 h-4 w-4 text-amajac-green focus:ring-amajac-green"
            />
            <span>
              <strong>Sócio Benemérito</strong><br />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Contribuição mensal. Tem direito a voto e ser votado (Art. 4º, II).
              </span>
            </span>
          </label>

          <label class="flex items-start gap-3">
            <input
              v-model="formData.categoria"
              type="radio"
              value="remido"
              required
              class="mt-1 h-4 w-4 text-amajac-green focus:ring-amajac-green"
            />
            <span>
              <strong>Sócio Remido</strong><br />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Para moradores em <strong>vulnerabilidade financeira</strong> ou com dependentes em situação de <strong>comorbidade ou necessidade especial</strong>.
                Sem contribuição mensal. Sem direito a voto (Art. 4º, III).
              </span>
            </span>
          </label>
          
        </div>
        <p v-if="formData.categoria === 'remido'" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <i class="mdi mdi-information-outline"></i>
          A solicitação será avaliada por uma comissão, que poderá solicitar documentos, entrevistas ou visitas domiciliares (Parágrafo único do Art. 4º).
        </p>
      </div>

      <!-- Observações (opcional, para remido) -->
      <div v-if="formData.categoria === 'remido'">
        <label for="observacoesRemido" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Informações adicionais (opcional)
        </label>
        <textarea
          id="observacoesRemido"
          v-model="formData.observacoesRemido"
          rows="3"
          maxlength="500"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Descreva brevemente a situação de vulnerabilidade (ex: condição de saúde, dependência financeira, etc.)"
        ></textarea>
      </div>

      <!-- Aviso final -->
      <div class="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p> Ao enviar este formulário, você declara conhecer e concordar com o <a href="/estatuto" target="_blank" class="text-amajac-green hover:underline">Estatuto Social da AMAJAC</a>.</p>
        <p> A falsa declaração de residência no bairro pode resultar em desligamento (Art. 6º, OBS).</p>
        <p> Sócios têm deveres, incluindo participação em assembleias e ações comunitárias (Art. 6º).</p>
      </div>

      <!-- Botão -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-5 py-2.5 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-send"></i>
          Enviar Inscrição
        </button>
      </div>

      <!-- Erro -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 rounded-lg text-sm text-center">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useInscricaoSocio } from '../composables/useInscricaoSocio'

const formData = ref({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: '',
  moradorLocal: false,
  categoria: 'benemerito',
  observacoesRemido: ''
})

const cpfFormatted = ref('')
const { loading, error, success, submitInscricao } = useInscricaoSocio()

// Formatação CPF
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
})

const handleSubmit = () => {
  if (!formData.value.moradorLocal) {
    error.value = 'Você deve confirmar residência no Jardim Atlântico Central.'
    return
  }
  submitInscricao(formData.value)
}
</script>