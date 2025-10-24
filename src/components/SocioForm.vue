<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Torne-se Sócio</h2>
      <p class="text-gray-600 mb-8">Preencha o formulário abaixo para solicitar sua associação.</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nome -->
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Seu nome completo"
            >
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="seu@email.com"
            >
          </div>

          <!-- Telefone -->
          <div>
            <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
            >
          </div>

          <!-- CPF -->
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2">
              CPF *
            </label>
            <input
              id="cpf"
              v-model="form.cpf"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="000.000.000-00"
            >
          </div>
        </div>

        <!-- Endereço -->
        <div>
          <label for="endereco" class="block text-sm font-medium text-gray-700 mb-2">
            Endereço Completo
          </label>
          <input
            id="endereco"
            v-model="form.endereco"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Rua, número, bairro, cidade"
          >
        </div>

        <!-- Profissão -->
        <div>
          <label for="profissao" class="block text-sm font-medium text-gray-700 mb-2">
            Profissão/Ocupação
          </label>
          <input
            id="profissao"
            v-model="form.profissao"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Sua profissão ou área de atuação"
          >
        </div>

        <!-- Motivação -->
        <div>
          <label for="motivacao" class="block text-sm font-medium text-gray-700 mb-2">
            Por que quer se tornar sócio? *
          </label>
          <textarea
            id="motivacao"
            v-model="form.motivacao"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Conte um pouco sobre sua motivação para se tornar sócio da AMAJAC..."
          ></textarea>
        </div>

        <!-- Termos -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="termos"
              v-model="form.aceitouTermos"
              type="checkbox"
              required
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            >
          </div>
          <div class="ml-3 text-sm">
            <label for="termos" class="font-medium text-gray-700">
              Concordo com os termos e condições *
            </label>
            <p class="text-gray-500">Ao marcar esta opção, você concorda com nossos termos de associação.</p>
          </div>
        </div>

        <!-- Botão Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
          <span v-else>
            Enviar Solicitação
          </span>
        </button>

        <!-- Mensagem de Sucesso -->
        <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">
                Solicitação enviada com sucesso! Entraremos em contato em breve.
              </p>
            </div>
          </div>
        </div>

        <!-- Mensagem de Erro -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase';

export default {
  name: 'SocioForm',
  setup() {
    const loading = ref(false);
    const success = ref(false);
    const error = ref(null);

    const form = ref({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      endereco: '',
      profissao: '',
      motivacao: '',
      aceitouTermos: false
    });

    const handleSubmit = async () => {
      loading.value = true;
      error.value = null;
      success.value = false;
      
      try {
        const { error: submitError } = await supabase
          .from('solicitacoes_socio')
          .insert([{
            ...form.value,
            status: 'pendente',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (submitError) throw submitError;
        
        success.value = true;
        
        // Reset form
        form.value = {
          nome: '',
          email: '',
          telefone: '',
          cpf: '',
          endereco: '',
          profissao: '',
          motivacao: '',
          aceitouTermos: false
        };
      } catch (err) {
        console.error('Erro ao enviar solicitação:', err);
        error.value = 'Erro ao enviar solicitação. Por favor, tente novamente.';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      success,
      error,
      handleSubmit
    };
  }
};
</script>

<style scoped>
input:focus, textarea:focus {
  outline: none;
  ring: 2px;
}
</style>