<!-- src/components/ColaboradoresSection.vue -->
<template>
  <section id="colaboradores" class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Nossos Parceiros Colaboradores
        </h2>
        <p class="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
          Apoie o comércio local que apoia a nossa associação.
        </p>
      </div>

      <div v-if="parceiros.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        <div 
          v-for="colaborador in parceiros" 
          :key="colaborador.id" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:scale-105"
        >
          <!-- Logo com useSafeImage (CORRIGIDO) -->
          <div class="mb-4 h-20 w-full flex justify-center">
            <div class="image-wrapper h-full max-w-full">
              <!-- Imagem carregada com sucesso -->
              <img 
                v-if="!colaborador._logoState.loading && !colaborador._logoState.error && colaborador._logoState.imageUrl"
                :src="colaborador._logoState.imageUrl" 
                :alt="colaborador.imagem_alt || `Logo de ${colaborador.nome}`" 
                class="max-h-full max-w-full object-contain p-1 rounded-md transition-opacity duration-300"
                :class="{ 'opacity-0': colaborador._logoState.loading, 'opacity-100': !colaborador._logoState.loading }"
                @load="colaborador._logoState.lazyLoad"
                loading="lazy"
              />
              
              <!-- Estado de carregamento -->
              <div v-else-if="colaborador._logoState.loading" class="placeholder animate-pulse w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                <div class="text-center">
                  <i class="fas fa-store text-gray-400 text-xl mb-1"></i>
                  <span class="text-xs text-gray-500 dark:text-gray-400 block">Carregando...</span>
                </div>
              </div>
              
              <!-- Estado de erro -->
              <div v-else-if="colaborador._logoState.error" class="error-state w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-700">
                <div class="text-center">
                  <i class="fas fa-exclamation-triangle text-red-400 text-xl mb-1"></i>
                  <span class="text-xs text-red-500 dark:text-red-400 block">Erro</span>
                </div>
              </div>
              
              <!-- Placeholder padrão -->
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                <i class="fas fa-store text-gray-400 text-2xl"></i>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-2 line-clamp-2">
            {{ colaborador.nome }}
          </h3>
          <span class="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1 mb-3">
            {{ colaborador.tipo }}
          </span>

          <p class="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
            {{ colaborador.descricao_curta || 'Nenhuma descrição disponível.' }}
          </p>

          <!-- Status do Parceiro -->
          <div class="w-full mb-3">
            <span 
              :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                colaborador.ativo 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              <i 
                :class="[
                  'w-2 h-2 rounded-full mr-1',
                  colaborador.ativo ? 'bg-green-500' : 'bg-gray-500'
                ]"
              ></i>
              {{ colaborador.ativo ? 'Ativo' : 'Inativo' }}
            </span>
          </div>

          <div class="mt-4 w-full">
            <a 
              v-if="colaborador.link_site"
              :href="colaborador.link_site" 
              target="_blank" 
              class="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              rel="noopener noreferrer"
            >
              <i class="fas fa-external-link-alt mr-2"></i>
              Visitar Site
            </a>
            <div v-else class="text-center">
              <span class="text-xs text-gray-500 dark:text-gray-400 block mb-2">
                Contato disponível por telefone/endereço.
              </span>
              <div class="flex justify-center space-x-2">
                <button 
                  v-if="colaborador.telefone"
                  @click="copiarTelefone(colaborador.telefone)"
                  class="inline-flex items-center p-2 text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Copiar telefone"
                >
                  <i class="fas fa-phone"></i>
                </button>
                <button 
                  v-if="colaborador.endereco"
                  @click="copiarEndereco(colaborador.endereco)"
                  class="inline-flex items-center p-2 text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Copiar endereço"
                >
                  <i class="fas fa-map-marker-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Redes Sociais -->
          <div v-if="hasRedesSociais(colaborador)" class="flex justify-center space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 w-full">
            <a 
              v-if="colaborador.Instagram"
              :href="colaborador.Instagram" 
              target="_blank"
              class="inline-flex items-center p-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
              title="Instagram"
            >
              <i class="fab fa-instagram"></i>
            </a>
            <a 
              v-if="colaborador.Facebook"
              :href="colaborador.Facebook" 
              target="_blank"
              class="inline-flex items-center p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              title="Facebook"
            >
              <i class="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center gap-3 text-primary-600 dark:text-primary-400">
          <i class="fas fa-spinner fa-spin text-xl"></i>
          <span class="text-lg">Carregando parceiros...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && parceiros.length === 0" class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
          <i class="fas fa-store-slash text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ainda não temos parceiros colaboradores ativos
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Em breve teremos estabelecimentos parceiros para apresentar.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePublicColaboradores } from '@/composables/usePublicColaboradores'
import { useSafeImage } from '@/composables/useSafeImage'
import { useToast } from '@/composables/useToast'

const { parceiros: parceirosData, isLoading, fetchColaboradores } = usePublicColaboradores()
const { showToast } = useToast()

// Computed para parceiros com estado de imagem (CORRIGIDO)
const parceiros = computed(() => {
  return parceirosData.value.map(parceiro => {
    const parceiroComImagem = { ...parceiro };
    
    // Adiciona o estado da imagem usando useSafeImage
    // Armazena como _logoState para evitar conflitos com propriedades existentes
    parceiroComImagem._logoState = useSafeImage(parceiro.logo_url || '');
    
    return parceiroComImagem;
  });
})

onMounted(() => {
  fetchColaboradores()
})

// Métodos utilitários
function hasRedesSociais(colaborador) {
  return !!(colaborador.Instagram || colaborador.Facebook)
}

async function copiarTelefone(telefone) {
  try {
    await navigator.clipboard.writeText(telefone)
    showToast('Telefone copiado!', 'success')
  } catch (error) {
    console.error('Erro ao copiar telefone:', error)
    showToast('Erro ao copiar telefone', 'error')
  }
}

async function copiarEndereco(endereco) {
  try {
    await navigator.clipboard.writeText(endereco)
    showToast('Endereço copiado!', 'success')
  } catch (error) {
    console.error('Erro ao copiar endereço:', error)
    showToast('Erro ao copiar endereço', 'error')
  }
}
</script>

<style scoped>
.image-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  background-color: #f8f9fa;
}

.dark .placeholder {
  background-color: #374151;
}

.error-state {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.dark .error-state {
  background-color: #7f1d1d;
  border: 1px solid #dc2626;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

.hover-scale {
  transition: transform 0.3s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}
</style>