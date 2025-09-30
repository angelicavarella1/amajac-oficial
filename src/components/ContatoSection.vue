<template>
  <section id="contato" class="py-20 bg-white" aria-labelledby="contato-title">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h2 id="contato-title" class="text-4xl md:text-5xl font-bold text-amajac-800 mb-4">
          Entre em Contato
        </h2>
        <div class="w-24 h-1 bg-amajac-500 mx-auto mb-6" aria-hidden="true"></div>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto">
          Tem alguma dúvida, sugestão ou quer participar da nossa associação? Entre em contato conosco!
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Informações de Contato -->
        <div>
          <h3 class="text-2xl font-semibold text-amajac-700 mb-8">Informações</h3>
          
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="bg-amajac-100 rounded-lg p-3 mr-4 flex-shrink-0" aria-hidden="true">
                <svg class="w-6 h-6 text-amajac-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-1">Endereço</h4>
                <a 
                  href="https://www.google.com/maps/place/Rua+Izabel+Cristina+Ouvina,+112+-+Jardim+Atlântico+Central,+Maricá+-+RJ,+24934-405"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-700 hover:text-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 focus-visible:rounded"
                >
                  Rua Izabel Cristina Ouvina, 112<br>
                  Jardim Atlântico Central (Itaipuaçu)<br>
                  Maricá - RJ<br>
                  CEP: 24934-405
                </a>
              </div>
            </div>

            <div class="flex items-start">
              <div class="bg-amajac-100 rounded-lg p-3 mr-4 flex-shrink-0" aria-hidden="true">
                <svg class="w-6 h-6 text-amajac-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-1">Telefone</h4>
                <a href="tel:+5521978979840" class="text-gray-700 hover:text-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 focus-visible:rounded">
                  (21) 97897-9840
                </a>
              </div>
            </div>

            <div class="flex items-start">
              <div class="bg-amajac-100 rounded-lg p-3 mr-4 flex-shrink-0" aria-hidden="true">
                <svg class="w-6 h-6 text-amajac-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-1">E-mail</h4>
                <a href="mailto:contato@amajac.org.br" class="text-gray-700 hover:text-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 focus-visible:rounded">
                  contato@amajac.org.br
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulário de Contato -->
        <div>
          <h3 class="text-2xl font-semibold text-amajac-700 mb-8">Envie uma Mensagem</h3>
          
          <form @submit.prevent="enviarMensagem" class="space-y-6" aria-labelledby="form-title">
            <h4 id="form-title" class="sr-only">Formulário de contato</h4>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label for="nome" class="block text-sm font-medium text-gray-800 mb-2">
                  Nome Completo *
                </label>
                <input 
                  type="text" 
                  id="nome" 
                  v-model="form.nome"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-500 focus:border-amajac-500 transition focus-visible:outline-none"
                  placeholder="Seu nome completo"
                  aria-required="true"
                >
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-800 mb-2">
                  E-mail *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-500 focus:border-amajac-500 transition focus-visible:outline-none"
                  placeholder="seu@email.com"
                  aria-required="true"
                >
              </div>
            </div>

            <div>
              <label for="telefone" class="block text-sm font-medium text-gray-800 mb-2">
                Telefone
              </label>
              <input 
                type="tel" 
                id="telefone" 
                v-model="form.telefone"
                @input="mascararTelefone"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-500 focus:border-amajac-500 transition focus-visible:outline-none"
                placeholder="(21) 99999-9999"
              >
            </div>

            <div>
              <label for="assunto" class="block text-sm font-medium text-gray-800 mb-2">
                Assunto *
              </label>
              <select 
                id="assunto" 
                v-model="form.assunto"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-500 focus:border-amajac-500 transition focus-visible:outline-none"
                aria-required="true"
              >
                <option value="" disabled selected>Selecione um assunto</option>
                <option value="duvida">Dúvida</option>
                <option value="sugestao">Sugestão</option>
                <option value="reclamacao">Reclamação</option>
                <option value="participacao">Quero Participar</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label for="mensagem" class="block text-sm font-medium text-gray-800 mb-2">
                Mensagem *
              </label>
              <textarea 
                id="mensagem" 
                v-model="form.mensagem"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-500 focus:border-amajac-500 transition focus-visible:outline-none"
                placeholder="Escreva sua mensagem aqui..."
                aria-required="true"
              ></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="enviando"
              class="w-full bg-amajac-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amajac-600 focus:ring-2 focus:ring-amajac-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none"
              :aria-label="enviando ? 'Enviando mensagem...' : 'Enviar mensagem de contato'"
            >
              <span v-if="enviando">Enviando...</span>
              <span v-else>Enviar Mensagem</span>
            </button>

            <!-- Mensagem de Sucesso/Erro -->
            <div v-if="mensagemFeedback" 
                 :class="['p-4 rounded-lg', feedbackSucesso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']"
                 role="alert"
                 aria-live="assertive"
            >
              {{ mensagemFeedback }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SupabaseService } from '../services/supabaseService'

export default {
  name: 'ContatoSection',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      },
      enviando: false,
      mensagemFeedback: '',
      feedbackSucesso: false
    }
  },
  methods: {
    async enviarMensagem() {
      // Validação do telefone (se preenchido)
      if (this.form.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(this.form.telefone)) {
        this.mensagemFeedback = 'Telefone inválido. Use o formato (21) 99999-9999.'
        this.feedbackSucesso = false
        return
      }

      this.enviando = true
      this.mensagemFeedback = ''

      try {
        const { data, error } = await SupabaseService.enviarMensagem(this.form)
        
        if (error) throw error

        this.feedbackSucesso = true
        this.mensagemFeedback = 'Mensagem enviada com sucesso! Entraremos em contato em breve.'

        // Resetar formulário
        this.form = {
          nome: '',
          email: '',
          telefone: '',
          assunto: '',
          mensagem: ''
        }

      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        this.feedbackSucesso = false
        this.mensagemFeedback = 'Erro ao enviar mensagem. Tente novamente mais tarde.'
      } finally {
        this.enviando = false
      }
    },
    mascararTelefone(e) {
      let value = e.target.value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses no DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen no número
        .replace(/(-\d{4})\d+?$/, '$1') // Limita a 9 dígitos após o DDD

      this.form.telefone = value
    }
  }
}
</script>