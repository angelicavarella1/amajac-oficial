<template>
  <!-- Modal de Cadastro de Associado -->
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      
      <!-- Cabeçalho do Modal -->
      <div class="bg-green-600 text-white p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">Cadastro de Associado AMAJAC</h2>
            <p class="text-green-100 mt-1">Preencha seus dados para se tornar um associado</p>
          </div>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-green-200 transition-colors p-2 rounded-full hover:bg-green-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Conteúdo do Formulário -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <form @submit.prevent="enviarCadastro" class="space-y-6">
          
          <!-- Dados Pessoais -->
          <div class="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Dados Pessoais</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Nome Completo -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  v-model="form.nome"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Digite seu nome completo"
                >
              </div>

              <!-- CPF -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPF *
                </label>
                <input
                  v-model="form.cpf"
                  type="text"
                  required
                  @input="formatarCPF"
                  maxlength="14"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="000.000.000-00"
                >
                <p class="text-xs text-gray-500 mt-1">Será usado para verificação única</p>
              </div>

              <!-- Telefone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone/WhatsApp *
                </label>
                <input
                  v-model="form.telefone"
                  type="tel"
                  required
                  @input="formatarTelefone"
                  maxlength="15"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="(21) 99999-9999"
                >
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="seu@email.com"
                >
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Endereço Residencial</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- CEP -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CEP *
                </label>
                <div class="flex gap-2">
                  <input
                    v-model="endereco.cep"
                    type="text"
                    required
                    @input="formatarCEP"
                    maxlength="9"
                    @blur="buscarCEP"
                    class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="00000-000"
                  >
                  <button
                    type="button"
                    @click="buscarCEP"
                    class="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    :disabled="!endereco.cep || endereco.cep.replace(/\D/g, '').length !== 8"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <!-- Logradouro -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logradouro *
                </label>
                <input
                  v-model="endereco.logradouro"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Rua, Avenida, etc."
                >
              </div>

              <!-- Número -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número *
                </label>
                <input
                  v-model="endereco.numero"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Nº"
                >
              </div>

              <!-- Complemento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complemento
                </label>
                <input
                  v-model="endereco.complemento"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Apto, Bloco, etc."
                >
              </div>

              <!-- Bairro -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bairro *
                </label>
                <input
                  v-model="endereco.bairro"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Jardim Atlântico Central"
                  value="Jardim Atlântico Central"
                >
              </div>

              <!-- Cidade -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade *
                </label>
                <input
                  v-model="endereco.cidade"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Maricá"
                  value="Maricá"
                >
              </div>

              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado *
                </label>
                <input
                  v-model="endereco.estado"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="RJ"
                  value="RJ"
                >
              </div>
            </div>
          </div>

          <!-- Informações Profissionais -->
          <div class="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informações Profissionais</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Profissão -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profissão/Ocupação *
                </label>
                <input
                  v-model="form.profissao"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Sua profissão ou área de atuação"
                >
              </div>
            </div>
          </div>

          <!-- Motivação -->
          <div class="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Motivação</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Por que você quer se tornar um associado da AMAJAC? *
              </label>
              <textarea
                v-model="form.motivacao"
                required
                rows="4"
                maxlength="500"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Conte um pouco sobre sua motivação para se tornar um associado da AMAJAC..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ form.motivacao.length }}/500 caracteres</p>
            </div>
          </div>

          <!-- Termos e Condições -->
          <div class="pb-6">
            <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                id="aceitou_termos"
                v-model="form.aceitou_termos"
                type="checkbox"
                required
                class="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              >
              <label for="aceitou_termos" class="text-sm text-gray-600 dark:text-gray-300">
                Concordo com os 
                <a href="/termos-associacao" target="_blank" class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium underline">
                  termos e condições
                </a> 
                e autorizo o tratamento dos meus dados pessoais para fins de associação à AMAJAC, conforme Lei Geral de Proteção de Dados (LGPD).
              </label>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading || !form.aceitou_termos"
              class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :class="{'opacity-50 cursor-not-allowed': !form.aceitou_termos}"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ loading ? 'Enviando...' : 'Enviar Cadastro' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Toast de Sucesso -->
  <div v-if="showSuccessToast" class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    Cadastro enviado com sucesso! Entraremos em contato em breve.
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { supabase } from '@/supabase'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'success'])

// Estado do formulário - ajustado para a estrutura da tabela
const form = reactive({
  // Campos da tabela socios
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  profissao: '',
  motivacao: '',
  aceitou_termos: false
})

// Endereço separado para montar o campo 'endereco' da tabela
const endereco = reactive({
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: 'Jardim Atlântico Central',
  cidade: 'Maricá',
  estado: 'RJ'
})

const loading = ref(false)
const showSuccessToast = ref(false)

// Formatação de campos
const formatarCPF = () => {
  let valor = form.cpf.replace(/\D/g, '')
  
  if (valor.length > 11) {
    valor = valor.substring(0, 11)
  }
  
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  
  form.cpf = valor
}

const formatarTelefone = () => {
  let valor = form.telefone.replace(/\D/g, '')
  
  if (valor.length > 11) {
    valor = valor.substring(0, 11)
  }
  
  if (valor.length <= 11) {
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2')
    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2')
  }
  
  form.telefone = valor
}

const formatarCEP = () => {
  let valor = endereco.cep.replace(/\D/g, '')
  
  if (valor.length > 8) {
    valor = valor.substring(0, 8)
  }
  
  if (valor.length === 8) {
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2')
  }
  
  endereco.cep = valor
}

// Buscar CEP via API
const buscarCEP = async () => {
  const cep = endereco.cep.replace(/\D/g, '')
  
  if (cep.length !== 8) {
    alert('CEP inválido. Digite um CEP com 8 dígitos.')
    return
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      alert('CEP não encontrado. Verifique o número digitado.')
      return
    }
    
    endereco.logradouro = data.logradouro
    endereco.bairro = data.bairro
    endereco.cidade = data.localidade
    endereco.estado = data.uf
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    alert('Erro ao buscar CEP. Tente novamente.')
  }
}

// Montar endereço completo para salvar no campo 'endereco'
const montarEnderecoCompleto = () => {
  const parts = [
    endereco.logradouro,
    endereco.numero,
    endereco.complemento,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
    endereco.cep
  ].filter(part => part && part.trim() !== '')
  
  return parts.join(', ')
}

// Validar CPF
const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '')
  
  if (cpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false
  
  // Validação do CPF
  let soma = 0
  let resto
  
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
  }
  
  resto = (soma * 10) % 11
  if ((resto === 10) || (resto === 11)) resto = 0
  if (resto !== parseInt(cpf.substring(9, 10))) return false
  
  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
  }
  
  resto = (soma * 10) % 11
  if ((resto === 10) || (resto === 11)) resto = 0
  if (resto !== parseInt(cpf.substring(10, 11))) return false
  
  return true
}

// Envio do formulário
const enviarCadastro = async () => {
  if (!form.aceitou_termos) {
    alert('Você precisa aceitar os termos e condições')
    return
  }

  // Validar CPF
  const cpfLimpo = form.cpf.replace(/\D/g, '')
  if (!validarCPF(cpfLimpo)) {
    alert('CPF inválido. Verifique o número digitado.')
    return
  }

  // Validar campos obrigatórios do endereço
  if (!endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
    alert('Por favor, preencha todos os campos obrigatórios do endereço.')
    return
  }

  loading.value = true
  
  try {
    // Verificar se CPF já existe
    const { data: existingSocio, error: checkError } = await supabase
      .from('socios')
      .select('id')
      .eq('cpf', cpfLimpo)
      .single()

    if (existingSocio) {
      alert('CPF já cadastrado. Entre em contato conosco se precisar de ajuda.')
      return
    }

    // Montar endereço completo
    const enderecoCompleto = montarEnderecoCompleto()

    // Inserir na tabela 'socios' com a estrutura existente
    const { data, error } = await supabase
      .from('socios')
      .insert([{
        nome: form.nome.trim(),
        cpf: cpfLimpo,
        telefone: form.telefone.replace(/\D/g, ''),
        email: form.email.trim().toLowerCase(),
        endereco: enderecoCompleto,
        profissao: form.profissao.trim(),
        status: 'pendente', // Status inicial
        data_inscricao: new Date().toISOString(),
        // created_at é automaticamente preenchido pelo Supabase
        // Campos adicionais para controle interno
        motivacao: form.motivacao.trim(),
        aceitou_termos: form.aceitou_termos
      }])
      .select()

    if (error) throw error

    // Sucesso
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
      emit('success', data[0])
      emit('close')
      resetForm()
    }, 3000)
    
  } catch (error) {
    console.error('Erro ao cadastrar associado:', error)
    
    if (error.code === '23505') { // Violação de chave única
      alert('CPF já cadastrado no sistema. Entre em contato conosco se precisar de ajuda.')
    } else {
      alert('Erro ao enviar cadastro. Tente novamente ou entre em contato conosco.')
    }
  } finally {
    loading.value = false
  }
}

// Reset do formulário
const resetForm = () => {
  // Reset dos campos principais
  Object.keys(form).forEach(key => {
    if (key === 'aceitou_termos') form[key] = false
    else form[key] = ''
  })
  
  // Reset do endereço
  Object.keys(endereco).forEach(key => {
    if (key === 'bairro') endereco[key] = 'Jardim Atlântico Central'
    else if (key === 'cidade') endereco[key] = 'Maricá'
    else if (key === 'estado') endereco[key] = 'RJ'
    else endereco[key] = ''
  })
}

// Fechar modal ao pressionar ESC
watch(() => props.show, (newVal) => {
  if (newVal) {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        emit('close')
      }
    }
    document.addEventListener('keydown', handleEsc)
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }
})

// Reset form quando modal abrir
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>

<style scoped>
/* Animações para o toast */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>