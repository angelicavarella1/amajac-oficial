// CORREÇÃO DEFINITIVA: Exportação unificada sem duplicações

// Re-exportar todas as exportações nomeadas dos módulos
export { supabase } from './client.js';
export * from './helpers/index.js';
export * from './public/index.js';
export * from './admin/index.js';
export * from './storage/index.js';

// Exportação padrão simples (opcional)
export default {
  // Esta exportação padrão pode ser usada se necessário
  // mas não é obrigatória
};