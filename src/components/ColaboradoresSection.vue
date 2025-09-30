<template>
  <section id="colaboradores" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-amajac-800 mb-4">Colaboradores</h2>
        <p class="text-xl text-gray-600">Conheça nossos parceiros e colaboradores</p>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" aria-live="polite" aria-label="Carregando colaboradores">
        <div v-for="i in 8" :key="i" class="text-center animate-pulse">
          <div class="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12" role="alert" aria-live="assertive">
        <div class="text-red-600 mb-4" aria-hidden="true">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar colaboradores</h3>
        <p class="text-gray-700 mb-4">{{ error }}</p>
        <button 
          @click="carregarColaboradores"
          class="bg-amajac-500 text-white px-6 py-3 rounded-lg hover:bg-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
          aria-label="Tentar carregar colaboradores novamente"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Grid de Colaboradores -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" aria-live="polite">
        <div 
          v-for="colaborador in colaboradores" 
          :key="colaborador.id"
          class="text-center group"
        >
          <div class="bg-amajac-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center group-hover:bg-amajac-200 transition-colors">
            <img 
              v-if="colaborador.logo_url"
              :src="colaborador.logo_url" 
              :alt="`Logo ${colaborador.nome}`"
              @error="substituirPorPlaceholder"
              loading="lazy"
              class="w-16 h-16 object-contain rounded-full"
            >
            <div v-else class="text-amajac-500 font-bold text-lg">
              {{ colaborador.nome.charAt(0) }}
            </div>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">{{ colaborador.nome }}</h3>
          <p class="text-sm text-gray-600">{{ colaborador.tipo }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && colaboradores.length === 0" class="text-center py-12" aria-live="polite">
        <div class="text-gray-500 mb-4" aria-hidden="true">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Em busca de colaboradores</h3>
        <p class="text-gray-700 mb-4">Estamos formando parcerias para fortalecer nossa comunidade</p>
        <button 
          @click="scrollToSection('#contato')"
          class="bg-amajac-500 text-white px-6 py-3 rounded-lg hover:bg-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
        >
          Seja um Colaborador
        </button>
      </div>

      <!-- Seção de Apoio -->
      <div class="mt-16 bg-amajac-50 rounded-2xl p-8 text-center">
        <h3 class="text-2xl font-semibold text-amajac-800 mb-4">Quer Apoiar a AMAJAC?</h3>
        <p class="text-gray-700 mb-6 max-w-2xl mx-auto">
          Sua empresa ou organização pode fazer parte dessa rede de transformação comunitária. 
          Juntos, podemos realizar ainda mais pelo Jardim Atlântico Central.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="scrollToSection('#contato')"
            class="bg-amajac-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
          >
            Seja um Parceiro
          </button>
          <a
            href="https://wa.me/5521978979840?text=Olá! Gostaria de saber mais sobre como apoiar a AMAJAC."
            target="_blank"
            rel="noopener noreferrer"
            class="border-2 border-amajac-500 text-amajac-500 px-6 py-3 rounded-lg font-semibold hover:bg-amajac-500 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SupabaseService } from '../services/supabaseService'

export default {
  name: 'ColaboradoresSection',
  data() {
    return {
      colaboradores: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.carregarColaboradores()
  },
  methods: {
    async carregarColaboradores() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await SupabaseService.getColaboradores()
        if (error) throw error
        this.colaboradores = data || []
      } catch (error) {
        console.error('Erro ao carregar colaboradores:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    substituirPorPlaceholder(event) {
      event.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f0f9f0"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%233a9a3a" text-anchor="middle" dy=".3em">Parceiro</text></svg>`
      event.target.onerror = null
    },
    scrollToSection(sectionId) {
      const element = document.querySelector(sectionId)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.offsetTop - headerOffset
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>