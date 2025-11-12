<!-- src/components/ui/Relogio.vue -->
<template>
  <div class="relogio-data">
    <div class="hora">{{ hora }}</div>
    <div class="separador"></div>
    <div class="data-completa">
      <span class="dia-semana">{{ diaSemana }}</span>
      <span class="data-extenso">{{ dataExtenso }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hora = ref('--:--:--')
const diaSemana = ref('---')
const dataExtenso = ref('-- de --------')

let timeoutId = null
let ultimaAtualizacao = 0
const INTERVALO_ATUALIZACAO = 1000 // 1 segundo
const THRESHOLD_PERFORMANCE = 16 // ~60fps

const atualizar = () => {
  const agora = Date.now()
  
  // Evitar atualizações muito rápidas que podem causar congestionamento
  if (agora - ultimaAtualizacao < THRESHOLD_PERFORMANCE) {
    agendarProximaAtualizacao()
    return
  }
  
  ultimaAtualizacao = agora
  const data = new Date(agora)
  
  try {
    // Formatar hora com segundos (otimizado)
    const horas = data.getHours().toString().padStart(2, '0')
    const minutos = data.getMinutes().toString().padStart(2, '0')
    const segundos = data.getSeconds().toString().padStart(2, '0')
    hora.value = `${horas}:${minutos}:${segundos}`
    
    // Cache para dias da semana e meses
    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    
    // Formatar dia da semana (otimizado)
    const diaNum = data.getDay()
    diaSemana.value = diasSemana[diaNum]
    
    // Capitalizar primeira letra do dia da semana
    diaSemana.value = diaSemana.value.charAt(0).toUpperCase() + diaSemana.value.slice(1)
    
    // Formatar data por extenso (15 de dezembro) - otimizado
    const dia = data.getDate()
    const mes = meses[data.getMonth()]
    dataExtenso.value = `${dia} de ${mes}`
    
  } catch (error) {
    console.warn('Erro ao atualizar relógio:', error)
  }
  
  agendarProximaAtualizacao()
}

const agendarProximaAtualizacao = () => {
  // Usar setTimeout recursivo em vez de setInterval para melhor controle
  const agora = Date.now()
  const proximoTick = INTERVALO_ATUALIZACAO - (agora % INTERVALO_ATUALIZACAO)
  
  timeoutId = setTimeout(() => {
    requestAnimationFrame(atualizar)
  }, Math.max(proximoTick, 0))
}

const iniciarRelogio = () => {
  // Atualizar imediatamente
  requestAnimationFrame(atualizar)
}

const pararRelogio = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// Lifecycle
onMounted(() => {
  iniciarRelogio()
})

onUnmounted(() => {
  pararRelogio()
})

// Otimização: pausar relógio quando a página não estiver visível
if (typeof document !== 'undefined') {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      pararRelogio()
    } else {
      iniciarRelogio()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
}
</script>

<style scoped>
.relogio-data {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #2E7D32;
  background: rgba(46, 125, 50, 0.1);
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  min-width: 280px;
  height: 56px;
}

.dark .relogio-data {
  color: #4CAF50;
  background: rgba(46, 125, 50, 0.15);
}

.hora {
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.separador {
  width: 1px;
  height: 30px;
  background: rgba(46, 125, 50, 0.3);
}

.data-completa {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.dia-semana {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: lowercase;
}

.dia-semana::first-letter {
  text-transform: uppercase;
}

.data-extenso {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
}

/* Responsivo para telas menores */
@media (max-width: 768px) {
  .relogio-data {
    min-width: 240px;
    padding: 0.5rem 0.8rem;
    gap: 0.5rem;
  }
  
  .hora {
    font-size: 1rem;
  }
  
  .dia-semana,
  .data-extenso {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .relogio-data {
    min-width: 220px;
    padding: 0.4rem 0.7rem;
    gap: 0.4rem;
  }
  
  .hora {
    font-size: 0.9rem;
  }
  
  .dia-semana,
  .data-extenso {
    font-size: 0.75rem;
  }
  
  .separador {
    height: 25px;
  }
}

/* Melhorias de performance CSS */
.relogio-data {
  will-change: transform;
  contain: layout style;
}

.hora, .dia-semana, .data-extenso {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>