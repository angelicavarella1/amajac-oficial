<!-- src/components/public/ContatoSection.vue -->
<template>
  <section id="contato" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-amajac-700">Contato</h2>
        <p class="text-gray-600 mt-2">Entre em contato conosco. Sua opinião é muito importante!</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Informações de Contato -->
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-amajac-700 mb-6">Informações</h3>
          <ul class="space-y-4">
            <!-- Telefone -->
            <li v-if="configuracoesStore.contatoTelefone" class="flex items-start">
              <i class="fas fa-phone-alt text-amajac-600 mt-1 mr-3"/>
              <div>
                <p class="font-medium">Telefone</p>
                <a :href="`tel:${configuracoesStore.contatoTelefone}`" class="text-gray-700 hover:text-amajac-600">
                  {{ formatarTelefone(configuracoesStore.contatoTelefone) }}
                </a>
              </div>
            </li>
            <!-- Email -->
            <li v-if="configuracoesStore.contatoEmail" class="flex items-start">
              <i class="fas fa-envelope text-amajac-600 mt-1 mr-3"/>
              <div>
                <p class="font-medium">E-mail</p>
                <a :href="`mailto:${configuracoesStore.contatoEmail}`" class="text-gray-700 hover:text-amajac-600">
                  {{ configuracoesStore.contatoEmail }}
                </a>
              </div>
            </li>
            <!-- Endereço -->
            <li v-if="configuracoesStore.contatoEndereco" class="flex items-start">
              <i class="fas fa-map-marker-alt text-amajac-600 mt-1 mr-3"/>
              <div>
                <p class="font-medium">Endereço</p>
                <p class="text-gray-700">{{ configuracoesStore.contatoEndereco }}</p>
              </div>
            </li>
            <!-- Horário de Funcionamento -->
            <li v-if="configuracoesStore.contatoHorarioFuncionamento" class="flex items-start">
              <i class="fas fa-clock text-amajac-600 mt-1 mr-3"/>
              <div>
                <p class="font-medium">Horário de Funcionamento</p>
                <p class="text-gray-700">{{ configuracoesStore.contatoHorarioFuncionamento }}</p>
              </div>
            </li>
          </ul>

          <!-- Redes Sociais -->
          <div class="mt-8">
            <h4 class="text-lg font-semibold text-amajac-700 mb-4">Siga-nos</h4>
            <div class="flex space-x-4">
              <!-- Facebook -->
              <a v-if="configuracoesStore.redesSociais.facebook"
                 :href="configuracoesStore.redesSociais.facebook"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="text-amajac-600 hover:text-amajac-800 transition-colors duration-200"
                 aria-label="Facebook">
                <i class="fab fa-facebook-f text-xl"/>
              </a>
              <!-- Instagram -->
              <a v-if="configuracoesStore.redesSociais.instagram"
                 :href="configuracoesStore.redesSociais.instagram"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="text-amajac-600 hover:text-amajac-800 transition-colors duration-200"
                 aria-label="Instagram">
                <i class="fab fa-instagram text-xl"/>
              </a>
              <!-- Outras redes... (Adicione conforme necessário no banco e na estrutura mapeada) -->
            </div>
          </div>
        </div>

        <!-- Formulário de Contato -->
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-amajac-700 mb-6">Envie uma Mensagem</h3>
          <form @submit.prevent="enviarMensagem">
            <div class="mb-4">
              <label for="nome" class="block text-gray-700 font-medium mb-2">Nome *</label>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amajac-500 focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>
            <div class="mb-4">
              <label for="email" class="block text-gray-700 font-medium mb-2">E-mail *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amajac-500 focus:border-transparent"
                placeholder="seu.email@exemplo.com"
              />
            </div>
            <div class="mb-4">
              <label for="telefone" class="block text-gray-700 font-medium mb-2">Telefone</label>
              <input
                id="telefone"
                v-model="form.telefone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amajac-500 focus:border-transparent"
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
            <div class="mb-4">
              <label for="assunto" class="block text-gray-700 font-medium mb-2">Assunto *</label>
              <input
                id="assunto"
                v-model="form.assunto"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amajac-500 focus:border-transparent"
                placeholder="Assunto da mensagem"
              />
            </div>
            <div class="mb-6">
              <label for="mensagem" class="block text-gray-700 font-medium mb-2">Mensagem *</label>
              <textarea
                id="mensagem"
                v-model="form.mensagem"
                required
                rows="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amajac-500 focus:border-transparent"
                placeholder="Sua mensagem..."
              />
            </div>
            <button
              type="submit"
              :disabled="enviando"
              class="w-full bg-amajac-600 text-white py-3 px-4 rounded-md hover:bg-amajac-700 focus:outline-none focus:ring-2 focus:ring-amajac-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ enviando ? 'Enviando...' : 'Enviar Mensagem' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useConfiguracoesStore } from '@/shared/stores/useConfigStore'; // Ajuste o caminho se necessário
import { publicApi } from '@/supabase/public'; // Para enviar a mensagem via API pública

const configuracoesStore = useConfiguracoesStore();

// Dados do formulário
const form = ref({
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: ''
});

const enviando = ref(false);

// Função para formatar o telefone (ex: (11) 99999-9999)
const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    // Formato (XX) XXXXX-XXXX
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } else if (numeros.length === 10) {
    // Formato (XX) XXXX-XXXX
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  // Retorna o original se não for 10 ou 11 dígitos
  return telefone;
};

// Carrega as configurações ao montar o componente
onMounted(async () => {
  console.log("ContatoSection.vue: Carregando configurações...");
  try {
    await configuracoesStore.carregarConfiguracoes(); // Chama o método da store
    console.log("ContatoSection.vue: Configurações carregadas com sucesso.");
  } catch (error) {
    console.error("ContatoSection.vue: Erro ao carregar configurações para a seção de contato:", error);
  }
});

// Função para enviar a mensagem via API pública
const enviarMensagem = async () => {
  if (enviando.value) return; // Evita múltiplos cliques

  enviando.value = true;
  try {
    console.log("ContatoSection.vue: Enviando mensagem:", form.value);
    // Chama a função de envio da API pública
    await publicApi.mensagens.send(form.value); // Usando o mapeamento definido em src/supabase/public/index.js
    console.log("ContatoSection.vue: Mensagem enviada com sucesso!");
    // Limpa o formulário após envio
    form.value = { nome: '', email: '', telefone: '', assunto: '', mensagem: '' };
  } catch (error) {
    console.error("ContatoSection.vue: Erro ao enviar mensagem:", error);
  } finally {
    enviando.value = false;
  }
};
</script>

<style scoped>
/* Adicione estilos específicos da seção de contato aqui se necessário */
</style>