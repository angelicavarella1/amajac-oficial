<template>
  <section class="py-16 bg-amajac-600 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-8">Informações em Tempo Real</h2>
      
      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="bg-white bg-opacity-10 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4">Horário Local</h3>
          <div class="text-3xl font-mono font-bold">{{ horaAtual }}</div>
        </div>

        <div class="bg-white bg-opacity-10 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4">Clima em Maricá</h3>
          <div class="text-3xl font-bold">{{ temperatura }}°C</div>
          <div class="text-sm opacity-80 mt-2">{{ condicaoClima }}</div>
        </div>

        <div class="bg-white bg-opacity-10 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4">Próximo Evento</h3>
          <div class="text-lg font-bold">Em Breve</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InfoTempoRelogio',
  data() {
    return {
      horaAtual: '',
      temperatura: 25,
      condicaoClima: 'Ensolarado'
    }
  },
  mounted() {
    this.atualizarRelogio()
    setInterval(this.atualizarRelogio, 1000)
    this.fetchClima()
  },
  methods: {
    atualizarRelogio() {
      this.horaAtual = new Date().toLocaleTimeString('pt-BR')
    },
    async fetchClima() {
      try {
        // Coordenadas de Itaipuaçu, Maricá - RJ
        const lat = -22.9194
        const lon = -42.8184
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America%2FSao_Paulo`
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.current_weather) {
          this.temperatura = Math.round(data.current_weather.temperature)
          this.condicaoClima = this.traduzirCondicao(data.current_weather.weathercode)
        }
      } catch (error) {
        console.error('Erro ao buscar clima:', error)
        this.condicaoClima = 'Sem dados'
      }
    },
    traduzirCondicao(codigo) {
      const condicoes = {
        0: 'Céu limpo',
        1: 'Principalmente ensolarado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina com geada',
        51: 'Chuvisco leve',
        53: 'Chuvisco moderado',
        55: 'Chuvisco intenso',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
      }
      return condicoes[codigo] || 'Condição desconhecida'
    }
  }
}
</script>