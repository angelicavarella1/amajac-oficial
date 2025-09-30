<template>
  <section id="inicio" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-amajac-500 to-amajac-700 text-white">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-amajac-600 font-bold text-4xl">AMAJAC</span>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold mb-6">AMAJAC</h1>
        <p class="text-xl md:text-2xl mb-8">
          Associação de Moradores e Amigos do Bairro<br>
          <strong>Jardim Atlântico Central</strong>
        </p>
        
        <p class="text-lg mb-12 max-w-2xl mx-auto">
          Unindo a comunidade por um bairro melhor. Trabalhamos juntos para 
          transformar nosso bairro através de ações coletivas.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="scrollToSection('#quem-somos')"
            class="bg-white text-amajac-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-amajac-500"
          >
            Conheça Nossa Associação
          </button>
          <button 
            @click="scrollToSection('#contato')"
            class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-amajac-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-amajac-500"
          >
            Participe da Comunidade
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
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