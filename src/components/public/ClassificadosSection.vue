<template>
  <section id="classificados" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Classificados</h2>
        <p class="text-xl text-gray-600">Serviços e produtos da comunidade</p>
      </div>

      <!-- Filtros -->
      <div v-if="classificados.length > 0" class="flex flex-wrap gap-2 justify-center mb-8">
        <button
          @click="$emit('filtrar', null)"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors', 
            !filtrarCategoria ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100']"
        >
          Todos
        </button>
        <button
          v-for="categoria in categorias"
          :key="categoria"
          @click="$emit('filtrar', categoria)"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors', 
            filtrarCategoria === categoria ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100']"
        >
          {{ formatarCategoria(categoria) }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-3 text-green-600">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Carregando classificados...
        </div>
      </div>

      <!-- Classificados -->
      <div v-else-if="classificados.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="classificado in classificados" 
          :key="classificado.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Imagem com useSafeImage -->
          <div v-if="classificado.imagem_url" class="h-48 overflow-hidden bg-gray-100">
            <div class="image-wrapper h-full">
              <img 
                v-if="!classificado.imageState.loading && !classificado.imageState.error"
                :src="classificado.imageState.imageUrl" 
                :alt="classificado.titulo"
                class="w-full h-full object-cover transition-opacity duration-300"
                :class="{ 'opacity-0': classificado.imageState.loading, 'opacity-100': !classificado.imageState.loading }"
                @load="classificado.imageState.lazyLoad"
                loading="lazy"
              />
              <div v-else-if="classificado.imageState.loading" class="placeholder animate-pulse w-full h-full flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-sm text-gray-500">Carregando...</span>
                </div>
              </div>
              <div v-else-if="classificado.imageState.error" class="error-state w-full h-full flex items-center justify-center bg-red-50">
                <div class="text-center">
                  <svg class="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <span class="text-sm text-red-500">Imagem não carregada</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Placeholder quando não há imagem -->
          <div v-else class="h-48 bg-gray-100 flex items-center justify-center">
            <div class="text-center text-gray-400">
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span class="text-sm">Sem imagem</span>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {{ formatarCategoria(classificado.categoria) }}
              </span>
              <span class="text-sm text-gray-500">
                {{ formatarData(classificado.created_at) }}
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{{ classificado.titulo }}</h3>
            
            <p class="text-gray-600 mb-4 line-clamp-3">{{ classificado.descricao }}</p>
            
            <div v-if="classificado.telefone" class="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {{ formatarTelefone(classificado.telefone) }}
            </div>

            <div v-if="classificado.preco" class="text-lg font-bold text-green-600">
              R$ {{ formatarPreco(classificado.preco) }}
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Nenhum classificado</h3>
          <p class="text-gray-500">Em breve teremos classificados cadastrados.</p>
        </div>
      </div>

      <!-- Ver Mais -->
      <div v-if="classificados.length > 6 && !verMais" class="text-center mt-8">
        <button 
          @click="$emit('ver-mais', true)"
          class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Ver mais classificados
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { useSafeImage } from '@/composables/useSafeImage'

export default {
  name: 'ClassificadosSection',
  props: {
    classificados: {
      type: Array,
      default: () => []
    },
    loading: Boolean,
    filtrarCategoria: String,
    verMais: Boolean,
    categorias: {
      type: Array,
      default: () => ['jardinagem', 'limpeza', 'reparos', 'pintura', 'encanamento', 'eletrica', 'construcao', 'moveis', 'automotivacao', 'tecnologia', 'couturas']
    }
  },
  setup(props) {
    // Adiciona useSafeImage para cada classificado
    const classificadosComImagem = props.classificados.map(classificado => ({
      ...classificado,
      imageState: useSafeImage(classificado.imagem_url || '')
    }))

    return {
      classificadosComImagem
    }
  },
  methods: {
    formatarCategoria(categoria) {
      if (!categoria) return 'Outros'
      const categoriasFormatadas = {
        jardinagem: 'Jardinagem',
        limpeza: 'Limpeza',
        reparos: 'Reparos',
        pintura: 'Pintura',
        encanamento: 'Encanamento',
        eletrica: 'Elétrica',
        construcao: 'Construção',
        moveis: 'Móveis',
        automotivacao: 'Automotiva',
        tecnologia: 'Tecnologia',
        couturas: 'Costuras'
      }
      return categoriasFormatadas[categoria] || categoria
    },
    formatarData(dataString) {
      if (!dataString) return 'Data não informada'
      try {
        const data = new Date(dataString)
        if (isNaN(data.getTime())) return 'Data inválida'
        return data.toLocaleDateString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch {
        return 'Data inválida'
      }
    },
    formatarTelefone(telefone) {
      if (!telefone) return ''
      const numbers = telefone.replace(/\D/g, '')
      if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      } else if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      }
      return telefone
    },
    formatarPreco(preco) {
      if (!preco) return '0,00'
      // Converte para número e formata como moeda brasileira
      const numero = typeof preco === 'string' ? parseFloat(preco.replace(',', '.')) : preco
      return isNaN(numero) ? '0,00' : numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  },
  emits: ['filtrar', 'ver-mais']
}
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

.image-wrapper {
  position: relative;
}

.placeholder {
  background-color: #f8f9fa;
  color: #6c757d;
}

.error-state {
  background-color: #f8d7da;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>