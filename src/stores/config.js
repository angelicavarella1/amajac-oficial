import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useConfiguracoes } from '@/composables/useConfiguracoes'

export const useConfigStore = defineStore('config', () => {
  const { configs, fetchConfiguracoes } = useConfiguracoes()
  
  const siteTitle = computed(() => configs.value.site_nome || 'AMAJAC')
  const siteDescription = computed(() => configs.value.site_descricao || 'Associação de Moradores e Amigos do Jardim Atlântico Central')
  const contactEmail = computed(() => configs.value.email_contato || 'amajac2024@gmail.com')
  const contactPhone = computed(() => configs.value.telefone_contato || '(21) 97897-9840')
  const contactAddress = computed(() => configs.value.endereco || 'Jardim Atlântico Central, Maricá - RJ')
  const apiBaseUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000')

  // Carregar configurações quando a store for inicializada
  const initialize = async () => {
    try {
      await fetchConfiguracoes()
    } catch (error) {
      console.error('Erro ao inicializar configurações:', error)
    }
  }

  const fullUrl = (path) => {
    return `${apiBaseUrl.value}${path}`
  }

  return {
    // Computed
    siteTitle,
    siteDescription,
    contactEmail,
    contactPhone,
    contactAddress,
    
    // Refs
    apiBaseUrl,
    
    // Métodos
    fullUrl,
    initialize
  }
})