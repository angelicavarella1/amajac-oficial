// src/modules/eventos/composables/useEventos.js
import { useEventosStore } from '../stores/eventos'
import { useConfigStore } from '@/shared/stores/useConfigStore'
import { computed } from 'vue'

export function useEventos() {
  const store = useEventosStore()
  const configStore = useConfigStore()

  const moduloAtivo = computed(() => 
    configStore.modulosAtivos.eventos
  )

  const carregarEventosComConfig = async (options = {}) => {
    if (!moduloAtivo.value) {
      console.log(' Módulo de eventos desativado')
      return []
    }
    return await store.carregarEventos(options)
  }

  return {
    ...store,
    moduloAtivo,
    carregarEventos: carregarEventosComConfig
  }
}
