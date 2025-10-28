<!-- src/components/layout/FooterComponent.vue -->
<template>
  <footer class="bg-amajac-700 text-white py-8">
    <div class="container mx-auto px-4">
      <!-- Logo e Informacoes -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
        <!-- Logo AMAJAC -->
        <div class="md:col-span-1">
          <div class="flex flex-col items-center md:items-start">
            <img 
              src="/images/logo-amajac.png" 
              alt="AMAJAC"
              class="h-16 w-auto mb-4 object-contain"
              @error="handleLogoError"
            />
            <h3 class="text-xl font-bold text-center md:text-left">AMAJAC</h3>
            <p class="text-amajac-200 text-sm text-center md:text-left mt-2">
              Associacao Municipal
            </p>
          </div>
        </div>

        <!-- Informacoes de Contato -->
        <div class="md:col-span-1">
          <h3 class="text-lg font-semibold mb-4">Contato</h3>
          <ul class="space-y-2">
            <!-- Telefone -->
            <li v-if="configuracoesStore.contatoTelefone" class="flex items-center">
              <i class="fas fa-phone-alt mr-2"/>
              <a :href="`tel:${configuracoesStore.contatoTelefone}`" class="hover:underline">
                {{ formatarTelefone(configuracoesStore.contatoTelefone) }}
              </a>
            </li>
            <!-- Email -->
            <li v-if="configuracoesStore.contatoEmail" class="flex items-center">
              <i class="fas fa-envelope mr-2"/>
              <a :href="`mailto:${configuracoesStore.contatoEmail}`" class="hover:underline">
                {{ configuracoesStore.contatoEmail }}
              </a>
            </li>
            <!-- Endereco -->
            <li v-if="configuracoesStore.contatoEndereco" class="flex items-start">
              <i class="fas fa-map-marker-alt mr-2 mt-1"/>
              <span>{{ configuracoesStore.contatoEndereco }}</span>
            </li>
          </ul>
        </div>

        <!-- Links Rapidos -->
        <div class="md:col-span-1">
          <h3 class="text-lg font-semibold mb-4">Links Rapidos</h3>
          <ul class="space-y-2">
            <li><router-link to="/" class="hover:underline">Home</router-link></li>
            <li><router-link to="/sobre" class="hover:underline">Sobre</router-link></li>
            <li><router-link to="/noticias" class="hover:underline">Noticias</router-link></li>
            <li><router-link to="/eventos" class="hover:underline">Eventos</router-link></li>
            <li><router-link to="/galeria" class="hover:underline">Galeria</router-link></li>
            <li><router-link to="/contato" class="hover:underline">Contato</router-link></li>
            <li><router-link to="/termos" class="hover:underline">Termos de Uso</router-link></li>
            <li><router-link to="/politica" class="hover:underline">Politica de Privacidade</router-link></li>
          </ul>
        </div>

        <!-- Redes Sociais -->
        <div class="md:col-span-1">
          <h3 class="text-lg font-semibold mb-4">Siga-nos</h3>
          <div class="flex space-x-4">
            <!-- Facebook -->
            <a v-if="configuracoesStore.redesSociais.facebook"
               :href="configuracoesStore.redesSociais.facebook"
               target="_blank"
               rel="noopener noreferrer"
               class="text-white hover:text-amajac-200 transition-colors duration-200"
               aria-label="Facebook">
              <i class="fab fa-facebook-f text-xl"/>
            </a>
            <!-- Instagram -->
            <a v-if="configuracoesStore.redesSociais.instagram"
               :href="configuracoesStore.redesSociais.instagram"
               target="_blank"
               rel="noopener noreferrer"
               class="text-white hover:text-amajac-200 transition-colors duration-200"
               aria-label="Instagram">
              <i class="fab fa-instagram text-xl"/>
            </a>
            <!-- WhatsApp -->
            <a v-if="configuracoesStore.redesSociais.whatsapp"
               :href="`https://wa.me/${configuracoesStore.redesSociais.whatsapp}`"
               target="_blank"
               rel="noopener noreferrer"
               class="text-white hover:text-amajac-200 transition-colors duration-200"
               aria-label="WhatsApp">
              <i class="fab fa-whatsapp text-xl"/>
            </a>
          </div>
          
          <!-- Horario de Atendimento -->
          <div class="mt-4 p-3 bg-amajac-600 rounded-lg">
            <h4 class="text-sm font-semibold mb-1">Horario de Atendimento</h4>
            <p class="text-xs text-amajac-200">
              Segunda a Sexta: 8h as 17h
            </p>
          </div>
        </div>
      </div>

      <!-- Divisoria -->
      <hr class="border-amajac-600 my-6" />

      <!-- Copyright -->
      <div class="text-center">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-amajac-300 text-sm mb-2 md:mb-0">
            &copy; {{ new Date().getFullYear() }} AMAJAC. Todos os direitos reservados.
          </p>
          <div class="flex items-center space-x-4 text-amajac-300 text-sm">
            <router-link to="/termos" class="hover:text-white transition-colors">
              Termos de Uso
            </router-link>
            <span>•</span>
            <router-link to="/politica" class="hover:text-white transition-colors">
              Politica de Privacidade
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue';
import { useConfiguracoesStore } from '@/shared/stores/useConfigStore';

const configuracoesStore = useConfiguracoesStore();
const logoError = ref(false)

// Funcao para lidar com erro no carregamento da logo
const handleLogoError = (event) => {
  console.error('Erro ao carregar logo no footer:', event)
  logoError.value = true
  // Fallback: tentar caminho alternativo apos um tempo
  setTimeout(() => {
    if (logoError.value) {
      event.target.src = '/images/logo-amajac.png'
    }
  }, 100)
}

// Funcao para formatar o telefone
const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  return telefone;
};

// Carrega as configuracoes ao montar o componente
onMounted(async () => {
  console.log("FooterComponent: Carregando configuracoes...");
  try {
    await configuracoesStore.carregarConfiguracoes();
    console.log("FooterComponent: Configuracoes carregadas com sucesso.");
  } catch (error) {
    console.error("FooterComponent: Erro ao carregar configuracoes para o rodape:", error);
  }
});
</script>

<style scoped>
/* Estilos especificos do footer se necessario */
</style>