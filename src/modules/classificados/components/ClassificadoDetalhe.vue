<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"/>
          <p class="text-gray-600">Carregando classificado...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Classificado não encontrado</h3>
          <p class="text-gray-500 mb-4">{{ error }}</p>
          <router-link
            to="/classificados"
            class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar para Classificados
          </router-link>
        </div>
      </div>

      <!-- Classificado Details -->
      <div v-else-if="classificado" class="max-w-4xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <router-link to="/" class="hover:text-green-600 transition-colors">Home</router-link>
          <span>/</span>
          <router-link to="/classificados" class="hover:text-green-600 transition-colors">Classificados</router-link>
          <span>/</span>
          <span class="text-gray-800 font-medium">{{ classificado.titulo }}</span>
        </nav>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Imagem Principal -->
          <div v-if="classificado.imagem_url" class="relative aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              :src="classificado.imagem_url"
              :alt="classificado.titulo"
              class="w-full h-96 object-cover"
              @error="handleImageError"
            />
            <div class="absolute top-4 left-4">
              <span class="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                {{ formatarCategoria(classificado.categoria) }}
              </span>
            </div>
          </div>

          <div class="p-8">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ classificado.titulo }}</h1>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Publicado em {{ formatarData(classificado.created_at) }}</span>
                  <span v-if="classificado.visualizacoes" class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {{ classificado.visualizacoes }} visualizações
                  </span>
                </div>
              </div>
              
              <!-- Preço -->
              <div v-if="classificado.preco" class="mt-4 lg:mt-0">
                <div class="text-3xl font-bold text-green-600">
                  R$ {{ formatarPreco(classificado.preco) }}
                </div>
              </div>
            </div>

            <!-- Descrição -->
            <div class="prose max-w-none mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Descrição</h3>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ classificado.descricao }}</p>
            </div>

            <!-- Informações de Contato -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Informações de Contato</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Telefone -->
                <div v-if="classificado.telefone" class="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600">Telefone</p>
                    <p class="text-lg font-semibold text-gray-800">{{ formatarTelefone(classificado.telefone) }}</p>
                  </div>
                </div>

                <!-- Email -->
                <div v-if="classificado.email" class="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600">E-mail</p>
                    <p class="text-lg font-semibold text-gray-800">{{ classificado.email }}</p>
                  </div>
                </div>

                <!-- Localização -->
                <div v-if="classificado.localizacao" class="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600">Localização</p>
                    <p class="text-lg font-semibold text-gray-800">{{ classificado.localizacao }}</p>
                  </div>
                </div>

                <!-- Categoria -->
                <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600">Categoria</p>
                    <p class="text-lg font-semibold text-gray-800">{{ formatarCategoria(classificado.categoria) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="border-t border-gray-200 pt-6 mt-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  v-if="classificado.telefone"
                  @click="ligarParaAnunciante"
                  class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Ligar Agora
                </button>
                
                <button
                  v-if="classificado.telefone"
                  @click="enviarWhatsApp"
                  class="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                  </svg>
                  WhatsApp
                </button>

                <router-link
                  to="/classificados"
                  class="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                >
                  Voltar para Classificados
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
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useClassificadosStore } from '@/modules/classificados/stores/classificados';
import { storeToRefs } from 'pinia';

export default {
  name: 'ClassificadoDetalhe',
  setup() {
    const route = useRoute();
    const classificadosStore = useClassificadosStore();
    const { classificadoSelecionado, loading, error } = storeToRefs(classificadosStore);

    const classificado = ref(null);

    // Methods
    const handleImageError = (event) => {
      event.target.src = '/placeholder-image.jpg';
    };

    const formatarCategoria = (categoria) => {
      const categoriasFormatadas = {
        jardinagem: 'Jardinagem',
        limpeza: 'Limpeza',
        reparos: 'Reparos',
        pintura: 'Pintura',
        encanamento: 'Encanamento',
        eletrica: 'Elétrica',
        construcao: 'Construção',
        moveis: 'Móveis',
        automotivacao: 'Automotivação',
        tecnologia: 'Tecnologia',
        costuras: 'Costuras'
      };
      return categoriasFormatadas[categoria] || categoria;
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

    const formatarTelefone = (telefone) => {
      if (!telefone) return '';
      const numbers = telefone.replace(/\D/g, '');
      if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return telefone;
    };

    const formatarPreco = (preco) => {
      if (typeof preco === 'number') {
        return preco.toFixed(2).replace('.', ',');
      }
      return preco;
    };

    const ligarParaAnunciante = () => {
      if (classificado.value?.telefone) {
        const numero = classificado.value.telefone.replace(/\D/g, '');
        window.open(`tel:${numero}`, '_self');
      }
    };

    const enviarWhatsApp = () => {
      if (classificado.value?.telefone) {
        const numero = classificado.value.telefone.replace(/\D/g, '');
        const mensagem = `Olá! Gostaria de saber mais sobre: "${classificado.value.titulo}"`;
        const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
      }
    };

    // Load classificado data
    const loadClassificado = async () => {
      const id = route.params.id;
      if (id) {
        await classificadosStore.fetchClassificadoById(id);
        classificado.value = classificadoSelecionado.value;
      }
    };

    onMounted(() => {
      loadClassificado();
    });

    watch(() => route.params.id, () => {
      loadClassificado();
    });

    return {
      classificado,
      loading,
      error,
      handleImageError,
      formatarCategoria,
      formatarData,
      formatarTelefone,
      formatarPreco,
      ligarParaAnunciante,
      enviarWhatsApp
    };
  }
};
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
}

.aspect-w-16::before {
  content: '';
  display: block;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.prose {
  line-height: 1.6;
}
</style>