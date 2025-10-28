// src/shared/stores/useConfigStore.js
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useConfiguracoes } from '@/shared/composables/useConfiguracoes'

export const useConfigStore = defineStore('config', () => {
  const { 
    configuracoes, 
    loading, 
    error, 
    fetchConfiguracoes, 
    atualizarConfiguracao,
    obterConfiguracao 
  } = useConfiguracoes()

  // Configurações agrupadas computadas
  const configsAgrupadas = computed(() => {
    const agrupadas = {
      site: {},
      contato: {},
      hero: {},
      about: {},
      sistema: {}
    }

    configuracoes.value.forEach(config => {
      const { chave, valor } = config

      if (chave.startsWith('site_')) {
        agrupadas.site[chave.replace('site_', '')] = valor
      } else if (chave.startsWith('email_') || chave.startsWith('telefone_') ||
                 chave.startsWith('endereco') || chave.startsWith('contato_')) {
        agrupadas.contato[chave] = valor
      } else if (chave.startsWith('hero_')) {
        agrupadas.hero[chave.replace('hero_', '')] = valor
      } else if (chave.startsWith('quem_somos_')) {
        agrupadas.about[chave.replace('quem_somos_', '')] = valor
      } else if (chave.startsWith('info_')) {
        agrupadas.sistema[chave] = valor
      } else {
        agrupadas.sistema[chave] = valor
      }
    })

    return agrupadas
  })

  // Módulos ativos computados
  const modulosAtivos = computed(() => ({
    noticias: obterConfiguracao('info_noticias_ativado') === 'true',
    eventos: obterConfiguracao('info_eventos_ativado') === 'true',
    galeria: obterConfiguracao('info_galeria_ativado') === 'true',
    classificados: obterConfiguracao('info_classificados_ativado') === 'true',
    colaboradores: obterConfiguracao('info_colaboradores_ativado') === 'true'
  }))

  return {
    // Estado
    configuracoes,
    loading,
    error,
    
    // Computed
    configsAgrupadas,
    modulosAtivos,
    
    // Actions
    fetchConfiguracoes,
    atualizarConfiguracao,
    obterConfiguracao
  }
})