<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <button 
            @click="$router.back()" 
            class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Voltar
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Detalhes do Parceiro</h1>
          <div class="w-8"></div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Parceiro Details -->
      <div v-else-if="parceiro" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="relative bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
          <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <!-- Logo com useSafeImage -->
            <div class="relative">
              <div class="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <div class="image-wrapper w-full h-full">
                  <img 
                    v-if="!logoState.loading && !logoState.error"
                    :src="logoState.imageUrl" 
                    :alt="parceiro.imagem_alt || parceiro.nome"
                    class="w-full h-full object-contain transition-opacity duration-300"
                    :class="{ 'opacity-0': logoState.loading, 'opacity-100': !logoState.loading }"
                    @load="logoState.lazyLoad"
                  />
                  <div v-else-if="logoState.loading" class="placeholder animate-pulse w-full h-full flex items-center justify-center bg-gray-100">
                    <div class="text-center">
                      <i class="fas fa-store text-2xl text-gray-400 mb-2"></i>
                      <span class="text-xs text-gray-500 block">Carregando...</span>
                    </div>
                  </div>
                  <div v-else-if="logoState.error" class="error-state w-full h-full flex items-center justify-center bg-red-50">
                    <div class="text-center">
                      <i class="fas fa-exclamation-triangle text-2xl text-red-400 mb-2"></i>
                      <span class="text-xs text-red-500 block">Erro ao carregar</span>
                    </div>
                  </div>
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                    <i class="fas fa-store text-4xl text-primary-600"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Basic Info -->
            <div class="flex-1 text-center lg:text-left">
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">{{ parceiro.nome }}</h1>
              <p class="text-xl text-primary-100 mb-4">{{ parceiro.tipo }}</p>
              <p class="text-primary-200 mb-6 max-w-2xl">{{ parceiro.descrição_curta }}</p>
              
              <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
                <span v-if="parceiro.ramo" class="flex items-center">
                  <i class="fas fa-tag mr-2"></i>
                  {{ parceiro.ramo }}
                </span>
                <span v-if="parceiro.data_inicio" class="flex items-center">
                  <i class="fas fa-calendar-alt mr-2"></i>
                  Desde {{ formatData(parceiro.data_inicio) }}
                </span>
                <span class="flex items-center">
                  <i class="fas fa-check-circle mr-2"></i>
                  {{ parceiro.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col space-y-3">
              <a 
                v-if="parceiro.link_site"
                :href="parceiro.link_site" 
                target="_blank"
                class="flex items-center justify-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <i class="fas fa-globe mr-2"></i>
                Site
              </a>
              <a 
                v-if="parceiro.Instagram"
                :href="parceiro.Instagram" 
                target="_blank"
                class="flex items-center justify-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <i class="fab fa-instagram mr-2"></i>
                Instagram
              </a>
              <a 
                v-if="parceiro.Facebook"
                :href="parceiro.Facebook" 
                target="_blank"
                class="flex items-center justify-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <i class="fab fa-facebook-f mr-2"></i>
                Facebook
              </a>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Sobre -->
              <section>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre o Estabelecimento</h2>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ parceiro.descrição_curta || 'Estabelecimento parceiro da nossa comunidade local.' }}
                </p>
              </section>

              <!-- Galeria de Imagens (se houver) -->
              <section v-if="parceiro.imagens_adicionais && parceiro.imagens_adicionais.length">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Galeria</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div 
                    v-for="(imagem, index) in parceiro.imagens_adicionais" 
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    <div class="image-wrapper w-full h-full">
                      <img 
                        v-if="!imagem.imageState.loading && !imagem.imageState.error"
                        :src="imagem.imageState.imageUrl" 
                        :alt="`Imagem ${index + 1} do estabelecimento ${parceiro.nome}`"
                        class="w-full h-full object-cover transition-opacity duration-300 cursor-pointer hover:scale-105"
                        :class="{ 'opacity-0': imagem.imageState.loading, 'opacity-100': !imagem.imageState.loading }"
                        @load="imagem.imageState.lazyLoad"
                        @click="abrirGaleria(index)"
                      />
                      <div v-else-if="imagem.imageState.loading" class="placeholder animate-pulse w-full h-full flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                      </div>
                      <div v-else-if="imagem.imageState.error" class="error-state w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                        <i class="fas fa-exclamation-triangle text-red-400"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Contato -->
              <section>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Informações de Contato</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="parceiro.endereco" class="flex items-start gap-3">
                    <i class="fas fa-map-marker-alt text-primary-600 dark:text-primary-400 mt-1"></i>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">Endereço</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ parceiro.endereco }}</p>
                    </div>
                  </div>
                  
                  <div v-if="parceiro.telefone" class="flex items-start gap-3">
                    <i class="fas fa-phone text-primary-600 dark:text-primary-400 mt-1"></i>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">Telefone</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ formatarTelefone(parceiro.telefone) }}</p>
                    </div>
                  </div>

                  <div v-if="parceiro.email_contato" class="flex items-start gap-3">
                    <i class="fas fa-envelope text-primary-600 dark:text-primary-400 mt-1"></i>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">E-mail</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ parceiro.email_contato }}</p>
                    </div>
                  </div>

                  <div v-if="parceiro.cnpj" class="flex items-start gap-3">
                    <i class="fas fa-id-card text-primary-600 dark:text-primary-400 mt-1"></i>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">CNPJ</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ formatarCNPJ(parceiro.cnpj) }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Status -->
              <div :class="['rounded-lg p-6', parceiro.ativo ? 'bg-green-50 dark:bg-green-900' : 'bg-gray-50 dark:bg-gray-700']">
                <div class="flex items-center">
                  <div :class="['w-3 h-3 rounded-full mr-3', parceiro.ativo ? 'bg-green-500' : 'bg-gray-500']"></div>
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white">
                      {{ parceiro.ativo ? 'Parceiro Ativo' : 'Parceiro Inativo' }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ parceiro.ativo ? 'Aceitando clientes' : 'Temporariamente indisponível' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Etiquetas -->
              <div v-if="parceiro.etiquetas && parceiro.etiquetas.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Serviços & Características</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="etiqueta in parceiro.etiquetas" 
                    :key="etiqueta"
                    class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                  >
                    {{ etiqueta }}
                  </span>
                </div>
              </div>

              <!-- Redes Sociais -->
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Siga nas Redes</h3>
                <div class="flex gap-3">
                  <a 
                    v-if="parceiro.Instagram"
                    :href="parceiro.Instagram" 
                    target="_blank"
                    class="flex items-center justify-center w-10 h-10 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
                    title="Instagram"
                  >
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a 
                    v-if="parceiro.Facebook"
                    :href="parceiro.Facebook" 
                    target="_blank"
                    class="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    title="Facebook"
                  >
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a 
                    v-if="parceiro.link_site"
                    :href="parceiro.link_site" 
                    target="_blank"
                    class="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    title="Site"
                  >
                    <i class="fas fa-globe"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <i class="fas fa-store-slash text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parceiro não encontrado</h2>
        <p class="text-gray-600 dark:text-gray-400">O parceiro que você está procurando não existe ou foi removido.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePublicColaboradores } from '@/composables/usePublicColaboradores'
import { useSafeImage } from '@/composables/useSafeImage'

const route = useRoute()
const { carregarParceiroPorId } = usePublicColaboradores()

const loading = ref(true)
const parceiro = ref(null)
const logoState = ref(null)

onMounted(async () => {
  const parceiroId = route.params.id
  await loadParceiro(parceiroId)
})

// Watch para atualizar a imagem quando o parceiro mudar
watch(parceiro, (newParceiro) => {
  if (newParceiro) {
    logoState.value = useSafeImage(newParceiro.logo_url || '')
    
    // Adiciona useSafeImage para imagens adicionais
    if (newParceiro.imagens_adicionais && Array.isArray(newParceiro.imagens_adicionais)) {
      newParceiro.imagens_adicionais = newParceiro.imagens_adicionais.map(imagem => ({
        ...imagem,
        imageState: useSafeImage(imagem.url || '')
      }))
    }
  }
})

async function loadParceiro(id) {
  try {
    loading.value = true
    parceiro.value = await carregarParceiroPorId(id)
  } catch (error) {
    console.error('Erro ao carregar parceiro:', error)
  } finally {
    loading.value = false
  }
}

function formatData(dataString) {
  if (!dataString) return 'Data não informada'
  try {
    const data = new Date(dataString)
    if (isNaN(data.getTime())) return 'Data inválida'
    return data.toLocaleDateString('pt-BR')
  } catch {
    return 'Data inválida'
  }
}

function formatarTelefone(telefone) {
  if (!telefone) return ''
  const numbers = telefone.replace(/\D/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}

function formatarCNPJ(cnpj) {
  if (!cnpj) return ''
  const numbers = cnpj.replace(/\D/g, '')
  if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return cnpj
}

function abrirGaleria(index) {
  // Implementar abertura da galeria em modal
  console.log('Abrir galeria no índice:', index)
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
  color: #6c757d;
}

.error-state {
  background-color: #f8d7da;
  color: #dc3545;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style>