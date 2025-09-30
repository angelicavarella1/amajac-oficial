<template>
  <footer class="bg-amajac-800 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Logo e Sobre -->
        <div class="md:col-span-2">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-amajac-500 rounded-full flex items-center justify-center mr-3">
              <span class="text-white font-bold">A</span>
            </div>
            <div>
              <h3 class="text-xl font-bold">AMAJAC</h3>
              <p class="text-amajac-200 text-sm">Associação de Moradores e Amigos</p>
            </div>
          </div>
          <p class="text-amajac-200 mb-6">
            Trabalhando juntos por um bairro melhor no Jardim Atlântico Central, Maricá-RJ.
          </p>
          <!-- Ícones de Acesso Rápido -->
          <div class="flex space-x-4">
            <!-- SOSJAC -->
            <a
              href="https://sosjac.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amajac-800"
              aria-label="Acesse o SOSJAC - Sistema de Ocorrências"
              title="SOSJAC - Denúncias e Ocorrências"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </a>
            <!-- Softaliza -->
            <a
              href="https://associacoes.softaliza.com.br/amajac"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amajac-800"
              aria-label="Área Administrativa da AMAJAC"
              title="Área Administrativa"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </a>
            <!-- WhatsApp -->
            <a
              href="https://wa.me/5521978979840"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amajac-800"
              aria-label="Fale conosco pelo WhatsApp"
              title="WhatsApp AMAJAC"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297a11.815 11.815 0 00-12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Links Rápidos -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Links Rápidos</h4>
          <ul class="space-y-2">
            <li>
              <a href="#inicio" 
                 class="text-amajac-200 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                 @click.prevent="scrollToSection('inicio')">
                Início
              </a>
            </li>
            <li>
              <a href="#quem-somos" 
                 class="text-amajac-200 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                 @click.prevent="scrollToSection('quem-somos')">
                Quem Somos
              </a>
            </li>
            <li>
              <a href="#noticias" 
                 class="text-amajac-200 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                 @click.prevent="scrollToSection('noticias')">
                Notícias
              </a>
            </li>
            <li>
              <a href="#eventos" 
                 class="text-amajac-200 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                 @click.prevent="scrollToSection('eventos')">
                Eventos
              </a>
            </li>
            <li>
              <a href="#galeria" 
                 class="text-amajac-200 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                 @click.prevent="scrollToSection('galeria')">
                Galeria
              </a>
            </li>
            <li>
              <a href="#contato" 
                 class="text-amajac-200 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                 @click.prevent="scrollToSection('contato')">
                Contato
              </a>
            </li>
          </ul>
        </div>

        <!-- Contato -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Contato</h4>
          <ul class="space-y-2 text-amajac-200">
            <li class="flex items-start">
              <svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <a 
                href="https://www.google.com/maps/place/Rua+Izabel+Cristina+Ouvina,+112+-+Jardim+Atlântico+Central,+Maricá+-+RJ,+24934-405"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
              >
                Rua Izabel Cristina Ouvina, 112<br>
                Jardim Atlântico Central<br>
                Maricá - RJ
              </a>
            </li>
            <li class="flex items-center mt-1">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a href="tel:+5521978979840" class="hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded">
                (21) 97897-9840
              </a>
            </li>
            <li class="flex items-center mt-1">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:amajac2024@gmail.com" class="hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded">
                amajac2024@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Seção de Créditos e Informações Legais CORRIGIDA -->
      <div class="border-t border-amajac-700 mt-8 pt-8">
        <div class="flex flex-col items-center text-center space-y-4">
          <!-- Informações Legais -->
          <div class="text-amajac-200">
            <p>&copy; {{ new Date().getFullYear() }} AMAJAC - Associação de Moradores e Amigos do Bairro Jardim Atlântico Central. Todos os direitos reservados.</p>
            <p class="mt-2 text-sm">CNPJ: 60.237.709/0001-37</p>
          </div>

          <!-- Créditos da Desenvolvedora - Agora abaixo e menor -->
          <div class="text-amajac-300 pt-2 border-t border-amajac-700 w-full max-w-md">
            <p class="text-sm mb-1">
              Desenvolvido com ❤️ por 
              <a 
                href="mailto:angelica.varella1@gmail.com"
                class="text-white hover:text-amajac-100 underline transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:rounded"
                title="Entre em contato com a desenvolvedora"
              >
                Angelica Varella
              </a>
            </p>
            <p class="text-xs text-amajac-400">
              Front-end Developer & UI/UX Designer
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  methods: {
    scrollToSection(sectionId) {
      const cleanId = sectionId.replace('#', '')
      const element = document.getElementById(cleanId)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.offsetTop - headerOffset
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
        
        window.history.pushState(null, null, `#${cleanId}`)
      }
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do footer se necessário */
</style>