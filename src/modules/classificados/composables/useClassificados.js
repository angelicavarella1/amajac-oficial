// src/modules/classificados/composables/useClassificados.js
import { useClassificadosStore } from '../stores/classificados'
import { useConfigStore } from '@/shared/stores/useConfigStore'
import { computed } from 'vue'

export function useClassificados() {
  const store = useClassificadosStore()
  const configStore = useConfigStore()

  const moduloAtivo = computed(() => 
    configStore.modulosAtivos.classificados
  )

  const carregarClassificadosComConfig = async (options = {}) => {
    if (!moduloAtivo.value) {
      console.log(' Módulo de classificados desativado')
      return []
    }
    return await store.fetchClassificados(options)
  }

  return {
    ...store,
    moduloAtivo,
    carregarClassificados: carregarClassificadosComConfig
  }
}
