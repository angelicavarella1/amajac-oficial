// C:\Users\angel\Documents\Projetos\amajac-oficial\src\composables\useOpenMeteoWeather.js
import { ref } from 'vue'

export function useOpenMeteoWeather() {
  const temperatura = ref(null)
  const descricao = ref('')
  const cidade = ref('Maricá')
  const umidade = ref(null)
  const vento = ref(null)
  const sensacaoTermica = ref(null)
  const pressao = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const ultimaAtualizacao = ref('')

  // Coordenadas para Maricá, RJ
  const lat = -22.9358
  const lon = -42.8270

  const buscarClima = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🌤️ Buscando dados do clima...')
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=America/Sao_Paulo`
      )

      if (!response.ok) throw new Error('Erro ao buscar dados do clima')

      const data = await response.json()
      console.log('📊 Dados do clima recebidos:', data)

      // Extrair dados atuais
      const current = data.current
      
      temperatura.value = Math.round(current.temperature_2m)
      umidade.value = current.relative_humidity_2m
      vento.value = Math.round(current.wind_speed_10m * 3.6) // Converter m/s para km/h
      sensacaoTermica.value = Math.round(current.apparent_temperature)
      pressao.value = Math.round(current.pressure_msl)
      descricao.value = traduzirDescricao(current.weathercode)

      // Atualizar timestamp
      ultimaAtualizacao.value = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })

      console.log('✅ Clima carregado com sucesso:', {
        temperatura: temperatura.value,
        descricao: descricao.value,
        umidade: umidade.value,
        vento: vento.value,
        sensacao: sensacaoTermica.value,
        pressao: pressao.value
      })

    } catch (err) {
      error.value = 'Não foi possível carregar informações do clima'
      console.error('❌ Erro ao buscar clima:', err)
      
      // Dados de fallback para desenvolvimento
      if (import.meta.env.DEV) {
        console.log('🔄 Usando dados mockados para desenvolvimento')
        temperatura.value = 28
        descricao.value = 'Céu limpo'
        umidade.value = 65
        vento.value = 12
        sensacaoTermica.value = 30
        pressao.value = 1013
        ultimaAtualizacao.value = new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
        error.value = null
      }
    } finally {
      loading.value = false
    }
  }

  const traduzirDescricao = (weathercode) => {
    const descricoes = {
      0: 'Céu limpo',
      1: 'Parcialmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Nevoeiro',
      48: 'Nevoeiro com geada',
      51: 'Garoa leve',
      53: 'Garoa moderada',
      55: 'Garoa densa',
      56: 'Garoa congelante leve',
      57: 'Garoa congelante densa',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      66: 'Chuva congelante leve',
      67: 'Chuva congelante forte',
      71: 'Queda de neve leve',
      73: 'Queda de neve moderada',
      75: 'Queda de neve forte',
      77: 'Grãos de neve',
      80: 'Pancadas de chuva leves',
      81: 'Pancadas de chuva moderadas',
      82: 'Pancadas de chuva violentas',
      85: 'Pancadas de neve leves',
      86: 'Pancadas de neve pesadas',
      95: 'Trovoada',
      96: 'Trovoada com granizo leve',
      99: 'Trovoada com granizo forte'
    }

    return descricoes[weathercode] || 'Condição desconhecida'
  }

  return {
    temperatura,
    descricao,
    cidade,
    umidade,
    vento,
    sensacaoTermica,
    pressao,
    loading,
    error,
    ultimaAtualizacao,
    buscarClima
  }
}