<template>
  <section id="galeria" class="py-20 bg-gray-50" aria-labelledby="galeria-title">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h2 id="galeria-title" class="text-4xl md:text-5xl font-bold text-amajac-800 mb-4">
          Galeria de Fotos
        </h2>
        <div class="w-24 h-1 bg-amajac-500 mx-auto mb-6" aria-hidden="true"></div>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto">
          Confira os melhores momentos dos nossos eventos e atividades comunitárias
        </p>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-live="polite" aria-label="Carregando galeria">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-lg h-48"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12" role="alert" aria-live="assertive">
        <div class="text-red-600 mb-4" aria-hidden="true">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar galeria</h3>
        <p class="text-gray-700 mb-4">{{ error }}</p>
        <button 
          @click="carregarFotos"
          class="bg-amajac-500 text-white px-6 py-3 rounded-lg hover:bg-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
          aria-label="Tentar carregar galeria novamente"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Grid de Fotos -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-live="polite">
        <div 
          v-for="(foto, index) in fotos" 
          :key="foto.id"
          class="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus-within:ring-2 focus-within:ring-amajac-500 focus-within:ring-offset-2"
          tabindex="0"
          @click="abrirLightbox(index)"
          @keydown.enter="abrirLightbox(index)"
          @keydown.space="abrirLightbox(index)"
        >
          <img 
            :src="foto.url" 
            :alt="foto.descricao || 'Foto da galeria AMAJAC'"
            @error="substituirPorPlaceholder"
            loading="lazy"
            class="w-full h-48 object-cover group-hover:brightness-75 transition duration-300"
          >
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
            <svg class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && fotos.length === 0" class="text-center py-12" aria-live="polite">
        <div class="text-gray-500 mb-4" aria-hidden="true">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Nenhuma foto publicada</h3>
        <p class="text-gray-700">Em breve teremos imagens para compartilhar!</p>
      </div>

      <!-- Lightbox -->
      <div v-if="lightboxAtivo" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" :aria-label="'Visualizando foto ' + (indiceLightbox + 1) + ' de ' + fotos.length">
        <div class="relative max-w-4xl w-full max-h-full">
          <!-- Botão Fechar -->
          <button 
            @click="fecharLightbox"
            @keydown.enter="fecharLightbox"
            @keydown.space="fecharLightbox"
            class="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            aria-label="Fechar visualização de foto"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Botão Anterior -->
          <button 
            v-if="fotos.length > 1"
            @click="fotoAnterior"
            @keydown.enter="fotoAnterior"
            @keydown.space="fotoAnterior"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            aria-label="Foto anterior"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Botão Próximo -->
          <button 
            v-if="fotos.length > 1"
            @click="proximaFoto"
            @keydown.enter="proximaFoto"
            @keydown.space="proximaFoto"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            aria-label="Próxima foto"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Imagem Lightbox -->
          <div class="flex items-center justify-center h-full">
            <img 
              :src="fotos[indiceLightbox].url" 
              :alt="fotos[indiceLightbox].descricao || 'Foto da galeria AMAJAC'"
              @error="substituirPorPlaceholderLightbox"
              loading="eager"
              class="max-w-full max-h-full object-contain"
            >
          </div>

          <!-- Contador -->
          <div v-if="fotos.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1" aria-hidden="true">
            {{ indiceLightbox + 1 }} / {{ fotos.length }}
          </div>

          <!-- Descrição -->
          <div v-if="fotos[indiceLightbox].descricao" class="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 rounded-lg p-2 max-w-md">
            {{ fotos[indiceLightbox].descricao }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SupabaseService } from '../services/supabaseService'

export default {
  name: 'GaleriaSection',
  data() {
    return {
      fotos: [],
      loading: true,
      error: null,
      lightboxAtivo: false,
      indiceLightbox: 0
    }
  },
  async mounted() {
    await this.carregarFotos()
  },
  methods: {
    async carregarFotos() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await SupabaseService.getFotos()
        if (error) throw error
        this.fotos = data || []
      } catch (error) {
        console.error('Erro ao carregar fotos:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    abrirLightbox(index) {
      this.indiceLightbox = index
      this.lightboxAtivo = true
      document.body.style.overflow = 'hidden'
    },
    fecharLightbox() {
      this.lightboxAtivo = false
      document.body.style.overflow = 'auto'
    },
    proximaFoto() {
      this.indiceLightbox = (this.indiceLightbox + 1) % this.fotos.length
    },
    fotoAnterior() {
      this.indiceLightbox = (this.indiceLightbox - 1 + this.fotos.length) % this.fotos.length
    },
    substituirPorPlaceholder(event) {
      event.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f9f0"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="%233a9a3a" text-anchor="middle" dy=".3em">AMAJAC Gallery</text></svg>`
      event.target.onerror = null
    },
    substituirPorPlaceholderLightbox(event) {
      event.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f0f9f0"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%233a9a3a" text-anchor="middle" dy=".3em">AMAJAC Gallery</text></svg>`
      event.target.onerror = null
    }
  }
}
</script>