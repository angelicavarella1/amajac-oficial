// src/modules/base/composables/useBaseState.js
import { ref } from 'vue'

/**
 * Estados reativos compartilhados por todos os módulos admin
 * @returns {Object} { loading, error, items }
 */
export function useBaseState() {
  const loading = ref(false)
  const error = ref(null)
  const items = ref([])

  return {
    loading,
    error,
    items
  }
}