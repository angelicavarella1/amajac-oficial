import { useClassificadosStore } from '@/stores/classificados';
import { storeToRefs } from 'pinia';

export function usePublicClassificados() {
  const store = useClassificadosStore();
  const { classificados, classificadoSelecionado, loading, error } = storeToRefs(store);

  const fetchClassificados = () => store.fetchClassificados();
  const fetchClassificadoById = (id) => store.fetchClassificadoById(id);
  const criarClassificado = (data) => store.criarClassificado(data);
  const atualizarClassificado = (id, data) => store.atualizarClassificado(id, data);
  const deletarClassificado = (id) => store.deletarClassificado(id);
  const incrementarVisualizacoes = (id) => store.incrementarVisualizacoes(id);

  return {
    // State
    classificados,
    classificadoSelecionado,
    loading,
    error,
    
    // Getters
    classificadosPorCategoria: (categoria) => store.classificadosPorCategoria(categoria),
    classificadosAtivos: store.classificadosAtivos,
    
    // Actions
    fetchClassificados,
    fetchClassificadoById,
    criarClassificado,
    atualizarClassificado,
    deletarClassificado,
    incrementarVisualizacoes
  };
}