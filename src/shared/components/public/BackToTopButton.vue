=== C:\Users\angel\Documents\Projetos\amajac-oficial\src\components\public\BackToTopButton.vue ===
<template>
  <button
    v-if="visible"
    @click="scrollToTop"
    class="fixed bottom-6 right-6 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-110"
    aria-label="Voltar ao topo"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const SCROLL_THRESHOLD = 300 // Distância em pixels para mostrar o botão
let rAF = null // Referência para requestAnimationFrame

/**
 * Atualiza a visibilidade do botão com otimização de performance.
 * Usa requestAnimationFrame para evitar que o evento de scroll sobrecarregue a thread principal.
 */
const handleScroll = () => {
  // Limpa qualquer requisição pendente para garantir que apenas um frame seja processado
  if (rAF) return

  rAF = window.requestAnimationFrame(() => {
    // Apenas muda o ref se for necessário para evitar gatilhos desnecessários de reatividade
    const shouldBeVisible = window.scrollY > SCROLL_THRESHOLD
    if (visible.value !== shouldBeVisible) {
      visible.value = shouldBeVisible
    }
    rAF = null // Libera para o próximo frame de animação
  })
}

/**
 * Rola a página para o topo com animação suave.
 */
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Configuração do Listener
onMounted(() => {
  // Adiciona o listener de scroll. Otimizado dentro do handleScroll.
  window.addEventListener('scroll', handleScroll)
  // Checa a posição inicial caso o usuário recarregue a página já scrollada
  handleScroll()
})

// Limpeza do Listener
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // Garante que o requestAnimationFrame pendente seja cancelado
  if (rAF) {
    window.cancelAnimationFrame(rAF)
  }
})
</script>