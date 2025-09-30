<template>
  <section id="eventos" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-amajac-800 mb-4">
          Eventos
        </h2>
        <div class="w-24 h-1 bg-amajac-500 mx-auto mb-6"></div>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Participe dos nossos eventos e atividades comunitárias. Junte-se a nós para momentos de integração e diversão!
        </p>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Skeleton para Próximos Eventos -->
        <div>
          <div class="h-8 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
          <div class="space-y-6">
            <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300 animate-pulse">
              <div class="flex justify-between items-start mb-3">
                <div class="h-6 bg-gray-200 rounded w-3/4"></div>
                <div class="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div class="flex flex-wrap gap-4 mt-4">
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton para Eventos Passados -->
        <div>
          <div class="h-8 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
          <div class="space-y-6">
            <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300 animate-pulse">
              <div class="flex justify-between items-start mb-3">
                <div class="h-6 bg-gray-200 rounded w-3/4"></div>
                <div class="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div class="flex items-center mt-4">
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar eventos</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="carregarEventos"
          class="bg-amajac-500 text-white px-6 py-3 rounded-lg hover:bg-amajac-600 transition"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Próximos Eventos -->
        <div>
          <h3 class="text-2xl font-semibold text-amajac-700 mb-8 flex items-center">
            <svg class="w-6 h-6 mr-3 text-amajac-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Próximos Eventos
          </h3>
          
          <div class="space-y-6">
            <div 
              v-for="evento in eventosFuturos" 
              :key="evento.id"
              class="bg-amajac-50 rounded-xl p-6 border-l-4 border-amajac-500 hover:shadow-md transition group"
            >
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-xl font-semibold text-amajac-800 group-hover:text-amajac-700 transition">
                  {{ evento.titulo }}
                </h4>
                <span class="bg-amajac-500 text-white text-sm px-3 py-1 rounded-full whitespace-nowrap">
                  {{ formatDate(evento.data_evento) }}
                </span>
              </div>
              
              <p class="text-gray-700 mb-4 leading-relaxed">
                {{ evento.descricao }}
              </p>
              
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ evento.local }}
                </div>
                <div v-if="evento.horario" class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ evento.horario }}
                </div>
              </div>

              <!-- Se houver imagem do evento -->
              <div v-if="evento.imagem_url" class="mt-4">
                <img 
                  :src="evento.imagem_url" 
                  :alt="evento.titulo"
                  @error="substituirPorPlaceholder"
                  loading="lazy"
                  class="w-full h-32 object-cover rounded-lg"
                >
              </div>
            </div>

            <!-- Empty State para eventos futuros -->
            <div v-if="eventosFuturos.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-700 mb-2">Nenhum evento programado</h4>
              <p class="text-gray-600">Fique atento às nossas redes sociais para novidades!</p>
            </div>
          </div>
        </div>

        <!-- Eventos Passados -->
        <div>
          <h3 class="text-2xl font-semibold text-amajac-700 mb-8 flex items-center">
            <svg class="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Eventos Realizados
          </h3>
          
          <div class="space-y-6">
            <div 
              v-for="evento in eventosPassados.slice(0, 4)" 
              :key="evento.id"
              class="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-400 hover:shadow-md transition group"
            >
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-xl font-semibold text-gray-800 group-hover:text-gray-700 transition">
                  {{ evento.titulo }}
                </h4>
                <span class="bg-gray-400 text-white text-sm px-3 py-1 rounded-full whitespace-nowrap">
                  {{ formatDate(evento.data_evento) }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4 leading-relaxed">
                {{ evento.descricao }}
              </p>
              
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ evento.local }}
              </div>

              <!-- Se houver imagem do evento -->
              <div v-if="evento.imagem_url" class="mt-4">
                <img 
                  :src="evento.imagem_url" 
                  :alt="evento.titulo"
                  @error="substituirPorPlaceholder"
                  loading="lazy"
                  class="w-full h-32 object-cover rounded-lg"
                >
              </div>
            </div>

            <!-- Empty State para eventos passados -->
            <div v-if="eventosPassados.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-700 mb-2">Nenhum evento realizado</h4>
              <p class="text-gray-600">Em breve teremos nossa primeira programação!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendário Mini -->
      <div class="mt-16 bg-amajac-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h3 class="text-2xl font-semibold text-amajac-800 text-center mb-8">Calendário de Eventos</h3>
        <div class="bg-white rounded-lg p-6 shadow-inner">
          <div class="text-center text-gray-600">
            <p class="mb-4">Em breve: Calendário interativo com todos os eventos da AMAJAC</p>
            <div class="flex justify-center space-x-4 text-amajac-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Funcionalidade em desenvolvimento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SupabaseService } from '../services/supabaseService'
import { format, isAfter, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default {
  name: 'EventosSection',
  data() {
    return {
      eventos: [],
      loading: true,
      error: null
    }
  },
  computed: {
    eventosFuturos() {
      const now = new Date()
      return this.eventos.filter(evento => 
        isAfter(new Date(evento.data_evento), now)
      ).sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento))
    },
    eventosPassados() {
      const now = new Date()
      return this.eventos.filter(evento => 
        isBefore(new Date(evento.data_evento), now)
      ).sort((a, b) => new Date(b.data_evento) - new Date(a.data_evento))
    }
  },
  async mounted() {
    await this.carregarEventos()
  },
  methods: {
    async carregarEventos() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await SupabaseService.getEventos()
        if (error) throw error
        this.eventos = data || []
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return format(new Date(date), "dd 'de' MMMM", { locale: ptBR })
    },
    substituirPorPlaceholder(event) {
      // Método preparado para quando adicionarmos imagens aos eventos
      event.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f9f0"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%233a9a3a" text-anchor="middle" dy=".3em">Evento AMAJAC</text></svg>`
      event.target.onerror = null
    }
  }
}
</script>