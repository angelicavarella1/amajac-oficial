<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Carregando evento...</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Evento não encontrado</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">{{ safeString(error) }}</p>
          <router-link
            to="/eventos"
            class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar para Eventos
          </router-link>
        </div>
      </div>

      <div v-else-if="evento" class="max-w-4xl mx-auto">
        <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <router-link to="/" class="hover:text-green-600 transition-colors">Home</router-link>
          <span>/</span>
          <router-link to="/eventos" class="hover:text-green-600 transition-colors">Eventos</router-link>
          <span>/</span>
          <span class="text-gray-800 dark:text-gray-200 font-medium">{{ safeString(evento.titulo) }}</span>
        </nav>

        <!-- ✅ ATUALIZADO: Banner do Evento com useSafeImage() -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div v-if="evento.imagem_url" class="relative h-64 md:h-80 overflow-hidden">
            <!-- Loading State -->
            <div v-if="eventoImageLoading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            
            <!-- Imagem Carregada -->
            <img 
              v-else
              :src="eventoImageUrl" 
              :alt="safeString(evento.titulo)"
              class="w-full h-full object-cover"
            />
            
            <!-- Error State -->
            <div v-if="eventoImageError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <div class="text-center p-4">
                <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
                <p class="text-red-500 text-sm">Falha ao carregar imagem do evento</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full mb-2 inline-block">
                  {{ getEventType(evento) }}
                </span>
                <h1 class="text-3xl font-bold">{{ safeString(evento.titulo) }}</h1>
              </div>
              <span 
                :class="[
                  'text-sm px-3 py-1 rounded-full font-semibold',
                  isEventoFuturo ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                ]"
              >
                {{ isEventoFuturo ? 'Em breve' : 'Realizado' }}
              </span>
            </div>

            <div class="flex flex-wrap gap-6 text-sm">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ formatarData(evento.data_evento || evento.data_hora_evento) }}</span>
              </div>
              
              <div v-if="evento.horario" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ safeString(evento.horario) }}</span>
              </div>

              <div v-if="evento.local" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ safeString(evento.local) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-8">
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Sobre o Evento</h2>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ safeString(evento.descricao || 'Descrição não disponível.') }}
              </p>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Informações do Evento</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="evento.local" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Local</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ safeString(evento.local) }}</p>
                  </div>
                </div>

                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Data e Hora</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-white">
                      {{ formatarDataCompleta(evento.data_evento || evento.data_hora_evento) }}
                      <span v-if="evento.horario"> às {{ safeString(evento.horario) }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-white">
                      {{ evento.ativo ? 'Ativo' : 'Inativo' }}
                      <span v-if="evento.destaque" class="text-yellow-600 dark:text-yellow-400 ml-2">
                        <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        Destaque
                      </span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ getEventType(evento) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  v-if="isEventoFuturo && evento.ativo"
                  @click="inscreverEvento"
                  class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  Inscrever-se
                </button>

                <button
                  @click="compartilharEvento"
                  class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  Compartilhar
                </button>

                <router-link
                  to="/eventos"
                  class="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Voltar para Eventos
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventosStore } from '@/stores/eventos'
import { useSafeImage } from '@/composables/useSafeImage'

const route = useRoute()
const eventosStore = useEventosStore()

// Refs
const evento = ref(null)
const loading = ref(true)
const error = ref(null)

// ✅ ATUALIZADO: useSafeImage() para a imagem do evento
const { 
  imageUrl: eventoImageUrl, 
  loading: eventoImageLoading, 
  error: eventoImageError,
  setUrl: setEventoImageUrl 
} = useSafeImage()

// ✅ ATUALIZADO: Watcher para atualizar a imagem quando o evento carregar
watch(evento, (newEvento) => {
  if (newEvento && newEvento.imagem_url) {
    setEventoImageUrl(newEvento.imagem_url)
  }
}, { immediate: true })

// ✅ CORREÇÃO: Funções de segurança
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

// Computed
const isEventoFuturo = computed(() => {
  if (!evento.value?.data_hora_evento && !evento.value?.data_evento) return false
  try {
    const dataString = evento.value.data_hora_evento || evento.value.data_evento
    const dataEvento = new Date(dataString)
    // Retorna true se a data do evento for maior ou igual à data/hora atual
    return dataEvento >= new Date()
  } catch {
    return false
  }
})

// Methods
const getEventType = (evento) => {
  const titulo = evento.titulo?.toLowerCase() || ''
  const descricao = evento.descricao?.toLowerCase() || ''
  
  if (titulo.includes('workshop') || descricao.includes('workshop')) return 'Workshop'
  if (titulo.includes('reunião') || descricao.includes('reunião')) return 'Reunião'
  if (titulo.includes('reuniao') || descricao.includes('reuniao')) return 'Reunião'
  if (titulo.includes('conferência') || descricao.includes('conferência')) return 'Conferência'
  if (titulo.includes('conferencia') || descricao.includes('conferencia')) return 'Conferência'
  if (titulo.includes('networking') || descricao.includes('networking')) return 'Networking'
  if (titulo.includes('palestra') || descricao.includes('palestra')) return 'Palestra'
  
  return 'Evento'
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data a definir'
  try {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

const formatarDataCompleta = (dataString) => {
  if (!dataString) return 'Data a definir'
  try {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

// ✅ CORREÇÃO: Função de Inscrição ajustada para o alerta
const inscreverEvento = () => {
  alert('🚫 Funcionalidade de Inscrição em Desenvolvimento. Aguarde!')
}

const compartilharEvento = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: safeString(evento.value?.titulo),
        text: safeString(evento.value?.descricao),
        url: window.location.href
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('🔗 URL do evento copiada para a área de transferência!')
    } catch (err) {
      console.log('Erro ao copiar URL:', err)
    }
  }
}

// Função para carregar evento
const loadEvento = async () => {
  const id = route.params.id
  if (!id) {
    error.value = 'ID do evento não fornecido'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null
    
    console.log('🔄 Carregando evento ID:', id)
    
    // Assumindo que a função correta no store é `carregarEventoPorId` ou similar
    let fetchedEvento = null;
    
    if (eventosStore.carregarEventoPorId) {
      // Se a função retornar o objeto diretamente
      fetchedEvento = await eventosStore.carregarEventoPorId(id);
    } 
    
    // Em alguns stores Pinia, a função apenas popula uma ref interna (eventoSelecionado, eventoAtual, etc.)
    if (!fetchedEvento) {
        if (eventosStore.fetchEventoById) {
            await eventosStore.fetchEventoById(id);
        } else if (eventosStore.carregarEvento) {
            await eventosStore.carregarEvento(id);
        } else {
            // Se nenhuma função de carregamento foi encontrada
            throw new Error('Store não possui função para carregar evento por ID');
        }
        
        // Tentativa de obter o evento carregado do estado
        fetchedEvento = eventosStore.eventoSelecionado || eventosStore.eventoAtual || fetchedEvento;
    }

    if (!fetchedEvento) {
      error.value = 'Evento não encontrado. O ID pode estar incorreto ou o evento inativo.'
    } else {
      evento.value = fetchedEvento;
      console.log('✅ Evento carregado:', evento.value)
    }

  } catch (err) {
    console.error('❌ Erro ao carregar evento:', err)
    error.value = err.message || 'Erro ao carregar evento'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvento()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>