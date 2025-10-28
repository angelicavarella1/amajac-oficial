<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Cabeçalho -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">Entre em Contato</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar. Entre em contato conosco através do formulário ou use nossas outras formas de contato.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Informações de Contato -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Card Informações -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Informações de Contato</h3>
              
              <div class="space-y-4">
                <!-- Endereço -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Endereço</p>
                    <p class="text-sm text-gray-600">Rua Exemplo, 123 - Centro</p>
                    <p class="text-sm text-gray-600">São Paulo - SP, 01234-567</p>
                  </div>
                </div>

                <!-- Telefone -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Telefone</p>
                    <p class="text-sm text-gray-600">(11) 3456-7890</p>
                    <p class="text-sm text-gray-600">(11) 98765-4321</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">E-mail</p>
                    <p class="text-sm text-gray-600">contato@amajac.org.br</p>
                    <p class="text-sm text-gray-600">presidente@amajac.org.br</p>
                  </div>
                </div>

                <!-- Horário -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Horário de Atendimento</p>
                    <p class="text-sm text-gray-600">Segunda a Sexta: 8h às 18h</p>
                    <p class="text-sm text-gray-600">Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Redes Sociais -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Redes Sociais</h3>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-green-600 transition-colors duration-200">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-green-600 transition-colors duration-200">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017 12.014 0 12.017 0 12.017 0z"/>
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-green-600 transition-colors duration-200">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Formulário de Contato -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-6">Envie sua Mensagem</h2>
              
              <form @submit.prevent="enviarMensagem" class="space-y-6">
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
                    />
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
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Telefone -->
                  <div>
                    <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      id="telefone"
                      v-model="form.telefone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <!-- Assunto -->
                  <div>
                    <label for="assunto" class="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      v-model="form.assunto"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida">Dúvida</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="reclamacao">Reclamação</option>
                      <option value="parceria">Proposta de Parceria</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <!-- Mensagem -->
                <div>
                  <label for="mensagem" class="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    v-model="form.mensagem"
                    required
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>

                <!-- Botão Submit -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Enviando...
                  </span>
                  <span v-else>
                    Enviar Mensagem
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
                        Mensagem enviada com sucesso! Retornaremos em breve.
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase';

export default {
  name: 'ContatoView',
  setup() {
    const loading = ref(false);
    const success = ref(false);
    const error = ref(null);

    const form = ref({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    });

    const enviarMensagem = async () => {
      loading.value = true;
      error.value = null;
      success.value = false;
      
      try {
        const { error: submitError } = await supabase
          .from('mensagens_contato')
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
          assunto: '',
          mensagem: ''
        };
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        error.value = 'Erro ao enviar mensagem. Por favor, tente novamente.';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      success,
      error,
      enviarMensagem
    };
  }
};
</script>

<style scoped>
input:focus, textarea:focus, select:focus {
  outline: none;
}
</style>