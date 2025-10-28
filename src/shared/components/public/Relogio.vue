=== C:\Users\angel\Documents\Projetos\amajac-oficial\src\components\public\Relogio.vue ===
<template>
  <div class="text-center">
    <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      {{ horaAtual }}
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-400">
      {{ dataAtual }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// Assumindo que você tem date-fns e ptBR instalados:
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const horaAtual = ref('')
const dataAtual = ref('')
let intervalId = null // Variável para armazenar o ID do intervalo

/**
 * Atualiza as referências reativas de hora e data.
 */
const atualizarRelogio = () => {
  const agora = new Date()
  // Exemplo: 17:30:45
  horaAtual.value = format(agora, 'HH:mm:ss')
  // Exemplo: sexta-feira, 24 de Outubro de 2025
  dataAtual.value = format(agora, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

onMounted(() => {
  // 1. Chama imediatamente para evitar um segundo de espera
  atualizarRelogio() 
  
  // 2. Inicia o intervalo de 1 segundo (1000ms)
  intervalId = setInterval(atualizarRelogio, 1000)
})

// 3. Limpeza do intervalo no hook onUnmounted
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>