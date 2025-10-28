import { useEventosStore } from '@/modules/eventos/stores/eventos';
import { storeToRefs } from 'pinia';

export function usePublicEventos() {
  const store = useEventosStore();
  const { eventos, eventoSelecionado, loading, error } = storeToRefs(store);

  const fetchEventos = () => store.fetchEventos();
  const fetchEventoById = (id) => store.fetchEventoById(id);
  const incrementarVisualizacoes = (id) => store.incrementarVisualizacoes(id);

  return {
    // State
    eventos,
    eventoSelecionado,
    loading,
    error,
    
    // Getters
    eventosAtivos: store.eventosAtivos,
    eventosPassados: store.eventosPassados,
    
    // Actions
    fetchEventos,
    fetchEventoById,
    incrementarVisualizacoes
  };
}