<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8">
          <!-- Header -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Sobre a AMAJAC
            </h2>
            <div class="mt-4 h-1 w-20 bg-primary-600 rounded-full"></div>
          </div>

          <!-- Description -->
          <div class="space-y-4">
            <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              A <strong class="text-primary-600 dark:text-primary-400">Associação de Inovação e Tecnologia AMAJAC</strong> 
              é uma organização sem fins lucrativos dedicada a promover o desenvolvimento tecnológico 
              e fomentar a inovação no Brasil.
            </p>
            
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Desde nossa fundação, trabalhamos para conectar profissionais, empresas e instituições 
              em um ecossistema colaborativo que impulsiona o crescimento e a transformação digital 
              em diversos setores.
            </p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {{ stats.anos }}+
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Anos de Atuação</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {{ stats.membros }}+
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Membros</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {{ stats.eventos }}+
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Eventos</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {{ stats.projetos }}+
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Projetos</div>
            </div>
          </div>

          <!-- Mission, Vision, Values -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-bullseye text-primary-600 dark:text-primary-400 text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Missão</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Promover a inovação e o desenvolvimento tecnológico através da colaboração e educação continuada.
              </p>
            </div>

            <div class="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-eye text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Visão</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Ser referência nacional em ecossistemas de inovação e tecnologia até 2030.
              </p>
            </div>

            <div class="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-heart text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Valores</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Inovação, Colaboração, Transparência, Excelência e Sustentabilidade.
              </p>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <router-link
              to="/torne-se-socio"
              class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors text-center flex items-center justify-center"
            >
              <i class="fas fa-user-plus mr-2"></i>
              Tornar-se Sócio
            </router-link>
            <router-link
              to="/sobre"
              class="border border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 font-medium py-3 px-8 rounded-lg transition-colors text-center flex items-center justify-center"
            >
              <i class="fas fa-info-circle mr-2"></i>
              Saiba Mais
            </router-link>
          </div>
        </div>

        <!-- Image/Visual -->
        <div class="relative">
          <!-- Main Image -->
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/about-hero.jpg"
              alt="Equipe AMAJAC"
              class="w-full h-96 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <!-- Floating Cards -->
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-award text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-lg font-bold text-gray-900 dark:text-white">Prêmio Inovação 2023</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Reconhecimento Nacional</div>
                </div>
              </div>
            </div>

            <div class="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i class="fas fa-users text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-lg font-bold text-gray-900 dark:text-white">Comunidade Ativa</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">+{{ stats.membros }} membros</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Background Elements -->
          <div class="absolute -z-10 top-8 -right-8 w-64 h-64 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20"></div>
          <div class="absolute -z-10 bottom-8 -left-8 w-48 h-48 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"></div>
        </div>
      </div>

      <!-- Partners Section -->
      <div class="mt-20">
        <div class="text-center mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Parceiros e Apoiadores
          </h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trabalhamos em conjunto com organizações que compartilham nossa visão de inovação e desenvolvimento tecnológico
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          <div 
            v-for="partner in partners" 
            :key="partner.id"
            class="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 grayscale hover:grayscale-0"
          >
            <img 
              :src="partner.logo" 
              :alt="partner.name" 
              class="h-12 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  anos: 12,
  membros: 1500,
  eventos: 200,
  projetos: 50
})

const partners = ref([
  {
    id: 1,
    name: 'Google for Startups',
    logo: '/images/partners/google.png'
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: '/images/partners/microsoft.png'
  },
  {
    id: 3,
    name: 'AWS',
    logo: '/images/partners/aws.png'
  },
  {
    id: 4,
    name: 'IBM',
    logo: '/images/partners/ibm.png'
  },
  {
    id: 5,
    name: 'Intel',
    logo: '/images/partners/intel.png'
  },
  {
    id: 6,
    name: 'Cisco',
    logo: '/images/partners/cisco.png'
  }
])

onMounted(() => {
  // Aqui você carregaria os dados da API
})
</script>