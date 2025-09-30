<template>
  <section id="quem-somos" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-amajac-800 mb-4">Quem Somos</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Conheça a história da Associação de Moradores e Amigos do Bairro Jardim Atlântico Central
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h3 class="text-2xl font-bold text-amajac-700 mb-4">Nossa História</h3>
          <p class="text-gray-700 mb-6">
            A AMAJAC foi fundada com o objetivo de unir a comunidade e trabalhar em prol 
            das melhorias necessárias para nosso bairro. Nossa trajetória começou com um 
            grupo de moradores preocupados com o desenvolvimento e qualidade de vida no 
            Jardim Atlântico Central.
          </p>
          <h3 class="text-2xl font-bold text-amajac-700 mb-4">Nossa Missão</h3>
          <p class="text-gray-700 mb-6">
            Representar e unir os moradores do Jardim Atlântico Central, promovendo ações 
            que elevem a qualidade de vida, defendendo os interesses da comunidade e 
            fomentando o desenvolvimento sustentável do bairro.
          </p>
          <h3 class="text-2xl font-bold text-amajac-700 mb-4">Nossos Valores</h3>
          <ul class="text-gray-700 space-y-2">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-amajac-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Transparência e ética
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-amajac-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Trabalho coletivo
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-amajac-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Compromisso com a comunidade
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-amajac-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Desenvolvimento sustentável
            </li>
          </ul>
        </div>
        
        <div class="bg-amajac-50 rounded-2xl p-8 text-center">
          <div class="text-amajac-600 mb-6">
            <div class="w-20 h-20 bg-amajac-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl font-bold">A</span>
            </div>
            <h4 class="text-2xl font-bold mb-2">AMAJAC</h4>
            <p class="text-amajac-700">Unindo a comunidade</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="bg-white rounded-lg p-3">
              <div class="text-amajac-600 font-bold text-lg">+200</div>
              <div class="text-amajac-700">Famílias</div>
            </div>
            <div class="bg-white rounded-lg p-3">
              <div class="text-amajac-600 font-bold text-lg">2024</div>
              <div class="text-amajac-700">Fundação</div>
            </div>
          </div>
          
          <div class="mt-6">
            <button 
              @click="scrollToSection('#contato')"
              class="bg-amajac-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
            >
              Junte-se a Nós
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'QuemSomosSection',
  methods: {
    scrollToSection(sectionId) {
      const element = document.querySelector(sectionId)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.offsetTop - headerOffset
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>