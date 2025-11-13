@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css');

<template>
  <div class="navbar-previsao-wrapper">
    <div class="navbar-previsao">
      <div class="nav-item clima-item">
        <div class="nav-icon clima-icon">
          <i class="mdi mdi-weather-sunny"></i>
          <span class="fallback-icone">☀️</span>
        </div>
        <div class="nav-info">
          <div class="nav-temp">{{ tempHoje }}°</div>
          <div class="nav-details">
            <span class="nav-minmax">{{ tempMin }}° / {{ tempMax }}°</span>
          </div>
        </div>
      </div>

      <div class="nav-item vento-item">
        <div class="nav-icon vento-icon">
          <i class="mdi mdi-weather-windy"></i>
          <span class="fallback-icone">💨</span>
        </div>
        <div class="nav-info">
          <div class="nav-value">{{ vento }} km/h</div>
          <div class="nav-details">{{ direcaoVento }}</div>
        </div>
      </div>

      <div class="nav-item umidade-item">
        <div class="nav-icon umidade-icon">
          <i class="mdi mdi-water-percent"></i>
          <span class="fallback-icone">💧</span>
        </div>
        <div class="nav-info">
          <div class="nav-value">{{ umidade }}%</div>
          <div class="nav-details">Umidade</div>
        </div>
      </div>

      <div class="nav-item ondas-item">
        <div class="nav-icon ondas-icon">
          <i class="mdi mdi-wave"></i>
          <span class="fallback-icone">🌊</span>
        </div>
        <div class="nav-info">
          <div class="nav-value">{{ ondas.wave_height }}m</div>
          <div class="nav-details">{{ ondas.wave_period }}s</div>
        </div>
      </div>

      <div class="nav-item mares-item">
        <div class="nav-icon mares-icon">
          <span class="mare-emoji">🌅</span>
        </div>
        <div class="nav-info">
          <div class="nav-value">{{ mare.alta }}</div>
          <div class="nav-details">Próxima alta</div>
        </div>
      </div>

      <div class="nav-item lua-item">
        <div class="nav-icon lua-icon">
          <span class="lua-emoji">{{ getMoonEmoji(lua.phase) }}</span>
        </div>
        <div class="nav-info">
          <div class="nav-value">{{ lua.illumination }}%</div>
          <div class="nav-details">{{ lua.phaseLabel }}</div>
        </div>
      </div>

      <div class="nav-item refresh-item">
        <button @click="refreshData" class="nav-refresh-btn" :disabled="loading" title="Atualizar dados">
          <i class="mdi mdi-refresh" :class="{ 'mdi-spin': loading }"></i>
          <span class="fallback-icone">🔍</span>
          <span class="update-time">{{ loading ? 'Carregando...' : tempoAtualizado > 0 ? tempoAtualizado + 'min' : 'Agora' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Dados do clima
const tempHoje = ref('--')
const tempMin = ref('--')
const tempMax = ref('--')
const umidade = ref('--')
const vento = ref('--')
const direcaoVento = ref('--')

// Dados das ondas
const ondas = ref({
  wave_height: '--',
  wave_period: '--'
})

// Dados das marés
const mare = ref({ 
  alta: '--:--'
})

// Dados da Lua
const lua = ref({
  phase: 0.5,
  phaseLabel: 'Cheia',
  illumination: 100
})

const tempoAtualizado = ref(0)
const loading = ref(false)

// Constantes de localização para API (Maricá/Região)
const LATITUDE = -22.956608
const LONGITUDE = -42.951448

// Função para calcular fase e iluminação da Lua (sem API, sem dependência)
const getMoonData = (date = new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let a = Math.floor((14 - month) / 12)
  let y = year + 4800 - a
  let m = month + 12 * a - 3

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  let jd = jdn + (date.getHours() - 12) / 24 + date.getMinutes() / 1440 + date.getSeconds() / 86400

  let daysSinceNew = jd - 2451550.1
  let newMoons = daysSinceNew / 29.530588853
  let phase = newMoons - Math.floor(newMoons)

  let illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50)

  let phaseLabel = 'Cheia'
  if (phase < 0.06 || phase > 0.94) phaseLabel = 'Lua Nova'
  else if (phase < 0.25) phaseLabel = 'Crescente Côncavo'
  else if (phase < 0.5) phaseLabel = 'Quarto Crescente'
  else if (phase < 0.75) phaseLabel = 'Crescente Convexo'
  else phaseLabel = 'Minguante'

  return { phase, illumination, phaseLabel }
}

// Função utilitária para emoji da Lua
const getMoonEmoji = (phase) => {
  if (phase < 0.1 || phase > 0.9) return '🌑'
  if (phase < 0.25) return '🌒'
  if (phase < 0.4) return '🌓'
  if (phase < 0.6) return '🌔'
  if (phase < 0.75) return '🌕'
  if (phase < 0.9) return '🌖'
  return '🌗'
}

const calcularDirecao = (graus) => {
  const direcoes = ['N', 'NNE', 'NE', 'ENE', 'L', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
  return direcoes[Math.round(graus / 22.5) % 16] || ''
}

// Carregar dados (Refatorado para duas chamadas de API + Lua local)
const carregarDados = async () => {
  if (loading.value) return
  loading.value = true
  
  try {
    // --- 1. CHAMADA DA API DE PREVISÃO DE TEMPO (TERRESTRE) ---
    const climaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo&forecast_days=1`
    
    const climaResponse = await fetch(climaUrl)
    const climaData = await climaResponse.json()
    
    if (climaData.error) throw new Error(climaData.reason || 'Erro na API de Clima.')

    const current = climaData.current
    tempHoje.value = Math.round(current.temperature_2m)
    umidade.value = Math.round(current.relative_humidity_2m)
    vento.value = Math.round(current.wind_speed_10m)
    direcaoVento.value = calcularDirecao(current.wind_direction_10m)
    tempMin.value = Math.round(climaData.daily.temperature_2m_min[0])
    tempMax.value = Math.round(climaData.daily.temperature_2m_max[0])
    
    // --- 2. CHAMADA DA API DE PREVISÃO MARINHA (ONDAS) ---
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=wave_height,wave_period&timezone=America%2FSao_Paulo`
    const marineResponse = await fetch(marineUrl)
    const marineData = await marineResponse.json()
    
    if (marineData.error) throw new Error(marineData.reason || 'Erro na API Marinha.')
    const marineCurrent = marineData.current
    ondas.value = {
      wave_height: marineCurrent.wave_height?.toFixed(1) || '--',
      wave_period: marineCurrent.wave_period?.toFixed(0) || '--'
    }

    // --- 3. CÁLCULO LOCAL DA LUA (SEM API EXTERNA) ---
    const moonData = getMoonData()
    lua.value = {
      phase: moonData.phase,
      phaseLabel: moonData.phaseLabel,
      illumination: moonData.illumination
    }

    // --- 4. SIMULAÇÃO DE MARÉS (mantida como antes) ---
    const agora = new Date()
    const minutos = (agora.getMinutes() + 30) % 60
    let horas = agora.getHours() + 2
    if (minutos < 30) horas = (horas - 1) % 24
    mare.value.alta = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
    
    tempoAtualizado.value = 0
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    
    // Dados de fallback
    tempHoje.value = 26
    tempMin.value = 20
    tempMax.value = 29
    umidade.value = 78
    vento.value = 15
    direcaoVento.value = 'SE'
    ondas.value = { wave_height: '1.2', wave_period: '8' }
    mare.value = { alta: '06:30' }
    lua.value = { phase: 0.5, phaseLabel: 'Cheia', illumination: 100 }
    
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  tempoAtualizado.value = 0
  await carregarDados()
}

onMounted(async () => {
  await carregarDados()

  setInterval(async () => {
    tempoAtualizado.value += 15
    if (tempoAtualizado.value % 15 === 0) {
      await carregarDados()
    }
  }, 900000)
})
</script>

<style scoped>
/* Estilos mantidos exatamente como estavam. Apenas adicionando um estilo para o spinner */

.navbar-previsao-wrapper {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.dark .navbar-previsao-wrapper {
  background: #1f2937;
  border-bottom-color: #374151;
}

.navbar-previsao {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-width: 110px;
  flex: 1;
  justify-content: flex-start;
}

.nav-item:hover:not(.refresh-item) {
  background: #f8fafc;
}

.dark .nav-item:hover:not(.refresh-item) {
  background: #374151;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  font-size: 1rem;
  flex-shrink: 0;
}

/* Cores específicas para cada item - MAIS ESCURAS */
.clima-item .nav-icon {
  background: rgba(251, 191, 36, 0.2);
  color: #d97706;
}

.vento-item .nav-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

.umidade-item .nav-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #16a34a;
}

.ondas-item .nav-icon {
  background: rgba(56, 189, 248, 0.2);
  color: #0284c7;
}

.mares-item .nav-icon {
  background: rgba(168, 85, 247, 0.2);
  color: #7c3aed;
}

.lua-item .nav-icon {
  background: rgba(156, 163, 175, 0.2);
  color: #6b7280;
}

.nav-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  flex: 1;
}

.nav-temp {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.dark .nav-temp {
  color: #f9fafb;
}

.nav-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.dark .nav-value {
  color: #f9fafb;
}

.nav-details {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.nav-minmax {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b7280;
}

/* Botão de atualizar */
.refresh-item {
  min-width: auto;
  padding: 0;
}

.nav-refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.375rem 0.625rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 2rem;
}

.nav-refresh-btn:hover:not(:disabled) {
  background: #1B5E20;
  transform: scale(1.02);
}

.nav-refresh-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.8;
}

.update-time {
  font-size: 0.7rem;
  opacity: 0.9;
}

/* ÍCONES - CORREÇÃO PARA APARECEREM SEMPRE */
.mdi {
  font-size: 1rem;
  line-height: 1;
  display: inline-block;
}

/* Adiciona o spinner para o ícone de refresh */
.mdi-spin {
    animation: mdi-spin 2s linear infinite;
}

@keyframes mdi-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Mostrar fallback sempre como backup */
.fallback-icone {
  font-size: 0.9rem;
  display: none;
}

.mdi[class*="mdi-"]:not(.mdi-loaded) {
  display: none;
}

.mdi[class*="mdi-"]:not(.mdi-loaded) + .fallback-icone {
  display: inline-block;
}

.mdi-weather-sunny:before,
.mdi-weather-windy:before,
.mdi-water-percent:before,
.mdi-wave:before,
.mdi-refresh:before {
  content: attr(data-mdi);
  font-family: 'Material Design Icons';
}

.lua-emoji, .mare-emoji {
  font-size: 0.9rem;
}

/* RESPONSIVO */
@media (max-width: 1024px) {
  .navbar-previsao {
    padding: 0.5rem;
    gap: 0.125rem;
  }
  
  .nav-item {
    min-width: 100px;
    gap: 0.375rem;
    padding: 0.25rem 0.375rem;
  }
  
  .nav-icon {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.875rem;
  }
  
  .nav-temp {
    font-size: 1rem;
  }
  
  .nav-value {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .navbar-previsao {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 0.375rem;
  }
  
  .nav-item {
    min-width: calc(33.333% - 0.25rem);
    flex: none;
    justify-content: flex-start;
    margin-bottom: 0.25rem;
  }
  
  .refresh-item {
    min-width: calc(33.333% - 0.25rem);
  }
  
  .nav-refresh-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .navbar-previsao {
    gap: 0.125rem;
  }
  
  .nav-item {
    min-width: calc(50% - 0.125rem);
    padding: 0.25rem 0.375rem;
  }
  
  .refresh-item {
    min-width: calc(50% - 0.125rem);
  }
  
  .nav-info {
    align-items: flex-start;
  }
  
  .nav-temp {
    font-size: 0.875rem;
  }
  
  .nav-value {
    font-size: 0.75rem;
  }
  
  .nav-details {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .nav-item {
    min-width: 100%;
    justify-content: flex-start;
  }
  
  .refresh-item {
    min-width: 100%;
  }
  
  .navbar-previsao {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>