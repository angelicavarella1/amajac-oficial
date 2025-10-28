<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Classificados</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Encontre serviços e produtos da nossa comunidade
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"/>
          <p class="text-gray-600">Carregando classificados...</p>
        </div>
      </div>

      <div v-else>
        <!-- Filtros -->
        <div class="mb-8">
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              @click="filtroCategoria = null"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                !filtroCategoria 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              ]"
            >
              Todos
            </button>
            <button
              v-for="categoria in categorias"
              :key="categoria"
              @click="filtroCategoria = categoria"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                filtroCategoria === categoria 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              ]"
            >
              {{ formatarCategoria(categoria) }}
            </button>
          </div>
        </div>

        <!-- Classificados Grid -->
        <div v-if="classificadosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="classificado in classificadosFiltrados"
            :key="classificado.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Imagem -->
            <div 
              v-if="classificado.imagem_url" 
              class="relative aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden"
            >
              <img
                :src="classificado.imagem_url"
                :alt="classificado.titulo"
                class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                @error="handleImageError"
                loading="lazy"
              />
              <div class="absolute top-3 left-3">
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {{ formatarCategoria(classificado.categoria) }}
                </span>
              </div>
            </div>

            <!-- Conteúdo -->
            <div class="p-6">
              <!-- Categoria e Data -->
              <div class="flex items-center justify-between mb-3">
                <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {{ formatarCategoria(classificado.categoria) }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ formatarData(classificado.created_at) }}
                </span>
              </div>

              <!-- Título -->
              <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                {{ classificado.titulo }}
              </h3>
              
              <!-- Descrição -->
              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ classificado.descricao }}
              </p>

              <!-- Contato -->
              <div v-if="classificado.telefone" class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>{{ formatarTelefone(classificado.telefone) }}</span>
              </div>

              <!-- Preço -->
              <div v-if="classificado.preco" class="text-lg font-bold text-green-600 mb-4">
                R$ {{ formatarPreco(classificado.preco) }}
              </div>

              <!-- Botão Ver Detalhes -->
              <router-link
                :to="`/classificados/${classificado.id}`"
                class="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                @click="incrementarVisualizacoes(classificado.id)"
              >
                Ver Detalhes
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              {{ filtroCategoria ? 'Nenhum classificado nesta categoria' : 'Nenhum classificado encontrado' }}
            </h3>
            <p class="text-gray-500">
              {{ filtroCategoria ? 'Tente selecionar outra categoria.' : 'Não há classificados cadastrados no momento.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useClassificadosStore } from '@/modules/classificados/stores/classificados';
import { storeToRefs } from 'pinia';

export default {
  name: 'ClassificadosView',
  setup() {
    const classificadosStore = useClassificadosStore();
    const { classificados, loading } = storeToRefs(classificadosStore);
    
    const filtroCategoria = ref(null);

    // Categorias disponíveis
    const categorias = [
      'jardinagem',
      'limpeza',
      'reparos',
      'pintura',
      'encanamento',
      'eletrica',
      'construcao',
      'moveis',
      'automotivacao',
      'tecnologia',
      'costuras'
    ];

    // Computed
    const classificadosFiltrados = computed(() => {
      if (!filtroCategoria.value) return classificados.value;
      return classificados.value.filter(item => item.categoria === filtroCategoria.value);
    });

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
          month: '2-digit',
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

    const incrementarVisualizacoes = (classificadoId) => {
      classificadosStore.incrementarVisualizacoes(classificadoId);
    };

    onMounted(() => {
      classificadosStore.fetchClassificados();
    });

    return {
      classificados,
      loading,
      filtroCategoria,
      categorias,
      classificadosFiltrados,
      handleImageError,
      formatarCategoria,
      formatarData,
      formatarTelefone,
      formatarPreco,
      incrementarVisualizacoes
    };
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
</style>