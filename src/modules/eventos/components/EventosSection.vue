<template>
<section id="eventos" class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-amajac-800 mb-4"> Eventos </h2>
      <div class="w-24 h-1 bg-amajac-500 mx-auto mb-6"/>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto"> Participe dos nossos eventos e atividades comunitárias.
        Junte-se a nós para momentos de integração e diversão! </p>
    </div>

    <div v-if="loading" class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      <div>
        <div class="h-8 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"/>
        <div class="space-y-6">
          <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300 animate-pulse">
            <div class="flex justify-between items-start mb-3">
              <div class="h-6 bg-gray-200 rounded w-3/4"/>
              <div class="h-6 bg-gray-200 rounded w-1/4"/>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"/>
              <div class="h-4 bg-gray-200 rounded w-5/6"/>
            </div>
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="h-4 bg-gray-200 rounded w-1/3"/>
              <div class="h-4 bg-gray-200 rounded w-1/4"/>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="h-8 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"/>
        <div class="space-y-6">
          <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300 animate-pulse">
            <div class="flex justify-between items-start mb-3">
              <div class="h-6 bg-gray-200 rounded w-3/4"/>
              <div class="h-6 bg-gray-200 rounded w-1/4"/>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"/>
              <div class="h-4 bg-gray-200 rounded w-5/6"/>
            </div>
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="h-4 bg-gray-200 rounded w-1/3"/>
              <div class="h-4 bg-gray-200 rounded w-1/4"/>
            </div>
          </div>
        </div>
      </div>
    </div> 
    
    <div v-else-if="eventos.length > 0" class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      
      <div v-if="eventosFuturos.length > 0">
        <h3 class="text-2xl md:text-3xl font-bold text-amajac-500 mb-6 border-b-2 pb-2">
          Próximos Eventos ({{ eventosFuturos.length }})
        </h3>
        <div class="space-y-8">
          <div 
            v-for="evento in eventosFuturos" 
            :key="evento.id"
            class="card-amajac p-6 border-l-4 border-amajac-500 flex flex-col hover:shadow-xl transition-shadow duration-300 group"
          >
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-amajac-600 transition-colors">
                {{ evento.titulo }}
              </h4>
              <span class="text-sm font-semibold text-amajac-500 bg-amajac-50 px-3 py-1 rounded-full flex-shrink-0">
                Próximo
              </span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ evento.descricao }}</p>
            
            <div class="flex flex-wrap gap-4 text-sm text-gray-500 mt-auto">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-amajac-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-4 10v4m-4-4h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span>{{ formatarDataCompleta(evento.data_evento) }}</span>
                <span class="ml-1 text-xs text-gray-400">@ {{ evento.horario || extrairHora(evento.data_evento) }}</span>
              </div>
              
              <div v-if="evento.local" class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-amajac-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{{ evento.local }}</span>
              </div>
            </div>

            <!-- 🔥 BOTÃO VER DETALHES ADICIONADO -->
            <div class="mt-4 flex gap-3">
              <router-link 
                :to="`/eventos/${evento.id}`"
                class="inline-flex items-center bg-amajac-600 hover:bg-amajac-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <span>Ver Detalhes</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </router-link>

              <a 
                v-if="evento.link_inscricao"
                :href="evento.link_inscricao"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <span>Inscrever-se</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="eventosPassados.length > 0">
        <h3 class="text-2xl md:text-3xl font-bold text-gray-500 mb-6 border-b-2 pb-2">
          Eventos Anteriores ({{ eventosPassados.length }})
        </h3>
        <div class="space-y-8">
          <div 
            v-for="evento in eventosPassados" 
            :key="evento.id"
            class="card-amajac p-6 border-l-4 border-gray-300 flex flex-col opacity-80"
          >
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-xl font-bold text-gray-800 line-clamp-1">{{ evento.titulo }}</h4>
              <span class="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full flex-shrink-0">
                Realizado
              </span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ evento.descricao }}</p>

            <div class="flex flex-wrap gap-4 text-sm text-gray-500 mt-auto">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-4 10v4m-4-4h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span>{{ formatarDataCompleta(evento.data_evento) }}</span>
                <span class="ml-1 text-xs text-gray-400">@ {{ evento.horario || extrairHora(evento.data_evento) }}</span>
              </div>
              
              <div v-if="evento.local" class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{{ evento.local }}</span>
              </div>
            </div>

            <!-- 🔥 BOTÃO VER DETALHES PARA EVENTOS PASSADOS -->
            <div class="mt-4">
              <router-link 
                :to="`/eventos/${evento.id}`"
                class="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <span>Ver Detalhes</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="eventosFuturos.length === 0 && eventosPassados.length > 0">
        <h3 class="text-2xl md:text-3xl font-bold text-amajac-500 mb-6 border-b-2 pb-2">
          Próximos Eventos (0)
        </h3>
        <div class="text-center py-10 bg-gray-50 rounded-xl">
          <div class="text-4xl mb-3">🎉</div>
          <p class="text-lg text-gray-600">Nenhum evento futuro agendado no momento.</p>
          <p class="text-sm text-gray-500 mt-2">Fique atento às nossas redes sociais para novidades!</p>
        </div>
      </div>
      
      <div v-if="eventosPassados.length === 0 && eventosFuturos.length > 0">
        <h3 class="text-2xl md:text-3xl font-bold text-gray-500 mb-6 border-b-2 pb-2">
          Eventos Anteriores (0)
        </h3>
        <div class="text-center py-10 bg-gray-50 rounded-xl">
          <div class="text-4xl mb-3">🌟</div>
          <p class="text-lg text-gray-600">Esta é a nossa primeira atividade!</p>
          <p class="text-sm text-gray-500 mt-2">Seja bem-vindo à nossa comunidade!</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading && !error" class="text-center py-12 max-w-2xl mx-auto">
      <div class="text-gray-400 text-6xl mb-4">🎯</div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Ainda sem eventos</h3>
      <p class="text-gray-600">Fique de olho! Em breve, teremos atividades e encontros para a comunidade.</p>
    </div>

    <div v-else-if="error" class="text-center py-12 max-w-md mx-auto">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-800 font-medium mb-2">Erro ao carregar eventos</p>
        <p class="text-red-600 text-sm">{{ error }}</p>
        <button 
          @click="fetchEventos" 
          class="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>

  </div>
</section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEventos } from '../composables/useEventos'
import { formatarDataCompleta, extrairHora } from '../supabase'

const { eventos, loading, error, fetchEventos } = useEventos()

// Filtra os eventos futuros (data_evento é maior ou igual a hoje)
const eventosFuturos = computed(() => {
  const hoje = new Date().setHours(0, 0, 0, 0)
  return eventos.value.filter(e => {
    try {
      const dataEvento = new Date(e.data_evento).setHours(0, 0, 0, 0)
      return dataEvento >= hoje && e.ativo !== false
    } catch {
      return false
    }
  })
})

// Filtra os eventos passados (data_evento é menor que hoje)
const eventosPassados = computed(() => {
  const hoje = new Date().setHours(0, 0, 0, 0)
  return eventos.value.filter(e => {
    try {
      const dataEvento = new Date(e.data_evento).setHours(0, 0, 0, 0)
      return dataEvento < hoje
    } catch {
      return false
    }
  })
})

onMounted(() => {
  console.log('🎯 Carregando EventosSection')
  fetchEventos()
})
</script>

<style scoped>
.card-amajac {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.card-amajac:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>