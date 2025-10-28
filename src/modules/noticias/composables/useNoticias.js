// src/modules/noticias/composables/useNoticias.js
import { useNoticiasStore } from '../stores/noticias'
import { useConfigStore } from '@/shared/stores/useConfigStore'
import { computed } from 'vue'

export function useNoticias() {
  const store = useNoticiasStore()
  const configStore = useConfigStore()

  const moduloAtivo = computed(() => 
    configStore.modulosAtivos.noticias
  )

  const carregarNoticiasComConfig = async (options = {}) => {
    if (!moduloAtivo.value) {
      console.log(' Módulo de notícias desativado')
      return []
    }
    return await store.carregarNoticias(options)
  }

  return {
    ...store,
    moduloAtivo,
    carregarNoticias: carregarNoticiasComConfig
  }
}
