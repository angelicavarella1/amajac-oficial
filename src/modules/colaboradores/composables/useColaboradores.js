// src/modules/colaboradores/composables/useColaboradores.js
import { useColaboradoresStore } from '../stores/colaboradores'
import { useConfigStore } from '@/shared/stores/useConfigStore'
import { computed } from 'vue'

export function useColaboradores() {
  const store = useColaboradoresStore()
  const configStore = useConfigStore()

  const moduloAtivo = computed(() => 
    configStore.modulosAtivos.colaboradores
  )

  const carregarColaboradoresComConfig = async (options = {}) => {
    if (!moduloAtivo.value) {
      console.log(' Módulo de colaboradores desativado')
      return []
    }
    return await store.carregarColaboradores(options)
  }

  return {
    ...store,
    moduloAtivo,
    carregarColaboradores: carregarColaboradoresComConfig
  }
}
