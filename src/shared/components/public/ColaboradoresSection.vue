<template>
  <section id="parceiros" class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Nossos Parceiros Comerciais
      </h2>
      <p class="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
        Apoie o comercio local que apoia a nossa associacao.
      </p>

      <div v-if="parceiros.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <ParceiroCard 
          v-for="parceiro in parceiros.slice(0, 8)" 
          :key="parceiro.id" 
          :parceiro="parceiro"
          @click="abrirDetalhes(parceiro)"
        />
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"/>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando parceiros...</p>
      </div>
      
      <div v-if="!loading && parceiros.length === 0" class="text-center py-12">
        <i class="fas fa-store text-6xl text-gray-400 mb-4"/>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Em breve teremos parceiros comerciais
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Estamos trabalhando para trazer os melhores comercios locais para voce.
        </p>
      </div>

      <!-- Botao para ver todos -->
      <div v-if="parceiros.length > 0" class="text-center mt-12">
        <RouterLink
          to="/parceiros"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300"
        >
          Ver Todos os Parceiros
          <i class="fas fa-arrow-right ml-2"/>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePublicColaboradores } from '@/shared/composables/usePublicColaboradores'
import ParceiroCard from '@/components/ParceiroCard.vue'

const router = useRouter()
const { parceiros, loading, carregarParceiros } = usePublicColaboradores()

const abrirDetalhes = (parceiro) => {
  router.push(`/parceiros/${parceiro.id}`)
}

onMounted(() => {
  carregarParceiros()
})
</script>