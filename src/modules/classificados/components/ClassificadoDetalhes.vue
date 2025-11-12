<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ classificado?.titulo }}
        </h2>
        <button
          @click="fechar"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
      </div>
      <!-- Content -->
      <div v-if="classificado" class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6">
          <!-- Imagem e Informações Principais -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Imagem -->
            <div>
              <div v-if="classificado.imagem_url" class="rounded-lg overflow-hidden">
                <img 
                  :src="classificado.imagem_url" 
                  :alt="classificado.titulo"
                  class="w-full h-64 object-cover"
                />
              </div>
              <div v-else class="h-64 bg-gradient-to-br from-amajac-green to-green-600 rounded-lg flex items-center justify-center">
                <i :class="getServiceIcon(classificado.categoria)" class="text-white text-6xl"></i>
              </div>
            </div>
            <!-- Informações -->
            <div class="space-y-4">
              <!-- Categoria e Avaliação -->
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full dark:bg-blue-900 dark:text-blue-200 capitalize">
                  {{ classificado.categoria }}
                </span>
                <div v-if="classificado.mediaAvaliacoes" class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <i class="mdi mdi-star text-yellow-500"></i>
                  <span class="font-medium text-gray-900 dark:text-white">{{ classificado.mediaAvaliacoes.toFixed(1) }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">({{ classificado.totalAvaliacoes }} avaliações)</span>
                </div>
              </div>
              <!-- Descrição -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Descrição</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ classificado.descricao }}
                </p>
              </div>
              <!-- Informações do Anunciante -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informações de Contato</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">Anunciante:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ classificado.nome_anunciante }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">Bairro:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ classificado.bairro }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">Telefone:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ classificado.telefone }}</span>
                  </div>
                  <div v-if="classificado.email" class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">E-mail:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ classificado.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Avaliações -->
          <div v-if="classificado.avaliacoes && classificado.avaliacoes.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Avaliações ({{ classificado.totalAvaliacoes }})
            </h3>
            <div class="space-y-4">
              <div
                v-for="avaliacao in classificado.avaliacoes"
                :key="avaliacao.id"
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex text-yellow-500">
                    <i v-for="n in 5" :key="n" class="mdi mdi-star" :class="n <= avaliacao.nota ? 'text-yellow-500' : 'text-gray-300'"></i>
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ avaliacao.data }}</span>
                </div>
                <p v-if="avaliacao.comentario" class="text-gray-700 dark:text-gray-300">
                  {{ avaliacao.comentario }}
                </p>
                <p v-else class="text-gray-500 dark:text-gray-400 italic">
                  Sem comentário
                </p>
              </div>
            </div>
          </div>
          <!-- Sem avaliações -->
          <div v-else class="border-t border-gray-200 dark:border-gray-700 pt-6 text-center py-8">
            <i class="mdi mdi-star-outline text-4xl text-gray-400 mb-2"></i>
            <p class="text-gray-500 dark:text-gray-400">Este classificado ainda não possui avaliações.</p>
          </div>
          <!-- Formulário de Avaliação -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <AvaliarClassificado 
              :classificado-id="classificado.id" 
              @avaliacao-enviada="recarregarDetalhes" 
            />
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-6">
        <div class="flex gap-3">
          <button
            v-if="classificado?.telefone"
            @click="abrirWhatsApp"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
          >
            <i class="mdi mdi-whatsapp text-xl"></i>
            Entrar em Contato via WhatsApp
          </button>
          <button
            @click="fechar"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
      <!-- Loading -->
      <div v-if="carregando" class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 flex items-center justify-center">
        <div class="text-center">
          <i class="mdi mdi-loading mdi-spin text-amajac-green text-4xl mb-2"></i>
          <p class="text-gray-600 dark:text-gray-300">Carregando detalhes...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useClassificados } from '../composables/useClassificados'
import AvaliarClassificado from './AvaliarClassificado.vue'

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  classificadoId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['fechar'])

const { getClassificadoDetalhes } = useClassificados()
const classificado = ref(null)
const carregando = ref(false)

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

// Fechar modal
const fechar = () => {
  emit('fechar')
}

// Abrir WhatsApp
const abrirWhatsApp = () => {
  if (classificado.value?.telefone) {
    const telefoneLimpo = classificado.value.telefone.replace(/\D/g, '')
    const mensagem = `Olá! Gostaria de saber mais sobre o serviço: ${classificado.value.titulo}`
    const url = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }
}

// Recarregar detalhes após avaliação
const recarregarDetalhes = async () => {
  if (props.classificadoId) {
    carregando.value = true
    classificado.value = await getClassificadoDetalhes(props.classificadoId)
    carregando.value = false
  }
}

// Carregar detalhes quando o modal abrir
watch(() => props.mostrar, async (novoValor) => {
  if (novoValor && props.classificadoId) {
    carregando.value = true
    classificado.value = await getClassificadoDetalhes(props.classificadoId)
    carregando.value = false
  } else {
    classificado.value = null
  }
})
</script>