// src/composables/useI18n.js
import { ref, computed } from 'vue'

// Traduções em português (único idioma por enquanto)
const translations = {
  pt: {
    // Notícias
    'noticias.titulo': 'Notícias',
    'noticias.ultimas': 'Últimas Notícias',
    'noticias.ler_mais': 'Ler mais',
    'noticias.sem_noticias': 'Nenhuma notícia publicada',
    
    // Eventos
    'eventos.titulo': 'Eventos',
    'eventos.proximos': 'Próximos Eventos',
    'eventos.local': 'Local',
    'eventos.data': 'Data',
    'eventos.horario': 'Horário',
    
    // Contato
    'contato.titulo': 'Entre em Contato',
    'contato.enviar': 'Enviar Mensagem',
    'contato.sucesso': 'Mensagem enviada com sucesso!',
    'contato.erro': 'Erro ao enviar mensagem',
    
    // Admin
    'admin.login': 'Acesso Administrativo',
    'admin.email': 'Email',
    'admin.senha': 'Senha',
    'admin.entrar': 'Entrar',
    
    // Geral
    'geral.salvar': 'Salvar',
    'geral.cancelar': 'Cancelar',
    'geral.editar': 'Editar',
    'geral.excluir': 'Excluir',
    'geral.sim': 'Sim',
    'geral.nao': 'Não'
  }
}

const currentLocale = ref('pt')

export function useI18n() {
  const t = (key) => {
    return translations[currentLocale.value][key] || key
  }

  const locale = computed(() => currentLocale.value)

  const setLocale = (locale) => {
    if (translations[locale]) {
      currentLocale.value = locale
    }
  }

  return {
    t,
    locale,
    setLocale
  }
}