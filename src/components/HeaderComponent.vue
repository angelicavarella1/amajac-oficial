<template>
  <header class="fixed top-0 w-full bg-white shadow-md z-50 transition-all duration-300" :class="{'shadow-lg': scrolled}">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo com link para início -->
        <a 
          href="#inicio" 
          class="flex items-center space-x-3 focus-visible:outline-none"
          @click.prevent="scrollToSection('#inicio')"
          aria-label="AMAJAC - Voltar ao início"
        >
          <div class="w-12 h-12 bg-amajac-500 rounded-full flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2">
            <span class="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-amajac-600">AMAJAC</h1>
            <p class="text-xs text-gray-600 hidden sm:block">
              Associação de Moradores e Amigos
            </p>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8" aria-label="Navegação principal">
          <a v-for="item in menuItems" 
             :key="item.id" 
             :href="item.href" 
             class="text-gray-700 hover:text-amajac-500 font-medium transition-colors duration-200 relative py-2 focus-visible:outline-none"
             :class="{
               'text-amajac-500 font-semibold': activeSection === item.id,
               'focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 focus-visible:rounded': true
             }"
             @click.prevent="scrollToSection(item.href)"
             :aria-current="activeSection === item.id ? 'page' : null"
          >
            {{ item.text }}
            <span v-if="activeSection === item.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-amajac-500 rounded-full" aria-hidden="true"></span>
          </a>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path 
              v-if="!mobileMenuOpen"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="md:hidden py-4 border-t border-gray-200 animate-fade-in"
        :aria-hidden="!mobileMenuOpen"
      >
        <nav class="flex flex-col space-y-2" aria-label="Navegação mobile">
          <a 
            v-for="item in menuItems" 
            :key="item.id" 
            :href="item.href"
            class="text-gray-700 hover:text-amajac-500 font-medium py-3 px-4 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2"
            :class="{
              'text-amajac-500 bg-amajac-50 font-semibold': activeSection === item.id
            }"
            @click.prevent="scrollToSection(item.href)"
            :aria-current="activeSection === item.id ? 'page' : null"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      mobileMenuOpen: false,
      scrolled: false,
      activeSection: 'inicio',
      menuItems: [
        { id: 'inicio', text: 'Início', href: '#inicio' },
        { id: 'quem-somos', text: 'Quem Somos', href: '#quem-somos' },
        { id: 'noticias', text: 'Notícias', href: '#noticias' },
        { id: 'eventos', text: 'Eventos', href: '#eventos' },
        { id: 'galeria', text: 'Galeria', href: '#galeria' },
        { id: 'colaboradores', text: 'Colaboradores', href: '#colaboradores' },
        { id: 'contato', text: 'Contato', href: '#contato' }
      ],
      observer: null
    }
  },
  mounted() {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
    this.setupIntersectionObserver()
    
    // Fecha menu mobile ao pressionar ESC
    document.addEventListener('keydown', this.handleEscapeKey)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('keydown', this.handleEscapeKey)
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    handleScroll() {
      this.scrolled = window.scrollY > 10
    },
    scrollToSection(sectionId) {
      this.mobileMenuOpen = false
      const element = document.querySelector(sectionId)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.offsetTop - headerOffset
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
        
        // Atualiza a seção ativa imediatamente
        this.activeSection = sectionId.replace('#', '')
        
        // Foca no elemento para navegação por teclado
        element.setAttribute('tabindex', '-1')
        element.focus({ preventScroll: true })
      }
    },
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id
          }
        })
      }, options)

      // Observa todas as seções
      this.menuItems.forEach(item => {
        const section = document.getElementById(item.id)
        if (section) {
          this.observer.observe(section)
        }
      })
    },
    handleEscapeKey(event) {
      if (event.key === 'Escape' && this.mobileMenuOpen) {
        this.mobileMenuOpen = false
      }
    }
  }
}
</script>