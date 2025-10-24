import { createPinia } from 'pinia'

export const pinia = createPinia()

// Re-export todos os stores para importação conveniente
export { useAuthStore } from './auth.js'
export { useConfigStore } from './config.js'
// ✅ CORRIGIDO: O nome re-exportado deve ser 'useUIStore' para corresponder à exportação em './ui.js'
export { useUIStore } from './ui.js' 
export { useNoticiasStore } from './noticias.js'
export { useEventosStore } from './eventos.js'
export { useColaboradoresStore } from './colaboradores.js'
export { useGaleriaStore } from './galeria.js'
export { useMensagensStore } from './mensagens.js'