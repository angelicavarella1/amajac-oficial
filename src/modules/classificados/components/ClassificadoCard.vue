<template>
  <article
    class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer"
    @click="abrirDetalhes"
  >
    <!-- Imagem do classificado ou cone padrão -->
    <div v-if="classificado.imagem_url" class="h-48 overflow-hidden">
      <img 
        :src="classificado.imagem_url" 
        :alt="classificado.titulo"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div v-else class="h-48 bg-gradient-to-br from-amajac-green to-green-600 flex items-center justify-center">
      <i :class="getServiceIcon(classificado.categoria)" class="text-white text-5xl"></i>
    </div>
    
    <div class="p-5 flex flex-col h-full">
      <!-- Categoria (clicável) -->
      <div class="flex justify-between items-start mb-3">
        <button
          @click.stop="filtrarPorCategoria(classificado.categoria)"
          class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200 capitalize hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {{ classificado.categoria }}
        </button>
        
        <!-- Avaliação -->
        <div v-if="classificado.mediaAvaliacoes" class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          <i class="mdi mdi-star text-yellow-500 text-sm"></i>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ classificado.mediaAvaliacoes.toFixed(1) }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">({{ classificado.totalAvaliacoes }})</span>
        </div>
      </div>

      <!-- Título e Descrição -->
      <h3 class="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-amajac-green transition-colors">
        {{ classificado.titulo }}
      </h3>
      <p class="text-sm mb-4 flex-grow line-clamp-3 text-gray-600 dark:text-gray-300">
        {{ classificado.descricao }}
      </p>

      <!-- Informações do Anunciante -->
      <div class="text-sm space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-900 dark:text-white">{{ classificado.anunciante }}</span>
          <span class="text-gray-600 dark:text-gray-400">{{ classificado.bairro }}</span>
        </div>
        
        <!-- Botão WhatsApp -->
        <button
          v-if="classificado.telefone"
          @click.stop="abrirWhatsApp(classificado.telefone, classificado.titulo)"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <i class="mdi mdi-whatsapp text-lg"></i>
          Entrar em Contato
        </button>

        <!-- Data de publicação -->
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <i class="mdi mdi-calendar"></i>
            <span>Publicado em {{ classificado.data }}</span>
          </div>
          
          <!-- Botão para ver detalhes -->
          <button
            @click.stop="abrirDetalhes"
            class="text-amajac-green hover:text-green-700 transition-colors flex items-center gap-1"
          >
            <span>Ver detalhes</span>
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  classificado: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['ver-detalhes', 'filtrar-categoria', 'contatar-whatsapp'])

// Função para obter ícone baseado na categoria
const getServiceIcon = (categoria) => {
  const icons = {
    jardinagem: 'mdi mdi-leaf',
    limpeza: 'mdi mdi-broom',
    reparos: 'mdi mdi-tools',
    pintura: 'mdi mdi-format-paint',
    encanamento: 'mdi mdi-pipe',
    eletrica: 'mdi mdi-flash',
    construcao: 'mdi mdi-hard-hat',
    informatica: 'mdi mdi-laptop',
    transporte: 'mdi mdi-truck',
    outros: 'mdi mdi-hammer-wrench'
  }
  return icons[categoria] || 'mdi mdi-toolbox'
}

// Abrir detalhes do classificado
const abrirDetalhes = () => {
  emit('ver-detalhes', props.classificado.id)
}

// Filtrar por categoria
const filtrarPorCategoria = (categoria) => {
  emit('filtrar-categoria', categoria)
}

// Abrir WhatsApp
const abrirWhatsApp = (telefone, titulo) => {
  // Limpar telefone (remover caracteres não numéricos)
  const telefoneLimpo = telefone.replace(/\D/g, '')
  
  // Mensagem padrão
  const mensagem = `Olá! Gostaria de saber mais sobre o serviço: ${titulo}`
  
  // URL do WhatsApp
  const url = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(mensagem)}`
  
  // Abrir em nova aba
  window.open(url, '_blank')
  
  emit('contatar-whatsapp', props.classificado.id)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>