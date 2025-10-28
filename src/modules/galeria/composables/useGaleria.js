// src/modules/galeria/composables/useGaleria.js
import { useGaleriaStore } from '../stores/galeria'
import { useConfigStore } from '@/shared/stores/useConfigStore'
import { computed } from 'vue'

export function useGaleria() {
  const store = useGaleriaStore()
  const configStore = useConfigStore()

  const moduloAtivo = computed(() => 
    configStore.modulosAtivos.galeria
  )

  const carregarGaleriaComConfig = async (options = {}) => {
    if (!moduloAtivo.value) {
      console.log(' Módulo de galeria desativado')
      return []
    }
    return await store.fetchImagens(options)
  }

  return {
    ...store,
    moduloAtivo,
    carregarGaleria: carregarGaleriaComConfig
  }
}
