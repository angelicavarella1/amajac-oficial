<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400 transition-colors duration-200">Carregando imagem...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Imagem não encontrada</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">{{ error }}</p>
          <router-link
            to="/galeria"
            class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar para Galeria
          </router-link>
        </div>
      </div>

      <!-- Imagem Details -->
      <div v-else-if="imagem" class="max-w-6xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
          <router-link to="/" class="hover:text-green-600 transition-colors">Home</router-link>
          <span>/</span>
          <router-link to="/galeria" class="hover:text-green-600 transition-colors">Galeria</router-link>
          <span>/</span>
          <span class="text-gray-800 dark:text-gray-200 font-medium transition-colors duration-200">{{ imagem.titulo || 'Imagem' }}</span>
        </nav>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <!-- Imagem Principal -->
          <div class="relative bg-gray-900">
            <!-- Loading da imagem -->
            <div v-if="imagemLoading" class="flex items-center justify-center min-h-[400px]">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p class="text-white text-sm">Carregando imagem...</p>
              </div>
            </div>
            
            <!-- Imagem -->
            <img
              v-else
              :src="imagemUrl"
              :alt="imagem.titulo || 'Imagem da galeria'"
              class="w-full max-h-[70vh] object-contain mx-auto"
              @load="handleImageLoad"
              @error="handleImageError"
            />
            
            <!-- Navegação -->
            <button
              v-if="temImagemAnterior"
              @click="imagemAnterior"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Imagem anterior"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <button
              v-if="temProximaImagem"
              @click="proximaImagem"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Próxima imagem"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Contador -->
            <div class="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {{ indiceAtual + 1 }} / {{ totalImagens }}
            </div>

            <!-- Informações Overlay -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div class="text-white">
                <h1 class="text-3xl font-bold mb-2">{{ imagem.titulo || 'Sem título' }}</h1>
                <div class="flex flex-wrap items-center gap-4 text-sm opacity-90">
                  <span v-if="imagem.categoria" class="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {{ formatarCategoria(imagem.categoria) }}
                  </span>
                  <span>{{ formatarData(imagem.created_at) }}</span>
                  <span v-if="imagem.visualizacoes" class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {{ imagem.visualizacoes }} visualizações
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-8">
            <!-- Descrição -->
            <div v-if="imagem.descricao" class="prose max-w-none mb-8 dark:prose-invert">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-200">Descrição</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line transition-colors duration-200">{{ imagem.descricao }}</p>
            </div>

            <!-- Informações Técnicas -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-200">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-200">Informações</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Categoria -->
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 transition-colors duration-200">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Categoria</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">{{ formatarCategoria(imagem.categoria) }}</p>
                  </div>
                </div>

                <!-- Data de Publicação -->
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 transition-colors duration-200">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Publicada em</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">{{ formatarData(imagem.created_at) }}</p>
                  </div>
                </div>

                <!-- Visualizações -->
                <div v-if="imagem.visualizacoes" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 transition-colors duration-200">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Visualizações</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">{{ imagem.visualizacoes }}</p>
                  </div>
                </div>

                <!-- Autor -->
                <div v-if="imagem.autor" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 transition-colors duration-200">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Autor</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">{{ imagem.autor }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 transition-colors duration-200">
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  @click="compartilharImagem"
                  class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  Compartilhar
                </button>

                <button
                  @click="downloadImagem"
                  class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download
                </button>

                <router-link
                  to="/galeria"
                  class="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Voltar para Galeria
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGaleriaStore } from '@/stores/galeria';
import { storeToRefs } from 'pinia';

export default {
  name: 'GaleriaDetalhesView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const galeriaStore = useGaleriaStore();
    const { imagens, imagemSelecionada, loading, error } = storeToRefs(galeriaStore);

    const imagem = ref(null);
    const indiceAtual = ref(0);
    const imagemLoading = ref(false);
    const imagemUrl = ref('');

    // Computed
    const totalImagens = computed(() => imagens.value.length);
    
    const temImagemAnterior = computed(() => {
      return indiceAtual.value > 0;
    });

    const temProximaImagem = computed(() => {
      return indiceAtual.value < imagens.value.length - 1;
    });

    // Methods
    const handleImageLoad = () => {
      imagemLoading.value = false;
    };

    const handleImageError = (event) => {
      console.error('❌ Erro ao carregar imagem:', imagemUrl.value);
      imagemLoading.value = false;
      // Tentar fallback para URL original se estiver usando URL processada
      if (imagem.value?.imagem_url && imagemUrl.value !== imagem.value.imagem_url) {
        imagemUrl.value = imagem.value.imagem_url;
        imagemLoading.value = true;
      } else {
        event.target.src = '/placeholder-image.jpg';
      }
    };

    const formatarCategoria = (categoria) => {
      if (!categoria) return 'Sem categoria';
      return categoria.charAt(0).toUpperCase() + categoria.slice(1);
    };

    const formatarData = (dataString) => {
      if (!dataString) return '';
      try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      } catch {
        return '';
      }
    };

    const imagemAnterior = () => {
      if (temImagemAnterior.value) {
        const novaImagem = imagens.value[indiceAtual.value - 1];
        navegarParaImagem(novaImagem.id, indiceAtual.value - 1);
      }
    };

    const proximaImagem = () => {
      if (temProximaImagem.value) {
        const novaImagem = imagens.value[indiceAtual.value + 1];
        navegarParaImagem(novaImagem.id, indiceAtual.value + 1);
      }
    };

    const navegarParaImagem = (imagemId, novoIndice) => {
      // Navegação mais eficiente - apenas atualiza a rota
      router.push(`/galeria/${imagemId}`);
      indiceAtual.value = novoIndice;
      
      // Atualiza a imagem atual sem recarregar tudo
      const novaImagem = imagens.value[novoIndice];
      if (novaImagem) {
        imagem.value = novaImagem;
        imagemUrl.value = novaImagem.imagem_url || novaImagem.url || '';
        imagemLoading.value = true;
        
        // Incrementar visualizações
        galeriaStore.incrementarVisualizacoes(imagemId);
      }
    };

    const compartilharImagem = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: imagem.value.titulo || 'Imagem da Galeria AMAJAC',
            text: imagem.value.descricao || 'Confira esta imagem da galeria da AMAJAC',
            url: window.location.href
          });
        } catch (err) {
          console.log('Erro ao compartilhar:', err);
        }
      } else {
        // Fallback para copiar URL
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            alert('URL copiada para a área de transferência!');
          })
          .catch(() => {
            // Fallback mais básico
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('URL copiada para a área de transferência!');
          });
      }
    };

    const downloadImagem = () => {
      if (imagemUrl.value) {
        const link = document.createElement('a');
        link.href = imagemUrl.value;
        link.download = imagem.value.titulo ? `${imagem.value.titulo}.jpg` : 'imagem-galeria-amajac.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Não foi possível fazer o download da imagem.');
      }
    };

    // Keyboard navigation
    const handleKeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          imagemAnterior();
          break;
        case 'ArrowRight':
          event.preventDefault();
          proximaImagem();
          break;
        case 'Escape':
          router.push('/galeria');
          break;
      }
    };

    // Load imagem data
    const loadImagem = async () => {
      const id = route.params.id;
      if (id) {
        console.log('🔄 Carregando imagem ID:', id);
        
        // Se já temos a imagem na store, use-a
        const imagemExistente = imagens.value.find(img => img.id === id);
        if (imagemExistente) {
          imagem.value = imagemExistente;
          imagemUrl.value = imagemExistente.imagem_url || imagemExistente.url || '';
          indiceAtual.value = imagens.value.findIndex(img => img.id === id);
          imagemLoading.value = true;
          console.log('✅ Imagem carregada da store:', imagem.value.titulo);
        } else {
          // Se não temos, busque da API
          await galeriaStore.fetchImagemById(id);
          if (imagemSelecionada.value) {
            imagem.value = imagemSelecionada.value;
            imagemUrl.value = imagemSelecionada.value.imagem_url || imagemSelecionada.value.url || '';
            // Encontrar índice atual
            indiceAtual.value = imagens.value.findIndex(img => img.id === imagem.value.id);
            imagemLoading.value = true;
            console.log('✅ Imagem carregada da API:', imagem.value.titulo);
          }
        }

        // Incrementar visualizações
        if (imagem.value) {
          galeriaStore.incrementarVisualizacoes(id);
        }
      }
    };

    onMounted(() => {
      console.log('🎯 GaleriaDetalhes montada');
      
      // Carregar todas as imagens se necessário
      if (imagens.value.length === 0) {
        console.log('📦 Carregando todas as imagens...');
        galeriaStore.fetchImagens().then(() => {
          loadImagem();
        });
      } else {
        loadImagem();
      }

      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
    });

    watch(() => route.params.id, (newId) => {
      console.log('🔄 ID da rota mudou:', newId);
      if (newId) {
        loadImagem();
      }
    });

    return {
      imagem,
      loading,
      error,
      imagemLoading,
      imagemUrl,
      temImagemAnterior,
      temProximaImagem,
      totalImagens,
      indiceAtual,
      handleImageLoad,
      handleImageError,
      formatarCategoria,
      formatarData,
      imagemAnterior,
      proximaImagem,
      compartilharImagem,
      downloadImagem
    };
  }
};
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

/* Transições suaves */
* {
  transition-property: color, background-color, border-color, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Melhorar a aparência dos botões de navegação */
button {
  backdrop-filter: blur(8px);
}

/* Efeito de hover suave */
button:hover {
  transform: scale(1.05);
}

/* Responsividade melhorada */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .gap-4 {
    gap: 1rem;
  }
}

/* Dark mode suporte para prose */
:deep(.prose) {
  color: inherit;
}

:deep(.prose h3) {
  color: inherit;
}

:deep(.prose p) {
  color: inherit;
}
</style>