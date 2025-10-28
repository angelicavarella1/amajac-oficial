<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <button 
            @click="voltar" 
            class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <i class="fas fa-arrow-left mr-2"/>
            Voltar
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Detalhes do Parceiro</h1>
          <div class="w-8"/>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"/>
      </div>

      <!-- Parceiro Details -->
      <div v-else-if="parceiro" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="relative bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
          <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <!-- Logo -->
            <div class="relative">
              <div class="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <img 
                  v-if="parceiro.logo_url"
                  :src="parceiro.logo_url" 
                  :alt="parceiro.imagem_alt || parceiro.nome"
                  class="w-full h-full object-contain rounded-full"
                />
                <i v-else class="fas fa-store text-4xl text-primary-600"/>
              </div>
            </div>

            <!-- Basic Info -->
            <div class="flex-1 text-center lg:text-left">
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">{{ parceiro.nome }}</h1>
              <p class="text-xl text-primary-100 mb-4">{{ parceiro.tipo }}</p>
              <p class="text-primary-200 mb-6 max-w-2xl">{{ parceiro.descricao_curta }}</p>
              
              <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
                <span v-if="parceiro.ramo" class="flex items-center">
                  <i class="fas fa-tag mr-2"/>
                  {{ parceiro.ramo }}
                </span>
                <span v-if="parceiro.data_inicio" class="flex items-center">
                  <i class="fas fa-calendar-alt mr-2"/>
                  Desde {{ formatData(parceiro.data_inicio) }}
                </span>
                <span class="flex items-center">
                  <i class="fas fa-check-circle mr-2"/>
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
                <i class="fas fa-globe mr-2"/>
                Site
              </a>
              <a 
                v-if="parceiro.instagram"
                :href="parceiro.instagram" 
                target="_blank"
                class="flex items-center justify-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <i class="fab fa-instagram mr-2"/>
                Instagram
              </a>
              <a 
                v-if="parceiro.facebook"
                :href="parceiro.facebook" 
                target="_blank"
                class="flex items-center justify-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <i class="fab fa-facebook-f mr-2"/>
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
                  {{ parceiro.descricao_curta || 'Estabelecimento parceiro da nossa comunidade local.' }}
                </p>
              </section>

              <!-- Contato -->
              <section>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Informações de Contato</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="parceiro.endereco" class="flex items-start gap-3">
                    <i class="fas fa-map-marker-alt text-primary-600 dark:text-primary-400 mt-1"/>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">Endereço</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ parceiro.endereco }}</p>
                    </div>
                  </div>
                  
                  <div v-if="parceiro.telefone" class="flex items-start gap-3">
                    <i class="fas fa-phone text-primary-600 dark:text-primary-400 mt-1"/>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">Telefone</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ parceiro.telefone }}</p>
                    </div>
                  </div>

                  <div v-if="parceiro.email_contato" class="flex items-start gap-3">
                    <i class="fas fa-envelope text-primary-600 dark:text-primary-400 mt-1"/>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">E-mail</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ parceiro.email_contato }}</p>
                    </div>
                  </div>

                  <div v-if="parceiro.cnpj" class="flex items-start gap-3">
                    <i class="fas fa-id-card text-primary-600 dark:text-primary-400 mt-1"/>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">CNPJ</h3>
                      <p class="text-gray-700 dark:text-gray-300">{{ parceiro.cnpj }}</p>
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
                  <div :class="['w-3 h-3 rounded-full mr-3', parceiro.ativo ? 'bg-green-500' : 'bg-gray-500']"/>
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
              <div v-if="parceiro.tags && parceiro.tags.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Serviços & Características</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="etiqueta in parceiro.tags" 
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
                    v-if="parceiro.instagram"
                    :href="parceiro.instagram" 
                    target="_blank"
                    class="flex items-center justify-center w-10 h-10 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
                    title="Instagram"
                  >
                    <i class="fab fa-instagram"/>
                  </a>
                  <a 
                    v-if="parceiro.facebook"
                    :href="parceiro.facebook" 
                    target="_blank"
                    class="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    title="Facebook"
                  >
                    <i class="fab fa-facebook-f"/>
                  </a>
                  <a 
                    v-if="parceiro.link_site"
                    :href="parceiro.link_site" 
                    target="_blank"
                    class="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    title="Site"
                  >
                    <i class="fas fa-globe"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <i class="fas fa-store-slash text-6xl text-gray-400 mb-4"/>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parceiro não encontrado</h2>
        <p class="text-gray-600 dark:text-gray-400">O parceiro que você está procurando não existe ou foi removido.</p>
        <button 
          @click="voltarParaLista" 
          class="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          Voltar para a Lista
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // ← ADICIONE useRouter
import { usePublicColaboradores } from '@/shared/composables/usePublicColaboradores'

const route = useRoute()
const router = useRouter() // ← INICIALIZE O ROUTER
const { carregarParceiroPorId } = usePublicColaboradores()

const loading = ref(true)
const parceiro = ref(null)

// Função para voltar
const voltar = () => {
  // Tenta voltar para a página anterior, se não houver, vai para a lista de parceiros
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/parceiros')
  }
}

// Função para voltar para a lista de parceiros
const voltarParaLista = () => {
  router.push('/parceiros')
}

onMounted(async () => {
  const parceiroId = route.params.id
  await loadParceiro(parceiroId)
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
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR')
}
</script>