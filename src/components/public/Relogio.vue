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
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const horaAtual = ref('')
const dataAtual = ref('')

const atualizarRelogio = () => {
  const agora = new Date()
  horaAtual.value = format(agora, 'HH:mm:ss')
  dataAtual.value = format(agora, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

onMounted(() => {
  atualizarRelogio()
  const interval = setInterval(atualizarRelogio, 1000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
