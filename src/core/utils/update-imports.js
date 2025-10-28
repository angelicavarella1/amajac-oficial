// src/core/utils/update-imports.js
// Script para ajudar a atualizar importações para a nova estrutura

export const IMPORT_MAPPINGS = {
  // Stores antigas  novas
  '@/stores/config': '@/shared/stores/useConfigStore',
  '@/stores/configuracoes': '@/shared/stores/useConfigStore', 
  '@/stores/noticias': '@/modules/noticias/stores/noticias',
  '@/stores/eventos': '@/modules/eventos/stores/eventos',
  '@/stores/galeria': '@/modules/galeria/stores/galeria',
  '@/stores/classificados': '@/modules/classificados/stores/classificados',
  '@/stores/colaboradores': '@/modules/colaboradores/stores/colaboradores',
  '@/stores/mensagens': '@/modules/mensagens/stores/mensagens',
  '@/stores/auth': '@/modules/auth/stores/auth',
  '@/stores/avaliacoes': '@/modules/classificados/stores/avaliacoes',

  // Composables antigos  novos
  '@/composables/useNoticias': '@/modules/noticias/composables/useNoticias',
  '@/composables/useEventos': '@/modules/eventos/composables/useEventos', 
  '@/composables/useGaleria': '@/modules/galeria/composables/useGaleria',
  '@/composables/useClassificados': '@/modules/classificados/composables/useClassificados',
  '@/composables/useColaboradores': '@/modules/colaboradores/composables/useColaboradores',
  '@/composables/useAuth': '@/modules/auth/composables/useAuth',

  // Components antigos  novos
  '@/components/NoticiasSection': '@/modules/noticias/components/NoticiasSection',
  '@/components/EventosSection': '@/modules/eventos/components/EventosSection',
  '@/components/GaleriaSection': '@/modules/galeria/components/GaleriaSection',
  '@/components/ClassificadosSection': '@/modules/classificados/components/ClassificadosSection',
  '@/components/ColaboradoresSection': '@/modules/colaboradores/components/ColaboradoresSection',
  '@/components/ContatoSection': '@/modules/mensagens/components/ContatoSection'
}

// Função para sugerir atualizações
export function sugerirAtualizacoes(importPath) {
  return IMPORT_MAPPINGS[importPath] || null
}
