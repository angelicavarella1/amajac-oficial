// Funções auxiliares para formatação
export const formatarData = (dataString) => {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para truncar texto
export const truncarTexto = (texto, limite = 100) => {
  if (!texto || typeof texto !== 'string') return '';
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
};

// Constantes para os buckets de storage
export const BUCKETS = {
  NOTICIAS: 'noticias',
  EVENTOS: 'eventos',
  GALERIA: 'galeria',
  COLABORADORES: 'colaboradores',
  PERFIS: 'perfis'
};

// Função para extrair caminho do arquivo de uma URL - CORRIGIDA
export const extrairCaminhoArquivo = (url) => {
  if (!url) return '';
  
  // CORREÇÃO: Removidos os escapes desnecessários da barra /
  const matches = url.match(/\/([^/]+\/[^/]+)$/);
  return matches ? matches[1] : '';
};

// Exportação padrão com todas as funções
export default {
  formatarData,
  truncarTexto,
  BUCKETS,
  extrairCaminhoArquivo
};