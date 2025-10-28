// src/modules/mensagens/composables/useMensagens.js
import { useMensagensStore } from '../stores/mensagens'

export function useMensagens() {
  const store = useMensagensStore()

  return {
    ...store
  }
}