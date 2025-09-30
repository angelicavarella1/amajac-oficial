import { ref, computed } from 'vue'

const translations = {
  pt: {
    // Navegação
    inicio: 'Início',
    quemSomos: 'Quem Somos',
    noticias: 'Notícias',
    eventos: 'Eventos',
    galeria: 'Galeria',
    colaboradores: 'Colaboradores',
    contato: 'Contato',
    
    // Hero Section
    heroTitulo: 'AMAJAC',
    heroSubtitulo: 'Associação de Moradores e Amigos do Bairro',
    heroLocal: 'Jardim Atlântico Central',
    heroDescricao: 'Unindo a comunidade por um bairro melhor. Trabalhamos juntos para transformar nosso bairro através de ações coletivas.',
    botaoConhecer: 'Conheça Nossa Associação',
    botaoParticipar: 'Participe da Comunidade',
    
    // Quem Somos
    quemSomosTitulo: 'Quem Somos',
    nossaHistoria: 'Nossa História',
    nossaMissao: 'Nossa Missão',
    nossosValores: 'Nossos Valores',
    
    // Contato
    endereco: 'Endereço',
    telefone: 'Telefone',
    email: 'E-mail',
    enviarMensagem: 'Enviar Mensagem',
    nomeCompleto: 'Nome Completo',
    assunto: 'Assunto',
    mensagem: 'Mensagem',
    placeholderTelefone: '(21) 99999-9999',
    placeholderMensagem: 'Escreva sua mensagem aqui...',
    
    // Footer
    direitosReservados: 'Todos os direitos reservados.',
    
    // Estados
    carregando: 'Carregando...',
    nenhumResultado: 'Nenhum resultado encontrado',
    erroCarregar: 'Erro ao carregar',
    tentarNovamente: 'Tentar Novamente'
  },
  en: {
    // Navigation
    inicio: 'Home',
    quemSomos: 'About Us',
    noticias: 'News',
    eventos: 'Events',
    galeria: 'Gallery',
    colaboradores: 'Partners',
    contato: 'Contact',
    
    // Hero Section
    heroTitulo: 'AMAJAC',
    heroSubtitulo: 'Residents and Friends Association of',
    heroLocal: 'Jardim Atlântico Central',
    heroDescricao: 'Uniting the community for a better neighborhood. We work together to transform our neighborhood through collective actions.',
    botaoConhecer: 'Learn About Our Association',
    botaoParticipar: 'Join the Community',
    
    // About Us
    quemSomosTitulo: 'About Us',
    nossaHistoria: 'Our History',
    nossaMissao: 'Our Mission',
    nossosValores: 'Our Values',
    
    // Contact
    endereco: 'Address',
    telefone: 'Phone',
    email: 'Email',
    enviarMensagem: 'Send Message',
    nomeCompleto: 'Full Name',
    assunto: 'Subject',
    mensagem: 'Message',
    placeholderTelefone: '(21) 99999-9999',
    placeholderMensagem: 'Write your message here...',
    
    // Footer
    direitosReservados: 'All rights reserved.',
    
    // States
    carregando: 'Loading...',
    nenhumResultado: 'No results found',
    erroCarregar: 'Error loading',
    tentarNovamente: 'Try Again'
  }
}

export function useI18n() {
  const currentLang = ref('pt')

  const t = computed(() => {
    return (key) => translations[currentLang.value][key] || key
  })

  const setLanguage = (lang) => {
    if (['pt', 'en'].includes(lang)) {
      currentLang.value = lang
      localStorage.setItem('amajac-lang', lang)
    }
  }

  // Carregar preferência salva
  const savedLang = localStorage.getItem('amajac-lang')
  if (savedLang) {
    currentLang.value = savedLang
  }

  return { 
    t, 
    currentLang, 
    setLanguage,
    availableLangs: ['pt', 'en']
  }
}