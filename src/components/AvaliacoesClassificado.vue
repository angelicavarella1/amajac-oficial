<template>
  <div class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
          Avaliações ({{ totalAvaliacoes }})
        </h3>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
               :class="{'bg-green-500': realtimeConnected, 'bg-gray-400': !realtimeConnected}"
               title="Status do tempo real"></div>
          <span class="text-xs text-gray-500">{{ realtimeConnected ? 'Ao vivo' : 'Offline' }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="text-5xl font-extrabold text-green-600 dark:text-green-400">
          {{ mediaEstrelas }}
        </div>
        <div class="flex flex-col">
          <div class="flex text-2xl text-yellow-400 mb-1">
            <span 
              v-for="star in 5" 
              :key="star" 
              :class="[
                'transition-transform duration-300',
                star <= Math.round(mediaEstrelas) ? 'text-yellow-400 scale-110' : 'text-gray-300'
              ]"
            >
              ★
            </span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ mediaEstrelas }} de 5 ({{ totalAvaliacoes }} avaliações)
          </div>
        </div>
      </div>
    </div>

    <!-- Formulário de Avaliação -->
    <div v-if="authStore.isAuthenticated && !hasEvaluated" 
         class="space-y-4 p-4 border-2 border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-gray-700 transition-all duration-300">
      
      <h4 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <span>⭐</span>
        Deixe sua Avaliação
      </h4>
      
      <!-- Seleção de Estrelas -->
      <div class="flex items-center gap-3">
        <label class="font-medium text-gray-700 dark:text-gray-200 min-w-16">Sua nota:</label>
        <div class="flex text-3xl cursor-pointer">
          <span 
            v-for="star in 5" 
            :key="star"
            @click="newNota = star"
            @mouseenter="hoverNota = star"
            @mouseleave="hoverNota = 0"
            class="transition-all duration-200 transform hover:scale-125"
            :class="[
              star <= (hoverNota || newNota) 
                ? 'text-yellow-400 drop-shadow-lg animate-pulse' 
                : 'text-gray-300 hover:text-yellow-200'
            ]"
          >
            ★
          </span>
        </div>
        <span class="text-sm font-medium" 
              :class="newNota > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
          {{ newNota || '0' }} estrela{{ newNota !== 1 ? 's' : '' }}
        </span>
      </div>
      
      <!-- Comentário -->
      <div>
        <textarea 
          v-model="newComentario" 
          rows="3" 
          placeholder="Compartilhe sua experiência com este classificado... (opcional)"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
          maxlength="500"
        ></textarea>
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{{ newComentario.length }}/500 caracteres</span>
          <span v-if="newComentario.length > 450" class="text-orange-500">
            {{ 500 - newComentario.length }} restantes
          </span>
        </div>
      </div>
      
      <!-- Mensagem de Erro -->
      <div v-if="avaliacoesStore.error" 
           class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md animate-shake">
        <p class="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
          <span>⚠️</span>
          {{ avaliacoesStore.error }}
        </p>
      </div>

      <!-- Botão Submit -->
      <button 
        @click="submitAvaliacao"
        :disabled="avaliacoesStore.loading || newNota === 0"
        class="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-md hover:from-green-700 hover:to-green-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
      >
        <span v-if="avaliacoesStore.loading" class="animate-spin">⟳</span>
        <span v-else>📝</span>
        <span>{{ avaliacoesStore.loading ? 'Enviando...' : 'Publicar Avaliação' }}</span>
      </button>
    </div>

    <!-- Estados de Autenticação -->
    <div v-else-if="!authStore.isAuthenticated" 
         class="text-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <p class="text-gray-600 dark:text-gray-300 mb-3">Faça login para compartilhar sua experiência!</p>
      <button 
        @click="$router.push('/login')"
        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
      >
        🔐 Fazer Login
      </button>
    </div>

    <div v-else-if="hasEvaluated" 
         class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
      <p class="text-blue-700 dark:text-blue-400 font-medium flex items-center justify-center gap-2">
        <span>✅</span>
        Você já avaliou este classificado. Obrigado pelo feedback!
      </p>
    </div>

    <!-- Lista de Avaliações -->
    <div v-if="avaliacoes.length > 0" class="space-y-4 pt-6">
      <div 
        v-for="(avaliacao, index) in avaliacoes" 
        :key="avaliacao.id"
        class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:shadow-md"
        :style="`animation-delay: ${index * 0.1}s`"
      >
        <!-- Avatar do usuário com useSafeImage -->
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="image-wrapper">
              <img 
                v-if="!avaliacao.userImage.loading && !avaliacao.userImage.error" 
                :src="avaliacao.userImage.imageUrl" 
                :alt="`Foto de ${avaliacao.usuario?.name || 'Usuário'}`"
                class="w-12 h-12 rounded-full object-cover border-2 border-green-200 dark:border-green-600"
                @load="avaliacao.userImage.lazyLoad"
              />
              <div v-else-if="avaliacao.userImage.loading" class="placeholder animate-pulse w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span class="text-xs text-gray-500">...</span>
              </div>
              <div v-else-if="avaliacao.userImage.error" class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center border-2 border-red-300 dark:border-red-700">
                <span class="text-xs text-red-600 dark:text-red-400">❌</span>
              </div>
            </div>
          </div>
          
          <div class="flex-1">
            <div class="flex justify-between items-start gap-4 mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-semibold text-gray-800 dark:text-white">
                    {{ avaliacao.usuario?.name || 'Usuário AMAJAC' }}
                  </p>
                  <span v-if="avaliacao.usuario_id === authStore.user?.id" 
                        class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                    Você
                  </span>
                </div>
                
                <div class="flex items-center gap-3">
                  <div class="flex text-lg text-yellow-400">
                    <span 
                      v-for="star in 5" 
                      :key="star" 
                      :class="star <= avaliacao.nota ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </span>
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {{ avaliacao.nota }} estrela{{ avaliacao.nota !== 1 ? 's' : '' }}
                  </span>
                </div>
              </div>

              <div v-if="avaliacao.usuario_id === authStore.user?.id" class="flex-shrink-0">
                <button 
                  @click="deleteAvaliacao(avaliacao.id)" 
                  :disabled="avaliacoesStore.loading"
                  class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Excluir minha avaliação"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p v-if="avaliacao.comentario" class="text-gray-700 dark:text-gray-300 mt-3 italic leading-relaxed bg-white dark:bg-gray-800 p-3 rounded-md border-l-4 border-green-500">
              "{{ avaliacao.comentario }}"
            </p>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          ⏰ Avaliado em {{ formatDate(avaliacao.created_at) }}
        </p>
      </div>
    </div>
    
    <!-- Estado Vazio -->
    <div v-else class="text-center p-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <p class="text-4xl mb-4">🌟</p>
      <p class="text-lg font-medium mb-2">Nenhuma avaliação ainda</p>
      <p class="text-sm">Seja o primeiro a compartilhar sua experiência!</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useAvaliacoesStore } from '@/stores/avaliacoes';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { useSafeImage } from '@/composables/useSafeImage';

const props = defineProps({
  classificadoId: {
    type: String,
    required: true,
  },
});

const avaliacoesStore = useAvaliacoesStore();
const authStore = useAuthStore();
const uiStore = useUIStore();

// Refs
const newNota = ref(0);
const newComentario = ref('');
const hoverNota = ref(0);
const realtimeConnected = ref(false);

// Computed
const avaliacoes = computed(() => {
  const avaliacoesData = avaliacoesStore.getAvaliacoes(props.classificadoId);
  
  // Adiciona useSafeImage para cada avaliação com foto do usuário
  return avaliacoesData.map(avaliacao => ({
    ...avaliacao,
    userImage: useSafeImage(avaliacao.usuario?.foto_url || '')
  }));
});

const mediaEstrelas = computed(() => avaliacoesStore.getMediaEstrelas(props.classificadoId));
const totalAvaliacoes = computed(() => avaliacoesStore.getTotalAvaliacoes(props.classificadoId));
const hasEvaluated = computed(() => avaliacoesStore.hasUserEvaluated(props.classificadoId));

// Métodos
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function submitAvaliacao() {
  if (newNota.value === 0) {
    uiStore.showToast('Selecione uma nota de 1 a 5 estrelas.', 'warning');
    return;
  }
  
  try {
    await avaliacoesStore.insertAvaliacao(
      props.classificadoId,
      newNota.value,
      newComentario.value
    );
    
    uiStore.showToast('✅ Avaliação publicada com sucesso!', 'success');
    
    // Reset do formulário
    newNota.value = 0;
    newComentario.value = '';
    hoverNota.value = 0;
    
  } catch (error) {
    uiStore.showToast(avaliacoesStore.error, 'error');
  }
}

async function deleteAvaliacao(avaliacaoId) {
  if (!confirm('Tem certeza que deseja excluir permanentemente sua avaliação?')) return;
  
  try {
    await avaliacoesStore.deleteAvaliacao(avaliacaoId, props.classificadoId);
    uiStore.showToast('🗑️ Avaliação excluída com sucesso!', 'success');
  } catch (error) {
    uiStore.showToast(avaliacoesStore.error, 'error');
  }
}

// Lifecycle
onMounted(() => {
  console.log('🔧 Iniciando sistema de avaliações para:', props.classificadoId);
  
  // Configura Realtime
  avaliacoesStore.setupRealtime();
  realtimeConnected.value = true;
  
  // Busca dados iniciais
  avaliacoesStore.fetchAvaliacoes(props.classificadoId);
});

onUnmounted(() => {
  console.log('🧹 Limpando recursos de avaliações');
  avaliacoesStore.cleanupRealtime();
  realtimeConnected.value = false;
});
</script>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.image-wrapper {
  position: relative;
  display: inline-block;
}

.placeholder {
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.75rem;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>